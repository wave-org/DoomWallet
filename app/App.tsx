/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
//   useWindowDimensions,
// } from 'react-native';

import HomePage from './pages/Home';
import FindPage from './pages/Find';
import AccountPage from './pages/Account';
import QRScannerPage from './pages/QRScanner';
import SignPage from './pages/Sign';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Routes from './routes/Routes';
import {loadWallet} from './wallet';

const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

const FindStack = createNativeStackNavigator();
const FindStackScreen = () => (
  <FindStack.Navigator screenOptions={{headerShown: false}}>
    <FindStack.Group>
      <FindStack.Screen name={Routes.FIND} component={FindPage} />
      <FindStack.Screen name={Routes.SIGN} component={SignPage} />
    </FindStack.Group>
    <FindStack.Group screenOptions={{presentation: 'modal'}}>
      <FindStack.Screen name={Routes.QR_SCANNER} component={QRScannerPage} />
    </FindStack.Group>
  </FindStack.Navigator>
);

// FindStack.navigationOptions = ({navigation}) => {
//   let tabBarVisible = true;

//   // let routeName = navigation.state.routes[navigation.state.index].routeName;

//   // if (routeName == 'ProductDetails') {
//   //   tabBarVisible = false;
//   // }

//   return {
//   };
// };

function App(): JSX.Element {
  useEffect(() => {
    // TODO : load wallet from storage
    loadWallet('j1io2u7$@081nf%@au0-,.,3151lijasfa');
  }, []);
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Find" component={FindStackScreen} />
        <Tab.Screen name="Account" component={AccountPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
