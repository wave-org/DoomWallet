import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import * as wallet from '../../wallet';
import Routes from '../../routes/Routes';

const SetSimplePasswordPage = ({route, navigation}) => {
  const {mnemonic, password, setupComplete} = route.params;
  const [simplePassword, setSimplePassword] = React.useState<string>('');
  const [pin, SetPin] = React.useState<string>('');
  // TODO not support faceID now
  const [faceIDSetted, setFaceIDSetted] = React.useState<boolean>(true);
  // const navigation = useNavigation();
  const useSimplePassword = () => {
    navigation.popToTop();
    setupComplete({
      mnemonic,
      password,
      passwordType: 'simple',
      simplePassword: simplePassword,
    });
  };
  const usePin = () => {
    navigation.popToTop();
    setupComplete({
      mnemonic,
      password,
      passwordType: 'pin',
      simplePassword: pin,
    });
  };
  const useGesturePassword = () => {
    console.log('TODO set Gesture Password');
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={Keyboard.dismiss}
        accessible={false}>
        <View style={styles.container}>
          <Text>Set simple password</Text>
          <Text>Mnemonic:</Text>
          <Text>{mnemonic}</Text>
          <Text>Password:</Text>
          <Text>{password}</Text>
          <Text>
            If you trust this device, you can use the simple password to store
            encrypted password in this device{' '}
          </Text>
          {!faceIDSetted ? (
            <View style={styles.passwordContainer}>
              <Text>First, We must have Face ID :</Text>
              <Button title="Setup FaceID" onPress={useSimplePassword} />
            </View>
          ) : (
            <View style={styles.passwordContainer}>
              <Text>We have three options:</Text>
              <Text>1. Normal simple password:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Type a simple password"
                onChangeText={newText => setSimplePassword(newText)}
                defaultValue={simplePassword}
                autoComplete="off"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Button title="Use simple password" onPress={useSimplePassword} />
              <Text>2. Use PIN:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Type a PIN"
                onChangeText={newText => SetPin(newText)}
                defaultValue={pin}
                autoComplete="off"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="numeric"
              />
              <Button title="Use PIN" onPress={usePin} />
              <Text>3. Use Gesture Password:</Text>
              <Button
                title="TODO set Gesture Password"
                onPress={useGesturePassword}
              />
            </View>
          )}
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

export default SetSimplePasswordPage;
