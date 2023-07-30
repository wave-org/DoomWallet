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
import {URRegistryDecoder} from '@doomjs/keystonehq-ur-decoder';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const QRScannerPage = ({route}: {route: any}) => {
  const {onSuccess} = route.params;
  const [progress, setProgress] = React.useState(0);

  const navigation = useNavigation();

  const decoder = React.useRef(new URRegistryDecoder());

  const onScanSuccess = React.useCallback(
    (e: BarCodeReadEvent) => {
      const _decoder = decoder.current;
      if (!_decoder.isComplete()) {
        _decoder.receivePart(e.data);
        if (_decoder.isComplete()) {
          if (_decoder.isSuccess()) {
            navigation.goBack();
            onSuccess(_decoder.resultUR());
          } else {
            Toast.show({
              type: 'error',
              text1: 'Scan failed, please try again',
            });
            navigation.goBack();
          }
        } else {
          let _progress =
            Math.round(_decoder.estimatedPercentComplete() * 100) / 100;
          setProgress(_progress);
        }
      }
    },
    [navigation, onSuccess],
  );

  const close = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onScanSuccess}
        reactivate={true}
        vibrate={false}
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
            {progress !== 0 ? (
              <View style={styles.progressBarBackground}>
                <View
                  style={[styles.progressBar, {width: `${progress * 100}%`}]}
                />
              </View>
            ) : null}
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
  progressBarBackground: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 70,
    width: '100%',
    left: 0,
    height: 4,
  },
  progressBar: {
    backgroundColor: 'deepskyblue',
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
