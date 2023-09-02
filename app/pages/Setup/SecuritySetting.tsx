import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Switch,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  PasswordType,
  getWalletSecuritySetting,
  setupWallet,
} from '../../wallet';
// import Routes from '../../routes/Routes';
import * as Keychain from 'react-native-keychain';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useTheme} from '../../util/theme';
import {useTranslation, Trans} from 'react-i18next';

const SecuritySettingPage = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const setupComplete =
    route.params !== undefined ? route.params.setupComplete : undefined;
  const {
    mnemonic,
    password,
    usingUnlockPassword,
  }: {mnemonic: string; password: string; usingUnlockPassword?: boolean} =
    setupComplete !== undefined ? route.params : getWalletSecuritySetting();
  const {t} = useTranslation();

  const defaultSetting =
    setupComplete !== undefined
      ? {
          useBiometrics: false,
          usePassword: true,
          useSimplePassword: false,
          useType1: false,
          useType2: false,
        }
      : {
          useBiometrics: getWalletSecuritySetting().useBiometrics,
          usePassword:
            getWalletSecuritySetting().passwordType === 'FullPassword',
          useSimplePassword:
            getWalletSecuritySetting().passwordType !== 'FullPassword' &&
            getWalletSecuritySetting().passwordType !== 'NoPassword',
          useType1:
            getWalletSecuritySetting().passwordType === 'SimplePassword',
          useType2: getWalletSecuritySetting().passwordType === 'PinPassword',
        };

  const [supportBiometrics, setSupportBiometrics] = React.useState<
    boolean | undefined
  >(undefined);
  const [usebiometrics, setUsebiometrics] = React.useState<boolean>(
    defaultSetting.useBiometrics,
  );
  const toggleBiometricsSwitch = () =>
    setUsebiometrics(previousState => !previousState);
  useEffect(() => {
    async function checkBiometrics() {
      const supportedType = await Keychain.getSupportedBiometryType();
      if (supportedType === null) {
        setSupportBiometrics(false);
      } else {
        setSupportBiometrics(true);
      }
    }
    checkBiometrics();
  }, [setSupportBiometrics]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const switchBiometrics = async () => {
    // check ios permission
    if (Platform.OS === 'ios') {
      const permission = await check(PERMISSIONS.IOS.FACE_ID);
      // console.log('permission', permission);
      if (permission === RESULTS.BLOCKED) {
        // toast ask for permission
        Toast.show({
          type: 'error',
          text1: t('securitySetting.faceIDPermissionBlocked'),
          position: 'bottom',
          bottomOffset: 100,
          visibilityTime: 2500,
        });
      } else if (permission === RESULTS.DENIED) {
        // request for permission
        request(PERMISSIONS.IOS.FACE_ID).then(_permission => {
          if (_permission === RESULTS.GRANTED) {
            toggleBiometricsSwitch();
          } else {
            Toast.show({
              type: 'error',
              text1: t('securitySetting.faceIDPermissionBlocked'),
              position: 'bottom',
              bottomOffset: 100,
              visibilityTime: 2500,
            });
          }
        });
      } else if (permission === RESULTS.GRANTED) {
        toggleBiometricsSwitch();
      }
    } else {
      toggleBiometricsSwitch();
    }
  };

  const [usePassword, setUsePassword] = React.useState<boolean>(
    defaultSetting.usePassword,
  );
  const togglePasswordSwitch = () =>
    setUsePassword(previousState => !previousState);
  const switchUsePassword = () => {
    if (!usePassword && useSimplePassword) {
      toggleSimplePasswordSwitch();
    }
    togglePasswordSwitch();
  };

  const [useSimplePassword, setUseSimplePassword] = React.useState<boolean>(
    defaultSetting.useSimplePassword,
  );
  const [editingPassword, setEditingPassword] = React.useState<boolean>(false);
  const toggleSimplePasswordSwitch = () =>
    setUseSimplePassword(previousState => !previousState);
  const [simplePassword, setSimplePassword] = React.useState<string>('');
  const switchUseSimplePassword = () => {
    if (usePassword && !useSimplePassword) {
      togglePasswordSwitch();
    }
    toggleSimplePasswordSwitch();
  };

  const buttonIsDisable = () => {
    if (useSimplePassword && simplePassword.length < 4) {
      return true;
    } else if (!usePassword && !useSimplePassword && !usebiometrics) {
      return true;
    }
    return false;
  };

  const [useType1, setUseType1] = React.useState<boolean>(
    defaultSetting.useType1,
  );
  const toggleType1Switch = () => {
    if (!useType1) {
      setUseType2(false);
      setUseType3(false);
    }
    setSimplePassword('');
    setUseType1(previousState => !previousState);
  };

  const [useType2, setUseType2] = React.useState<boolean>(
    defaultSetting.useType2,
  );
  const toggleType2Switch = () => {
    if (!useType2) {
      setUseType1(false);
      setUseType3(false);
    }
    setSimplePassword('');
    setUseType2(previousState => !previousState);
  };

  const [useType3, setUseType3] = React.useState<boolean>(false);
  // const toggleType3Switch = () => {
  //   if (!useType3) {
  //     setUseType2(false);
  //     setUseType1(false);
  //   }
  //   setSimplePassword('');
  //   setUseType3(previousState => !previousState);
  // };

  // const useGesturePassword = () => {
  //   Toast.show({
  //     type: 'error',
  //     text1: 'TODO set Gesture Password',
  //   });
  // };

  const complete = async () => {
    // check if simple password is valid
    if (useSimplePassword && simplePassword.length < 4) {
      Toast.show({
        type: 'error',
        text1: t('securitySetting.simplePasswordLengthError'),
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2500,
      });
      return;
    }
    if (!usePassword && !useSimplePassword && !usebiometrics) {
      Toast.show({
        type: 'error',
        text1: t('securitySetting.noSecurityOptionError'),
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2500,
      });
      return;
    }
    let passwordType: PasswordType = 'NoPassword';
    if (usePassword) {
      passwordType = 'FullPassword';
    } else if (useSimplePassword) {
      passwordType = 'SimplePassword';
      if (useType2) {
        passwordType = 'PinPassword';
      } else if (useType3) {
        passwordType = 'GesturePassword';
      }
    }
    const walletInfo = {
      password,
      mnemonic,
      passwordType,
      simplePassword: useSimplePassword ? simplePassword : undefined,
      useBiometrics: usebiometrics,
      usingUnlockPassword: usingUnlockPassword === true,
    };
    if (setupComplete !== undefined) {
      navigation.popToTop();
      setupComplete(walletInfo);
    } else {
      try {
        setLoading(true);
        await setupWallet(walletInfo);
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: t('securitySetting.savedToast'),
          position: 'bottom',
          bottomOffset: 100,
          visibilityTime: 2500,
        });
      } catch (error) {
        setLoading(false);
        const message = (error as Error).message;
        Toast.show({
          type: 'error',
          text1: t('securitySetting.saveFailedToast'),
          text2: message,
          position: 'bottom',
          bottomOffset: 100,
          visibilityTime: 2500,
        });
      }
    }
  };
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback
          style={styles.container}
          onPress={Keyboard.dismiss}
          accessible={false}>
          <ScrollView
            style={styles.container}
            // contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.textContainer}>
              <Text style={[styles.normalText, {color: theme.colors.text}]}>
                <Trans>securitySetting.biometricsCaption</Trans>
              </Text>
              {supportBiometrics === false ? (
                <Text style={[styles.normalText, {color: theme.colors.text}]}>
                  <Trans>securitySetting.withoutBiometrics</Trans>
                </Text>
              ) : (
                <View style={styles.subArea}>
                  <View style={styles.line}>
                    <Text
                      style={[styles.lineLabel, {color: theme.colors.title}]}>
                      <Trans>securitySetting.biometricsLabel</Trans>
                    </Text>
                    <Switch
                      trackColor={{
                        false: theme.colors.surface,
                        true: theme.colors.primary,
                      }}
                      thumbColor={
                        usebiometrics
                          ? theme.colors.secondary
                          : theme.colors.text
                      }
                      ios_backgroundColor={theme.colors.border}
                      onValueChange={switchBiometrics}
                      value={usebiometrics}
                    />
                  </View>
                </View>
              )}
              <View style={styles.subArea}>
                <View style={styles.line}>
                  <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                    {usingUnlockPassword ? (
                      <Trans>securitySetting.unlockPasswordLabel</Trans>
                    ) : (
                      <Trans>securitySetting.passwordLabel</Trans>
                    )}
                  </Text>
                  <Text style={[styles.lineText, {color: theme.colors.text}]}>
                    {password}
                  </Text>
                </View>
                <View style={styles.line}>
                  <Text style={[styles.lineText, {color: theme.colors.text}]}>
                    <Trans>securitySetting.passwordOption</Trans>
                  </Text>
                  <Switch
                    trackColor={{
                      false: theme.colors.surface,
                      true: theme.colors.primary,
                    }}
                    thumbColor={
                      usePassword ? theme.colors.secondary : theme.colors.text
                    }
                    ios_backgroundColor={theme.colors.border}
                    onValueChange={switchUsePassword}
                    value={usePassword}
                  />
                </View>
              </View>

              <View style={styles.line}>
                <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                  <Trans>securitySetting.simplePasswordLabel</Trans>
                </Text>
                <Text style={[styles.lineText, {color: theme.colors.text}]}>
                  {simplePassword}
                </Text>
              </View>
              <Text style={[styles.normalText, {color: theme.colors.text}]}>
                <Trans>securitySetting.simplePasswordCaption</Trans>
              </Text>
              <View style={styles.line}>
                <Text style={[styles.lineText, {color: theme.colors.text}]}>
                  <Trans>securitySetting.simplePasswordOption</Trans>
                </Text>
                <Switch
                  trackColor={{
                    false: theme.colors.surface,
                    true: theme.colors.primary,
                  }}
                  thumbColor={
                    useSimplePassword
                      ? theme.colors.secondary
                      : theme.colors.text
                  }
                  ios_backgroundColor={theme.colors.border}
                  onValueChange={switchUseSimplePassword}
                  value={useSimplePassword}
                />
              </View>
              {useSimplePassword ? (
                <View style={styles.subArea}>
                  <View style={styles.subArea}>
                    <Text
                      style={[styles.normalText, {color: theme.colors.text}]}>
                      <Trans>securitySetting.twoOptionsNow</Trans>
                    </Text>
                    <View style={styles.line}>
                      <Text
                        style={[styles.lineText, {color: theme.colors.text}]}>
                        <Trans>securitySetting.simplePasswordOption1</Trans>
                      </Text>
                      <Switch
                        trackColor={{
                          false: theme.colors.surface,
                          true: theme.colors.primary,
                        }}
                        thumbColor={
                          useType1 ? theme.colors.secondary : theme.colors.text
                        }
                        ios_backgroundColor={theme.colors.border}
                        onValueChange={toggleType1Switch}
                        value={useType1}
                      />
                    </View>
                    {useType1 ? (
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
                        placeholder={t(
                          'securitySetting.simplePasswordPlaceholder',
                        )}
                        placeholderTextColor={theme.colors.placeholder}
                        onChangeText={newText => setSimplePassword(newText)}
                        defaultValue={simplePassword}
                        maxLength={16}
                        clearButtonMode="while-editing"
                        autoComplete="off"
                        autoCorrect={false}
                        autoCapitalize="none"
                        onFocus={() => {
                          setEditingPassword(true);
                        }}
                        onBlur={() => {
                          setEditingPassword(false);
                        }}
                        inputMode="text"
                      />
                    ) : null}
                    <View style={styles.line}>
                      <Text
                        style={[styles.lineText, {color: theme.colors.text}]}>
                        <Trans>securitySetting.simplePasswordOption2</Trans>
                      </Text>
                      <Switch
                        trackColor={{
                          false: theme.colors.surface,
                          true: theme.colors.primary,
                        }}
                        thumbColor={
                          useType2 ? theme.colors.secondary : theme.colors.text
                        }
                        ios_backgroundColor={theme.colors.border}
                        onValueChange={toggleType2Switch}
                        value={useType2}
                      />
                    </View>
                    {useType2 ? (
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
                        placeholder={t(
                          'securitySetting.pinPasswordPlaceholder',
                        )}
                        placeholderTextColor={theme.colors.placeholder}
                        onChangeText={newText => setSimplePassword(newText)}
                        defaultValue={simplePassword}
                        maxLength={10}
                        clearButtonMode="while-editing"
                        autoComplete="off"
                        autoCorrect={false}
                        autoCapitalize="none"
                        onFocus={() => {
                          setEditingPassword(true);
                        }}
                        onBlur={() => {
                          setEditingPassword(false);
                        }}
                        inputMode="numeric"
                        // keyboardType="numeric"
                      />
                    ) : null}
                    {/* <View style={styles.line}>
                    <Text style={styles.lineText}>
                      3. Use Gesture Password::
                    </Text>
                    <Switch
                      trackColor={{false: '#767577', true: '#81b0ff'}}
                      thumbColor={useType3 ? '#f5dd4b' : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleType3Switch}
                      value={useType3}
                    />
                  </View>
                  {useType3 ? (
                    <Button
                      title="TODO set Gesture Password"
                      onPress={useGesturePassword}
                    />
                  ) : null} */}
                  </View>
                </View>
              ) : null}
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              disabled={buttonIsDisable()}
              style={[
                styles.button,
                {
                  opacity: buttonIsDisable() ? 0.5 : 1,
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={complete}>
              <Text style={[styles.buttonText, {color: theme.colors.inverse}]}>
                {setupComplete !== undefined
                  ? t('securitySetting.complete')
                  : t('securitySetting.save')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
      {loading ? (
        <View style={styles.indicatorView}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    width: '90%',
  },
  subArea: {
    width: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  textContainer: {
    flex: 2,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  passwordStrengthContainer: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  normalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  passwordStrengthText: {
    fontSize: 16,
    marginTop: 24,
    textAlign: 'left',
    width: '100%',
  },
  highlightText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  textInput: {
    height: 50,
    width: '80%',
    alignSelf: 'center',
    borderWidth: 1.5,
    padding: 10,
    fontSize: 18,
    borderRadius: 4,
    marginBottom: 5,
  },
  buttonContainer: {
    width: '100%',
    padding: 30,
  },
  button: {
    height: 44,
    width: '80%',
    flexDirection: 'column',
    alignSelf: 'center',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  buttonText: {
    fontSize: 17,
  },
  line: {
    height: 44,
    width: '100%',
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  lineText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
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
});

export default SecuritySettingPage;
