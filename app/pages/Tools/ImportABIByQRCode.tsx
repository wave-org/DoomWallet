import React from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Trans, useTranslation} from 'react-i18next';
import {useTheme} from '../../util/theme';
import {EVMDataDecoder} from '../../wallet/EVMDataDecoder';
import Toast from 'react-native-toast-message';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Routes from '../../routes/Routes';

const QRCodeABIImportScreen = ({navigation}: {navigation: any}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const onScanSuccess = async (result: string) => {
    try {
      await EVMDataDecoder.importABI(result);
      Toast.show({
        type: 'success',
        text1: t('tools.importSuccess'),
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2500,
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: t('tools.importFailed'),
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2500,
      });
    }
    navigation.goBack();
  };

  const scanQRCode = async () => {
    const cameraPermission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    const permission = await check(cameraPermission);
    if (permission === RESULTS.GRANTED) {
      navigation.navigate(Routes.TABS.QR_SCANNER, {
        onSuccess: onScanSuccess,
        notUR: true,
      });
    } else if (
      permission === RESULTS.BLOCKED ||
      permission === RESULTS.DENIED
    ) {
      request(cameraPermission).then(_permission => {
        if (_permission === RESULTS.GRANTED) {
          navigation.navigate(Routes.TABS.QR_SCANNER, {
            onSuccess: onScanSuccess,
            notUR: true,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: t('tools.noCameraPermission'),
            position: 'bottom',
            bottomOffset: 100,
            visibilityTime: 2500,
          });
        }
      });
    } else {
      Toast.show({
        type: 'error',
        text1: t('tools.noCameraPermission'),
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2500,
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        <Text
          style={{
            padding: 20,
            fontSize: 16,
            color: theme.colors.placeholder,
            width: '100%',
            textAlign: 'left',
          }}>
          <Trans>tools.scanABICaption1</Trans>
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: theme.colors.primary,
            width: '100%',
            textAlign: 'center',
          }}
          selectable={true}>
          https://doom-helper.netlify.app/import-abi
        </Text>
        <Text
          style={{
            padding: 20,
            fontSize: 16,
            color: theme.colors.placeholder,
            width: '100%',
            textAlign: 'left',
          }}>
          <Trans>tools.scanABICaption2</Trans>
        </Text>

        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            height: 44,
            width: '80%',
            marginTop: 44,
            marginBottom: 25,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 22,
            backgroundColor: theme.colors.primary,
          }}
          onPress={scanQRCode}>
          <Text style={{fontSize: 17, color: theme.colors.inverse}}>
            <Trans>tools.importButton</Trans>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRCodeABIImportScreen;
