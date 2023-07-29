import React, {useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {
  SafeAreaView,
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Routes from '../../routes/Routes';

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

const FindPage = () => {
  const [urText, setUrText] = React.useState<string>('');
  const [cameraPermission, setCameraPermission] =
    React.useState('not-determined');
  useEffect(() => {
    async function fetchPermission() {
      // TODO android
      const permission = await check(PERMISSIONS.IOS.CAMERA);
      setCameraPermission(permission);
    }

    fetchPermission();
  }, []);
  const navigation = useNavigation();

  const onSuccess = (ur: string) => {
    // setUrText(ur);
    navigation.navigate(Routes.TABS.SIGN, {ur});
  };

  const showResult = () => {
    if (urText !== '') {
      return <Text>{urText}</Text>;
    } else {
      return null;
    }
  };

  const onClickScan = () => {
    setUrText('');
    if (cameraPermission === 'authorized') {
      // Navigate to QR Scanner
      navigation.navigate(Routes.TABS.QR_SCANNER, {onSuccess});
    } else {
      request(PERMISSIONS.IOS.CAMERA).then(permission => {
        setCameraPermission(permission);
        navigation.navigate(Routes.TABS.QR_SCANNER, {onSuccess});
      });
    }
  };

  return (
    // <NavigationContainer>
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          {showResult()}
          <QRCodeButton
            cameraPermission={cameraPermission}
            onPress={onClickScan}
          />
        </View>
      </View>
    </SafeAreaView>
    // </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    // padding: 20,
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  normalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  textContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
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
    // fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default FindPage;
