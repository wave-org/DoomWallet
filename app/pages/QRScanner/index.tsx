import React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {SafeAreaView, Text, View} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera, BarCodeReadEvent} from 'react-native-camera';

const QRScannerPage = ({route}) => {
  const {onSuccess} = route.params;

  const navigation = useNavigation();

  const onScanSuccess = (e: BarCodeReadEvent) => {
    navigation.goBack();
    onSuccess(e.data);
  };

  return (
    // <NavigationContainer>
    <SafeAreaView>
      <View>
        <Text>QR Scanner</Text>
        <QRCodeScanner
          onRead={onScanSuccess}
          flashMode={RNCamera.Constants.FlashMode.off}
          topContent={
            <Text>
              Go to <Text>wikipedia.org/wiki/QR_code</Text> on your computer and
              scan the QR code.
            </Text>
          }
          bottomContent={<Text>OK. Got it!</Text>}
        />
      </View>
    </SafeAreaView>
  );
};
export default QRScannerPage;
