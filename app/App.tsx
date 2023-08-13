import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  AppState,
  Image,
  StyleSheet,
  StatusBar,
  // Appearance,
} from 'react-native';

import HomePage from './pages/Home';
import FindPage from './pages/Find';
import AccountPage from './pages/Settings';
import QRScannerPage from './pages/QRScanner';
import SignPage from './pages/Sign';
import ConnectionQRCodePage from './pages/Settings/ConnectionQR';
import AddressList from './pages/Settings/AddressList';
import AutoLockPage from './pages/Settings/AutoLock';
import LanguagePage from './pages/Settings/LanguagePage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Routes from './routes/Routes';
import {checkWalletExists, getWallet} from './wallet';
import LoginPage from './pages/Login';
import SetupPage from './pages/Setup';
import SetPasswordPage from './pages/Setup/SetPassword';
import SecuritySettingPage from './pages/Setup/SecuritySetting';
import BtcAddressListPage from './pages/Settings/BtcAddressList';
import Toast from 'react-native-toast-message';
import * as AutoLock from './wallet/autolock';

const Tab = createBottomTabNavigator();

const TabHome = () => {
  const networkTabIcon = ({
    color,
    // focused,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) => (
    <Image
      source={require('./images/network.png')}
      tintColor={color}
      width={size}
      height={size}
    />
  );
  const scanTabIcon = ({
    color,
    // focused,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) => (
    <Image
      source={require('./images/scan.png')}
      tintColor={color}
      width={size}
      height={size}
    />
  );
  const accountTabIcon = ({
    color,
    // focused,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) => (
    <Image
      source={require('./images/account.png')}
      tintColor={color}
      width={size}
      height={size}
    />
  );
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Network"
        component={HomePage}
        options={{
          tabBarIcon: networkTabIcon,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={FindPage}
        options={{
          tabBarIcon: scanTabIcon,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountPage}
        options={{
          tabBarIcon: accountTabIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator();
function App(): JSX.Element {
  const [route, setRoute] = useState('');
  const navigation = React.useRef(null);

  useEffect(() => {
    async function checkExisting() {
      let wallet = getWallet();
      if (wallet !== null) {
        setRoute(Routes.ROOT.TABS);
      } else {
        try {
          const walletHeader = await checkWalletExists();
          AutoLock.loadAutoLockTime();
          if (walletHeader !== null) {
            setRoute(Routes.ROOT.LOGIN);
          } else {
            setRoute(Routes.ROOT.SETUP);
          }
        } catch (error) {
          let message = (error as Error).message;
          Toast.show({
            type: 'error',
            text1: 'Error happened, please try again later',
            text2: message,
          });
        }
      }
    }

    checkExisting();
  }, []);

  useEffect(() => {
    // auto lock
    let showingLoginpage = false;
    const onLogin = () => {
      // because of while the faceid is showing, the app will be in background. So, we need to wait for a while to avoid the app will be locked immediately.
      setTimeout(() => {
        showingLoginpage = false;
      }, 1000);
    };
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (showingLoginpage) {
        return;
      }
      if (nextAppState === 'active') {
        if (!AutoLock.enterForeground() && !showingLoginpage) {
          showingLoginpage = true;
          // @ts-ignore
          navigation.current!.navigate(Routes.ROOT.LOGIN, {onLogin});
        }
      } else if (nextAppState === 'background') {
        AutoLock.enterBackground();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    (route !== '' && (
      <NavigationContainer ref={navigation}>
        <StatusBar
          animated={true}
          barStyle="dark-content"
          // barStyle={
          //   Appearance.getColorScheme() === 'dark'
          //     ? 'light-content'
          //     : 'dark-content'
          // }
        />
        <RootStack.Navigator initialRouteName={route}>
          <RootStack.Group
            screenOptions={{
              headerShown: false,
              presentation: 'modal',
            }}>
            <RootStack.Screen
              name={Routes.ROOT.LOGIN}
              component={LoginPage}
              options={{headerShown: false, presentation: 'fullScreenModal'}}
            />
            <RootStack.Screen
              name={Routes.ROOT.SETUP}
              component={SetupPage}
              options={{headerShown: true, title: 'Create Wallet'}}
            />
            <RootStack.Screen
              name={Routes.ROOT.TABS}
              component={TabHome}
              options={{headerShown: false, animation: 'none'}}
            />
          </RootStack.Group>
          <RootStack.Group>
            <RootStack.Screen
              name={Routes.ROOT.SETPASSWORD}
              component={SetPasswordPage}
              options={{title: 'Set Password'}}
            />
            <RootStack.Screen
              name={Routes.ROOT.SECURITY_SETTING}
              component={SecuritySettingPage}
              options={{title: 'Security Setting'}}
            />
          </RootStack.Group>
          <RootStack.Group>
            <RootStack.Screen
              name={Routes.TABS.SIGN}
              options={{title: 'Sign'}}
              component={SignPage}
            />
            <RootStack.Screen
              name={Routes.TABS.CONNECTION}
              options={{title: 'Connection QR Code'}}
              component={ConnectionQRCodePage}
            />
            <RootStack.Screen
              name={Routes.TABS.ADDRESS_LIST}
              options={{title: 'EVM Address List'}}
              component={AddressList}
            />
            <RootStack.Screen
              name={Routes.TABS.BTC_ADDRESS_LIST}
              options={{title: 'BTC Address List'}}
              component={BtcAddressListPage}
            />
            <RootStack.Screen
              name={Routes.TABS.AUTOLOCK}
              options={{title: 'Auto Lock Setting'}}
              component={AutoLockPage}
            />
            <RootStack.Screen
              name={Routes.TABS.LANGUAGE}
              options={{title: 'Language Setting'}}
              component={LanguagePage}
            />
          </RootStack.Group>
          <RootStack.Group
            screenOptions={{
              presentation: 'fullScreenModal',
              headerShown: false,
            }}>
            <RootStack.Screen
              name={Routes.TABS.QR_SCANNER}
              component={QRScannerPage}
            />
          </RootStack.Group>
        </RootStack.Navigator>
        <Toast />
      </NavigationContainer>
    )) || (
      <NavigationContainer>
        <SafeAreaView style={styles.background}>
          <View>
            <Text>Loding</Text>
          </View>
        </SafeAreaView>
      </NavigationContainer>
    )
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
  },
});

export default App;
