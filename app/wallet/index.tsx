import QRCode from 'react-native-qrcode-svg';
import {Key, EVMWallet, SignRequest} from 'doom-wallet-core';
import EncryptedStorage from 'react-native-encrypted-storage';

// const mnemonic =
//   'farm library shuffle knee equal blush disease table deliver custom farm stereo fat level dawn book advance lamp clutch crumble gaze law bird jazz';
// const password = 'j1io2u7$@081nf%@au0-,.,3151lijasfa';

let wallet: EVMWallet | null = null;

export type PasswordType =
  | 'FullPassword'
  | 'SimplePassword'
  | 'PinPassword'
  | 'GesturePassword';
//   | 'NoPassword';

type WalletSetupParam = {
  mnemonic: string;
  password: string;
  passwordType: PasswordType;
  useBiometrics: boolean;
  simplePassword?: string;
};

let walletJSON: WalletJSON | null = null;
/// stored in storage
type WalletJSON = {
  mnemonic: string;
  passwordType: PasswordType;
  useBiometrics: boolean;
  encryptedPassword: string | undefined;
  /// use hash to check password is correct
  passwordHash: string;
};

// encrypt password
function encryptPassword(password: string, simplePassword: string) {
  // a very simple encrypt
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const simplePasswordData = encoder.encode(simplePassword);
  const encryptedPasswordData = passwordData.map((value, index) => {
    // eslint-disable-next-line no-bitwise
    return value ^ simplePasswordData[index % simplePasswordData.length];
  });
  return Buffer.from(encryptedPasswordData).toString('hex');
}

function decryptPassword(encryptedPassword: string, simplePassword: string) {
  // encryptedPassword is hex string
  const encoder = new TextEncoder();
  const encryptedPasswordData = Buffer.from(encryptedPassword, 'hex');
  const simplePasswordData = encoder.encode(simplePassword);
  const passwordData = encryptedPasswordData.map((value, index) => {
    // eslint-disable-next-line no-bitwise
    return value ^ simplePasswordData[index % simplePasswordData.length];
  });
  return Buffer.from(passwordData).toString();
}

export async function checkWalletExists(): Promise<PasswordType | null> {
  const storedValue = await EncryptedStorage.getItem('wallet_json');
  if (storedValue !== null && storedValue !== undefined) {
    // Congrats! You've just retrieved your first value!
    console.log(storedValue);
    walletJSON = JSON.parse(storedValue);
    if (walletJSON !== null) {
      return walletJSON.passwordType;
    }
  }
  return null;
}

export function getPasswordType() {
  if (walletJSON === null) {
    throw new Error('walletJSON is null');
  }
  return walletJSON.passwordType;
}

/// if password is correct, return true
export function loadWallet(password: string) {
  if (walletJSON === null) {
    throw new Error('walletJSON is null');
  }

  if (Key.hashPassword(password) === walletJSON.passwordHash) {
    wallet = new EVMWallet(Key.fromMnemonic(walletJSON.mnemonic, password));
    return true;
  }
  return false;
}

export function loadWalletBySimplePassword(simplePassword: string) {
  if (walletJSON === null) {
    throw new Error('walletJSON is null');
  }

  if (walletJSON.passwordType === 'FullPassword') {
    throw new Error('passwordType should not be FullPassword');
  }
  if (walletJSON.encryptedPassword === undefined) {
    throw new Error('encryptedPassword is undefined');
  }
  const password = decryptPassword(
    walletJSON.encryptedPassword,
    simplePassword,
  );
  if (Key.hashPassword(password) === walletJSON.passwordHash) {
    wallet = new EVMWallet(Key.fromMnemonic(walletJSON.mnemonic, password));
    return true;
  }
  return false;
}

export async function setupWallet(walletInfo: WalletSetupParam) {
  // get password hash.
  const passwordHash = Key.hashPassword(walletInfo.password);
  if (walletInfo.passwordType === 'FullPassword') {
    walletJSON = {
      mnemonic: walletInfo.mnemonic,
      passwordType: walletInfo.passwordType,
      useBiometrics: walletInfo.useBiometrics,
      passwordHash: passwordHash,
      encryptedPassword: undefined,
    };
  } else {
    if (walletInfo.simplePassword === undefined) {
      throw new Error('simplePassword is undefined');
    }
    walletJSON = {
      mnemonic: walletInfo.mnemonic,
      passwordType: walletInfo.passwordType,
      useBiometrics: walletInfo.useBiometrics,
      passwordHash: passwordHash,
      encryptedPassword: encryptPassword(
        walletInfo.password,
        walletInfo.simplePassword,
      ),
    };
  }

  await EncryptedStorage.setItem('wallet_json', JSON.stringify(walletJSON));
  wallet = new EVMWallet(
    Key.fromMnemonic(walletInfo.mnemonic, walletInfo.password),
  );
}

export async function resetWallet() {
  wallet = null;
  walletJSON = null;
  await EncryptedStorage.removeItem('wallet_json');
}

// export async function loadWallet(_password: string) {
//   // TODO load data from storage
//   if (wallet === null) {
//     wallet = new EVMWallet(Key.fromMnemonic(mnemonic, _password));
//   }
//   return wallet;
// }

// export async function loadWalletWithSimplePassword(simplePassword: string) {
//   // TODO load data from storage
//   if (wallet === null) {
//     // TODO : password =  storedpassword + simplePassword
//     wallet = new EVMWallet(
//       Key.fromMnemonic(mnemonic, password + simplePassword),
//     );
//   }
//   return wallet;
// }

export function parseRequest(ur: string) {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  return wallet.parseRequest(ur);
}

export function signRequest(request: SignRequest) {
  if (wallet === null) {
    throw new Error('Wallet is not loaded');
  }
  return wallet.signRequest(request);
}

export function generateRandomMnemonic() {
  return Key.generateRandomMnemonic();
}

export function generateMnemonicByHashingText(text: string) {
  return Key.generateMenoicByHashString(text);
}

export function getWallet() {
  return wallet;
}
