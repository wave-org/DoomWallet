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

const QRCodeGenerator = () => {
  // const ur = route.params.ur as UR;
  const [text, setText] = React.useState<string>('');
  const [qrCode, setQRCode] = React.useState<string>('');
  const [editing, setEditing] = React.useState<boolean>(false);
  const theme = useTheme();
  const {t} = useTranslation();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const generate = () => {
    Keyboard.dismiss();
    setQRCode(text);
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({animated: true});
      }
    }, 100);
  };
  const {width} = useWindowDimensions();

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
        <TextInput
          style={{
            borderColor: editing ? theme.colors.primary : theme.colors.border,
            color: theme.colors.text,
            height: 360,
            width: '90%',
            borderWidth: 1.5,
            padding: 10,
            marginTop: 20,
            fontSize: 18,
            textAlignVertical: 'top',
            borderRadius: 4,
          }}
          placeholder={t('tools.generatorPlaceHolder')}
          placeholderTextColor={theme.colors.placeholder}
          onChangeText={newText => setText(newText)}
          value={text}
          autoComplete="off"
          autoCorrect={false}
          returnKeyType="done"
          maxLength={1024}
          multiline={true}
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
          style={{
            height: 36,
            width: '60%',
            marginTop: 25,
            marginBottom: 25,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 22,
            backgroundColor: theme.colors.primary,
          }}
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

export default QRCodeGenerator;
