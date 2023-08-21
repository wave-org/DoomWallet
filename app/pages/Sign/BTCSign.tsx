import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as wallet from '../../wallet';
import {BTCSignRequest} from 'doom-wallet-core';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {UR} from '@ngraveio/bc-ur';
import AnimatedQRCode from '../../components/AnimatedQRCode';
import {useTheme} from '../../util/theme';
import {useTranslation, Trans} from 'react-i18next';

const BTCSignPage = ({route}: {route: any}) => {
  const ur = route.params.ur as UR;
  const scrollViewRef = React.useRef<ScrollView>(null);
  // unknown error
  const [wrongUr, setWrongUr] = React.useState<boolean>(false);
  const [notThisWallet, setNotThisWallet] = React.useState<boolean>(false);
  const [request, setRequest] = React.useState<
    BTCSignRequest | undefined | null
  >(undefined);
  const theme = useTheme();
  const {t} = useTranslation();
  React.useEffect(() => {
    try {
      const req = wallet.parseBTCRequest(ur);
      if (!wallet.canSignBTCRequest(req)) {
        setNotThisWallet(true);
        // console.log('address can not be derived');
        Toast.show({
          type: 'error',
          text1: t('signBTC.invalidQR'),
          text2: t('signBTC.noFoundAddressToast'),
          position: 'bottom',
          bottomOffset: 100,
          visibilityTime: 2500,
        });
      }
      setRequest(req);
    } catch (error) {
      let errorMessage = (error as Error).message;
      Toast.show({
        type: 'error',
        text1: t('signBTC.invalidQR'),
        text2: errorMessage,
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2500,
      });
      setWrongUr(true);
      setRequest(null);
      // console.log(error);
    }
  }, [ur, t]);

  const [urList, setUrList] = React.useState<string[]>([]);

  if (request === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (request === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.errorText, {color: theme.colors.error}]}>
          <Trans>signBTC.invalidQRText</Trans>
        </Text>
      </SafeAreaView>
    );
  }

  const sign = () => {
    const signedUr = wallet.signBTCRequest(request);
    setUrList(signedUr);
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({animated: true});
      }
    }, 100);
  };

  const addressesView = () => {
    if (request.unsignedInputAddresses.length === 0) {
      return null;
    } else if (request.unsignedInputAddresses.length === 1) {
      return (
        <>
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            <Trans>signBTC.fromAddress</Trans>
          </Text>
          <Text style={[styles.addressText, {color: theme.colors.text}]}>
            {request.unsignedInputAddresses[0].address}
          </Text>
        </>
      );
    } else {
      const addressesList = request.unsignedInputAddresses.map(
        address => address.address,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <View style={styles.textContainer}>
          {wrongUr ? (
            <Text style={[styles.highlightText, {color: theme.colors.error}]}>
              <Trans>signBTC.invalidQRText</Trans>
            </Text>
          ) : null}
          {notThisWallet ? (
            <Text style={[styles.highlightText, {color: theme.colors.error}]}>
              <Trans>signBTC.noFoundAddressText</Trans>
            </Text>
          ) : null}
          {addressesView()}
          <View style={styles.line}>
            <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
              <Trans>signBTC.fee</Trans>
            </Text>
            <Text style={[styles.lineText, {color: theme.colors.text}]}>
              {request.fee}
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
            {request.inputTx}
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
            {request.outputTx}
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
            {request.inputData}
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
            {request.outputData}
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
            {request.PSBTGlobalMap}
          </Text>
          <View style={styles.line}>
            <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
              <Trans>signBTC.version</Trans>
            </Text>
            <Text style={[styles.lineText, {color: theme.colors.text}]}>
              {request.version}
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
              Locktime:
            </Text>
            <Text style={[styles.lineText, {color: theme.colors.text}]}>
              {request.locktime}
            </Text>
          </View>
          {urList.length === 0 && !wrongUr && !notThisWallet ? (
            <TouchableOpacity
              activeOpacity={0.6}
              style={[
                styles.button,
                {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={sign}>
              <Text style={[styles.buttonText, {color: theme.colors.inverse}]}>
                <Trans>signBTC.sign</Trans>
              </Text>
            </TouchableOpacity>
          ) : null}

          {!wrongUr && urList.length !== 0 && !notThisWallet ? (
            <Text
              style={[
                styles.highlightText,
                {
                  marginTop: 25,
                  marginBottom: 20,
                  color: theme.colors.title,
                },
              ]}>
              <Trans>signBTC.result</Trans>
            </Text>
          ) : null}
        </View>
        {urList.length !== 0 && !wrongUr && !notThisWallet ? (
          <AnimatedQRCode urList={urList} />
        ) : null}
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

export default BTCSignPage;
