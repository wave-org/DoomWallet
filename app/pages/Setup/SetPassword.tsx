import React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
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

const SetPasswordPage = ({route, navigation}) => {
  const {mnemonic, setupComplete} = route.params;
  const [password, setPassword] = React.useState<string>('');
  //   const navigation = useNavigation();

  const goSecurityPage = () => {
    navigation.navigate(Routes.ROOT.SECURITY_SETTING, {
      mnemonic,
      password,
      setupComplete,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={Keyboard.dismiss}
        accessible={false}>
        <View style={styles.container}>
          <Text>Set password</Text>
          <Text>Mnemonic:</Text>
          <Text>{mnemonic}</Text>
          <Text>
            If you forget your password, you can never recover your private key.
          </Text>
          <Text>Input your password(It should be very complex):</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type a complex password"
            onChangeText={newText => setPassword(newText)}
            defaultValue={password}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            // keyboardType="url"
          />
          <Text>
            Be easy, we will support simple password to help you unlock the
            wallet in a trusted device
          </Text>
          {password.length > 10 ? (
            <View>
              <Text>TODO not bad password</Text>
              <Button title="Security Setting" onPress={goSecurityPage} />
            </View>
          ) : (
            <View>
              <Text>Password should be strong</Text>
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
  textInput: {
    height: 40,
    width: '80%',
    borderWidth: 1,
  },
});

export default SetPasswordPage;
