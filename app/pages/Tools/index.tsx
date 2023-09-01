import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {Trans, useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import Routes from '../../routes/Routes';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
// @ts-ignore
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {useTheme} from '../../util/theme';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const ToolsPage = ({navigation}: {navigation: any}) => {
  const [networkState, setNetworkState] = React.useState<NetInfoState | null>(
    null,
  );
  React.useEffect(() => {
    NetInfo.addEventListener(state => {
      setNetworkState(state);
    });
  }, []);

  const onScanSuccess = (result: string) => {
    navigation.navigate(Routes.TABS.QRResult, {result});
  };

  const {t} = useTranslation();

  const scanQRCode = async () => {
    let permission: string = '';
    if (Platform.OS === 'android') {
      permission = await check(PERMISSIONS.ANDROID.CAMERA);
    } else if (Platform.OS === 'ios') {
      permission = await check(PERMISSIONS.IOS.CAMERA);
    }
    if (permission === RESULTS.GRANTED) {
      navigation.navigate(Routes.TABS.QR_SCANNER, {
        onSuccess: onScanSuccess,
        notUR: true,
      });
    } else if (
      permission === RESULTS.BLOCKED ||
      permission === RESULTS.DENIED
    ) {
      request(PERMISSIONS.ANDROID.CAMERA).then(_permission => {
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
  const jumpToGenerator = () => {
    navigation.navigate(Routes.TABS.QRGenerator);
  };

  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <View
            style={{
              width: '100%',
              paddingRight: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                padding: 20,
                color: theme.colors.title,
              }}>
              <Trans>tools.networkLabel</Trans>
            </Text>
            <Text style={[styles.label, {color: theme.colors.text}]}>
              <Trans>
                {networkState?.isConnected
                  ? 'tools.connected'
                  : 'tools.disconnected'}
              </Trans>
            </Text>
          </View>
          <Text
            style={{
              fontSize: 15,
              color: theme.colors.placeholder,
              paddingLeft: 20,
              width: '100%',
              paddingRight: 15,
            }}>
            <Trans>tools.offlineWarning</Trans>
          </Text>
        </View>
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text
            style={{
              width: '100%',
              fontSize: 16,
              fontWeight: 'bold',
              paddingLeft: 20,
              paddingTop: 20,
              color: theme.colors.title,
            }}>
            <Trans>tools.QRCode</Trans>
          </Text>
          <TouchableOpacity style={styles.cell} onPress={scanQRCode}>
            <MCIcon name="scan-helper" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>tools.reader</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cell} onPress={jumpToGenerator}>
            <MCIcon name="qrcode-edit" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>tools.generator</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  section: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    paddingBottom: 10,
    marginBottom: 10,
  },
  cell: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    height: 32,
    marginTop: 10,
  },
  line: {
    flex: 1,
    marginLeft: 15,
    borderBottomWidth: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 17,
  },
  text: {
    fontSize: 17,
    marginRight: 16,
  },
});
export default ToolsPage;
