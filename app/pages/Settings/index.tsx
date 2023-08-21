import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {useTranslation, Trans} from 'react-i18next';

import * as wallet from '../../wallet';
import Routes from '../../routes/Routes';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
// @ts-ignore
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  // getApplicationName,
  getBuildNumber,
  getVersion,
} from 'react-native-device-info';
import {useTheme} from '../../util/theme';

const AccountPage = ({navigation}: {navigation: any}) => {
  const [version, setVersion] = React.useState('');
  const {t} = useTranslation();
  const reset = () => {
    Alert.alert(t('account.alertTitle'), t('account.alertMessage'), [
      {
        text: t('account.alertCancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('account.alertConfirm'),
        style: 'destructive',
        onPress: () => {
          wallet.resetWallet();
          navigation.replace(Routes.ROOT.SETUP);
        },
      },
    ]);
  };

  const jumpToConnectionQR = () => {
    navigation.navigate(Routes.TABS.CONNECTION);
  };

  const jumpToAddressList = () => {
    navigation.navigate(Routes.TABS.ADDRESS_LIST);
  };

  const jumpToBTCAddressList = () => {
    navigation.navigate(Routes.TABS.BTC_ADDRESS_LIST);
  };

  const jumpToSecuritySetting = () => {
    navigation.navigate(Routes.ROOT.SECURITY_SETTING);
  };

  const jumpToAutoLock = () => {
    navigation.navigate(Routes.TABS.AUTOLOCK);
  };

  const jumpToLanuage = () => {
    navigation.navigate(Routes.TABS.LANGUAGE);
  };

  const jumpToDarkMode = () => {
    navigation.navigate(Routes.TABS.DARKMODE);
  };

  const jumpToGithub = () => {
    Linking.openURL('https://github.com/wave-org/DoomWallet');
  };

  const jumpToIssues = () => {
    Linking.openURL('https://github.com/wave-org/DoomWallet/issues');
  };

  const jumpToDocuments = () => {
    Linking.openURL(
      'https://github.com/wave-org/DoomWallet#how-to-use-doom-wallet',
    );
  };

  const jumpToPrivacyPolicy = () => {
    Linking.openURL('https://prosurfer.net/privacy-policy.html');
  };

  useEffect(() => {
    async function loadVersion() {
      const ver = await getVersion();
      const buildNumber = await getBuildNumber();
      setVersion(`${ver}(${buildNumber})`);
    }
    loadVersion();
  }, []);

  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionHeader, {color: theme.colors.title}]}>
            <Trans>account.account</Trans>
          </Text>
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
                <Trans>account.evmAddress</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cell} onPress={jumpToBTCAddressList}>
            <MCIcon name="bitcoin" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>account.btcAddress</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cell} onPress={reset}>
            <Icon name="ban" size={25} color={theme.colors.error} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.error}]}>
                <Trans>account.reset</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionHeader, {color: theme.colors.title}]}>
            <Trans>account.setting</Trans>
          </Text>
          <TouchableOpacity style={styles.cell} onPress={jumpToSecuritySetting}>
            <MCIcon name="security" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>account.security</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cell} onPress={jumpToAutoLock}>
            <Icon name="timer-outline" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>account.autoLock</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cell} onPress={jumpToLanuage}>
            <Icon name="language" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>account.language</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cell} onPress={jumpToDarkMode}>
            <Icon name="contrast" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>account.darkMode</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.section, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.sectionHeader, {color: theme.colors.title}]}>
            <Trans>account.about</Trans>
          </Text>
          <View style={styles.cell}>
            <Icon name="build-outline" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>account.version</Trans>
              </Text>
              <Text style={[styles.text, {color: theme.colors.title}]}>
                {version}
              </Text>
            </View>
          </View>
          {/*
            // TODO add rate link for ios and android
          <TouchableOpacity style={styles.cell}>
            <Icon name="thumbs-up-outline" size={25} color="#333333" />
            <View style={styles.line}>
              <Text style={styles.label}>Rate us</Text>
              <Icon name="chevron-forward" size={24} color="#AAAAAA" />
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.cell} onPress={jumpToPrivacyPolicy}>
            <Icon
              name="information-circle-outline"
              size={25}
              color={theme.colors.primary}
            />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>account.privacy</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.cell}>
            <Icon name="document-text-outline" size={25} color="#333333" />
            <View style={styles.line}>
              <Text style={styles.label}>Terms of Service</Text>
              <Icon name="chevron-forward" size={24} color="#AAAAAA" />
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.cell} onPress={jumpToDocuments}>
            <Icon name="book-outline" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>account.documentation</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cell} onPress={jumpToGithub}>
            <Icon name="logo-github" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>account.github</Trans>
              </Text>
              <Icon
                name="chevron-forward"
                size={24}
                color={theme.colors.placeholder}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cell} onPress={jumpToIssues}>
            <Icon name="bug-outline" size={25} color={theme.colors.primary} />
            <View
              style={[styles.line, {borderBottomColor: theme.colors.border}]}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                <Trans>account.issue</Trans>
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
    marginTop: 10,
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
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
export default AccountPage;
