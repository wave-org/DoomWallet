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
} from 'react-native';
import Routes from '../../routes/Routes';
import * as wallet from '../../wallet';
import Toast from 'react-native-toast-message';
import MnemonicView from '../../components/MnemonicView';
import {useTheme} from '../../util/theme';

const SetupPage = ({navigation}: {navigation: any}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>('');
  const [editingText, setEditingText] = React.useState<boolean>(false);
  const [mnemonic, setMnemonic] = React.useState<string>('');
  const [success, setSuccess] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');
  const [useBiometrics, setUseBiometrics] = React.useState<boolean>(false);
  const [passwordType, setPasswordType] =
    React.useState<wallet.PasswordType>('FullPassword');
  const [simplePassword, setSimplePassword] = React.useState<string>('');
  // const navigation = useNavigation();

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
  }) => {
    setSuccess(true);
    setMnemonic(keyInfo.mnemonic);
    setPassword(keyInfo.password);
    setPasswordType(keyInfo.passwordType);
    setUseBiometrics(keyInfo.useBiometrics);
    if (keyInfo.simplePassword !== undefined) {
      setSimplePassword(keyInfo.simplePassword);
    }
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
          <ScrollView
            style={styles.container}
            // contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.textContainer}>
              <Text style={[styles.highlightText, {color: theme.colors.title}]}>
                Mnemonic:
              </Text>
              <MnemonicView mnemonic={mnemonic.split(' ')} theme={theme} />
              <View style={styles.line}>
                <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                  Password:
                </Text>
                <Text style={[styles.lineText, {color: theme.colors.text}]}>
                  {password}
                </Text>
              </View>
              <View style={styles.line}>
                <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                  Biometrics:
                </Text>
                <Text style={[styles.lineText, {color: theme.colors.text}]}>
                  {useBiometrics ? 'use' : 'not use'}
                </Text>
              </View>
              {simplePassword !== '' ? (
                <View style={styles.line}>
                  <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                    PasswordType:
                  </Text>
                  <Text style={[styles.lineText, {color: theme.colors.text}]}>
                    {passwordType}
                  </Text>
                </View>
              ) : null}
              {simplePassword !== '' ? (
                <View style={styles.line}>
                  <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                    SimplePassword:
                  </Text>
                  <Text style={[styles.lineText, {color: theme.colors.text}]}>
                    {simplePassword}
                  </Text>
                </View>
              ) : null}

              <Text style={[styles.normalText, {color: theme.colors.text}]}>
                You should backup your mnemonic and password in different
                places.
              </Text>
              <Text style={[styles.normalText, {color: theme.colors.text}]}>
                If you forget your password, you will never recover your private
                key.
              </Text>
              {simplePassword !== '' ? (
                <Text style={[styles.normalText, {color: theme.colors.text}]}>
                  You have to remember your simplePassword.
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
                  Use Doom Wallet
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
                  Reset
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
          <View style={styles.textContainer}>
            <Text style={[styles.normalText, {color: theme.colors.text}]}>
              In Doom Wallet, a private key is generated by a 24-words mnemonic
              and a password.
            </Text>
            <Text style={[styles.normalText, {color: theme.colors.text}]}>
              Password is different from other wallets.
            </Text>
            <Text style={[styles.normalText, {color: theme.colors.text}]}>
              If you forget your password, you will never recover your private
              key.
            </Text>
            <Text style={[styles.normalText, {color: theme.colors.text}]}>
              You are going to generate a mnemonic. A mnemonic is a sequence of
              words.
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
              <Text style={[styles.buttonText, {color: theme.colors.inverse}]}>
                Random Mnemonic
              </Text>
            </TouchableOpacity>

            <Text style={[styles.textInputLabel, {color: theme.colors.text}]}>
              You can also type some random text to generate a mnemonic:
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
              placeholder="Type random text, at least 16 characters"
              placeholderTextColor={theme.colors.placeholder}
              onChangeText={newText => setText(newText)}
              defaultValue={text}
              autoComplete="off"
              multiline={true}
              numberOfLines={2}
              autoCorrect={false}
              returnKeyType="done"
              // inputMode="search"
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
              <Text style={[styles.buttonText, {color: theme.colors.inverse}]}>
                Hash Text
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
                Now, you can set password.
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
                  Set Password
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mnemonicContainer} />
          )}
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
