import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Linking,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {Button} from '@rneui/themed';
import * as wallet from '../../wallet';
import {WalletType} from '../../wallet';
import {useTheme} from '../../util/theme';
import {Trans} from 'react-i18next';

const ConnectionQRCodePage = ({route}: {route: any}) => {
  const {walletType}: {walletType: WalletType} = route.params;

  const [ur, setUR] = React.useState<string | undefined>(undefined);
  const {width} = useWindowDimensions();
  React.useEffect(() => {
    if (walletType === WalletType.EVM) {
      setUR(wallet.getWallet()!.EVMWallet.getConnectionUR());
    } else if (walletType === WalletType.BTC) {
      setUR(wallet.getWallet()!.BTCWallet.getConnectionUR());
    }
  }, [setUR, walletType]);

  const getMetaMask = () => {
    Linking.openURL('https://metamask.io/');
  };

  const getBlueWallet = () => {
    Linking.openURL('https://bluewallet.io/');
  };

  const theme = useTheme();

  if (ur === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (walletType === WalletType.EVM) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#DFE0E2',
              padding: 20,
            }}>
            <QRCode size={width - 40} value={ur} />
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
      </SafeAreaView>
    );
  }

  if (walletType === WalletType.BTC) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#DFE0E2',
              padding: 20,
            }}>
            <QRCode size={width - 40} value={ur} />
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
      </SafeAreaView>
    );
  }

  return <SafeAreaView style={styles.container} />;
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
