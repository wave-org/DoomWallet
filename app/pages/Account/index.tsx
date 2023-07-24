import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  Button,
  Pressable,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as wallet from '../../wallet';
import Routes from '../../routes/Routes';

const AccountPage = ({navigation}) => {
  const [ur, setUr] = React.useState('https://www.google.com');
  const {width} = useWindowDimensions();
  React.useEffect(() => {
    setUr(wallet.getWallet()!.getConnectionUR());
  }, []);

  const reset = () => {
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

  return (
    // <NavigationContainer>
    <SafeAreaView>
      <View>
        <Text>Account</Text>
        <View
          style={[
            styles.qrCodeContainer,
            {
              width: width - 40,
            },
          ]}>
          <QRCode size={width - 40} value={ur} />
          <Pressable style={styles.resetButton} onLongPress={reset}>
            <Text>Reset wallet! (Long press)</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
    // </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  qrCodeContainer: {
    margin: 20,
    aspectRatio: 1,
    // height: 100%,
  },
  resetButton: {
    marginTop: 100,
    height: 44,
    width: '66%',
    backgroundColor: 'red',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
export default AccountPage;
