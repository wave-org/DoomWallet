import EncryptedStorage from 'react-native-encrypted-storage';
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';

export enum DarkMode {
  UseSystemConfig,
  Light,
  Dark,
}

export const useDarkModeOptions = () => {
  const {t} = useTranslation();
  return [t('darkMode.useSystem'), t('darkMode.light'), t('darkMode.dark')];
};

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

export enum Language {
  EN,
  ZH,
}

export const LanguageStringMap = {
  [Language.EN]: 'en',
  [Language.ZH]: 'zh',
};

const LANGUAGE_VALUE = 'LANGUAGE_VALUE';
let language: Language | undefined;
export const loadLanguage = async () => {
  if (language !== undefined) {
    return language;
  }
  const storedValue = await EncryptedStorage.getItem(LANGUAGE_VALUE);
  if (storedValue !== null && storedValue !== undefined) {
    const value = parseInt(storedValue, 10);
    switch (value) {
      case Language.EN:
        language = Language.EN;
        return Language.EN;
      case Language.ZH:
        language = Language.ZH;
        i18n.changeLanguage(LanguageStringMap[language]);
        return Language.ZH;
    }
  }
  language = Language.EN;
  return Language.EN;
};
// call this function after loadDarkMode
export const getLanguage = () => {
  if (language === undefined) {
    throw new Error('language is not loaded');
  }
  return language;
};

export const useLanguageOptions = () => {
  const {t} = useTranslation();
  return [t('language.en'), t('language.zh')];
};

export const setLanguage = async (value: Language) => {
  try {
    await i18n.changeLanguage(LanguageStringMap[value]);
    await EncryptedStorage.setItem(LANGUAGE_VALUE, value.toString());
    language = value;
  } catch (error) {
    console.log(error);
  }
};
