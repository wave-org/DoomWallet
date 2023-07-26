/**
 * @format
 */

import 'fast-text-encoding';
import Joi from 'joi';
global.Buffer = require('buffer').Buffer;
import 'react-native-get-random-values';
import mobileAds from 'react-native-google-mobile-ads';

mobileAds()
  .initialize()
  .then(adapterStatuses => {
    // Initialization complete!
  });

import {AppRegistry} from 'react-native';

import App from './app/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
