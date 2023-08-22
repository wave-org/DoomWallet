import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  AppState,
  // Appearance,
} from 'react-native';

import {useAirgapMode, AirgapProvider} from './wallet/airgap';
import HomePage from './pages/Home';
import FindPage from './pages/Find';
import AccountPage from './pages/Settings';
import QRScannerPage from './pages/QRScanner';
import SignPage from './pages/Sign';
import BTCSignPage from './pages/Sign/BTCSign';
import ConnectionQRCodePage from './pages/Settings/ConnectionQR';
import AddressList from './pages/Settings/AddressList';
import AutoLockPage from './pages/Settings/AutoLock';
import LanguagePage from './pages/Settings/LanguagePage';
import DarkModePage from './pages/Settings/DarkModePage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Routes from './routes/Routes';
import {checkWalletExists, getWallet, logout} from './wallet';
import LoginPage from './pages/Login';
import SetupPage from './pages/Setup';
import SetPasswordPage from './pages/Setup/SetPassword';
import SecuritySettingPage from './pages/Setup/SecuritySetting';
import BtcAddressListPage from './pages/Settings/BtcAddressList';
import Toast from 'react-native-toast-message';
import * as AutoLock from './wallet/autolock';
import {useNavigationTheme, useTheme} from './util/theme';
import {useTranslation, Trans} from 'react-i18next';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
// @ts-ignore
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const TabHome = () => {
  const {t} = useTranslation();
  const networkTabIcon = ({
    color,
    // focused,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) => <MCIcon name="wifi" color={color} size={size} />;
  const scanTabIcon = ({
    color,
    // focused,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) => <MCIcon name="qrcode-scan" color={color} size={size} />;
  const accountTabIcon = ({
    color,
    // focused,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) => <MCIcon name="cog" color={color} size={size} />;
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={t('find.title')}
        component={FindPage}
        options={{
          tabBarIcon: scanTabIcon,
        }}
      />
      <Tab.Screen
        name={t('home.title')}
        component={HomePage}
        options={{
          tabBarIcon: networkTabIcon,
        }}
      />
      <Tab.Screen
        name={t('account.title')}
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
  const {airgapMode} = useAirgapMode();
  // console.log('airgapMode: ', airgapMode);
  const [networkState, setNetworkState] = React.useState<NetInfoState | null>(
    null,
  );

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
            position: 'bottom',
            bottomOffset: 100,
            visibilityTime: 2500,
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

    let unsubscribe: () => void;
    if (airgapMode) {
      unsubscribe = NetInfo.addEventListener(state => {
        setNetworkState(prev => {
          if (prev !== null && !prev.isConnected && state.isConnected) {
            // clean login info.
            logout();
            // @ts-ignore
            if (!showingLoginpage) {
              showingLoginpage = true;
              // @ts-ignore
              navigation.current!.navigate(Routes.ROOT.LOGIN, {onLogin});
            }
          }
          return state;
        });
      });
    }

    return () => {
      subscription.remove();
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [airgapMode]);

  const navigationTheme = useNavigationTheme();
  const {t} = useTranslation();
  const theme = useTheme();

  if (
    airgapMode === true &&
    networkState !== null &&
    networkState.isConnected
  ) {
    return (
      <SafeAreaView
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: theme.colors.background,
        }}>
        <Text
          style={{
            color: theme.colors.text,
            fontSize: 16,
            width: '100%',
            textAlign: 'center',
            padding: 30,
          }}>
          <Trans>airgap.caption</Trans>
        </Text>
      </SafeAreaView>
    );
  }

  return (
    (route !== '' && (
      <NavigationContainer theme={navigationTheme} ref={navigation}>
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
              options={{headerShown: true, title: t('setup.title')}}
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
              options={{title: t('setPassword.title')}}
            />
            <RootStack.Screen
              name={Routes.ROOT.SECURITY_SETTING}
              component={SecuritySettingPage}
              options={{title: t('securitySetting.title')}}
            />
          </RootStack.Group>
          <RootStack.Group>
            <RootStack.Screen
              name={Routes.TABS.SIGN}
              options={{title: t('signEVM.title')}}
              component={SignPage}
            />
            <RootStack.Screen
              name={Routes.TABS.BTCSIGN}
              options={{title: t('signBTC.title')}}
              component={BTCSignPage}
            />
            <RootStack.Screen
              name={Routes.TABS.CONNECTION}
              options={{title: t('connection.title')}}
              component={ConnectionQRCodePage}
            />
            <RootStack.Screen
              name={Routes.TABS.ADDRESS_LIST}
              options={{title: t('addressList.title')}}
              component={AddressList}
            />
            <RootStack.Screen
              name={Routes.TABS.BTC_ADDRESS_LIST}
              options={{title: t('btcAddressList.title')}}
              component={BtcAddressListPage}
            />
            <RootStack.Screen
              name={Routes.TABS.AUTOLOCK}
              options={{title: t('autoLock.title')}}
              component={AutoLockPage}
            />
            <RootStack.Screen
              name={Routes.TABS.LANGUAGE}
              options={{title: t('languageSetting.title')}}
              component={LanguagePage}
            />
            <RootStack.Screen
              name={Routes.TABS.DARKMODE}
              options={{title: t('darkMode.title')}}
              component={DarkModePage}
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
      <NavigationContainer theme={navigationTheme}>
        <SafeAreaView>
          <View>
            <Text>Loding</Text>
          </View>
        </SafeAreaView>
      </NavigationContainer>
    )
  );
}

const withProviders = () => {
  return (
    <AirgapProvider>
      <App />
    </AirgapProvider>
  );
};

export default withProviders;
