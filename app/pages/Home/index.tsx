import React from 'react';
import {SafeAreaView, Text, View, StyleSheet} from 'react-native';
// import {BannerAd, TestIds} from 'react-native-google-mobile-ads';
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
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.normalText}>
            {' '}
            Using this wallet in a offline device will be much safer!{' '}
          </Text>
          <View style={styles.line}>
            <Text style={styles.lineLabel}>Network state:</Text>
            <Text style={styles.lineText}>
              {networkState?.isConnected ? 'Connected' : 'Not connected'}
            </Text>
          </View>
        </View>
        {/* {networkState?.isConnected ? (
          <Text style={styles.adsText}>
            If you have network connection, you can see the ads below:
          </Text>
        ) : null}
        {networkState?.isConnected ? (
          <View style={styles.adContainer}>
            <BannerAd
              unitId={TestIds.BANNER}
              // size="600x400"
              // size="INLINE_ADAPTIVE_BANNER"
              size="ANCHORED_ADAPTIVE_BANNER"
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        ) : null} */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    // padding: 20,
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  normalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  adsText: {
    fontSize: 14,
    margin: 10,
    textAlign: 'left',
  },
  textContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  adContainer: {
    flex: 2,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  line: {
    height: 44,
    width: '100%',
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  lineText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
  },
});
export default HomePage;
