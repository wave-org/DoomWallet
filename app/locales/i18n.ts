import en from './languages/en.json';
import zh from './languages/zh.json';

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {LanguageDetectorModule} from 'i18next';
import {Platform, NativeModules} from 'react-native';

let systemLanguage = 'en';
export const getSystemLanguage = () => {
  return systemLanguage;
};

const RNLanguageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  init: () => {},
  detect: () => {
    const locale =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;
    systemLanguage = locale.split('_')[0];
    return systemLanguage;
  },
  cacheUserLanguage: () => {},
};

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
  'zh-Hans': {
    translation: zh,
  },
  'zh-Hant': {
    translation: zh,
  },
};

i18n
  .use(RNLanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    // lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'zh-Hans', 'zh-Hant'],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false,
    },
    compatibilityJSON: 'v3',
  });

export default i18n;
