import React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {SafeAreaView, Text, View} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera, BarCodeReadEvent} from 'react-native-camera';

const QRScannerPage = ({route}) => {
  const {onSuccess} = route.params;
  // const devices = useCameraDevices();
  // const device = devices.back!;

  // const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
  //   checkInverted: true,
  // });

  // React.useEffect(() => {
  //   console.log(barcodes);
  // }, [barcodes]);
  const navigation = useNavigation();
  // React.useEffect(() => {
  //   navigation.setOptions({
  //     tabBarStyle: {display: 'none'},
  //   });
  // }, [navigation]);

  const onScanSuccess = (e: BarCodeReadEvent) => {
    navigation.goBack();
    console.log(e.data);
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

// import {useCameraDevices} from 'react-native-vision-camera';
// import {Camera} from 'react-native-vision-camera';
// import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

// const QRScannerPage = () => {
//   const devices = useCameraDevices();
//   const device = devices.back!;

//   const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
//     checkInverted: true,
//   });

//   React.useEffect(() => {
//     console.log(barcodes);
//   }, [barcodes]);

//   return (
//     // <NavigationContainer>
//     <SafeAreaView>
//       <View>
//         <Camera
//           style={StyleSheet.absoluteFill}
//           device={device}
//           isActive={true}
//           frameProcessor={frameProcessor}
//           frameProcessorFps={5}
//         />
//         {barcodes.map((barcode, idx) => (
//           <Text key={idx} style={styles.barcodeTextURL}>
//             {barcode.displayValue}
//           </Text>
//         ))}
//       </View>
//     </SafeAreaView>
//     // </NavigationContainer>
//   );
// };
// const styles = StyleSheet.create({
//   barcodeTextURL: {
//     fontSize: 20,
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

export default QRScannerPage;
