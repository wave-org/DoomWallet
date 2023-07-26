import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Switch,
} from 'react-native';
import {PasswordType} from '../../wallet';
// import Routes from '../../routes/Routes';
import * as Keychain from 'react-native-keychain';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const SecuritySettingPage = ({route, navigation}) => {
  const {mnemonic, password, setupComplete} = route.params;
  const [supportBiometrics, setSupportBiometrics] = React.useState<
    boolean | undefined
  >(undefined);
  // const [hasPermission, setHasPermission] = React.useState<boolean>(false);
  const [usebiometrics, setUsebiometrics] = React.useState<boolean>(false);
  const toggleBiometricsSwitch = () =>
    setUsebiometrics(previousState => !previousState);
  useEffect(() => {
    const supportedType = Keychain.getSupportedBiometryType();
    if (supportedType === null) {
      setSupportBiometrics(false);
    } else {
      setSupportBiometrics(true);
    }
  }, [setSupportBiometrics]);

  const switchBiometrics = async () => {
    // check ios permission
    if (Platform.OS === 'ios') {
      const permission = await check(PERMISSIONS.IOS.FACE_ID);
      // console.log('permission', permission);
      if (permission === RESULTS.BLOCKED) {
        // toast ask for permission
        Toast.show({
          type: 'error',
          text1: 'Please go to setting page to enable Face ID for Doom Wallet',
        });
      } else if (permission === RESULTS.DENIED) {
        // request for permission
        request(PERMISSIONS.IOS.FACE_ID).then(_permission => {
          if (_permission === RESULTS.GRANTED) {
            toggleBiometricsSwitch();
          } else {
            Toast.show({
              type: 'error',
              text1:
                'Please go to setting page to enable Face ID for Doom Wallet',
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

  const [usePassword, setUsePassword] = React.useState<boolean>(true);
  const togglePasswordSwitch = () =>
    setUsePassword(previousState => !previousState);
  const switchUsePassword = () => {
    if (!usePassword && useSimplePassword) {
      toggleSimplePasswordSwitch();
    }
    togglePasswordSwitch();
  };

  const [useSimplePassword, setUseSimplePassword] =
    React.useState<boolean>(false);
  const toggleSimplePasswordSwitch = () =>
    setUseSimplePassword(previousState => !previousState);
  const [simplePassword, setSimplePassword] = React.useState<string>('');
  const switchUseSimplePassword = () => {
    if (usePassword && !useSimplePassword) {
      togglePasswordSwitch();
    }
    toggleSimplePasswordSwitch();
  };

  const [useType1, setUseType1] = React.useState<boolean>(false);
  const toggleType1Switch = () => {
    if (!useType1) {
      setUseType2(false);
      setUseType3(false);
    }
    setSimplePassword('');
    setUseType1(previousState => !previousState);
  };

  const [useType2, setUseType2] = React.useState<boolean>(false);
  const toggleType2Switch = () => {
    if (!useType2) {
      setUseType1(false);
      setUseType3(false);
    }
    setSimplePassword('');
    setUseType2(previousState => !previousState);
  };

  const [useType3, setUseType3] = React.useState<boolean>(false);
  const toggleType3Switch = () => {
    if (!useType3) {
      setUseType2(false);
      setUseType1(false);
    }
    setSimplePassword('');
    setUseType3(previousState => !previousState);
  };

  const useGesturePassword = () => {
    Toast.show({
      type: 'error',
      text1: 'TODO set Gesture Password',
    });
  };

  const complete = () => {
    // check if simple password is valid
    if (useSimplePassword && simplePassword.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'Simple password must be at least 4 characters',
      });
      return;
    }
    if (!usePassword && !useSimplePassword && !usebiometrics) {
      Toast.show({
        type: 'error',
        text1: 'Please select at least one security option',
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
    navigation.popToTop();
    setupComplete({
      password,
      mnemonic,
      passwordType,
      simplePassword: useSimplePassword ? simplePassword : undefined,
      useBiometrics: usebiometrics,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={Keyboard.dismiss}
        accessible={false}>
        <View style={styles.container}>
          <Text>
            With biometrics, you can use your face or fingerprint to unlock your
            wallet.
          </Text>
          <Text>
            It's much safer. The data will be encrypted by your biometrics.
            Without your biometrics, no one can access your wallet.
          </Text>
          {supportBiometrics === false ? (
            <View style={styles.passwordContainer}>
              <Text>Sorry, your device don't support biometrics.</Text>
            </View>
          ) : (
            <View style={styles.passwordContainer}>
              <Text>check biometrics every time.</Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={usebiometrics ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={switchBiometrics}
                value={usebiometrics}
              />
            </View>
          )}
          <View style={styles.passwordContainer}>
            <Text>Password: {password} , Check password every time.</Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={usePassword ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={switchUsePassword}
              value={usePassword}
            />
          </View>
          <Text>
            SimplePassword: {simplePassword} , Check simplePassword every time.
          </Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={useSimplePassword ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={switchUseSimplePassword}
            value={useSimplePassword}
          />
          {useSimplePassword ? (
            <View style={styles.passwordContainer}>
              <View style={styles.passwordContainer}>
                <Text>We have three options for Simple password:</Text>
                <Text>1. Normal simple password:</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={useType1 ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleType1Switch}
                  value={useType1}
                />
                {useType1 ? (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type a simple password"
                    onChangeText={newText => setSimplePassword(newText)}
                    defaultValue={simplePassword}
                    autoComplete="off"
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                ) : null}
                <Text>2. Use PIN:</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={useType2 ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleType2Switch}
                  value={useType2}
                />
                {useType2 ? (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type a PIN"
                    onChangeText={newText => setSimplePassword(newText)}
                    defaultValue={simplePassword}
                    autoComplete="off"
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="numeric"
                  />
                ) : null}
                <Text>3. Use Gesture Password:</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={useType3 ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleType3Switch}
                  value={useType3}
                />
                {useType3 ? (
                  <Button
                    title="TODO set Gesture Password"
                    onPress={useGesturePassword}
                  />
                ) : null}
              </View>
            </View>
          ) : null}
          <Button title="Complete" onPress={complete} />
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
  passwordContainer: {
    width: '90%',
  },
  textInput: {
    height: 40,
    width: '80%',
    borderWidth: 1,
  },
});

export default SecuritySettingPage;
