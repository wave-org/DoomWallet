import {
  Key,
  EVMWallet,
  SignRequest,
  BTCWallet,
  BTCSignRequest,
} from 'doom-wallet-core';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Keychain from 'react-native-keychain';
import {UR} from '@ngraveio/bc-ur';

export type Wallet = {
  EVMWallet: EVMWallet;
  BTCWallet: BTCWallet;
};

let wallet: Wallet | null = null;

export type PasswordType =
  | 'FullPassword'
  | 'SimplePassword'
  | 'PinPassword'
  | 'GesturePassword'
  | 'NoPassword';

type WalletSetupParam = {
  mnemonic: string;
  password: string;
  passwordType: PasswordType;
  useBiometrics: boolean;
  simplePassword?: string;
};

let walletSecret: WalletSecret | null = null;
/// stored in Keychain. If user use biometrics, this is encrypted by biometrics.
type WalletSecret = {
  mnemonic: string;
  /// if only use biometrics, password will be stored here
  password?: string;
};
let walletHeader: WalletHeader | null = null;
/// stored in EncryptedStorage
export type WalletHeader = {
  passwordType: PasswordType;
  useBiometrics: boolean;
  encryptedPassword: string | undefined;
  /// use hash to check password is correct
  passwordHash: string;
};
const KEY_WALLET_HEADER = 'wallet_header';

// encrypt password
function encryptPassword(password: string, simplePassword: string) {
  // a very simple encrypt
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const simplePasswordData = encoder.encode(simplePassword);
  const encryptedPasswordData = passwordData.map((value, index) => {
    return (
      // eslint-disable-next-line no-bitwise
      value ^
      index % simplePasswordData.length ^
      simplePasswordData[index % simplePasswordData.length]
    );
  });
  return Buffer.from(encryptedPasswordData).toString('hex');
}

function decryptPassword(encryptedPassword: string, simplePassword: string) {
  // encryptedPassword is hex string
  const encoder = new TextEncoder();
  const encryptedPasswordData = Buffer.from(encryptedPassword, 'hex');
  const simplePasswordData = encoder.encode(simplePassword);
  const passwordData = encryptedPasswordData.map((value, index) => {
    return (
      // eslint-disable-next-line no-bitwise
      value ^
      index % simplePasswordData.length ^
      simplePasswordData[index % simplePasswordData.length]
    );
  });
  return Buffer.from(passwordData).toString();
}

export async function checkWalletExists(): Promise<WalletHeader | null> {
  const storedValue = await EncryptedStorage.getItem(KEY_WALLET_HEADER);
  if (storedValue !== null && storedValue !== undefined) {
    walletHeader = JSON.parse(storedValue);
    if (walletHeader !== null) {
      return walletHeader;
    }
  }
  return null;
}

export function getWalletHeader() {
  if (walletHeader === null) {
    throw new Error('walletHeader is null');
  }
  return walletHeader;
}

export async function checkBiometrics() {
  if (walletHeader === null) {
    throw new Error('walletHeader is null');
  }
  if (!walletHeader.useBiometrics) {
    throw new Error('useBiometrics is false');
  }
  // TODO permission check again
  const result = await Keychain.getGenericPassword({
    authenticationPrompt: {
      title: 'Doom wallet need use your biometrics to secure your wallet',
    },
  });
  if (result === false) {
    throw new Error('save failed. Unknown error');
  }
  walletSecret = JSON.parse(result.password);
  if (walletSecret === null) {
    throw new Error('walletSecret is null');
  }
}

/// if password is correct and pass the Biometrics check, return true
/// if password is wrong, it will return false
export async function loadWallet(
  password: string | undefined,
  simplePassword: string | undefined,
) {
  if (walletHeader === null) {
    throw new Error('walletHeader is null');
  }
  let correctPassword = password;
  if (walletHeader.passwordType === 'FullPassword') {
    if (password === undefined) {
      throw new Error('password is undefined');
    }
    if (Key.hashPassword(password) !== walletHeader.passwordHash) {
      return false;
    }
  } else if (
    walletHeader.passwordType === 'SimplePassword' ||
    walletHeader.passwordType === 'GesturePassword' ||
    walletHeader.passwordType === 'PinPassword'
  ) {
    if (simplePassword === undefined) {
      throw new Error('simplePassword is undefined');
    }
    if (walletHeader.encryptedPassword === undefined) {
      throw new Error('encryptedPassword is undefined');
    }
    const fullPassword = decryptPassword(
      walletHeader.encryptedPassword,
      simplePassword,
    );
    if (Key.hashPassword(fullPassword) !== walletHeader.passwordHash) {
      return false;
    }
    correctPassword = fullPassword;
  } else {
    correctPassword = undefined;
  }

  if (walletHeader.useBiometrics) {
    if (walletSecret === null) {
      await checkBiometrics();
    }
    if (walletSecret === null) {
      throw new Error('walletSecret is null');
    }
    if (walletSecret.password === undefined && correctPassword === undefined) {
      throw new Error('walletSecret.password is null');
    }
    if (correctPassword === undefined) {
      correctPassword = walletSecret.password!;
    }
  } else {
    const result = await Keychain.getGenericPassword();
    if (result === false) {
      throw new Error('save failed. Unknown error');
    }
    walletSecret = JSON.parse(result.password);
    if (walletSecret === null) {
      throw new Error('walletSecret is null');
    }
  }
  if (correctPassword === undefined) {
    throw new Error('correctPassword is undefined');
  }
  walletSecret.password = correctPassword;
  const key = Key.fromMnemonic(walletSecret.mnemonic, correctPassword);
  wallet = {
    EVMWallet: new EVMWallet(key),
    BTCWallet: new BTCWallet(key),
  };
  return true;
}

