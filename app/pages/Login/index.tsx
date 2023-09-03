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
  Platform,
} from 'react-native';
import * as wallet from '../../wallet';
import {useRootRoute} from '../../wallet/useRootRoute';
import Routes from '../../routes/Routes';
import {useTheme} from '../../util/theme';
import {Trans, useTranslation} from 'react-i18next';
// @ts-ignore
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginPage = ({route, navigation}: {navigation: any; route: any}) => {
  const {setRootRoute} = useRootRoute();
  const walletHeader = React.useMemo(() => wallet.getWalletHeader(), []);
  const [pageDisabled, setPageDisabled] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');
  const [simplePassword, setSimplePassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [editingPassword, setEditingPassword] = React.useState<boolean>(false);
  const [errorText, setErrorText] = React.useState<string>('');
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
  const {t} = useTranslation();

  React.useEffect(() => {
    if (walletHeader.triedTimes > 0) {
      setErrorText(
        t('login.remainingTryTimes', {
          times: wallet.maxTryTimes - walletHeader.triedTimes,
        }),
      );
    }
  }, [walletHeader, t]);

  const login = React.useCallback(() => {
    Keyboard.dismiss();
    setLoading(true);

    async function loadWallet() {
      // console.log('walletHeader', new Date());
      setErrorText('');
      let result: wallet.PasswordCheckResult = wallet.PasswordCheckResult.Wrong;
      try {
        if (walletHeader.passwordType === 'FullPassword') {
          result = await wallet.loadWallet(
            t('securitySetting.unlockBiometricPrompt'),
            password,
            undefined,
          );
        } else if (walletHeader.passwordType === 'NoPassword') {
          result = await wallet.loadWallet(
            t('securitySetting.unlockBiometricPrompt'),
            undefined,
            undefined,
          );
        } else {
          result = await wallet.loadWallet(
            t('securitySetting.unlockBiometricPrompt'),
            undefined,
            simplePassword,
          );
        }
        setLoading(false);
        if (result === wallet.PasswordCheckResult.Correct) {
          // about 4000ms...
          if (onLogin !== undefined) {
            onLogin();
            navigation.goBack();
          } else {
            setTimeout(() => {
              navigation.replace(Routes.ROOT.TABS);
            }, 100);
          }
        } else if (result === wallet.PasswordCheckResult.OverMaxTryTimes) {
          // over max try times
          setErrorText(t('login.overMaxTryTimes'));
          setPageDisabled(true);
          setTimeout(() => {
            setRootRoute('');
          }, 3500);
        } else {
          setErrorText(
            t('login.passwordIsWrong') +
              '\n' +
              t('login.remainingTryTimes', {
                times: wallet.maxTryTimes - walletHeader.triedTimes,
              }),
          );
        }
      } catch (error) {
        setLoading(false);
        let message = (error as Error).message;
        setErrorText(message);
      }
    }

    setImmediate(() => {
      loadWallet();
    });
  }, [
    navigation,
    onLogin,
    password,
    simplePassword,
    walletHeader,
    t,
    setRootRoute,
  ]);

  const checked = React.useRef(false);
  React.useEffect(() => {
    // when only check biometrics, auto login
    if (!checked.current) {
      if (
        walletHeader.passwordType === 'NoPassword' &&
        walletHeader.useBiometrics === true
      ) {
        setTimeout(() => {
          login();
        }, 300);
      }
      checked.current = true;
    }
  }, [walletHeader, login]);

  const reset = () => {
    Keyboard.dismiss();
    Alert.alert(t('login.alertTitle'), t('login.alertMessage'), [
      {
        text: t('login.cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('login.resetConfirm'),
        style: 'destructive',
        onPress: () => {
          wallet.resetWallet();
          setRootRoute('');
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
            <Trans>login.passwordLabel</Trans>
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
            placeholder={t('login.passwordPlaceholder')}
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
            <Trans>login.simplePasswordLabel</Trans>
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
            placeholder={t('login.simplePasswordPlaceholder')}
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
            <Trans>login.pinPasswordLabel</Trans>
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
            placeholder={t('login.pinPasswordPlaceholder')}
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
                  <Trans>login.welcome</Trans>
                </Text>
              </View>

              {inputView()}
              <View style={{width: '100%', height: 70}}>
                {errorText.length > 0 ? (
                  <Text
                    style={{
                      color: theme.colors.error,
                      fontSize: 14,
                      width: '100%',
                      textAlign: 'center',
                    }}>
                    {errorText}
                  </Text>
                ) : null}
              </View>

              <View style={styles.login}>
                {walletHeader.useBiometrics && Platform.OS === 'ios' ? (
                  <Image
                    source={require('../../images/face-id.png')}
                    style={styles.faceIdIcon}
                    tintColor={theme.colors.placeholder}
                  />
                ) : null}
                {walletHeader.useBiometrics && Platform.OS === 'android' ? (
                  <MCIcon
                    style={styles.faceIdIcon}
                    name="fingerprint"
                    color={theme.colors.placeholder}
                    size={100}
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
                    <Trans>login.unlock</Trans>
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
                  <Trans>login.reset</Trans>
                </Text>
              </TouchableOpacity>
              <Text style={{color: theme.colors.placeholder}}>
                <Trans>login.resetWarning</Trans>
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
        {loading ? (
          <View style={styles.indicatorView}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : null}
        {pageDisabled ? <View style={styles.indicatorView} /> : null}
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
