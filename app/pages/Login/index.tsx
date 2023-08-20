import React from 'react';

import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
  Image,
  BackHandler,
} from 'react-native';
import * as wallet from '../../wallet';
import Routes from '../../routes/Routes';
import Toast from 'react-native-toast-message';
import {useTheme} from '../../util/theme';

const LoginPage = ({route, navigation}: {navigation: any; route: any}) => {
  const walletHeader = wallet.getWalletHeader();
  const [password, setPassword] = React.useState<string>('');
  const [simplePassword, setSimplePassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [editingPassword, setEditingPassword] = React.useState<boolean>(false);
  const onLogin = route.params?.onLogin;
  const loginButtonIsDisable = () => {
    if (walletHeader.passwordType === 'FullPassword') {
      return password.length === 0;
    } else if (walletHeader.passwordType === 'SimplePassword') {
      return simplePassword.length === 0;
    } else if (walletHeader.passwordType === 'PinPassword') {
      return simplePassword.length === 0;
    } else {
      return false;
    }
  };

  const login = () => {
    Keyboard.dismiss();
    setLoading(true);

    async function loadWallet() {
      // console.log('walletHeader', new Date());
      let success = false;
      try {
        if (walletHeader.passwordType === 'FullPassword') {
          success = await wallet.loadWallet(password, undefined);
        } else if (walletHeader.passwordType === 'NoPassword') {
          success = await wallet.loadWallet(undefined, undefined);
        } else {
          success = await wallet.loadWallet(undefined, simplePassword);
        }
        setLoading(false);
        if (success) {
          // about 4000ms...
          if (onLogin !== undefined) {
            onLogin();
            navigation.goBack();
          } else {
            setTimeout(() => {
              navigation.replace(Routes.ROOT.TABS);
            }, 300);
          }
        } else {
          // TODO max try times
          Toast.show({
            type: 'error',
            text1: 'Password is wrong',
            position: 'bottom',
            bottomOffset: 100,
            visibilityTime: 2500,
          });
        }
      } catch (error) {
        setLoading(false);
        let message = (error as Error).message;
        Toast.show({
          type: 'error',
          text1: message,
          position: 'bottom',
          bottomOffset: 100,
          visibilityTime: 2500,
        });
      }
    }

    setImmediate(() => {
      loadWallet();
    });
  };
  const reset = () => {
    Keyboard.dismiss();
    Alert.alert('Alert Title', 'Are you sure to reset wallet', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Reset Wallet',
        onPress: () => {
          wallet.resetWallet();
          navigation.replace(Routes.ROOT.SETUP);
        },
      },
    ]);
  };

  // disable back button on android
  React.useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const theme = useTheme();

  const inputView = () => {
    if (walletHeader.passwordType === 'FullPassword') {
      return (
        <View style={styles.inputView}>
          <Text style={[styles.passwordText, {color: theme.colors.title}]}>
            Password:
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: editingPassword
                  ? theme.colors.primary
                  : theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            placeholder="Type your password"
            placeholderTextColor={theme.colors.placeholder}
            onChangeText={newText => setPassword(newText)}
            defaultValue={password}
            autoComplete="off"
            autoCorrect={false}
            returnKeyType="done"
            maxLength={32}
            // inputMode="search"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            onFocus={() => {
              setEditingPassword(true);
            }}
            onBlur={() => {
              setEditingPassword(false);
            }}
            inputMode="text"
          />
        </View>
      );
    } else if (walletHeader.passwordType === 'SimplePassword') {
      return (
        <View style={styles.inputView}>
          <Text style={[styles.passwordText, {color: theme.colors.title}]}>
            Simple Password:
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: editingPassword
                  ? theme.colors.primary
                  : theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            placeholder="Type simple password"
            placeholderTextColor={theme.colors.placeholder}
            onChangeText={newText => setSimplePassword(newText)}
            defaultValue={simplePassword}
            autoComplete="off"
            maxLength={16}
            autoCorrect={false}
            returnKeyType="done"
            // inputMode="search"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            onFocus={() => {
              setEditingPassword(true);
            }}
            onBlur={() => {
              setEditingPassword(false);
            }}
            inputMode="text"
          />
        </View>
      );
    } else if (walletHeader.passwordType === 'PinPassword') {
      return (
        <View style={styles.inputView}>
          <Text style={[styles.passwordText, {color: theme.colors.title}]}>
            PIN Password:
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: editingPassword
                  ? theme.colors.primary
                  : theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            placeholder="Type your PIN"
            placeholderTextColor={theme.colors.placeholder}
            onChangeText={newText => setSimplePassword(newText)}
            defaultValue={simplePassword}
            autoComplete="off"
            maxLength={10}
            autoCorrect={false}
            returnKeyType="done"
            // inputMode="search"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            onFocus={() => {
              setEditingPassword(true);
            }}
            onBlur={() => {
              setEditingPassword(false);
            }}
            inputMode="numeric"
          />
        </View>
      );
    } else {
      return null;
    }
  };

  if (walletHeader.passwordType === 'GesturePassword') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text>TODO</Text>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <View style={styles.fullScreen}>
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}
            accessible={false}>
            <View style={styles.container}>
              <View style={styles.welcome}>
                <Text style={[styles.welcomeText, {color: theme.colors.title}]}>
                  Welcome back !
                </Text>
              </View>

              {inputView()}
              <View style={styles.login}>
                {walletHeader.useBiometrics ? (
                  <Image
                    source={require('../../images/face-id.png')}
                    style={styles.faceIdIcon}
                    tintColor={theme.colors.placeholder}
                  />
                ) : null}
                <TouchableOpacity
                  activeOpacity={0.6}
                  disabled={loginButtonIsDisable()}
                  style={[
                    styles.loginButton,
                    {
                      opacity: loginButtonIsDisable() ? 0.5 : 1,
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  onPress={login}>
                  <Text
                    style={[
                      styles.loginButtonText,
                      {color: theme.colors.inverse},
                    ]}>
                    UNLOCK
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  styles.resetButton,
                  {backgroundColor: theme.colors.error},
                ]}
                onLongPress={reset}>
                <Text
                  style={[
                    styles.resetButtonText,
                    {color: theme.colors.inverse},
                  ]}>
                  Reset wallet!
                </Text>
              </TouchableOpacity>
              <Text style={{color: theme.colors.placeholder}}>
                You can long press this button to ERASE your wallet and setup a
                new one
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
        {loading ? (
          <View style={styles.indicatorView}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : null}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  fullScreen: {
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  inputView: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textInput: {
    height: 50,
    width: '80%',
    borderWidth: 1.5,
    padding: 10,
    fontSize: 18,
    borderRadius: 4,
  },
  resetButton: {
    marginBottom: 10,
    height: 36,
    width: 160,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  resetButtonText: {
    fontSize: 16,
  },
  indicatorView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  passwordText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '80%',
    padding: 10,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcome: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  faceIdIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loginButton: {
    height: 44,
    width: '88%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginPage;
