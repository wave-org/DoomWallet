import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Routes from '../../routes/Routes';
import MnemonicView from '../../components/MnemonicView';
import {zxcvbn, zxcvbnOptions} from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

const SetPasswordPage = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {mnemonic, setupComplete} = route.params;
  const [password, setPassword] = React.useState<string>('');
  const [editingPassword, setEditingPassword] = React.useState<boolean>(false);

  const goSecurityPage = () => {
    navigation.navigate(Routes.ROOT.SECURITY_SETTING, {
      mnemonic,
      password,
      setupComplete,
    });
  };

  const options = {
    translations: zxcvbnEnPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
  };

  zxcvbnOptions.setOptions(options);

  const passwordStrengthByScore = {
    0: 'Too weak: risky password. (guesses < 10^3)',
    1: 'Very weak: protection from throttled online attacks. (guesses < 10^6)',
    2: 'Weak: protection from unthrottled online attacks. (guesses < 10^8)',
    3: 'Okay: moderate protection from offline slow-hash scenario. (guesses < 10^10)',
    4: 'Safe: strong protection from offline slow-hash scenario. (guesses >= 10^10)',
  };

  const passwordStrength = () => {
    const {score} = zxcvbn(password);
    return passwordStrengthByScore[score];
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={Keyboard.dismiss}
        accessible={false}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.highlightText}>Mnemonic:</Text>
            <MnemonicView mnemonic={mnemonic.split(' ')} />
            <Text style={styles.normalText}>
              If you forget your password, you can never recover your private
              key.
            </Text>
            <Text style={styles.normalText}>
              Input your password(It should be very complex):
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {borderColor: editingPassword ? 'deepskyblue' : '#aaaaaa'},
              ]}
              placeholder="Password: at least 8 characters"
              placeholderTextColor="#aaaaaa"
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
            {password.length >= 8 ? (
              <View style={styles.passwordStrengthContainer}>
                <Text style={styles.highlightText}>Password Strength:</Text>
                <Text style={styles.normalText}>{passwordStrength()}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.buttonContainer}>
            {password.length >= 8 ? (
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.button}
                onPress={goSecurityPage}>
                <Text style={styles.buttonText}>Security Setting</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    // padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '85%',
    borderWidth: 1.5,
    borderColor: '#aaaaaa',
    padding: 10,
    fontSize: 18,
    borderRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    padding: 30,
  },
  button: {
    height: 44,
    width: '100%',
    backgroundColor: 'dodgerblue',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  buttonText: {
    fontSize: 17,
    color: '#ffffff',
  },
});

export default SetPasswordPage;
