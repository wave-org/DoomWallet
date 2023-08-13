import React from 'react';
import {
  SafeAreaView,
  // Text,
  View,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Linking,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {Tab, Text, TabView, Button} from '@rneui/themed';
import * as wallet from '../../wallet';

const ConnectionQRCodePage = () => {
  const [evmUR, setEvmUR] = React.useState<string | undefined>(undefined);
  const [btcUR, setBtcUR] = React.useState<string | undefined>(undefined);
  const [tabIndex, setTabIndex] = React.useState(0);
  const {width} = useWindowDimensions();
  React.useEffect(() => {
    setEvmUR(wallet.getWallet()!.EVMWallet.getConnectionUR());
    setBtcUR(wallet.getWallet()!.BTCWallet.getConnectionUR());
  }, [setBtcUR, setEvmUR]);

  const getMetaMask = () => {
    Linking.openURL('https://metamask.io/');
  };

  const getBlueWallet = () => {
    Linking.openURL('https://bluewallet.io/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {evmUR === undefined || btcUR === undefined ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.container}>
          <Tab
            value={tabIndex}
            onChange={e => setTabIndex(e)}
            style={{width: '100%', height: 60}}
            indicatorStyle={{
              backgroundColor: 'white',
              height: 3,
            }}
            variant="primary">
            <Tab.Item
              title="EVM"
              titleStyle={{fontSize: 12}}
              icon={{
                name: 'ethereum',
                type: 'material-community',
                color: 'white',
              }}
            />
            <Tab.Item
              title="Bitcoin"
              titleStyle={{fontSize: 12}}
              icon={{
                name: 'bitcoin',
                type: 'material-community',
                color: 'white',
              }}
            />
          </Tab>
          <TabView
            containerStyle={{
              flex: 1,
              width: '100%',
              height: '100%',
            }}
            value={tabIndex}
            onChange={setTabIndex}
            animationType="spring">
            <TabView.Item style={{width: '100%'}}>
              <View style={styles.textContainer}>
                <QRCode size={width - 40} value={evmUR} />
                <Text style={styles.normalText}>
                  Use your MetaMask Wallet to scan this QRCode to connect.{'\n'}{' '}
                  (Add account or hardware wallet -- Connect a hardware wallet
                  -- QR-Based )
                </Text>
                <Button
                  title="get MetaMask"
                  type="clear"
                  onPress={getMetaMask}
                  style={{marginTop: 25}}
                />
              </View>
            </TabView.Item>
            <TabView.Item style={{width: '100%'}}>
              <View style={styles.textContainer}>
                <QRCode size={width - 40} value={btcUR} />
                <Text style={styles.normalText}>
                  Use your hot wallet to scan this QRCode to connect.{'\n'} We
                  recommend Blue Wallet!
                </Text>
                <Button
                  title="get BlueWallet"
                  type="clear"
                  onPress={getBlueWallet}
                  style={{marginTop: 25}}
                />
              </View>
            </TabView.Item>
          </TabView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  normalText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  textContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
});

export default ConnectionQRCodePage;
