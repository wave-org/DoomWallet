/**
 * @format
 */

import 'fast-text-encoding';
import Joi from 'joi';
global.Buffer = require('buffer').Buffer;
import 'react-native-get-random-values';

import {AppRegistry, Appearance} from 'react-native';

import App from './app/App';
import {name as appName} from './app.json';
import {
  loadDarkMode,
  getDarkMode,
  DarkMode,
  loadLanguage,
} from './app/wallet/setting';
import {loadAirgapMode} from './app/wallet/airgap';
import * as AutoLock from './wallet/autolock';
import './app/locales/i18n';

async function load() {
  // const startTime = Date.now();
  const load1 = loadDarkMode();
  const load2 = loadLanguage();
  const load3 = loadAirgapMode();
  const load4 = AutoLock.loadAutoLockTime();
  await Promise.all([load1, load2, load3, load4]);

  const darkMode = getDarkMode();
  if (darkMode === DarkMode.Dark) {
    Appearance.setColorScheme('dark');
  } else if (darkMode === DarkMode.Light) {
    Appearance.setColorScheme('light');
  } else {
    Appearance.setColorScheme(undefined);
  }
  // console.log('load time', Date.now() - startTime);
}

AppRegistry.registerRunnable(appName, async initialProps => {
  try {
    await load();
    AppRegistry.registerComponent(appName, () => App);
    AppRegistry.runApplication(appName, initialProps);
  } catch (err) {
    console.log(err);
  }
});