export async function setupWallet(walletInfo: WalletSetupParam) {
  // get password hash.
  const passwordHash = Key.hashPassword(walletInfo.password);
  walletHeader = {
    passwordType: walletInfo.passwordType,
    useBiometrics: walletInfo.useBiometrics,
    passwordHash: passwordHash,
    encryptedPassword: undefined,
  };
  if (walletInfo.passwordType === 'FullPassword') {
    walletSecret = {
      mnemonic: walletInfo.mnemonic,
    };
  } else if (walletInfo.passwordType === 'NoPassword') {
    walletSecret = {
      mnemonic: walletInfo.mnemonic,
      password: walletInfo.password,
    };
  } else {
    if (walletInfo.simplePassword === undefined) {
      throw new Error('simplePassword is undefined');
    }
    walletHeader.encryptedPassword = encryptPassword(
      walletInfo.password,
      walletInfo.simplePassword,
    );
    walletSecret = {
      mnemonic: walletInfo.mnemonic,
    };
  }
  let keyChainOptions: Keychain.Options | undefined;
  if (walletInfo.useBiometrics) {
    keyChainOptions = {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      // accessGroup: null,
      authenticationPrompt: {
        title: 'Doom wallet need use your biometrics to secure your wallet',
      },
      authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
      storage: Keychain.STORAGE_TYPE.RSA,
      rules: Keychain.SECURITY_RULES.NONE,
    };
  }

  const secretString = JSON.stringify(walletSecret);
  const result = await Keychain.setGenericPassword(
    'doom',
    secretString,
    keyChainOptions,
  );
  if (result === false) {
    throw new Error('save failed. Unknown error');
  }

  // save header info
  await EncryptedStorage.setItem(
    KEY_WALLET_HEADER,
    JSON.stringify(walletHeader),
  );

  const key = Key.fromMnemonic(walletInfo.mnemonic, walletInfo.password);
  wallet = {
    EVMWallet: new EVMWallet(key),
    BTCWallet: new BTCWallet(key),
  };
}

export async function logout() {
  wallet = null;
  walletSecret = null;
}

export async function resetWallet() {
  wallet = null;
  walletHeader = null;
  walletSecret = null;
  await EncryptedStorage.removeItem(KEY_WALLET_HEADER);
  await Keychain.resetGenericPassword();
}

export function parseEVMRequest(ur: UR) {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  return wallet.EVMWallet.parseRequest(ur);
}

export function signEVMRequest(request: SignRequest) {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  return wallet.EVMWallet.signRequest(request);
}

export function parseBTCRequest(ur: UR): BTCSignRequest {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  return wallet.BTCWallet.parseRequest(ur);
}

export function signBTCRequest(request: BTCSignRequest) {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  return wallet.BTCWallet.signRequest(request);
}

export function generateRandomMnemonic() {
  return Key.generateRandomMnemonic();
}

export function generateMnemonicByHashingText(text: string) {
  return Key.generateMenoicByHashString(text);
}

export function checkEVMAddressCanBeDerived(
  address: string,
  derivationPath: string,
) {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  const expectedAddress =
    wallet.EVMWallet.getDerivedAddressByPath(derivationPath);
  return expectedAddress === address;
}

export function checkBTCAddressCanBeDerived(
  address: string,
  derivationPath: string,
) {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  const expectedAddress =
    wallet.BTCWallet.getDerivedAddressByPath(derivationPath);
  return expectedAddress === address;
}

export function derivedEVMAddressList(length: number) {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  let list: string[] = [];
  for (let i = 0; i < length; i++) {
    list.push(wallet.EVMWallet.getDerivedAddressByIndex(i));
  }
  return list;
}

// change is true mean it is change/external address, or it is receive/internal address
// pageNumber start from 0
export function derivedBTCAddressList(pageNumber: number, change: boolean) {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  let list: string[] = [];
  for (
    let i = pageNumber * BTCWallet.PAGE_SIZE;
    i < pageNumber * BTCWallet.PAGE_SIZE + BTCWallet.PAGE_SIZE;
    i++
  ) {
    if (change) {
      list.push(wallet.BTCWallet.getChangeAddress(i));
    } else {
      list.push(wallet.BTCWallet.getExternalAddress(i));
    }
  }
  return list;
}

export function getWalletSecuritySetting() {
  if (wallet === null) {
    throw new Error('wallet is null');
  }
  return {
    mnemonic: walletSecret!.mnemonic,
    password: walletSecret!.password!,
    passwordType: walletHeader!.passwordType,
    useBiometrics: walletHeader!.useBiometrics,
  };
}

export function getWallet() {
  // const mnemonic =
  //   'farm library shuffle knee equal blush disease table deliver custom farm stereo fat level dawn book advance lamp clutch crumble gaze law bird jazz';
  // const password = 'j1io2u7$@081nf%@au0-,.,3151lijasfa';
  // wallet = new EVMWallet(Key.fromMnemonic(mnemonic, password));
  return wallet;
}
