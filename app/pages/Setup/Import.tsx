import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import {useTheme} from '../../util/theme';
import {Trans, useTranslation} from 'react-i18next';
import * as wallet from '../../wallet';
import Routes from '../../routes/Routes';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Toast from 'react-native-toast-message';

const mnemonicRegex = /^[a-z]+(\s[a-z]+){11,23}$/;

const ImportWalletPage = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const setupComplete = route.params.setupComplete;
  const [mnemonic, setMnemonic] = React.useState<string>('');
  const [editing, setEditing] = React.useState<boolean>(false);
  const [usePassphrase, toggleUsingPassphrase] = React.useState<boolean>(true);
  const [passphrase, setPassphrase] = React.useState<string>('');
  const [passphraseEditing, setPassphraseEditing] =
    React.useState<boolean>(false);
  const theme = useTheme();
  const {t} = useTranslation();
  const {height} = Dimensions.get('window');

  const [encryptedWEF, setEncryptedWEF] = React.useState<string>('');
  const [unlockPassword, setUnlockPassword] = React.useState<string>('');
  const [unlockPasswordEditing, setUnlockPasswordEditing] =
    React.useState<boolean>(false);
  const [showUnlockError, setShowUnlockError] = React.useState<boolean>(false);
  const [showWordNotInList, setShowWordNotInList] =
    React.useState<boolean>(false);

  const onScanSuccess = (result: string) => {
    if (!wallet.isWalletExportData(result)) {
      Toast.show({
        type: 'error',
        text1: t('import.notWEF'),
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2500,
      });
    } else {
      setEncryptedWEF(result);
    }
  };

  const importByQRCode = async () => {
    const cameraPermission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const permission = await check(cameraPermission);
    console.log('permission', permission);
    if (permission === RESULTS.GRANTED) {
      navigation.navigate(Routes.TABS.QR_SCANNER, {
        onSuccess: onScanSuccess,
        notUR: true,
      });
    } else if (
      permission === RESULTS.BLOCKED ||
      permission === RESULTS.DENIED
    ) {
      request(cameraPermission).then(_permission => {
        if (_permission === RESULTS.GRANTED) {
          navigation.navigate(Routes.TABS.QR_SCANNER, {
            onSuccess: onScanSuccess,
            notUR: true,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: t('tools.noCameraPermission'),
            position: 'bottom',
            bottomOffset: 100,
            visibilityTime: 2500,
          });
        }
      });
    } else {
      Toast.show({
        type: 'error',
        text1: t('tools.noCameraPermission'),
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2500,
      });
    }
  };

  const unlockWEF = () => {
    try {
      const wef = wallet.decryptWalletExportData(encryptedWEF, unlockPassword);
      setMnemonic(wef.mnemonic || '');
      if (wef.password && wef.password.length > 0) {
        toggleUsingPassphrase(true);
        setPassphrase(wef.password);
      } else {
        toggleUsingPassphrase(false);
        setPassphrase('');
      }

      setEncryptedWEF('');
      setUnlockPassword('');
      setShowUnlockError(false);
    } catch (error) {
      setShowUnlockError(true);
    }
  };

  const buttonDisabled = () => {
    return (
      mnemonic.length === 0 ||
      mnemonicRegex.test(mnemonic) === false ||
      (usePassphrase && passphrase.length === 0)
    );
  };

  const showMnemonicWrongText = () => {
    return mnemonic.length > 30 && mnemonicRegex.test(mnemonic) === false;
  };
  const jumpToNext = () => {
    if (wallet.validateMnemonic(mnemonic) === false) {
      setShowWordNotInList(true);
    } else {
      if (!usePassphrase) {
        navigation.navigate(Routes.ROOT.SETPASSWORD, {
          mnemonic,
          setupComplete,
          usingUnlockPassword: true,
        });
      } else {
        navigation.navigate(Routes.ROOT.SECURITY_SETTING, {
          mnemonic,
          password: passphrase!,
          setupComplete,
        });
      }
    }
  };

  if (encryptedWEF.length > 0) {
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
          <View
            style={{
              minHeight: height - 250,
              width: '100%',
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
              <Trans>import.encrypted</Trans>
            </Text>
            <View
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 10,
                  textAlign: 'left',
                  width: '98%',
                  padding: 5,
                  borderWidth: 1,
                  borderRadius: 8,
                  overflow: 'hidden',
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                }}>
                {encryptedWEF}
              </Text>
            </View>
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
              <Trans>import.unlockPassword</Trans>
            </Text>
            <View
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                width: '100%',
              }}>
              <TextInput
                style={{
                  height: 50,
                  width: '100%',
                  alignSelf: 'center',
                  borderWidth: 1.5,
                  padding: 10,
                  fontSize: 18,
                  borderRadius: 4,
                  marginBottom: 5,
                  borderColor: unlockPasswordEditing
                    ? theme.colors.primary
                    : theme.colors.border,
                  color: theme.colors.text,
                }}
                placeholder={t('import.unlockPasswordPlaceholder')}
                placeholderTextColor={theme.colors.placeholder}
                onChangeText={newText => {
                  setUnlockPassword(newText);
                  setShowUnlockError(false);
                }}
                defaultValue={unlockPassword}
                maxLength={32}
                clearButtonMode="while-editing"
                autoComplete="off"
                autoCorrect={false}
                autoCapitalize="none"
                onFocus={() => {
                  setUnlockPasswordEditing(true);
                }}
                onBlur={() => {
                  setUnlockPasswordEditing(false);
                }}
                inputMode="text"
              />
            </View>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                marginTop: 10,
                marginBottom: 10,
                height: 20,
              }}>
              {showUnlockError ? (
                <Text
                  style={{
                    color: theme.colors.error,
                    fontSize: 14,
                    textAlign: 'center',
                  }}>
                  <Trans>import.unlockFailed</Trans>
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              activeOpacity={0.6}
              disabled={unlockPassword.length === 0}
              style={{
                height: 44,
                width: '80%',
                flexDirection: 'column',
                alignSelf: 'center',
                marginBottom: 25,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 22,
                backgroundColor: theme.colors.primary,
                opacity: unlockPassword.length === 0 ? 0.5 : 1,
              }}
              onPress={unlockWEF}>
              <Text style={{fontSize: 17, color: theme.colors.inverse}}>
                <Trans>import.unlock</Trans>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
        <View
          style={{
            minHeight: height - 250,
            width: '100%',
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
          <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              width: '100%',
            }}>
            <TextInput
              style={{
                borderColor: editing
                  ? theme.colors.primary
                  : theme.colors.border,
                color: theme.colors.text,
                height: 160,
                width: '100%',
                borderWidth: 1.5,
                padding: 10,
                fontSize: 18,
                textAlignVertical: 'top',
                borderRadius: 4,
              }}
              placeholder={t('import.mnemonicPlaceholder')}
              placeholderTextColor={theme.colors.placeholder}
              onChangeText={newText => setMnemonic(newText)}
              value={mnemonic}
              autoComplete="off"
              autoCorrect={false}
              returnKeyType="done"
              maxLength={512}
              multiline={true}
              // inputMode="search"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              onFocus={() => {
                setEditing(true);
                setShowWordNotInList(false);
              }}
              onBlur={() => {
                setEditing(false);
              }}
              inputMode="text"
            />
          </View>

          <View
            style={{
              height: 44,
              width: '100%',
              paddingRight: 20,
              marginTop: 10,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                margin: 10,
                paddingLeft: 10,
                textAlign: 'left',
                color: theme.colors.title,
              }}>
              <Trans>import.passphrase</Trans>
            </Text>
            <Switch
              trackColor={{
                false: theme.colors.surface,
                true: theme.colors.primary,
              }}
              thumbColor={
                usePassphrase ? theme.colors.secondary : theme.colors.text
              }
              ios_backgroundColor={theme.colors.border}
              onValueChange={toggleUsingPassphrase}
              value={usePassphrase}
            />
          </View>
          {usePassphrase ? (
            <View
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                width: '100%',
              }}>
              <TextInput
                style={{
                  height: 50,
                  width: '100%',
                  alignSelf: 'center',
                  borderWidth: 1.5,
                  padding: 10,
                  fontSize: 18,
                  borderRadius: 4,
                  marginBottom: 5,
                  borderColor: passphraseEditing
                    ? theme.colors.primary
                    : theme.colors.border,
                  color: theme.colors.text,
                }}
                placeholder={t('import.passphrasePlaceholder')}
                placeholderTextColor={theme.colors.placeholder}
                onChangeText={newText => setPassphrase(newText)}
                defaultValue={passphrase}
                maxLength={16}
                clearButtonMode="while-editing"
                autoComplete="off"
                autoCorrect={false}
                autoCapitalize="none"
                onFocus={() => {
                  setPassphraseEditing(true);
                }}
                onBlur={() => {
                  setPassphraseEditing(false);
                }}
                inputMode="text"
              />
            </View>
          ) : null}
          <Text
            style={{
              marginTop: 20,
              fontSize: 13,
              paddingHorizontal: 15,
              width: '100%',
              textAlign: 'center',
              color: theme.colors.placeholder,
            }}>
            <Trans>import.qrcodeCaption</Trans>
          </Text>
          <TouchableOpacity
            style={{
              height: 44,
              width: '80%',
              flexDirection: 'column',
              alignSelf: 'center',
              marginTop: 15,
              marginBottom: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 22,
              backgroundColor: theme.colors.primary,
            }}
            onPress={importByQRCode}>
            <Text style={{fontSize: 17, color: theme.colors.inverse}}>
              <Trans>import.byQRCode</Trans>
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 35,
            }}>
            {showMnemonicWrongText() ? (
              <Text
                style={{
                  color: theme.colors.error,
                  fontSize: 14,
                  width: '100%',
                  textAlign: 'center',
                }}>
                <Trans>import.mnemonicWrong</Trans>
              </Text>
            ) : null}
            {showWordNotInList ? (
              <Text
                numberOfLines={2}
                style={{
                  color: theme.colors.error,
                  fontSize: 14,
                  width: '100%',
                  textAlign: 'center',
                }}>
                <Trans>import.wordNotInList</Trans>
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            disabled={buttonDisabled()}
            style={{
              height: 44,
              width: '80%',
              flexDirection: 'column',
              alignSelf: 'center',
              marginBottom: 25,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 22,
              backgroundColor: theme.colors.primary,
              opacity: buttonDisabled() ? 0.5 : 1,
            }}
            onPress={jumpToNext}>
            <Text style={{fontSize: 17, color: theme.colors.inverse}}>
              <Trans>setup.import</Trans>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImportWalletPage;
