import {
  Key,
  EVMWallet,
  SignRequest,
  BTCWallet,
  BTCSignRequest,
  WalletExportFormat,
  encryptWEF,
  decryptWEF,
  isWEF,
  decrypt,
  encrypt,
} from 'doom-wallet-core';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Keychain from 'react-native-keychain';
import {UR} from '@ngraveio/bc-ur';
import {getPreviousVersion} from '../util/upgrade';

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
  /// Doom type: Wallet created by Doom will use this password and mnemonic to generate private key. So, this password is seed password.
  /// Imported type: Imported wallet will use this password to encrypt and decrypt mnemonic. usingUnlockPassword will be true.
  password: string;
  // how to store password
  passwordType: PasswordType;
  // if usingUnlockPassword is true, the password is used to encrypt and decrypt mnemonic
  usingUnlockPassword?: boolean;
  useBiometrics: boolean;
  simplePassword?: string;
};

let walletSecret: WalletSecret | null = null;
/// stored in Keychain. If user use biometrics, this is encrypted by biometrics.
type WalletSecret = {
  /// when usingUnlockPassword is true, mnemonic will be encrypted before stored in Keychain
  mnemonic: string;
  /// if only use biometrics, password will be stored here
  password?: string;
};
let walletHeader: WalletHeader | null = null;
export const maxTryTimes = 5;
/// stored in EncryptedStorage
export type WalletHeader = {
  passwordType: PasswordType;
  useBiometrics: boolean;
  encryptedPassword: string | undefined;
  /// use hash to check password is correct
  passwordHash: string;
  triedTimes: number;
  /// if it is nil, use default derivation path
  evmDerivationPath?: string;
  // For imported wallet, there may be no password. In this case, use unlockPassword to encrypt and decrypt mnemonic
  usingUnlockPassword?: boolean;
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

export async function checkBiometrics(prompt: string) {
  if (walletHeader === null) {
    throw new Error('walletHeader is null');
  }
  if (!walletHeader.useBiometrics) {
    throw new Error('useBiometrics is false');
  }
  const keyChainOptions = {
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    authenticationPrompt: {
      title: prompt,
    },
    authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
    securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
    storage: Keychain.STORAGE_TYPE.RSA,
    rules: Keychain.SECURITY_RULES.NONE,
  };
  const result = await Keychain.getGenericPassword(keyChainOptions);
  if (result === false) {
    throw new Error('load failed. Unknown error');
  }
  walletSecret = JSON.parse(result.password);
  biometricsChecked = true;
  if (walletSecret === null) {
    throw new Error('walletSecret is null');
  }
}

export enum PasswordCheckResult {
  Correct,
  Wrong,
  OverMaxTryTimes,
}
/// if password is correct and pass the Biometrics check, return true
/// if password is wrong, it will return false
export async function loadWallet(
  prompt: string,
  password: string | undefined,
  simplePassword: string | undefined,
): Promise<PasswordCheckResult> {
  if (walletHeader === null) {
    throw new Error('walletHeader is null');
  }
  let correctPassword = password;
  if (walletHeader.passwordType === 'FullPassword') {
    if (password === undefined) {
      throw new Error('password is undefined');
    }
    if (Key.hashPassword(password) !== walletHeader.passwordHash) {
      walletHeader.triedTimes += 1;
      if (walletHeader.triedTimes >= maxTryTimes) {
        await resetWallet();
        // throw new Error('Over max try times, wallet is reset!');
        return PasswordCheckResult.OverMaxTryTimes;
      } else {
        await EncryptedStorage.setItem(
          KEY_WALLET_HEADER,
          JSON.stringify(walletHeader),
        );
      }
      return PasswordCheckResult.Wrong;
    } else if (walletHeader.triedTimes !== 0) {
      walletHeader.triedTimes = 0;
      await EncryptedStorage.setItem(
        KEY_WALLET_HEADER,
        JSON.stringify(walletHeader),
      );
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
      walletHeader.triedTimes += 1;
      if (walletHeader.triedTimes >= maxTryTimes) {
        await resetWallet();
        // throw new Error('Over max try times, wallet is reset!');
        return PasswordCheckResult.OverMaxTryTimes;
      } else {
        await EncryptedStorage.setItem(
          KEY_WALLET_HEADER,
          JSON.stringify(walletHeader),
        );
      }
      return PasswordCheckResult.Wrong;
    } else if (walletHeader.triedTimes !== 0) {
      walletHeader.triedTimes = 0;
      await EncryptedStorage.setItem(
        KEY_WALLET_HEADER,
        JSON.stringify(walletHeader),
      );
    }
    correctPassword = fullPassword;
  } else {
    correctPassword = undefined;
  }

  if (walletHeader.useBiometrics) {
    if (walletSecret === null) {
      await checkBiometrics(prompt);
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
      throw new Error('load failed. Unknown error');
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
  if (walletHeader.usingUnlockPassword === true) {
    // while usingUnlockPassword, the mnemonic is encrypted, we need to decrypt it
    try {
      let mnemonic = decrypt(walletSecret.mnemonic, correctPassword);
      walletSecret.mnemonic = mnemonic;
    } catch (error) {
      console.log('decrypt mnemonic failed');
      throw new Error('decrypt mnemonic failed');
    }
  }
  const key = Key.fromMnemonic(
    walletSecret.mnemonic,
    walletHeader.usingUnlockPassword === true ? undefined : correctPassword,
  );
  wallet = {
    EVMWallet: new EVMWallet(key),
    BTCWallet: new BTCWallet(key),
  };
  if (walletHeader.evmDerivationPath !== undefined) {
    setupSavedDerivationPath(walletHeader.evmDerivationPath);
  }
  return PasswordCheckResult.Correct;
}

let biometricsChecked = false;
export function getBiometricsChecked() {
  return biometricsChecked;
}

export async function checkBiometricsAvailable(prompt: string) {
  // when first time set biometrics, check if biometrics is available
  if (biometricsChecked) {
    return true;
  }
  // store and read a value to check if biometrics is available
  const keyChainOptions = {
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    // accessGroup: null,
    authenticationPrompt: {
      title: prompt,
    },
    authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
    securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
    storage: Keychain.STORAGE_TYPE.RSA,
    rules: Keychain.SECURITY_RULES.NONE,
    service: 'org.wave.doom.test',
  };
  try {
    await Keychain.setGenericPassword('doom', 'test', keyChainOptions);
    const result = await Keychain.getGenericPassword(keyChainOptions);
    if (result === false) {
      return false;
    } else {
      biometricsChecked = true;
      return true;
    }
  } catch (error) {
    console.log('checkBiometricsAvailable error', error);
    return false;
  }
}

export async function setupWallet(walletInfo: WalletSetupParam) {
  // get password hash.
  const passwordHash: string = Key.hashPassword(walletInfo.password);
  let usingUnlockPassword = walletInfo.usingUnlockPassword === true;

  walletHeader = {
    passwordType: walletInfo.passwordType,
    useBiometrics: walletInfo.useBiometrics,
    passwordHash: passwordHash,
    encryptedPassword: undefined,
    triedTimes: 0,
    usingUnlockPassword: usingUnlockPassword,
  };
  if (!usingUnlockPassword) {
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
  } else {
    // usingUnlockPassword
    let encryptedMnemonic = encrypt(walletInfo.mnemonic, walletInfo.password);
    if (walletInfo.passwordType === 'FullPassword') {
      walletSecret = {
        mnemonic: encryptedMnemonic,
      };
    } else if (walletInfo.passwordType === 'NoPassword') {
      walletSecret = {
        mnemonic: encryptedMnemonic,
        password: walletInfo.password!,
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
        mnemonic: encryptedMnemonic,
      };
    }
  }

  let keyChainOptions: Keychain.Options | undefined;
  if (walletInfo.useBiometrics) {
    keyChainOptions = {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      // accessGroup: null,
      // authenticationPrompt: {
      //   title: prompt,
      // },
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

  const key = Key.fromMnemonic(
    walletInfo.mnemonic,
    usingUnlockPassword ? undefined : walletInfo.password,
  );
  wallet = {
    EVMWallet: new EVMWallet(key),
    BTCWallet: new BTCWallet(key),
  };
  // show mnemonic and password in security setting page
  if (usingUnlockPassword) {
    walletSecret.password = walletInfo.password;
    walletSecret.mnemonic = walletInfo.mnemonic;
  } else {
    walletSecret.password = walletInfo.password;
  }
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

// fragement lengths in bytes
const DEFAULT_QR_CODE_SIZE = 200;
// TODO setting.
const qrCodefragmentSize = DEFAULT_QR_CODE_SIZE;

export function signBTCRequest(request: BTCSignRequest) {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  return wallet.BTCWallet.signRequest(request, qrCodefragmentSize);
}

export function generateRandomMnemonic() {
  return Key.generateRandomMnemonic();
}

export function generateMnemonicByHashingText(text: string) {
  return Key.generateMnemonicByHashString(text);
}

export function getDerivedAddressByPath(derivationPath: string) {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  return wallet.EVMWallet.getDerivedAddressByPath(derivationPath);
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
    password: walletSecret!.password,
    passwordType: walletHeader!.passwordType,
    useBiometrics: walletHeader!.useBiometrics,
    usingUnlockPassword: walletHeader!.usingUnlockPassword === true,
  };
}

export function getWallet() {
  // if (wallet === null) {
  //   const mnemonic =
  //     'farm library shuffle knee equal blush disease table deliver custom farm stereo fat level dawn book advance lamp clutch crumble gaze law bird jazz';
  //   const password = 'j1io2u7$@081nf%@au0-,.,3151lijasfa';
  //   const key = Key.fromMnemonic(mnemonic, password);
  //   wallet = {
  //     EVMWallet: new EVMWallet(key),
  //     BTCWallet: new BTCWallet(key),
  //   };
  // }
  return wallet;
}

export enum WalletType {
  EVM = 'EVM',
  BTC = 'BTC',
}

export function getRequestType(ur: UR): WalletType {
  if (ur.type === 'eth-sign-request') {
    return WalletType.EVM;
  } else if (ur.type === 'crypto-psbt') {
    return WalletType.BTC;
  } else {
    throw new Error('Unknown request type');
  }
}

export function canSignBTCRequest(request: BTCSignRequest): boolean {
  return request.canSignByKey(wallet!.BTCWallet.key);
}

function setupSavedDerivationPath(path: string) {
  if (wallet === null) {
    throw new Error('wallet is null');
  }
  if (path === EVMWallet.defaultPath || path === undefined) {
    wallet.EVMWallet.useDefaultDerivationPath();
  } else if (path === EVMWallet.ledgerLegacyDerivationPath) {
    wallet.EVMWallet.useLedgerLegacyDerivationPath();
  } else if (path === EVMWallet.doomPath) {
    wallet.EVMWallet.useDoomDerivationPath();
  } else {
    wallet.EVMWallet.setCustomDerivationPath(path);
  }
}

export type EVMDerivationPathType =
  | 'Doom Legacy'
  | 'Ledger Legacy'
  | 'Default'
  | 'Custom';
export const EVMDerivationPathTypes: EVMDerivationPathType[] = [
  'Default',
  'Doom Legacy',
  'Ledger Legacy',
  'Custom',
];

export function getDerivationPathForEVMWallet() {
  if (wallet === null) {
    throw new Error('wallet is null');
  }
  return wallet.EVMWallet.getDerivationPath();
}

export function getDerivationTypeForEVMWallet() {
  const path = getDerivationPathForEVMWallet();
  if (path === EVMWallet.defaultPath || path === undefined) {
    return 'Default';
  } else if (path === EVMWallet.ledgerLegacyDerivationPath) {
    return 'Ledger Legacy';
  } else if (path === EVMWallet.doomPath) {
    return 'Doom Legacy';
  } else {
    return 'Custom';
  }
}

export function setLedgercyDerivationPathForEVMWallet() {
  if (wallet === null) {
    throw new Error('wallet is null');
  }
  wallet.EVMWallet.useLedgerLegacyDerivationPath();
  walletHeader!.evmDerivationPath = EVMWallet.ledgerLegacyDerivationPath;
  EncryptedStorage.setItem(KEY_WALLET_HEADER, JSON.stringify(walletHeader));
}

export function setDoomDerivationPathForEVMWallet() {
  if (wallet === null) {
    throw new Error('wallet is null');
  }
  wallet.EVMWallet.useDoomDerivationPath();
  walletHeader!.evmDerivationPath = EVMWallet.doomPath;
  EncryptedStorage.setItem(KEY_WALLET_HEADER, JSON.stringify(walletHeader));
}

export function setCustomDerivationPathForEVMWallet(path: string) {
  if (wallet === null) {
    throw new Error('wallet is null');
  }
  // m/44'/60'/0'/
  wallet.EVMWallet.setCustomDerivationPath(path);
  walletHeader!.evmDerivationPath = path;
  EncryptedStorage.setItem(KEY_WALLET_HEADER, JSON.stringify(walletHeader));
}

// return true if path is valid
export function checkCustomDerivationPathIsValid(path: string) {
  const regex = /^m(\/[0-9]+'?)+\/\*$/;
  return regex.test(path);
}

export function setDefaultDerivationPathForEVMWallet() {
  if (wallet === null) {
    throw new Error('wallet is null');
  }
  wallet.EVMWallet.useDefaultDerivationPath();
  walletHeader!.evmDerivationPath = EVMWallet.defaultPath;
  EncryptedStorage.setItem(KEY_WALLET_HEADER, JSON.stringify(walletHeader));
}

// The default derivation path for EVM wallet is changed in version 0.3.0, so we need to update the derivation path for the existing wallets.
// TODO this function will be removed in the future, maybe version 0.4.0.
export const derivationPathPatch = (header: WalletHeader | null) => {
  const previousVersion = getPreviousVersion();
  if (previousVersion === undefined && header !== null) {
    if (header.evmDerivationPath === undefined) {
      // It means the wallet is created before version 0.3.0, and it use the default doom derivation path.
      header.evmDerivationPath = EVMWallet.doomPath;
      EncryptedStorage.setItem(KEY_WALLET_HEADER, JSON.stringify(walletHeader));
    }
  }
};

export function validateMnemonic(mnemonic: string) {
  return Key.validateMnemonic(mnemonic);
}

export function getExportData(): WalletExportFormat {
  if (wallet === null) {
    throw new Error('wallet is null');
  }
  if (walletHeader?.usingUnlockPassword === true) {
    return {
      mnemonic: walletSecret!.mnemonic,
    };
  }
  return {
    mnemonic: walletSecret!.mnemonic,
    password: walletSecret!.password,
  };
}

export function encryptWalletExportData(
  data: WalletExportFormat,
  password: string,
): string {
  return encryptWEF(data, password);
}

export function isWalletExportData(data: string): boolean {
  return isWEF(data);
}

export function decryptWalletExportData(
  data: string,
  password: string,
): WalletExportFormat {
  return decryptWEF(data, password);
}
