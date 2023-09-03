import React from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  useWindowDimensions,
  Keyboard,
} from 'react-native';
import {Trans, useTranslation} from 'react-i18next';
import {useTheme} from '../../util/theme';
import QRCode from 'react-native-qrcode-svg';
import * as wallet from '../../wallet';

const ExportByQRCode = () => {
  const exportedData = wallet.getExportData();
  const [password, setPassword] = React.useState<string>('');
  const [qrCode, setQRCode] = React.useState<string>('');
  const [editing, setEditing] = React.useState<boolean>(false);
  const theme = useTheme();
  const {t} = useTranslation();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const generate = () => {
    Keyboard.dismiss();
    let encrypted = wallet.encryptWalletExportData(exportedData, password);
    setQRCode(encrypted);
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({animated: true});
      }
    }, 100);
  };
  const {width} = useWindowDimensions();

  const buttonIsDisable = () => {
    return password.length < 4;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScrollView
        ref={scrollViewRef}
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            padding: 20,
            color: theme.colors.title,
            width: '100%',
            textAlign: 'left',
          }}>
          <Trans>export.exportedData</Trans>
        </Text>
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            width: '100%',
          }}>
          <Text
            style={{
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              fontSize: 16,
              marginBottom: 10,
              textAlign: 'left',
              width: '98%',
              padding: 15,
              borderWidth: 1,
              borderRadius: 8,
              overflow: 'hidden',
            }}>
            {JSON.stringify(exportedData, null, 4)}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            padding: 20,
            color: theme.colors.title,
            width: '100%',
            textAlign: 'left',
          }}>
          <Trans>export.qrCodePassword</Trans>
        </Text>

        <TextInput
          style={{
            borderColor: editing ? theme.colors.primary : theme.colors.border,
            color: theme.colors.text,
            height: 60,
            width: '90%',
            borderWidth: 1.5,
            padding: 10,
            fontSize: 18,
            borderRadius: 4,
          }}
          placeholder={t('export.passwordPlaceholder')}
          placeholderTextColor={theme.colors.placeholder}
          onChangeText={newText => setPassword(newText)}
          value={password}
          autoComplete="off"
          autoCorrect={false}
          returnKeyType="done"
          maxLength={32}
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
        <Text
          style={{
            fontSize: 15,
            padding: 20,
            color: theme.colors.placeholder,
            width: '100%',
            textAlign: 'left',
          }}>
          <Trans>export.passwordCaption</Trans>
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            opacity: buttonIsDisable() ? 0.5 : 1,
            height: 44,
            width: '75%',
            marginTop: 25,
            marginBottom: 25,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 22,
            backgroundColor: theme.colors.primary,
          }}
          disabled={buttonIsDisable()}
          onPress={generate}>
          <Text style={{fontSize: 17, color: theme.colors.inverse}}>
            <Trans>tools.generate</Trans>
          </Text>
        </TouchableOpacity>
        {qrCode !== '' ? (
          <View
            style={{
              padding: 20,
              aspectRatio: 1,
              backgroundColor: '#DFE0E2',
            }}>
            <QRCode size={width - 40} value={qrCode} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExportByQRCode;
