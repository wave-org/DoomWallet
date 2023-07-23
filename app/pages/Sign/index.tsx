import React, {useEffect} from 'react';
// import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {
  SafeAreaView,
  Text,
  View,
  Button,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Routes from '../../routes/Routes';
import * as wallet from '../../wallet';
import QRCode from 'react-native-qrcode-svg';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const SignPage = ({route}) => {
  const {ur} = route.params;
  const request = wallet.parseRequest(ur);
  // const [urText, setUrText] = React.useState<string>('');
  const [signedUrText, setSignedUrText] = React.useState<string>('');
  const {width} = useWindowDimensions();
  // const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View>
        <Text>Request :</Text>
        <Text>{JSON.stringify(request.payload)}</Text>
        <Text>Result :</Text>
        {signedUrText !== '' ? (
          <View
            style={[
              styles.qrCodeContainer,
              {
                width: width - 40,
              },
            ]}>
            <QRCode size={width - 40} value={signedUrText} />
          </View>
        ) : (
          <Button
            title="Sign"
            onPress={() => {
              const signedUr = wallet.signRequest(request);
              setSignedUrText(signedUr);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  qrCodeContainer: {
    margin: 20,
    aspectRatio: 1,
    // height: 100%,
  },
});

export default SignPage;
