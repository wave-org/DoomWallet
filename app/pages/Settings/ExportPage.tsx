import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MnemonicView from '../../components/MnemonicView';
import {useTheme} from '../../util/theme';
import {Trans} from 'react-i18next';
import * as wallet from '../../wallet';
import Routes from '../../routes/Routes';
// @ts-ignore
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';

const ExportPage = ({navigation}: {navigation: any}) => {
  const {mnemonic, password, usingUnlockPassword} =
    wallet.getWalletSecuritySetting();

  const theme = useTheme();

  const jumpToExportedByQRCode = () => {
    navigation.navigate(Routes.TABS.ExportWalletByQRCode);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 10,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            margin: 10,
            paddingLeft: 10,
            textAlign: 'left',
            width: '100%',
            color: theme.colors.title,
          }}>
          <Trans>setPassword.mnemonic</Trans>
        </Text>
        <MnemonicView mnemonic={mnemonic.split(' ')} theme={theme} />

        {usingUnlockPassword !== true && password && password.length > 0 && (
          <View
            style={{
              height: 44,
              width: '100%',
              paddingRight: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                margin: 10,
                textAlign: 'left',
                color: theme.colors.title,
              }}>
              <Trans>setup.password</Trans>
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 10,
                textAlign: 'left',
                color: theme.colors.text,
              }}>
              {password}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.section,
            {backgroundColor: theme.colors.surface, marginTop: 15},
          ]}>
          <TouchableOpacity
            style={styles.cell}
            onPress={jumpToExportedByQRCode}>
            <MCIcon name="qrcode" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>export.byQRCode</Trans>
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

export default ExportPage;
