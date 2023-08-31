import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {Trans} from 'react-i18next';

import * as wallet from '../../../wallet';
import Routes from '../../../routes/Routes';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
// @ts-ignore
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTheme} from '../../../util/theme';

const BTCWalletPage = ({navigation}: {navigation: any}) => {
  const jumpToAddressList = () => {
    navigation.navigate(Routes.TABS.BTC_ADDRESS_LIST);
  };
  const jumpToConnectionQR = () => {
    navigation.navigate(Routes.TABS.CONNECTION, {
      walletType: wallet.WalletType.BTC,
    });
  };

  const jumpToBip32 = () => {
    Linking.openURL(
      'https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki',
    );
  };

  const jumpToBip44 = () => {
    Linking.openURL(
      'https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki',
    );
  };

  const jumpToSegWit = () => {
    Linking.openURL(
      'https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki',
    );
  };

  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionHeader, {color: theme.colors.title}]}>
            <Trans>BTC.title</Trans>
          </Text>

          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 17,
              width: '100%',
              paddingLeft: 25,
              textAlign: 'left',
            }}
            onPress={jumpToBip32}>
            <Trans>BTC.HDWallet</Trans>
          </Text>
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 17,
              width: '100%',
              paddingLeft: 25,
              textAlign: 'left',
            }}
            onPress={jumpToBip44}>
            <Trans>BIP44</Trans>
          </Text>
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 17,
              width: '100%',
              paddingLeft: 25,
              textAlign: 'left',
            }}
            onPress={jumpToSegWit}>
            <Trans>BTC.segwit</Trans>
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: 25,
              height: 32,
            }}>
            <Text style={[styles.label, {color: theme.colors.text}]}>
              <Trans>EVM.derivationPath</Trans>
            </Text>
            <Text style={[styles.text, {color: theme.colors.text}]}>
              m/84'/0'/0'/0/0
            </Text>
          </View>
          <Text
            style={{
              color: theme.colors.placeholder,
              fontSize: 13,
              width: '100%',
              paddingLeft: 25,
              textAlign: 'left',
            }}>
            <Trans>BTC.captionAboutDerivationPath</Trans>
          </Text>
        </View>
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <TouchableOpacity style={styles.cell} onPress={jumpToAddressList}>
            <MCIcon name="bitcoin" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>BTC.addressList</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cell} onPress={jumpToConnectionQR}>
            <Icon name="qr-code" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>account.connection</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  section: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    paddingBottom: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 20,
  },
  cell: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    height: 32,
    marginTop: 10,
  },
  line: {
    flex: 1,
    marginLeft: 10,
    borderBottomWidth: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 17,
  },
  text: {
    fontSize: 17,
    marginRight: 16,
  },
});
export default BTCWalletPage;
