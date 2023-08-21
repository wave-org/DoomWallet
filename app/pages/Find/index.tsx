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
import {useTheme, Theme} from '../../util/theme';
import {Trans} from 'react-i18next';

function QRCodeButton({
  cameraPermission,
  onPress,
  theme,
}: {
  cameraPermission: string;
  onPress: () => void;
  theme: Theme;
}) {
  if (cameraPermission === RESULTS.GRANTED) {
    return (
      <View style={styles.beforeScanContainer}>
        <Text style={[styles.normalText, {color: theme.colors.text}]}>
          <Trans>find.beforeScan</Trans>
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          onPress={onPress}>
          <Text style={[styles.buttonText, {color: theme.colors.inverse}]}>
            <Trans>find.scanButton</Trans>
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else if (cameraPermission === RESULTS.DENIED) {
    return (
      <View style={styles.beforeScanContainer}>
        <Text style={[styles.normalText, {color: theme.colors.text}]}>
          <Trans>find.permessionText</Trans>
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          onPress={onPress}>
          <Text style={[styles.buttonText, {color: theme.colors.inverse}]}>
            <Trans>find.getPermissionButton</Trans>
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else if (cameraPermission === RESULTS.BLOCKED) {
    return (
      <View style={styles.beforeScanContainer}>
        <Text style={[styles.normalText, {color: theme.colors.text}]}>
          <Trans>find.permessionText</Trans>
        </Text>
        <Text style={[styles.normalText, {color: theme.colors.text}]}>
          <Trans>find.cameraPermissionBlocked</Trans>
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.beforeScanContainer}>
        <Text style={[styles.normalText, {color: theme.colors.text}]}>
          <Trans>find.permessionText</Trans>
        </Text>
        <Text style={[styles.normalText, {color: theme.colors.title}]}>
          <Trans>find.cameraPermissionBlocked</Trans>
        </Text>
      </View>
    );
  }
}

const FindPage = ({navigation}: {navigation: any}) => {
  const [cameraPermission, setCameraPermission] =
    React.useState('not-determined');
  const theme = useTheme();
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
            theme={theme}
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
    textAlign: 'center',
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  buttonText: {
    fontSize: 17,
  },
});

export default FindPage;
