import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  AppState,
  // Appearance,
} from 'react-native';

import {useAirgapMode, AirgapProvider} from './wallet/airgap';
import {useRootRoute, RootRouteProvider} from './wallet/useRootRoute';
import ToolsPage from './pages/Tools';
import QRResultPage from './pages/Tools/QRCodeResult';
import QRCodeGenerator from './pages/Tools/QRCodeGenerator';
import URCodeGenerator from './pages/Tools/URCodeGenerator';
import ExportPage from './pages/Settings/ExportPage';
import ExportByQRCode from './pages/Settings/ExportByQRCode';
import ImportWalletPage from './pages/Setup/Import';
import FindPage from './pages/Find';
import AccountPage from './pages/Settings';
import QRScannerPage from './pages/QRScanner';
import SignPage from './pages/Sign';
import BTCSignPage from './pages/Sign/BTCSign';
import ConnectionQRCodePage from './pages/Settings/ConnectionQR';
import AddressList from './pages/Settings/EVM/AddressList';
import AutoLockPage from './pages/Settings/AutoLock';
import LanguagePage from './pages/Settings/LanguagePage';
import DarkModePage from './pages/Settings/DarkModePage';
import EVMWalletPage from './pages/Settings/EVM/EVMWallet';
import BTCSignRecordScreen from './pages/Find/BTCSignRecord';
import EVMSignRecordScreen from './pages/Find/EVMSignRecord';
// import ABIImportScreen from './pages/Tools/ImportABI';
import DerivationPathPage from './pages/Settings/EVM/DerivationPath';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Routes from './routes/Routes';
import {
  checkWalletExists,
  getWallet,
  logout,
  derivationPathPatch,
} from './wallet';
import LoginPage from './pages/Login';
import SetupPage from './pages/Setup';
import SetPasswordPage from './pages/Setup/SetPassword';
import SecuritySettingPage from './pages/Setup/SecuritySetting';
import BtcAddressListPage from './pages/Settings/BTC/BtcAddressList';
import BTCWalletPage from './pages/Settings/BTC/BTCWallet';
import Toast from 'react-native-toast-message';
import * as AutoLock from './wallet/autolock';
import {useNavigationTheme, useTheme} from './util/theme';
import {useTranslation, Trans} from 'react-i18next';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import QRCodeABIImportScreen from './pages/Tools/ImportABIByQRCode';
// @ts-ignore
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const TabHome = () => {
  const {t} = useTranslation();
  const toolsTabIcon = ({
    color,
    // focused,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) => <MCIcon name="tools" color={color} size={size} />;
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
        name={t('tools.title')}
        component={ToolsPage}
        options={{
          tabBarIcon: toolsTabIcon,
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
  const {rootRoute, setRootRoute} = useRootRoute();
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
        setRootRoute(Routes.ROOT.TABS);
      } else {
        try {
          const walletHeader = await checkWalletExists();
          await derivationPathPatch(walletHeader);
          if (walletHeader !== null) {
            setRootRoute(Routes.ROOT.LOGIN);
          } else {
            setRootRoute(Routes.ROOT.SETUP);
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
    if (rootRoute === '') {
      checkExisting();
    }
  }, [rootRoute, setRootRoute]);

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
    (rootRoute !== '' && (
      <NavigationContainer theme={navigationTheme} ref={navigation}>
        <RootStack.Navigator initialRouteName={rootRoute}>
          <RootStack.Group
            screenOptions={{
              headerShown: false,
              presentation: 'modal',
              headerBackTitleVisible: false,
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
          <RootStack.Group screenOptions={{headerBackTitleVisible: false}}>
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
            <RootStack.Screen
              name={Routes.ROOT.ImportWallet}
              options={{title: t('import.title')}}
              component={ImportWalletPage}
            />
          </RootStack.Group>
          <RootStack.Group screenOptions={{headerBackTitleVisible: false}}>
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
              name={Routes.TABS.QRResult}
              options={{title: t('tools.QRResultTitle')}}
              component={QRResultPage}
            />
            <RootStack.Screen
              name={Routes.TABS.QRGenerator}
              options={{title: t('tools.QRGeneratorTitle')}}
              component={QRCodeGenerator}
            />
            <RootStack.Screen
              name={Routes.TABS.ImportABI}
              options={{title: t('tools.importByQR')}}
              component={QRCodeABIImportScreen}
            />
            <RootStack.Screen
              name={Routes.TABS.URGenerator}
              options={{title: t('tools.urTitle')}}
              component={URCodeGenerator}
            />
            <RootStack.Screen
              name={Routes.TABS.ExportWallet}
              options={{title: t('export.title')}}
              component={ExportPage}
            />
            <RootStack.Screen
              name={Routes.TABS.ExportWalletByQRCode}
              options={{title: t('export.byQRCode')}}
              component={ExportByQRCode}
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
              name={Routes.TABS.EVMWallet}
              options={{title: t('EVM.title')}}
              component={EVMWalletPage}
            />
            <RootStack.Screen
              name={Routes.TABS.EVMDerivation}
              options={{title: t('EVM.changePath')}}
              component={DerivationPathPage}
            />
            <RootStack.Screen
              name={Routes.TABS.BTCWallet}
              options={{title: t('BTC.title')}}
              component={BTCWalletPage}
            />
            <RootStack.Screen
              name={Routes.TABS.BTCSignRecord}
              options={{title: t('find.btcRecordTitle')}}
              component={BTCSignRecordScreen}
            />
            <RootStack.Screen
              name={Routes.TABS.EVMSignRecord}
              options={{title: t('find.evmRecordTitle')}}
              component={EVMSignRecordScreen}
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
    <RootRouteProvider>
      <AirgapProvider>
        <App />
      </AirgapProvider>
    </RootRouteProvider>
  );
};

export default withProviders;
