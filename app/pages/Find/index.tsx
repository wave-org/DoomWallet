import React, {useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {SafeAreaView, Text, View, Button} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Routes from '../../routes/Routes';

function QRCodeButton({
  cameraPermission,
  onPress,
}: {
  cameraPermission: string;
  onPress: () => void;
}) {
  if (cameraPermission === RESULTS.GRANTED) {
    return <Button title="Scan QR Code" onPress={onPress} />;
  } else if (cameraPermission === RESULTS.DENIED) {
    return (
      <Button
        title="Grant Camera Permission And Scan QR Code"
        onPress={onPress}
      />
    );
  } else {
    return <Text>Camera permission not granted</Text>;
  }
}

const FindPage = () => {
  const [urText, setUrText] = React.useState<string>('');
  const [cameraPermission, setCameraPermission] =
    React.useState('not-determined');
  useEffect(() => {
    async function fetchPermission() {
      // TODO android
      const permission = await check(PERMISSIONS.IOS.CAMERA);
      setCameraPermission(permission);
    }

    fetchPermission();
  }, []);
  const navigation = useNavigation();
  // const cameraPermission = await Camera.getCameraPermissionStatus()
  // const newCameraPermission = await Camera.requestCameraPermission()

  const onSuccess = (ur: string) => {
    // setUrText(ur);
    navigation.navigate(Routes.TABS.SIGN, {ur});
  };

  const showResult = () => {
    if (urText !== '') {
      return <Text>{urText}</Text>;
    } else {
      return null;
    }
  };

  return (
    // <NavigationContainer>
    <SafeAreaView>
      <View>
        <Text>QR Code</Text>
        {showResult()}
        <QRCodeButton
          cameraPermission={cameraPermission}
          onPress={() => {
            if (cameraPermission === 'authorized') {
              // Navigate to QR Scanner
              setUrText('');
              navigation.navigate(Routes.TABS.QR_SCANNER, {onSuccess});
            } else {
              request(PERMISSIONS.IOS.CAMERA).then(permission => {
                setCameraPermission(permission);
                navigation.navigate(Routes.TABS.QR_SCANNER, {onSuccess});
              });
            }
          }}
        />
      </View>
    </SafeAreaView>
    // </NavigationContainer>
  );
};

export default FindPage;
