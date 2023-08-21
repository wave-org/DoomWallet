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
import {useTheme} from '../../util/theme';
import {Trans} from 'react-i18next';

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

  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      {evmUR === undefined || btcUR === undefined ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : (
        <View style={styles.container}>
          <Tab
            value={tabIndex}
            onChange={e => setTabIndex(e)}
            style={{
              width: '100%',
              height: 60,
              backgroundColor: theme.colors.surface,
            }}
            disableIndicator={true}
            variant="primary">
            <Tab.Item
              title="EVM"
              titleStyle={active => ({
                fontSize: active ? 13 : 12,
                fontWeight: active ? 'bold' : 'normal',
                color: theme.colors.inverse,
              })}
              icon={{
                name: 'ethereum',
                type: 'material-community',
                color: 'white',
              }}
              containerStyle={active => ({
                opacity: active ? 1 : 0.5,
              })}
              buttonStyle={{
                backgroundColor: theme.colors.primary,
              }}
            />
            <Tab.Item
              title="Bitcoin"
              titleStyle={active => ({
                fontSize: active ? 13 : 12,
                fontWeight: active ? 'bold' : 'normal',
                color: theme.colors.inverse,
              })}
              containerStyle={active => ({
                opacity: active ? 1 : 0.5,
              })}
              buttonStyle={{
                backgroundColor: theme.colors.primary,
              }}
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
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#DFE0E2',
                    padding: 20,
                  }}>
                  <QRCode size={width - 40} value={evmUR} />
                </View>
                <Text style={[styles.normalText, {color: theme.colors.text}]}>
                  <Trans>connection.evmText</Trans>
                </Text>
                <Button
                  title="MetaMask"
                  type="clear"
                  onPress={getMetaMask}
                  style={{marginTop: 25}}
                  titleStyle={{color: theme.colors.primary}}
                />
              </View>
            </TabView.Item>
            <TabView.Item style={{width: '100%'}}>
              <View style={styles.textContainer}>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#DFE0E2',
                    padding: 20,
                  }}>
                  <QRCode size={width - 40} value={btcUR} />
                </View>
                <Text style={[styles.normalText, {color: theme.colors.text}]}>
                  <Trans>connection.btcText</Trans>
                </Text>
                <Button
                  title="BlueWallet"
                  type="clear"
                  onPress={getBlueWallet}
                  style={{marginTop: 25}}
                  titleStyle={{color: theme.colors.primary}}
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
    padding: 20,
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  textContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default ConnectionQRCodePage;
