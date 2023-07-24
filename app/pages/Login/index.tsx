import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Alert,
} from 'react-native';
import * as wallet from '../../wallet';
import Routes from '../../routes/Routes';
import Toast from 'react-native-toast-message';

const LoginPage = ({navigation}) => {
  const passwordType = wallet.getPasswordType();
  const [password, setPassword] = React.useState<string>('');

  const login = () => {
    Keyboard.dismiss();
    if (passwordType === 'FullPassword') {
      if (wallet.loadWallet(password)) {
        console.log('Login success');
        navigation.replace(Routes.ROOT.TABS);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Password is wrong',
        });
      }
    } else {
      // simple password
      if (wallet.loadWalletBySimplePassword(password)) {
        console.log('Login success');
        navigation.replace(Routes.ROOT.TABS);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Password is wrong',
        });
      }
    }
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

  const inputView = () => {
    if (passwordType === 'FullPassword') {
      return (
        <View style={styles.inputView}>
          <Text>Input your password</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type your password"
            onChangeText={newText => setPassword(newText)}
            defaultValue={password}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      );
    } else if (passwordType === 'SimplePassword') {
      return (
        <View style={styles.inputView}>
          <Text>Input your simple password to unlock your wallet</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type your password"
            onChangeText={newText => setPassword(newText)}
            defaultValue={password}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            // keyboardType="url"
          />
        </View>
      );
    } else {
      // passwordType === 'PinPassword'
      return (
        <View style={styles.inputView}>
          <Text>Input your PIN password to unlock your wallet</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type your password"
            onChangeText={newText => setPassword(newText)}
            defaultValue={password}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="numeric"
          />
        </View>
      );
    }
  };

  if (passwordType === 'GesturePassword') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text>TODO</Text>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback
          style={styles.container}
          onPress={Keyboard.dismiss}
          accessible={false}>
          <View style={styles.container}>
            {inputView()}
            <Button title="Login" onPress={login} />
            <Text>Forget password. Abondon this wallet.</Text>
            <Pressable style={styles.resetButton} onLongPress={reset}>
              <Text>Reset wallet! (Long press)</Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
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
  },
  textInput: {
    height: 40,
    width: '80%',
    borderWidth: 1,
  },
  resetButton: {
    height: 44,
    width: '66%',
    backgroundColor: 'red',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default LoginPage;
