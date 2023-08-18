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
// TODO not support darm mode now.
Appearance.setColorScheme('light');
AppRegistry.registerComponent(appName, () => App);
