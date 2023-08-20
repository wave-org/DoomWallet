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
import {loadDarkMode, DarkMode} from './app/wallet/setting';

loadDarkMode().then(darkMode => {
  if (darkMode === DarkMode.Dark) {
    Appearance.setColorScheme('dark');
  } else if (darkMode === DarkMode.Light) {
    Appearance.setColorScheme('light');
  } else {
    Appearance.setColorScheme(undefined);
  }
});
AppRegistry.registerComponent(appName, () => App);
