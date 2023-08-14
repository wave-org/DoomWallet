import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Routes from '../../routes/Routes';
import {UR} from '@ngraveio/bc-ur';
import * as wallet from '../../wallet';

function QRCodeButton({
  cameraPermission,
  onPress,
}: {
  cameraPermission: string;
  onPress: () => void;
}) {
  if (cameraPermission === RESULTS.GRANTED) {
    return (
      <View style={styles.beforeScanContainer}>
        <Text style={styles.normalText}>
          If you want to sign a transaction, you need to use MetaMask or
          BlueWallet to start a transaction and get a QR code. Then you can scan
          the QR code to sign the transaction.
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.button}
          onPress={onPress}>
          <Text style={styles.buttonText}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (cameraPermission === RESULTS.DENIED) {
    return (
      <View style={styles.beforeScanContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.button}
          onPress={onPress}>
          <Text style={styles.buttonText}>
            Grant Camera Permission And Scan
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else if (cameraPermission === RESULTS.BLOCKED) {
    return (
      <View style={styles.beforeScanContainer}>
        <Text style={styles.normalText}>
          Doom Wallet need camera permission to scan a QR code to sign
          Transaction.
        </Text>
        <Text style={styles.normalText}>
          Please go to Settings and grant the Camera permission.
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.beforeScanContainer}>
        <Text style={styles.normalText}>
          Doom Wallet need camera permission to scan a QR code to sign
          Transaction.
        </Text>
        <Text style={styles.normalText}>
          Please go to Settings and grant the Camera permission.
        </Text>
      </View>
    );
  }
}

const FindPage = ({navigation}: {navigation: any}) => {
  const [cameraPermission, setCameraPermission] =
    React.useState('not-determined');

  useEffect(() => {
    async function fetchPermission() {
      if (Platform.OS === 'android') {
        const permission = await check(PERMISSIONS.ANDROID.CAMERA);
        setCameraPermission(permission);
      } else if (Platform.OS === 'ios') {
        const permission = await check(PERMISSIONS.IOS.CAMERA);
        setCameraPermission(permission);
      }
    }

    fetchPermission();
  }, []);
  const onSuccess = (ur: UR) => {
    const type = wallet.getRequestType(ur);
    if (type === wallet.WalletType.EVM) {
      navigation.navigate(Routes.TABS.SIGN, {ur});
    } else if (type === wallet.WalletType.BTC) {
      navigation.navigate(Routes.TABS.BTCSIGN, {ur});
    }
  };

  const onClickScan = () => {
    if (cameraPermission === 'authorized' || cameraPermission === 'granted') {
      // Navigate to QR Scanner
      navigation.navigate(Routes.TABS.QR_SCANNER, {onSuccess});
    } else {
      if (Platform.OS === 'android') {
        request(PERMISSIONS.ANDROID.CAMERA).then(permission => {
          setCameraPermission(permission);
          navigation.navigate(Routes.TABS.QR_SCANNER, {onSuccess});
        });
      } else if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.CAMERA).then(permission => {
          setCameraPermission(permission);
          navigation.navigate(Routes.TABS.QR_SCANNER, {onSuccess});
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <QRCodeButton
            cameraPermission={cameraPermission}
            onPress={onClickScan}
          />
        </View>
      </View>
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
  },
  normalText: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'left',
    width: '100%',
  },
  textContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  beforeScanContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 44,
    width: '88%',
    backgroundColor: 'dodgerblue',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  buttonText: {
    fontSize: 17,
    color: '#ffffff',
  },
});

export default FindPage;
