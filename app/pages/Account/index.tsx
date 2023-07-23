import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {Key, EVMWallet} from 'doom-wallet-core';
const mnemonic =
  'farm library shuffle knee equal blush disease table deliver custom farm stereo fat level dawn book advance lamp clutch crumble gaze law bird jazz';
const password = 'j1io2u7$@081nf%@au0-,.,3151lijasfa';
const AccountPage = () => {
  const [ur, setUr] = React.useState('https://www.google.com');
  const {width} = useWindowDimensions();
  React.useEffect(() => {
    const wallet = new EVMWallet(Key.fromMnemonic(mnemonic, password));
    setUr(wallet.getConnectionUR());
  }, []);
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
});
export default AccountPage;
