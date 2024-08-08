import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Routes from '../../routes/Routes';
import {UR} from '@ngraveio/bc-ur';
import * as wallet from '../../wallet';
import {useTheme, Theme} from '../../util/theme';
import {Trans, useTranslation} from 'react-i18next';
import {
  SignRecord,
  BTCSignRecord,
  EVMSignRecord,
  getPageCount,
  getRecords,
} from '../../wallet/signRecord';
import {RequestType} from 'doom-wallet-core';
import {DateTime} from 'luxon';
import Pagination from '../../components/Pagination';
import {useFocusEffect} from '@react-navigation/native';

type ItemProps = {
  item: SignRecord;
  onPress: (item: SignRecord) => void;
  theme: Theme;
};

const Item = ({item, onPress, theme}: ItemProps) => {
  const {t} = useTranslation();
  let status = t('find.recordPending');
  if (item.status === 'success') {
    status = t('find.recordSuccess');
  } else if (item.status === 'failed') {
    status = t('find.recordFailed');
  }

  if (item.chainType === 'BTC') {
    const record = item as BTCSignRecord;
    return (
      <View
        style={{
          width: '100%',
          marginBottom: 5,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => onPress(item)}
          activeOpacity={0.6}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            flexDirection: 'row',
            width: '100%',
            backgroundColor: theme.colors.surface,
            borderRadius: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: 50,
              height: 36,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 17,
                color: theme.colors.title,
                fontWeight: 'bold',
              }}>
              #
            </Text>
            <Text style={{fontSize: 16, color: theme.colors.title}}>
              {item.index}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              height: 64,
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View
              style={{
                width: '100%',
                height: 32,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 16, color: theme.colors.text}}>
                {item.chainType}
              </Text>
              <Text style={{fontSize: 15, color: theme.colors.placeholder}}>
                {DateTime.fromMillis(item.timestamp).toFormat(
                  'yyyy-MM-dd HH:mm:ss',
                )}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 32,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 16, color: theme.colors.text}}>
                <Trans>find.recordStatus</Trans>
                {status}
              </Text>
              <Text style={{fontSize: 15, color: theme.colors.text}}>
                <Trans>find.recordFees</Trans>
                {record.fee}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  // EVM
  const record = item as EVMSignRecord;
  let type = t('find.evmTransactionTypes.typedData');
  if (record.type === RequestType.legacyTransaction) {
    type = t('find.evmTransactionTypes.legacyTransaction');
  } else if (record.type === RequestType.transaction) {
    type = t('find.evmTransactionTypes.transaction');
  } else if (record.type === RequestType.personalMessage) {
    type = t('find.evmTransactionTypes.personalMessage');
  }
  return (
    <View
      style={{
        width: '100%',
        marginBottom: 5,
        paddingHorizontal: 20,
      }}>
      <TouchableOpacity
        onPress={() => onPress(item)}
        activeOpacity={0.6}
        style={{
          paddingHorizontal: 8,
          paddingVertical: 4,
          flexDirection: 'row',
          width: '100%',
          backgroundColor: theme.colors.surface,
          borderRadius: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: 50,
            height: 32,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 17,
              color: theme.colors.title,
              fontWeight: 'bold',
            }}>
            #
          </Text>
          <Text style={{fontSize: 16, color: theme.colors.title}}>
            {item.index}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            height: 82,
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View
            style={{
              width: '100%',
              height: 32,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 16, color: theme.colors.text}}>
              {item.chainType}
            </Text>
            <Text style={{fontSize: 15, color: theme.colors.placeholder}}>
              {DateTime.fromMillis(item.timestamp).toFormat(
                'yyyy-MM-dd HH:mm:ss',
              )}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              height: 25,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 16, color: theme.colors.text}}>
              <Trans>find.recordFromAddress</Trans>
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: theme.colors.text,
                maxWidth: '70%',
              }}
              ellipsizeMode="middle"
              numberOfLines={1}>
              {record.address}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              height: 25,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 16, color: theme.colors.text}}>
              <Trans>find.recordStatus</Trans>
              {status}
            </Text>
            <Text style={{fontSize: 15, color: theme.colors.text}}>
              <Trans>find.recordEVMType</Trans>
              {type}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

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
        <Text style={[styles.normalText, {color: theme.colors.placeholder}]}>
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
        <Text style={[styles.normalText, {color: theme.colors.placeholder}]}>
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
        <Text style={[styles.normalText, {color: theme.colors.placeholder}]}>
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
        <Text style={[styles.normalText, {color: theme.colors.placeholder}]}>
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
  const [records, setRecords] = React.useState<SignRecord[]>([]);
  const [recordsPageCount, setRecordsPageCount] = React.useState(0);

  const refreshRecordsPageCount = () => {
    const count = getPageCount();
    setRecordsPageCount(count);
    return count;
  };
  useFocusEffect(
    React.useCallback(() => {
      //View did appear
      refreshRecordsPageCount();
    }, []),
  );

  const refreshRecords = (page: number) => {
    setRecords(getRecords(page));
  };

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
    if (refreshRecordsPageCount() > 0) {
      refreshRecords(0);
    }
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

  const renderItem = ({item}: {item: SignRecord}) => {
    return (
      <Item item={item} onPress={o => console.log(o.index)} theme={theme} />
    );
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
        <View
          style={{
            width: '100%',
            height: 32,
            marginBottom: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: theme.colors.title,
            }}>
            <Trans>find.recordHeader</Trans>
          </Text>
        </View>
        <FlatList
          style={{
            width: '100%',
            flex: 1,
          }}
          data={records}
          renderItem={renderItem}
          keyExtractor={item => item.index.toString()}
          ListEmptyComponent={
            <View
              style={{
                width: '100%',
                height: 400,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 24,
              }}>
              <Text
                style={[styles.normalText, {color: theme.colors.placeholder}]}>
                <Trans>find.recordsHint</Trans>
              </Text>
            </View>
          }
          ListFooterComponent={
            records.length > 0 ? (
              <Pagination
                count={recordsPageCount}
                onPageChange={index => refreshRecords(index)}
                theme={theme}
              />
            ) : null
          }
        />
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
    fontSize: 15,
    marginBottom: 25,
    paddingHorizontal: 24,
    textAlign: 'left',
    width: '100%',
  },
  textContainer: {
    width: '100%',
    height: 180,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default FindPage;
