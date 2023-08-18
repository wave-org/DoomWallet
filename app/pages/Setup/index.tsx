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
              <Text style={styles.highlightText}>Mnemonic:</Text>
              <MnemonicView mnemonic={mnemonic.split(' ')} />
              <View style={styles.line}>
                <Text style={styles.lineLabel}>Password:</Text>
                <Text style={styles.lineText}>{password}</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>Biometrics:</Text>
                <Text style={styles.lineText}>
                  {useBiometrics ? 'use' : 'not use'}
                </Text>
              </View>
              {simplePassword !== '' ? (
                <View style={styles.line}>
                  <Text style={styles.lineLabel}>PasswordType:</Text>
                  <Text style={styles.lineText}>{passwordType}</Text>
                </View>
              ) : null}
              {simplePassword !== '' ? (
                <View style={styles.line}>
                  <Text style={styles.lineLabel}>SimplePassword:</Text>
                  <Text style={styles.lineText}>{simplePassword}</Text>
                </View>
              ) : null}

              <Text style={styles.normalText}>
                You should backup your mnemonic and password in different
                places.
              </Text>
              <Text style={styles.normalText}>
                If you forget your password, you will never recover your private
                key.
              </Text>
              {simplePassword !== '' ? (
                <Text style={styles.normalText}>
                  You have to remember your simplePassword.
                </Text>
              ) : null}
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.button}
                onPress={complete}>
                <Text style={styles.buttonText}>Use Doom Wallet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.resetButton}
                onPress={reset}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        {loading ? (
          <View style={styles.indicatorView}>
            <ActivityIndicator size="large" color="#00ff00" />
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
        <ScrollView
          style={styles.container}
          // contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.textContainer}>
            <Text style={styles.normalText}>
              In Doom Wallet, a private key is generated by a 24-words mnemonic
              and a password.
            </Text>
            <Text style={styles.normalText}>
              Password is different from other wallets.
            </Text>
            <Text style={styles.normalText}>
              If you forget your password, you will never recover your private
              key.
            </Text>
            <Text style={styles.normalText}>
              You are going to generate a mnemonic. A mnemonic is a sequence of
              words.
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.button}
              onPress={generateRandomMnemonic}>
              <Text style={styles.buttonText}>Random Mnemonic</Text>
            </TouchableOpacity>

            <Text style={styles.textInputLabel}>
              You can also type some random text to generate a mnemonic:
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {borderColor: editingText ? 'deepskyblue' : '#aaaaaa'},
              ]}
              placeholder="Type random text, at least 16 characters"
              placeholderTextColor="#aaaaaa"
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
              style={[styles.button, {opacity: hashButtonDisable() ? 0.5 : 1}]}
              onPress={generateMnemonicByText}>
              <Text style={styles.buttonText}>Hash Text</Text>
            </TouchableOpacity>
          </View>

          {mnemonic !== '' ? (
            <View style={styles.mnemonicContainer}>
              {/* <Text>{mnemonic}</Text> */}
              <MnemonicView mnemonic={mnemonic.split(' ')} />

              <Text style={[styles.normalText, {paddingLeft: 20}]}>
                Now, you can set password.
              </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.button}
                onPress={goToSetPassword}>
                <Text style={styles.buttonText}>Set Password</Text>
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
    backgroundColor: 'dodgerblue',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  buttonText: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: '#ffffff',
  },
  textInput: {
    height: 60,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#aaaaaa',
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
    backgroundColor: 'red',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#ffffff',
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
