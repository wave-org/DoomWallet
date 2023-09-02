import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Routes from '../../routes/Routes';
import * as wallet from '../../wallet';
import Toast from 'react-native-toast-message';
import MnemonicView from '../../components/MnemonicView';
import {useTheme} from '../../util/theme';
import {useTranslation, Trans} from 'react-i18next';

const SetupPage = ({navigation}: {navigation: any}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>('');
  const [editingText, setEditingText] = React.useState<boolean>(false);
  const [mnemonic, setMnemonic] = React.useState<string>('');
  const [success, setSuccess] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');
  const [useBiometrics, setUseBiometrics] = React.useState<boolean>(false);
  const [usingUnlockPassword, setUsingUnlockPassword] =
    React.useState<boolean>(false);
  const [passwordType, setPasswordType] =
    React.useState<wallet.PasswordType>('FullPassword');
  const [simplePassword, setSimplePassword] = React.useState<string>('');
  const {t} = useTranslation();
  const {height} = Dimensions.get('window');

  const generateRandomMnemonic = () => {
    setText('');
    const _mnemonic = wallet.generateRandomMnemonic();
    setMnemonic(_mnemonic);
  };

  const hashButtonDisable = () => {
    return text.length < 16;
  };

  const generateMnemonicByText = () => {
    const _mnemonic = wallet.generateMnemonicByHashingText(text);
    setMnemonic(_mnemonic);
  };

  const goToSetPassword = () => {
    navigation.navigate(Routes.ROOT.SETPASSWORD, {mnemonic, setupComplete});
  };

  const goToImportWallet = () => {
    navigation.navigate(Routes.ROOT.ImportWallet, {setupComplete});
  };

  const reset = () => {
    setText('');
    setMnemonic('');
    setSuccess(false);
  };

  const setupComplete = (keyInfo: {
    mnemonic: string;
    password: string;
    passwordType: wallet.PasswordType;
    simplePassword: string | undefined;
    useBiometrics: boolean;
    usingUnlockPassword?: boolean;
  }) => {
    setSuccess(true);
    setMnemonic(keyInfo.mnemonic);
    setPassword(keyInfo.password);
    setPasswordType(keyInfo.passwordType);
    setUseBiometrics(keyInfo.useBiometrics);
    if (keyInfo.simplePassword !== undefined) {
      setSimplePassword(keyInfo.simplePassword);
    }
    setUsingUnlockPassword(keyInfo.usingUnlockPassword === true);
  };

  const complete = () => {
    setLoading(true);
    // save to storage
    async function loadWallet() {
      try {
        wallet.setupWallet({
          mnemonic,
          password,
          passwordType,
          simplePassword,
          useBiometrics,
          usingUnlockPassword,
        });
        setTimeout(() => {
          setLoading(false);
          navigation.replace(Routes.ROOT.TABS);
        }, 50);
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

    setTimeout(() => {
      loadWallet();
    }, 50);
  };
  const theme = useTheme();

  const successView = () => {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback
          style={styles.container}
          onPress={Keyboard.dismiss}
          accessible={false}>
          <ScrollView style={styles.container}>
            <View style={styles.textContainer}>
              <Text style={[styles.highlightText, {color: theme.colors.title}]}>
                <Trans>setup.mnemonic</Trans>
              </Text>
              <MnemonicView mnemonic={mnemonic.split(' ')} theme={theme} />
              <View style={styles.line}>
                <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                  <Trans>setup.password</Trans>
                </Text>
                <Text style={[styles.lineText, {color: theme.colors.text}]}>
                  {password}
                </Text>
              </View>
              <View style={styles.line}>
                <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                  <Trans>setup.biometrics</Trans>
                </Text>
                <Text style={[styles.lineText, {color: theme.colors.text}]}>
                  {useBiometrics ? t('setup.use') : t('setup.notUse')}
                </Text>
              </View>
              {simplePassword !== '' ? (
                <View style={styles.line}>
                  <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                    <Trans>setup.passwordType</Trans>
                  </Text>
                  <Text style={[styles.lineText, {color: theme.colors.text}]}>
                    {passwordType}
                  </Text>
                </View>
              ) : null}
              {simplePassword !== '' ? (
                <View style={styles.line}>
                  <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                    <Trans>setup.simplePassword</Trans>
                  </Text>
                  <Text style={[styles.lineText, {color: theme.colors.text}]}>
                    {simplePassword}
                  </Text>
                </View>
              ) : null}

              <Text style={[styles.normalText, {color: theme.colors.text}]}>
                <Trans>setup.differentPlaces</Trans>
              </Text>
              <Text style={[styles.normalText, {color: theme.colors.text}]}>
                {usingUnlockPassword ? (
                  <Trans>setup.forgetPassword</Trans>
                ) : (
                  <Trans>setup.neverRecover</Trans>
                )}
              </Text>
              {simplePassword !== '' ? (
                <Text style={[styles.normalText, {color: theme.colors.text}]}>
                  <Trans>setup.rememberSimplePassword</Trans>
                </Text>
              ) : null}
              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={complete}>
                <Text
                  style={[styles.buttonText, {color: theme.colors.inverse}]}>
                  <Trans>setup.startButton</Trans>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  styles.resetButton,
                  {
                    backgroundColor: theme.colors.error,
                  },
                ]}
                onPress={reset}>
                <Text
                  style={[
                    styles.resetButtonText,
                    {color: theme.colors.inverse},
                  ]}>
                  <Trans>setup.resetButton</Trans>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        {loading ? (
          <View style={styles.indicatorView}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : null}
      </SafeAreaView>
    );
  };

  if (success) {
    return successView();
  }
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={Keyboard.dismiss}
        accessible={false}>
        <ScrollView style={styles.container}>
          <View
            style={{
              minHeight: height - 200,
              width: '100%',
            }}>
            <View style={styles.textContainer}>
              <Text style={[styles.normalText, {color: theme.colors.text}]}>
                <Trans>setup.caption</Trans>
              </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={generateRandomMnemonic}>
                <Text
                  style={[styles.buttonText, {color: theme.colors.inverse}]}>
                  <Trans>setup.randomButton</Trans>
                </Text>
              </TouchableOpacity>

              <Text style={[styles.textInputLabel, {color: theme.colors.text}]}>
                <Trans>setup.hashCaption</Trans>
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: editingText
                      ? theme.colors.primary
                      : theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                placeholder={t('setup.hashPlaceholder')}
                placeholderTextColor={theme.colors.placeholder}
                onChangeText={newText => setText(newText)}
                defaultValue={text}
                autoComplete="off"
                multiline={true}
                numberOfLines={2}
                autoCorrect={false}
                returnKeyType="done"
                clearButtonMode="while-editing"
                autoCapitalize="none"
                onFocus={() => {
                  setEditingText(true);
                }}
                onBlur={() => {
                  setEditingText(false);
                }}
                inputMode="text"
              />
              <TouchableOpacity
                activeOpacity={0.6}
                disabled={hashButtonDisable()}
                style={[
                  styles.button,
                  {
                    opacity: hashButtonDisable() ? 0.5 : 1,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={generateMnemonicByText}>
                <Text
                  style={[styles.buttonText, {color: theme.colors.inverse}]}>
                  <Trans>setup.hashButton</Trans>
                </Text>
              </TouchableOpacity>
            </View>

            {mnemonic !== '' ? (
              <View style={styles.mnemonicContainer}>
                {/* <Text>{mnemonic}</Text> */}
                <MnemonicView mnemonic={mnemonic.split(' ')} theme={theme} />

                <Text
                  style={[
                    styles.normalText,
                    {
                      paddingLeft: 20,
                      color: theme.colors.title,
                      textAlign: 'center',
                    },
                  ]}>
                  <Trans>setup.passwordCaption</Trans>
                </Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={[
                    styles.button,
                    {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  onPress={goToSetPassword}>
                  <Text
                    style={[styles.buttonText, {color: theme.colors.inverse}]}>
                    <Trans>setup.passwordButton</Trans>
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.mnemonicContainer} />
            )}
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                height: 32,
                paddingHorizontal: 44,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                backgroundColor: theme.colors.secondary,
              }}
              onPress={goToImportWallet}>
              <Text style={{color: theme.colors.inverse, fontSize: 14}}>
                <Trans>setup.import</Trans>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  textContainer: {
    flex: 2,
    width: '100%',
    flexDirection: 'column',
    // justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  mnemonicContainer: {
    flex: 1,
    width: '100%',
    paddingBottom: 20,
    // padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  normalText: {
    fontSize: 16,
    marginBottom: 10,
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
  textInputLabel: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'left',
    width: '100%',
  },
  button: {
    height: 44,
    width: '88%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  buttonText: {
    fontSize: 17,
  },
  textInput: {
    height: 60,
    width: '100%',
    borderWidth: 1.5,
    padding: 10,
    fontSize: 18,
    borderRadius: 4,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  resetButton: {
    marginBottom: 10,
    marginTop: 20,
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
});

export default SetupPage;
