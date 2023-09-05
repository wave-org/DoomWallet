import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as wallet from '../../wallet';
import QRCode from 'react-native-qrcode-svg';
import {
  SignRequest,
  RequestType,
  TransactionSignRequest,
  EIP1559TransactionSignRequest,
  MessageSignRequest,
  TypedDataSignRequest,
} from 'doom-wallet-core';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {UR} from '@ngraveio/bc-ur';
import {useTheme} from '../../util/theme';
import {useTranslation, Trans} from 'react-i18next';

const EVMSignPage = ({route}: {route: any}) => {
  const ur = route.params.ur as UR;
  const scrollViewRef = React.useRef<ScrollView>(null);
  // if the address or type is wrong.
  const [wrongUr, setWrongUr] = React.useState<boolean>(false);
  const [request, setRequest] = React.useState<SignRequest | undefined | null>(
    undefined,
  );
  const [fromAddress, setFromAddress] = React.useState<string>('');
  const {t} = useTranslation();
  const typeText = (type: RequestType) => {
    switch (type) {
      case RequestType.transaction:
        return t('signEVM.transactionType.transaction');
      case RequestType.personalMessage:
        return t('signEVM.transactionType.message');
      case RequestType.typedData:
        return t('signEVM.transactionType.typedData');
      default:
        return t('signEVM.transactionType.unknown');
    }
  };
  React.useEffect(() => {
    try {
      const req = wallet.parseEVMRequest(ur);
      const derivedAddress = wallet.getDerivedAddressByPath(req.derivationPath);
      if (req.address === undefined) {
        setFromAddress(derivedAddress);
      } else if (derivedAddress !== req.address) {
        setWrongUr(true);
        // console.log('address can not be derived');
        Toast.show({
          type: 'error',
          text1: t('signEVM.invalidQR'),
          text2: t('signEVM.noFoundAddressToast'),
          position: 'bottom',
          bottomOffset: 100,
          visibilityTime: 2500,
        });
        setFromAddress(req.address);
      } else {
        setFromAddress(req.address);
      }
      setRequest(req);
    } catch (error) {
      let errorMessage = (error as Error).message;
      Toast.show({
        type: 'error',
        text1: t('signEVM.invalidQR'),
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
  const theme = useTheme();
  const [signedUrText, setSignedUrText] = React.useState<string>('');
  const {width} = useWindowDimensions();

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
          <Trans>signEVM.invalidQRText</Trans>
        </Text>
      </SafeAreaView>
    );
  }

  const sign = () => {
    const signedUr = wallet.signEVMRequest(request);
    setSignedUrText(signedUr);
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({animated: true});
      }
    }, 100);
  };

  const payloadView = () => {
    switch (request.type) {
      case RequestType.transaction:
        if (request instanceof EIP1559TransactionSignRequest) {
          // eth transaction
          const payload = request.payload;
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
            </View>
          );
        } else if (request instanceof TransactionSignRequest) {
          const payload = request.payload;
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
            </View>
          );
        } else {
          // never
          return null;
        }
      case RequestType.personalMessage: {
        const payload = (request as MessageSignRequest).payload;
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
        const payload = (request as TypedDataSignRequest).payload;
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
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <View style={styles.textContainer}>
          {wrongUr ? (
            <Text style={[styles.highlightText, {color: theme.colors.error}]}>
              <Trans>signEVM.invalidQRText</Trans>
            </Text>
          ) : null}
          <View style={styles.line}>
            <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
              <Trans>signEVM.type</Trans>
            </Text>
            <Text style={[styles.lineText, {color: theme.colors.text}]}>
              {typeText(request.type)}
            </Text>
          </View>
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            <Trans>signEVM.fromAddress</Trans>
          </Text>
          <Text style={[styles.addressText, {color: theme.colors.text}]}>
            {fromAddress}
          </Text>
          {request.address === undefined && (
            <Text
              style={{
                marginBottom: 15,
                color: theme.colors.placeholder,
                fontSize: 13,
                width: '100%',
                textAlign: 'left',
              }}>
              <Trans>signEVM.noAddressCaption</Trans>
            </Text>
          )}
          {request.type === RequestType.transaction ? (
            <View style={styles.line}>
              <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
                Chain ID:
              </Text>
              <Text style={[styles.lineText, {color: theme.colors.text}]}>
                {request.chainID}
              </Text>
            </View>
          ) : null}
          <View style={styles.line} />
          {payloadView()}
          {signedUrText === '' && !wrongUr ? (
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
                <Trans>signEVM.sign</Trans>
              </Text>
            </TouchableOpacity>
          ) : null}

          {!wrongUr && signedUrText !== '' ? (
            <Text style={[styles.highlightText, {color: theme.colors.title}]}>
              <Trans>signEVM.result</Trans>
            </Text>
          ) : null}
        </View>
        {signedUrText !== '' && !wrongUr ? (
          <View
            style={[
              styles.qrCodeContainer,
              {
                backgroundColor: '#DFE0E2',
              },
            ]}>
            <QRCode size={width - 40} value={signedUrText} />
          </View>
        ) : null}
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

export default EVMSignPage;
