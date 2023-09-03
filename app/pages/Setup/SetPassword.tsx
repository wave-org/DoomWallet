import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import Routes from '../../routes/Routes';
import MnemonicView from '../../components/MnemonicView';
import {zxcvbn, zxcvbnOptions} from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import {useTheme} from '../../util/theme';
import {useTranslation, Trans} from 'react-i18next';

const SetPasswordPage = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {mnemonic, setupComplete, usingUnlockPassword} = route.params;
  const [password, setPassword] = React.useState<string>('');
  const [editingPassword, setEditingPassword] = React.useState<boolean>(false);

  const goSecurityPage = () => {
    navigation.navigate(Routes.ROOT.SECURITY_SETTING, {
      mnemonic,
      password,
      setupComplete,
      usingUnlockPassword: usingUnlockPassword === true,
    });
  };

  const options = {
    translations: zxcvbnEnPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
  };

  zxcvbnOptions.setOptions(options);

  const {t} = useTranslation();
  const {height} = Dimensions.get('window');
  const passwordStrengthByScore = {
    0: t('setPassword.passwordStrengthByScore.0'),
    1: t('setPassword.passwordStrengthByScore.1'),
    2: t('setPassword.passwordStrengthByScore.2'),
    3: t('setPassword.passwordStrengthByScore.3'),
    4: t('setPassword.passwordStrengthByScore.4'),
  };

  const passwordStrength = () => {
    const {score} = zxcvbn(password);
    return passwordStrengthByScore[score];
  };

  const buttonDisabled = () => {
    return password.length < 8;
  };

  const theme = useTheme();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
        }}
        contentContainerStyle={{
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 20,
            minHeight: height - 220,
          }}>
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            <Trans>setPassword.mnemonic</Trans>
          </Text>
          <MnemonicView mnemonic={mnemonic.split(' ')} theme={theme} />
          <Text style={[styles.highlightText, {color: theme.colors.title}]}>
            {usingUnlockPassword === true ? (
              <Trans>setPassword.unlockPassword</Trans>
            ) : (
              <Trans>setPassword.password</Trans>
            )}
          </Text>
          <View
            style={{
              width: '100%',
              paddingHorizontal: 15,
              marginVertical: 10,
            }}>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: editingPassword
                    ? theme.colors.primary
                    : theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              placeholder={t('setPassword.placeholder')}
              placeholderTextColor={theme.colors.placeholder}
              onChangeText={newText => setPassword(newText)}
              defaultValue={password}
              autoComplete="off"
              autoCorrect={false}
              returnKeyType="done"
              maxLength={32}
              // inputMode="search"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              onFocus={() => {
                setEditingPassword(true);
              }}
              onBlur={() => {
                setEditingPassword(false);
              }}
              inputMode="text"
            />
          </View>

          <Text
            style={[
              styles.normalText,
              {color: theme.colors.text, marginTop: 10},
            ]}>
            {usingUnlockPassword === true ? (
              <Trans>setPassword.unlockCaption</Trans>
            ) : (
              <Trans>setPassword.caption</Trans>
            )}
          </Text>
          {password.length >= 8 ? (
            <View style={styles.passwordStrengthContainer}>
              <Text style={[styles.highlightText, {color: theme.colors.title}]}>
                <Trans>setPassword.passwordStrengthLabel</Trans>
              </Text>
              <Text style={[styles.normalText, {color: theme.colors.text}]}>
                {passwordStrength()}
              </Text>
            </View>
          ) : null}
        </View>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 20,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 25,
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            disabled={buttonDisabled()}
            style={[
              styles.button,
              {
                backgroundColor: theme.colors.primary,
                opacity: buttonDisabled() ? 0.5 : 1,
              },
            ]}
            onPress={goSecurityPage}>
            <Text style={[styles.buttonText, {color: theme.colors.inverse}]}>
              <Trans>setPassword.securityButton</Trans>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  passwordStrengthContainer: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  normalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  passwordStrengthText: {
    fontSize: 16,
    marginTop: 24,
    textAlign: 'left',
    width: '100%',
  },
  highlightText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  textInput: {
    height: 50,
    width: '100%',
    borderWidth: 1.5,
    padding: 10,
    fontSize: 18,
    borderRadius: 4,
  },

  button: {
    height: 44,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  buttonText: {
    fontSize: 17,
  },
});

export default SetPasswordPage;
