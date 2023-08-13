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

const typeText = (type: RequestType) => {
  switch (type) {
    case RequestType.transaction:
      return 'Transaction';
    case RequestType.personalMessage:
      return 'Message';
    case RequestType.typedData:
      return 'Typed Data';
    default:
      return 'Unknown';
  }
};

const EVMSignPage = ({route}: {route: any}) => {
  const ur = route.params.ur as UR;
  const scrollViewRef = React.useRef<ScrollView>(null);
  // if the address or type is wrong.
  const [wrongUr, setWrongUr] = React.useState<boolean>(false);
  const [request, setRequest] = React.useState<SignRequest | undefined | null>(
    undefined,
  );
  React.useEffect(() => {
    try {
      const req = wallet.parseEVMRequest(ur);
      if (
        !wallet.checkEVMAddressCanBeDerived(req.address, req.derivationPath)
      ) {
        setWrongUr(true);
        // console.log('address can not be derived');
        Toast.show({
          type: 'error',
          text1: 'Invalid UR',
          text2:
            'Address can not be derived : The address is not in the wallet',
        });
      }
      setRequest(req);
    } catch (error) {
      let errorMessage = (error as Error).message;
      Toast.show({
        type: 'error',
        text1: 'Invalid UR',
        text2: errorMessage,
      });
      setWrongUr(true);
      setRequest(null);
      // console.log(error);
    }
  }, [ur]);

  const [signedUrText, setSignedUrText] = React.useState<string>('');
  const {width} = useWindowDimensions();

  if (request === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (request === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          Invalid UR, Please check the QR code
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
                <Text style={styles.lineLabel}>Nonce:</Text>
                <Text style={styles.lineText}>{payload.nonce}</Text>
              </View>
              <Text style={styles.highlightText}>To:</Text>
              <Text style={styles.addressText}>{payload.to}</Text>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>Value:</Text>
                <Text style={styles.lineText}>{payload.value.toString()}</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>maxFeePerGas:</Text>
                <Text style={styles.lineText}>
                  {payload.maxFeePerGas.toString()}
                </Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>maxPriorityFeePerGas:</Text>
                <Text style={styles.lineText}>
                  {payload.maxPriorityFeePerGas.toString()}
                </Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>gasLimit:</Text>
                <Text style={styles.lineText}>
                  {payload.gasLimit.toString()}
                </Text>
              </View>
              <Text style={styles.highlightText}>Data:</Text>
              <Text style={styles.dataText}>{payload.data}</Text>
            </View>
          );
        } else if (request instanceof TransactionSignRequest) {
          const payload = request.payload;
          return (
            <View style={styles.payloadView}>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>Nonce:</Text>
                <Text style={styles.lineText}>{payload.nonce}</Text>
              </View>
              <Text style={styles.highlightText}>To:</Text>
              <Text style={styles.addressText}>{payload.to}</Text>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>Value:</Text>
                <Text style={styles.lineText}>{payload.value.toString()}</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>gasPrice:</Text>
                <Text style={styles.lineText}>
                  {payload.gasPrice.toString()}
                </Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>gasLimit:</Text>
                <Text style={styles.lineText}>
                  {payload.gasLimit.toString()}
                </Text>
              </View>
              <Text style={styles.highlightText}>Data:</Text>
              <Text style={styles.dataText}>{payload.data}</Text>
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
            <Text style={styles.highlightText}>Message:</Text>
            <Text style={styles.dataText}>{payload}</Text>
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
            <Text style={styles.highlightText}>Message:</Text>
            <Text style={styles.dataText}>{formattedPayload}</Text>
          </View>
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.textContainer}>
        {wrongUr ? (
          <Text style={styles.highlightText}>Invalid UR, Can't Sign!</Text>
        ) : null}
        <View style={styles.line}>
          <Text style={styles.lineLabel}>Type:</Text>
          <Text style={styles.lineText}>{typeText(request.type)}</Text>
        </View>
        <Text style={styles.highlightText}>Address:</Text>
        <Text style={styles.addressText}>{request.address}</Text>
        {request.type === RequestType.transaction ? (
          <View style={styles.line}>
            <Text style={styles.lineLabel}>Chain ID:</Text>
            <Text style={styles.lineText}>{request.chainID}</Text>
          </View>
        ) : null}
        <View style={styles.line} />
        {payloadView()}
        {signedUrText === '' && !wrongUr ? (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.button}
            onPress={sign}>
            <Text style={styles.buttonText}>SIGN</Text>
          </TouchableOpacity>
        ) : null}

        {!wrongUr && signedUrText !== '' ? (
          <Text style={styles.highlightText}>Result :</Text>
        ) : null}

        {signedUrText !== '' && !wrongUr ? (
          <View
            style={[
              styles.qrCodeContainer,
              {
                width: width - 40,
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
    backgroundColor: 'lightgray',
    padding: 5,
    borderWidth: 1,
    borderColor: 'lightslategrey',
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
