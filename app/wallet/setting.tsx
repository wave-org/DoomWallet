import EncryptedStorage from 'react-native-encrypted-storage';

export enum DarkMode {
  UseSystemConfig,
  Light,
  Dark,
}

export const DarkModeText = {
  [DarkMode.UseSystemConfig]: 'Use system config',
  [DarkMode.Light]: 'Light',
  [DarkMode.Dark]: 'Dark',
};

export const DARK_MODE_OPTIONS = [
  DarkModeText[DarkMode.UseSystemConfig],
  DarkModeText[DarkMode.Light],
  DarkModeText[DarkMode.Dark],
];

const DARK_MODE_VALUE = 'DARK_MODE_VALUE';
let darkMode: DarkMode | undefined;
export const loadDarkMode = async () => {
  if (darkMode !== undefined) {
    return darkMode;
  }
  const storedValue = await EncryptedStorage.getItem(DARK_MODE_VALUE);
  if (storedValue !== null && storedValue !== undefined) {
    const value = parseInt(storedValue, 10);
    if (value === 1) {
      darkMode = DarkMode.Light;
      return DarkMode.Light;
    } else if (value === 2) {
      darkMode = DarkMode.Dark;
      return DarkMode.Dark;
    }
  }
  darkMode = DarkMode.UseSystemConfig;
  return DarkMode.UseSystemConfig;
};
// call this function after loadDarkMode
export const getDarkMode = () => {
  if (darkMode === undefined) {
    throw new Error('darkMode is not loaded');
  }
  return darkMode;
};

export const setDarkMode = async (value: DarkMode) => {
  darkMode = value;
  await EncryptedStorage.setItem(DARK_MODE_VALUE, value.toString());
};
