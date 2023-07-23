import QRCode from 'react-native-qrcode-svg';
import {Key, EVMWallet, SignRequest} from 'doom-wallet-core';
const mnemonic =
  'farm library shuffle knee equal blush disease table deliver custom farm stereo fat level dawn book advance lamp clutch crumble gaze law bird jazz';
const password = 'j1io2u7$@081nf%@au0-,.,3151lijasfa';

let wallet: EVMWallet | null = null;

export async function loadWallet(_password: string) {
  // TODO load data from storage
  if (wallet === null) {
    wallet = new EVMWallet(Key.fromMnemonic(mnemonic, _password));
  }
  return wallet;
}

export async function loadWalletWithSimplePassword(simplePassword: string) {
  // TODO load data from storage
  if (wallet === null) {
    // TODO : password =  storedpassword + simplePassword
    wallet = new EVMWallet(
      Key.fromMnemonic(mnemonic, password + simplePassword),
    );
  }
  return wallet;
}

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
  console.log('signRequest', request);
  return wallet.signRequest(request);
}
