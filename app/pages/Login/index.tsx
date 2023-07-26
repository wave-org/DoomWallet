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
  ActivityIndicator,
} from 'react-native';
import * as wallet from '../../wallet';
import Routes from '../../routes/Routes';
import Toast from 'react-native-toast-message';

const LoginPage = ({navigation}) => {
  const walletHeader = wallet.getWalletHeader();
  const [password, setPassword] = React.useState<string>('');
  const [simplePassword, setSimplePassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

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
          // console.log('success', new Date());
          Toast.show({
            type: 'success',
            text1: 'Login success',
          });
          setTimeout(() => {
            navigation.replace(Routes.ROOT.TABS);
          }, 300);
        } else {
          // TODO max try times
          Toast.show({
            type: 'error',
            text1: 'Password is wrong',
          });
        }
      } catch (error) {
        setLoading(false);
        let message = (error as Error).message;
        Toast.show({
          type: 'error',
          text1: message,
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

  const inputView = () => {
    if (walletHeader.passwordType === 'FullPassword') {
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
    } else if (walletHeader.passwordType === 'SimplePassword') {
      return (
        <View style={styles.inputView}>
          <Text>Input your simple password to unlock your wallet</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type your password"
            onChangeText={newText => setSimplePassword(newText)}
            defaultValue={simplePassword}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            // keyboardType="url"
          />
        </View>
      );
    } else if (walletHeader.passwordType === 'PinPassword') {
      return (
        <View style={styles.inputView}>
          <Text>Input your PIN password to unlock your wallet</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type your password"
            onChangeText={newText => setSimplePassword(newText)}
            defaultValue={simplePassword}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="numeric"
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
        {loading ? (
          <View style={styles.indicatorView}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        ) : null}
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

export default LoginPage;
