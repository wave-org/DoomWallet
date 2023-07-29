import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera, BarCodeReadEvent} from 'react-native-camera';

// TODO support animated QR code
const QRScannerPage = ({route}: {route: any}) => {
  const {onSuccess} = route.params;

  const navigation = useNavigation();

  const onScanSuccess = (e: BarCodeReadEvent) => {
    navigation.goBack();
    onSuccess(e.data);
  };

  const close = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onScanSuccess}
        flashMode={RNCamera.Constants.FlashMode.off}
        cameraStyle={styles.container}
      />
      <View style={styles.float}>
        <SafeAreaView>
          <View style={styles.closeContainer}>
            <TouchableWithoutFeedback
              onPress={close}
              style={styles.closeButton}>
              <Image
                style={styles.closeImage}
                source={require('../../images/close.png')}
              />
            </TouchableWithoutFeedback>
            <View style={styles.markView} />
          </View>
        </SafeAreaView>
      </View>
    </View>
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
  float: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  closeContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 60,
    height: 60,
  },
  closeImage: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    tintColor: 'white',
  },
  markView: {
    position: 'absolute',
    width: '80%',
    top: '25%',
    left: '10%',
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 5,
    aspectRatio: 1,
  },
  normalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  textContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
});

export default QRScannerPage;
