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
import AnimatedQRCode from '../../components/AnimatedQRCode';
import {URDecoder, UREncoder} from '@ngraveio/bc-ur';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const URCodeGenerator = () => {
  const [text, setText] = React.useState<string>('');
  const [urList, setUrList] = React.useState<string[]>([]);
  const [editing, setEditing] = React.useState<boolean>(false);
  const theme = useTheme();
  const {t} = useTranslation();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const generate = async () => {
    Keyboard.dismiss();
    try {
      const ur = await URDecoder.decode(text);
      // TODO setting
      const encoder = new UREncoder(ur, 200);
      const ul = encoder.encodeWhole();
      setUrList(ul);
      // setQRCode(text);
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({animated: true});
        }
      }, 100);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: t('tools.urError'),
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 2500,
      });
    }
  };
  // const {width} = useWindowDimensions();

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
          width: '100%',
        }}>
        <Text
          style={{
            padding: 20,
            fontSize: 16,
            color: theme.colors.placeholder,
            width: '100%',
            textAlign: 'center',
          }}>
          <Trans>tools.urCaption</Trans>
        </Text>
        <TextInput
          style={{
            borderColor: editing ? theme.colors.primary : theme.colors.border,
            color: theme.colors.text,
            minHeight: 400,
            width: '90%',
            borderWidth: 1.5,
            padding: 10,
            marginTop: 20,
            fontSize: 18,
            textAlignVertical: 'top',
            borderRadius: 4,
          }}
          placeholder={t('tools.urPlaceholder')}
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
          onPress={generate}>
          <Text style={{fontSize: 17, color: theme.colors.inverse}}>
            <Trans>tools.generate</Trans>
          </Text>
        </TouchableOpacity>
        {urList.length > 0 ? <AnimatedQRCode urList={urList} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default URCodeGenerator;
