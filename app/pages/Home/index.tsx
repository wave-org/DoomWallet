import React from 'react';
import {SafeAreaView, Text, View, StyleSheet} from 'react-native';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {useTheme} from '../../util/theme';

const HomePage = () => {
  const [networkState, setNetworkState] = React.useState<NetInfoState | null>(
    null,
  );
  React.useEffect(() => {
    NetInfo.addEventListener(state => {
      setNetworkState(state);
    });
  }, []);
  const theme = useTheme();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.normalText, {color: theme.colors.text}]}>
            {' '}
            Using this wallet in a offline device will be much safer!{' '}
          </Text>
          <View style={styles.line}>
            <Text style={[styles.lineLabel, {color: theme.colors.title}]}>
              Network state:
            </Text>
            <Text style={[styles.lineText, {color: theme.colors.text}]}>
              {networkState?.isConnected ? 'Connected' : 'Not connected'}
            </Text>
          </View>
        </View>
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
