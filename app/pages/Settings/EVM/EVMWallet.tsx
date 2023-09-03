import React, {useEffect} from 'react';
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
import {useIsFocused} from '@react-navigation/native';

const EVMWalletPage = ({navigation}: {navigation: any}) => {
  const [derivationPath, setDerivationPath] = React.useState<string>('');
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setDerivationPath(wallet.getDerivationPathForEVMWallet());
    }
  }, [isFocused]);
  const changeDerivationPath = () => {
    navigation.navigate(Routes.TABS.EVMDerivation);
  };

  const jumpToAddressList = () => {
    navigation.navigate(Routes.TABS.ADDRESS_LIST);
  };
  const jumpToConnectionQR = () => {
    navigation.navigate(Routes.TABS.CONNECTION, {
      walletType: wallet.WalletType.EVM,
    });
  };

  const jumpToBip32 = () => {
    Linking.openURL(
      'https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki',
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
            <Trans>EVM.title</Trans>
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
            <Trans>EVM.HDWallet</Trans>
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingLeft: 25,
              paddingRight: 0,
              height: 32,
            }}>
            <Text style={[styles.label, {color: theme.colors.text}]}>
              <Trans>EVM.derivationPath</Trans>
            </Text>
            <View
              style={{
                flex: 1,
                height: '100%',
                paddingLeft: 20,
                paddingRight: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={{
                  color: theme.colors.text,
                  textAlign: 'right',
                  width: '100%',
                  textAlignVertical: 'center',
                }}>
                {derivationPath}
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: theme.colors.placeholder,
              fontSize: 13,
              width: '100%',
              paddingLeft: 25,
              paddingRight: 10,
              textAlign: 'left',
            }}>
            <Trans>EVM.captionAboutDerivationPath</Trans>
            {derivationPath.replaceAll('*', '0')}
          </Text>
        </View>
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
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
          <TouchableOpacity style={styles.cell} onPress={jumpToAddressList}>
            <MCIcon name="ethereum" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>EVM.accountList</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cell} onPress={changeDerivationPath}>
            <MCIcon name="graph" size={25} color={theme.colors.secondary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.secondary}]}>
                <Trans>EVM.changePath</Trans>
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
export default EVMWalletPage;
