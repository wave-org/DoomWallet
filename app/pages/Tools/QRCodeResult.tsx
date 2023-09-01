import React from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {Trans, useTranslation} from 'react-i18next';
import {useTheme} from '../../util/theme';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

const QRResultPage = ({route}: {route: any}) => {
  // const ur = route.params.ur as UR;
  const result = route.params.result as string;
  const theme = useTheme();
  const {t} = useTranslation();
  const copy = () => {
    Clipboard.setString(result);
    Toast.show({
      type: 'success',
      text1: t('tools.copyed'),
      position: 'bottom',
      bottomOffset: 100,
      visibilityTime: 2500,
    });
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
        }}>
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
          onPress={copy}>
          <Text style={{fontSize: 17, color: theme.colors.inverse}}>
            <Trans>tools.copy</Trans>
          </Text>
        </TouchableOpacity>
        <View
          style={{
            padding: 20,
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
            {result}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRResultPage;
