import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as wallet from '../../wallet';

const ConnectionQRCodePage = () => {
  const [ur, setUr] = React.useState<string | undefined>(undefined);
  const {width} = useWindowDimensions();
  React.useEffect(() => {
    setUr(wallet.getWallet()!.getConnectionUR());
  }, [setUr]);

  return (
    <SafeAreaView style={styles.container}>
      {ur === undefined ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.textContainer}>
          <QRCode size={width - 40} value={ur} />
          <Text style={styles.normalText}>
            Use your MetaMask Wallet to scan this QRCode to connect.{'\n'} (Add
            account or hardware wallet -- Connect a hardware wallet -- QR-Based
            )
          </Text>
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
