import React from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import {Trans, useTranslation} from 'react-i18next';
import {useTheme} from '../../util/theme';
import {EVMDataDecoder} from '../../wallet/EVMDataDecoder';
import Toast from 'react-native-toast-message';

const ABIImportScreen = () => {
  const [text, setText] = React.useState<string>('');
  const [editing, setEditing] = React.useState<boolean>(false);
  const theme = useTheme();
  const {t} = useTranslation();
  const importABI = async () => {
    Keyboard.dismiss();
    try {
      await EVMDataDecoder.importABI(text);
      setText('');
      Toast.show({
        type: 'success',
        text1: t('tools.importSuccess'),
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2500,
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: t('tools.importFailed'),
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2500,
      });
    }
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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        <TextInput
          style={{
            borderColor: editing ? theme.colors.primary : theme.colors.border,
            color: theme.colors.text,
            minHeight: 400,
            maxHeight: '80%',
            width: '90%',
            borderWidth: 1.5,
            padding: 10,
            marginTop: 20,
            fontSize: 18,
            textAlignVertical: 'top',
            borderRadius: 4,
          }}
          placeholder={t('tools.pasteABI')}
          placeholderTextColor={theme.colors.placeholder}
          onChangeText={newText => setText(newText)}
          value={text}
          autoComplete="off"
          autoCorrect={false}
          returnKeyType="done"
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
          onPress={importABI}>
          <Text style={{fontSize: 17, color: theme.colors.inverse}}>
            <Trans>tools.import</Trans>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ABIImportScreen;
