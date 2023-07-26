import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView, Text, View, Button, StyleSheet} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {BannerAd, TestIds} from 'react-native-google-mobile-ads';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

const HomePage = () => {
  const [networkState, setNetworkState] = React.useState<NetInfoState | null>(
    null,
  );
  React.useEffect(() => {
    NetInfo.addEventListener(state => {
      setNetworkState(state);
    });
  }, []);
  return (
    // <NavigationContainer>
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text>Home</Text>
        <Text> Using this wallet in a offline device will be much safer! </Text>
        <Text>
          {' '}
          Network state :{' '}
          {networkState?.isConnected ? 'Connected' : 'Not connected'}
        </Text>
        <Text>
          Here is some annoying ads for you becauase you are not offline:
        </Text>
        <BannerAd
          // style={{width: '100%', height: 400}}
          unitId={TestIds.BANNER}
          // size="600x400"
          // size="INLINE_ADAPTIVE_BANNER"
          size="ANCHORED_ADAPTIVE_BANNER"
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </SafeAreaView>
    // </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    // padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default HomePage;
