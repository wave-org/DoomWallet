import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  // useWindowDimensions,
  Image,
  StyleSheet,
  StatusBar,
  Appearance,
} from 'react-native';

import HomePage from './pages/Home';
import FindPage from './pages/Find';
import AccountPage from './pages/Account';
import QRScannerPage from './pages/QRScanner';
import SignPage from './pages/Sign';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Routes from './routes/Routes';
import {checkWalletExists, getWallet} from './wallet';
import LoginPage from './pages/Login';
import SetupPage from './pages/Setup';
import SetPasswordPage from './pages/Setup/SetPassword';
import SecuritySettingPage from './pages/Setup/SecuritySetting';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();

const FindStack = createNativeStackNavigator();
const FindStackScreen = () => (
  <FindStack.Navigator screenOptions={{headerShown: false}}>
    <FindStack.Group>
      <FindStack.Screen name={Routes.TABS.FIND} component={FindPage} />
      <FindStack.Screen name={Routes.TABS.SIGN} component={SignPage} />
    </FindStack.Group>
    <FindStack.Group screenOptions={{presentation: 'modal'}}>
      <FindStack.Screen
        name={Routes.TABS.QR_SCANNER}
        component={QRScannerPage}
      />
    </FindStack.Group>
  </FindStack.Navigator>
);

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
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Network"
        component={HomePage}
        options={{
          tabBarIcon: networkTabIcon,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={FindStackScreen}
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

  useEffect(() => {
    async function checkExisting() {
      let wallet = getWallet();
      if (wallet !== null) {
        setRoute(Routes.ROOT.TABS);
      } else {
        try {
          const walletHeader = await checkWalletExists();
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

  return (
    (route !== '' && (
      <NavigationContainer>
        <StatusBar
          animated={true}
          // backgroundColor="#61dafb"
          barStyle={
            Appearance.getColorScheme() === 'dark'
              ? 'light-content'
              : 'dark-content'
          }
        />
        <RootStack.Navigator initialRouteName={route}>
          <RootStack.Group
            screenOptions={{
              headerShown: false,
              presentation: 'modal',
              // cardStyle: {backgroundColor: importedColors.transparent},
              // animationEnabled: false,
            }}>
            <RootStack.Screen
              name={Routes.ROOT.LOGIN}
              component={LoginPage}
              options={{headerShown: false}}
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
            />
            <RootStack.Screen
              name={Routes.ROOT.SECURITY_SETTING}
              component={SecuritySettingPage}
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
