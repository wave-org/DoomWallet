import React from 'react';
import {SafeAreaView, Text, View, StyleSheet} from 'react-native';
import PickerView from '../../components/PickerView';
import {useTheme} from '../../util/theme';
import {
  useLanguageOptions,
  getLanguage,
  setLanguage,
} from '../../wallet/setting';
import {Trans} from 'react-i18next';

const LanguagePage = () => {
  const options = useLanguageOptions();

  const selectedIndex: number = getLanguage();
  const onSelect = (index: number) => {
    setLanguage(index);
  };

  const theme = useTheme();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.normalText, {color: theme.colors.text}]}>
          <Trans>language.caption</Trans>
        </Text>
        <PickerView
          options={options}
          onSelect={onSelect}
          selectedIndex={selectedIndex}
          theme={theme}
        />
      </View>
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
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
});

export default LanguagePage;
