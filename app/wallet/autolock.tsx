import EncryptedStorage from 'react-native-encrypted-storage';
import * as wallet from './index';

export enum AutoLockTime {
  Immediately,
  After30Seconds,
  After1Minute,
  After10Minutes,
  After30Minutes,
  After1Hour,
  Never,
}

export const AutoLockTimeText = [
  'Immediately',
  'After 30 seconds',
  'After 1 minute',
  'After 10 minutes',
  'After 30 minutes',
  'After 1 hour',
  'Never',
];

export const AutoLockTimeValueMap = {
  [AutoLockTime.Immediately]: 0,
  [AutoLockTime.After30Seconds]: 30,
  [AutoLockTime.After1Minute]: 60,
  [AutoLockTime.After10Minutes]: 600,
  [AutoLockTime.After30Minutes]: 1800,
  [AutoLockTime.After1Hour]: 3600,
  [AutoLockTime.Never]: 999999999,
};

let lastTime = 0;
export const DEFAULT_AUTO_LOCK_TIME = AutoLockTime.After30Seconds;
const AUTO_LOCK_TIME_VALUE = 'AUTO_LOCK_TIME_VALUE';
let autoLockTime = DEFAULT_AUTO_LOCK_TIME;

export async function loadAutoLockTime() {
  const storedValue = await EncryptedStorage.getItem(AUTO_LOCK_TIME_VALUE);
  if (storedValue !== null && storedValue !== undefined) {
    autoLockTime = parseInt(storedValue, 10);
  }
}

export function getAutoLockTime() {
  return autoLockTime;
}

export async function setAutoLockTime(value: AutoLockTime) {
  autoLockTime = value;
  await EncryptedStorage.setItem(AUTO_LOCK_TIME_VALUE, value.toString());
}

export function enterBackground() {
  lastTime = new Date().getTime();
}

/// return true if app should not lock
export function enterForeground(): boolean {
  if (lastTime === 0) {
    /// first time launch app. do not lock
    return true;
  }
  const currentTime = new Date().getTime();
  const diff = currentTime - lastTime;
  if (diff > AutoLockTimeValueMap[autoLockTime] * 1000) {
    wallet.logout();
    return false;
  } else {
    return true;
  }
}
