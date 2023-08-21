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
import {loadDarkMode, DarkMode, loadLanguage} from './app/wallet/setting';
import './app/locales/i18n';

loadDarkMode().then(darkMode => {
  if (darkMode === DarkMode.Dark) {
    Appearance.setColorScheme('dark');
  } else if (darkMode === DarkMode.Light) {
    Appearance.setColorScheme('light');
  } else {
    Appearance.setColorScheme(undefined);
  }
});
loadLanguage();
AppRegistry.registerComponent(appName, () => App);
