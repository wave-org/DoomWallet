import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import {RequestType} from 'doom-wallet-core';

import {useTheme} from '../../util/theme';
import {useTranslation, Trans} from 'react-i18next';
import {EVMDataDecoder} from '../../wallet/EVMDataDecoder';
import {
  EVMSignRecord,
  changeRecordStatus,
  deleteRecord,
  TransactionStatus,
} from '../../wallet/signRecord';
import SimpleToggleButton from '../../components/SimpleToggleButton';
import {DateTime} from 'luxon';

const EVMSignRecordScreen = ({
  route,
  navigation,
}: {
  navigation: any;
  route: any;
}) => {
  const record = route.params.record as EVMSignRecord;
  const [fromAddress, setFromAddress] = React.useState<string>('');
  const [decodedData, setDecodedData] = React.useState<string>('');
  const {t} = useTranslation();
  let type = t('common.evmTransactionTypes.typedData');
  if (record.type === RequestType.legacyTransaction) {
    type = t('common.evmTransactionTypes.legacyTransaction');
  } else if (record.type === RequestType.transaction) {
    type = t('common.evmTransactionTypes.transaction');
  } else if (record.type === RequestType.personalMessage) {
    type = t('common.evmTransactionTypes.personalMessage');
  }

  const decodeData = async (data: string) => {
    let decoded: string | undefined;
    if (data !== '0x') {
      try {
        const result = await EVMDataDecoder.decodeInputData(data);
        if (result.length > 0) {
          if (result.length > 1) {
            decoded = JSON.stringify(result, null, 4);
          } else {
            decoded = JSON.stringify(result[0], null, 4);
          }
        }
      } catch (error) {
        console.log('decode data error:', error);
      }
    }
    if (decoded !== undefined) {
      setDecodedData(decoded);
    }
  };

  React.useEffect(() => {
    setFromAddress(record.address);
    if (record.type === RequestType.transaction) {
      decodeData(record.transaction!.data);
    } else if (record.type === RequestType.legacyTransaction) {
      decodeData(record.legacyTransaction!.data);
    }
    navigation.setOptions({
      title: `${t('find.evmRecordTitle')} #${record.index}`,
    });
  }, [record, navigation, t]);
  const theme = useTheme();

  const txStatusTitleList = [
    t('find.recordSuccess'),
    t('find.recordFailed'),
    t('find.recordPending'),
  ];
  let defaultSelectedIndex = 0;
  switch (record.status) {
    case 'failed':
      defaultSelectedIndex = 1;
      break;
    case 'pending':
      defaultSelectedIndex = 2;
      break;
  }

  const statusList: TransactionStatus[] = ['success', 'failed', 'pending'];
  const changeStatus = (index: number) => {
    changeRecordStatus(record.index, statusList[index]);
  };

  const onDelete = () => {
    Alert.alert(t('find.deleteRecord'), t('find.deleteRecordConfirm'), [
      {
        text: t('common.cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: async () => {
          deleteRecord(record.index);
          navigation.goBack();
        },
      },
    ]);
  };

  const payloadView = () => {
    switch (record.type) {
      case RequestType.transaction: {
        // eth transaction, EIP1559 transaction
        const payload = record.transaction!;
        return (
          <View style={styles.payloadView}>
            <View style={styles.line}>
              <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                Nonce:
              </Text>
              <Text style={[styles.lineText, {color: theme.colors.text}]}>
                {payload.nonce}
              </Text>
            </View>
            <Text style={[styles.highlightText, {color: theme.colors.title}]}>
              <Trans>signEVM.toAddress</Trans>
            </Text>
            <Text style={[styles.addressText, {color: theme.colors.text}]}>
              {payload.to}
            </Text>
            <View style={styles.line}>
              <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                <Trans>signEVM.value</Trans>
              </Text>
              <Text style={[styles.lineText, {color: theme.colors.text}]}>
                {payload.value.toString()}
              </Text>
            </View>
            <View style={styles.line}>
              <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                maxFeePerGas:
              </Text>
              <Text style={[styles.lineText, {color: theme.colors.text}]}>
                {payload.maxFeePerGas.toString()}
              </Text>
            </View>
            <View style={styles.line}>
              <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                maxPriorityFeePerGas:
              </Text>
              <Text style={[styles.lineText, {color: theme.colors.text}]}>
                {payload.maxPriorityFeePerGas.toString()}
              </Text>
            </View>
            <View style={styles.line}>
              <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                gasLimit:
              </Text>
              <Text style={[styles.lineText, {color: theme.colors.text}]}>
                {payload.gasLimit.toString()}
              </Text>
            </View>
            <Text style={[styles.highlightText, {color: theme.colors.title}]}>
              <Trans>signEVM.data</Trans>
            </Text>
            <Text
              style={[
                styles.dataText,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                },
              ]}>
              {payload.data}
            </Text>
            {decodedData !== '' ? (
              <>
                <Text
                  style={[styles.highlightText, {color: theme.colors.title}]}>
                  <Trans>signEVM.decodedData</Trans>
                </Text>
                <Text
                  style={[
                    styles.dataText,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                    },
                  ]}>
                  {decodedData}
                </Text>
              </>
            ) : null}
          </View>
        );
      }
      case RequestType.legacyTransaction: {
        const payload = record.legacyTransaction!;
        return (
          <View style={styles.payloadView}>
            <View style={styles.line}>
              <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                Nonce:
              </Text>
              <Text style={[styles.lineText, {color: theme.colors.text}]}>
                {payload.nonce}
              </Text>
            </View>
            <Text style={[styles.highlightText, {color: theme.colors.title}]}>
              <Trans>signEVM.toAddress</Trans>
            </Text>
            <Text style={[styles.addressText, {color: theme.colors.text}]}>
              {payload.to}
            </Text>
            <View style={styles.line}>
              <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                <Trans>signEVM.value</Trans>
              </Text>
              <Text style={[styles.lineText, {color: theme.colors.text}]}>
                {payload.value.toString()}
              </Text>
            </View>
            <View style={styles.line}>
              <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                <Trans>signEVM.gasPrice</Trans>
              </Text>
              <Text style={[styles.lineText, {color: theme.colors.text}]}>
                {payload.gasPrice.toString()}
              </Text>
            </View>
            <View style={styles.line}>
              <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                gasLimit:
              </Text>
              <Text style={[styles.lineText, {color: theme.colors.text}]}>
                {payload.gasLimit.toString()}
              </Text>
            </View>
            <Text style={[styles.highlightText, {color: theme.colors.title}]}>
              <Trans>signEVM.data</Trans>
            </Text>
            <Text
              style={[
                styles.dataText,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                },
              ]}>
              {payload.data}
            </Text>
            {decodedData !== '' ? (
              <>
                <Text
                  style={[styles.highlightText, {color: theme.colors.title}]}>
                  <Trans>signEVM.decodedData</Trans>
                </Text>
                <Text
                  style={[
                    styles.dataText,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                    },
                  ]}>
                  {decodedData}
                </Text>
              </>
            ) : null}
          </View>
        );
      }
      case RequestType.personalMessage: {
        const payload = record.message!;
        return (
          <View style={styles.payloadView}>
            <Text style={[styles.highlightText, {color: theme.colors.title}]}>
              <Trans>signEVM.message</Trans>
            </Text>
            <Text
              style={[
                styles.dataText,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                },
              ]}>
              {payload}
            </Text>
          </View>
        );
      }

      case RequestType.typedData: {
        const payload = record.typedData!;
        let formattedPayload = '';
        try {
          formattedPayload = JSON.stringify(payload, null, 4);
        } catch (error) {
          let errorMessage = (error as Error).message;
          formattedPayload = "Can't parse payload: \n" + errorMessage;
        }

        return (
          <View style={styles.payloadView}>
            <Text style={[styles.highlightText, {color: theme.colors.title}]}>
              <Trans>signEVM.typedData</Trans>
            </Text>
            <Text
              style={[
                styles.dataText,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                },
              ]}>
              {formattedPayload}
            </Text>
          </View>
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.textContainer}>
          <View style={styles.line}>
            <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
              <Trans>find.recordSignAt</Trans>
            </Text>
            <Text style={[styles.lineText, {color: theme.colors.text}]}>
              {DateTime.fromMillis(record.timestamp).toFormat(
                'yyyy-MM-dd HH:mm:ss',
              )}
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
              <Trans>find.recordStatus</Trans>
            </Text>
            <SimpleToggleButton
              titles={txStatusTitleList}
              defaultSelectedIndex={defaultSelectedIndex}
              onChange={changeStatus}
              theme={theme}
            />
          </View>
          <View style={styles.line}>
            <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
              <Trans>signEVM.type</Trans>
            </Text>
            <Text style={[styles.lineText, {color: theme.colors.text}]}>
              {type}
            </Text>
          </View>
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            <Trans>signEVM.fromAddress</Trans>
          </Text>
          <Text style={[styles.addressText, {color: theme.colors.text}]}>
            {fromAddress}
          </Text>

          {record.type === RequestType.transaction ||
          record.type === RequestType.legacyTransaction ? (
            <View style={styles.line}>
              <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                Chain ID:
              </Text>
              <Text style={[styles.lineText, {color: theme.colors.text}]}>
                {record.chainID}
              </Text>
            </View>
          ) : null}
          <View style={styles.line} />
          {payloadView()}

          <Button
            title={t('find.deleteRecord')}
            color={theme.colors.error}
            onPress={onDelete}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  qrCodeContainer: {
    padding: 20,
    aspectRatio: 1,
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payloadView: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
    // flex: 2,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  normalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  addressText: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'right',
    width: '100%',
  },
  dataText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    width: '98%',
    padding: 5,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  highlightText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'left',
    width: '100%',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  button: {
    height: 44,
    width: '88%',
    marginTop: 25,
    marginBottom: 25,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  buttonText: {
    fontSize: 17,
  },
  line: {
    height: 36,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'left',
  },
  lineText: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'left',
  },
});

export default EVMSignRecordScreen;
