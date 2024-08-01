import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import PickerView from '../../../components/PickerView';
import {useTheme} from '../../../util/theme';

import {
  setLedgercyDerivationPathForEVMWallet,
  setCustomDerivationPathForEVMWallet,
  checkCustomDerivationPathIsValid,
  setDefaultDerivationPathForEVMWallet,
  setDoomDerivationPathForEVMWallet,
  EVMDerivationPathType,
  EVMDerivationPathTypes,
  getDerivationTypeForEVMWallet,
  getDerivationPathForEVMWallet,
} from '../../../wallet';
import {Trans, useTranslation} from 'react-i18next';

const HARDENED = "'";

const DerivationPathPage = ({navigation}: {navigation: any}) => {
  const options = EVMDerivationPathTypes;
  const initialDerivationType = getDerivationTypeForEVMWallet();
  const derivationPath = getDerivationPathForEVMWallet();
  const initialCustomPath =
    initialDerivationType === 'Custom'
      ? derivationPath.slice(2, derivationPath.length - 2)
      : '';
  const selectedIndex: number = options.indexOf(initialDerivationType);
  const [derivationType, setDerivationType] =
    React.useState<EVMDerivationPathType>(initialDerivationType);
  const [editing, setEditing] = React.useState<boolean>(false);
  const [customPath, setCustomPath] = React.useState<string>(initialCustomPath);

  const onSelect = (index: number) => {
    let type = EVMDerivationPathTypes[index];
    setDerivationType(type);
    if (type === 'Ledger Legacy') {
      setLedgercyDerivationPathForEVMWallet();
    } else if (type === 'Default') {
      setDefaultDerivationPathForEVMWallet();
    } else if (type === 'Doom Legacy') {
      setDoomDerivationPathForEVMWallet();
    }
  };

  const fullCustomPath = () => {
    return `m/${customPath}/*`;
  };

  const saveButtonDisabled = () => {
    if (derivationType === 'Custom') {
      return !checkCustomDerivationPathIsValid(fullCustomPath());
    }
    return true;
  };

  const saveCustomPath = () => {
    setCustomDerivationPathForEVMWallet(`m/${customPath}`);
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  const handleInput = (text: string) => {
    // it's hard to type ' in mobile keyboard, so we replace it with '
    setCustomPath(text.replaceAll('’', HARDENED));
  };

  const theme = useTheme();
  const {t} = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
        }}
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.normalText, {color: theme.colors.text}]}>
            <Trans>EVM.derivationCaption</Trans>
          </Text>
          <PickerView
            options={options}
            onSelect={onSelect}
            selectedIndex={selectedIndex}
            theme={theme}
          />
        </View>
        {derivationType === 'Custom' && (
          <View
            style={{
              height: 360,
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 30,
            }}>
            <Text
              style={{
                color: theme.colors.title,
                fontSize: 18,
                width: '100%',
                textAlign: 'left',
              }}>
              <Trans>EVM.customPathLabel</Trans>
            </Text>
            <Text
              style={{
                color: theme.colors.placeholder,
                fontSize: 14,
                width: '100%',
                paddingLeft: 5,
                marginTop: 10,
                textAlign: 'left',
              }}>
              <Trans>EVM.customPathWarning</Trans>
            </Text>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
                padding: 5,
              }}>
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 15,
                }}>
                <Trans>EVM.path</Trans>
              </Text>
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 15,
                }}>
                {fullCustomPath()}
              </Text>
            </View>
            <Text
              style={{
                color: theme.colors.placeholder,
                fontSize: 14,
                width: '100%',
                paddingLeft: 5,
                marginTop: 10,
                marginBottom: 10,
                textAlign: 'left',
              }}>
              <Trans>EVM.inputCaption</Trans>
            </Text>
            <TextInput
              style={{
                borderColor: editing
                  ? theme.colors.primary
                  : theme.colors.border,
                color: theme.colors.text,
                height: 50,
                width: '90%',
                borderWidth: 1.5,
                padding: 10,
                fontSize: 18,
                borderRadius: 4,
              }}
              placeholder={t('EVM.inputPlaceholder')}
              placeholderTextColor={theme.colors.placeholder}
              onChangeText={handleInput}
              value={customPath}
              autoComplete="off"
              autoCorrect={false}
              returnKeyType="done"
              maxLength={20}
              // inputMode="search"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              onFocus={() => {
                setEditing(true);
              }}
              onBlur={() => {
                setEditing(false);
              }}
              inputMode="text"
            />
            <TouchableOpacity
              activeOpacity={0.6}
              disabled={saveButtonDisabled()}
              style={{
                marginTop: 15,
                height: 44,
                width: '88%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 22,
                opacity: saveButtonDisabled() ? 0.5 : 1,
                backgroundColor: theme.colors.primary,
              }}
              onPress={saveCustomPath}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: theme.colors.inverse,
                }}>
                <Trans>EVM.save</Trans>
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
    marginBottom: 40,
  },
  textContainer: {
    flex: 2,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
});

export default DerivationPathPage;
