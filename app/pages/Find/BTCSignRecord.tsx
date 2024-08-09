import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import {useTheme} from '../../util/theme';
import {Trans, useTranslation} from 'react-i18next';
import {
  BTCSignRecord,
  changeRecordStatus,
  deleteRecord,
  TransactionStatus,
} from '../../wallet/signRecord';
import SimpleToggleButton from '../../components/SimpleToggleButton';
import {DateTime} from 'luxon';

const BTCSignRecordScreen = ({
  route,
  navigation,
}: {
  navigation: any;
  route: any;
}) => {
  const record = route.params.record as BTCSignRecord;
  const theme = useTheme();

  const addressesView = () => {
    const unsignedInputAddresses =
      record.unsignedInputAddresses.length > 0
        ? JSON.parse(record.unsignedInputAddresses)
        : [];
    if (unsignedInputAddresses.length === 0) {
      return null;
    } else if (unsignedInputAddresses.length === 1) {
      return (
        <>
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            <Trans>signBTC.fromAddress</Trans>
          </Text>
          <Text style={[styles.addressText, {color: theme.colors.text}]}>
            {unsignedInputAddresses[0].address}
          </Text>
        </>
      );
    } else {
      const addressesList = unsignedInputAddresses.map(
        (address: {address: any}) => address.address,
      );
      return (
        <>
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            <Trans>signBTC.unsignedInputAddresses</Trans>
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
            {JSON.stringify(addressesList, null, 4)}
          </Text>
        </>
      );
    }
  };

  const {t} = useTranslation();
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
          {addressesView()}
          <View style={styles.line}>
            <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
              <Trans>signBTC.fee</Trans>
            </Text>
            <Text style={[styles.lineText, {color: theme.colors.text}]}>
              {record.fee}
            </Text>
          </View>
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            Input Tx:
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
            {record.inputTx}
          </Text>
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            Output Tx:
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
            {record.outputTx}
          </Text>
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            Input Data:
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
            {record.inputData}
          </Text>
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            Output Data:
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
            {record.outputData}
          </Text>
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            Global Map:
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
            {record.PSBTGlobalMap}
          </Text>
          <View style={styles.line}>
            <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
              <Trans>signBTC.version</Trans>
            </Text>
            <Text style={[styles.lineText, {color: theme.colors.text}]}>
              {record.version}
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
              Locktime:
            </Text>
            <Text style={[styles.lineText, {color: theme.colors.text}]}>
              {record.locktime}
            </Text>
          </View>

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
    margin: 20,
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

export default BTCSignRecordScreen;
