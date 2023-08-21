import React from 'react';
import {SafeAreaView, Text, View, StyleSheet, Appearance} from 'react-native';
import PickerView from '../../components/PickerView';
import {useTheme} from '../../util/theme';
import {
  getDarkMode,
  setDarkMode,
  useDarkModeOptions,
  DarkMode,
} from '../../wallet/setting';
import {Trans} from 'react-i18next';

const DarkModePage = () => {
  const options = useDarkModeOptions();
  const selectedIndex: number = getDarkMode();
  const onSelect = (index: number) => {
    setDarkMode(index)
      .then(() => {
        if (index === DarkMode.Dark) {
          Appearance.setColorScheme('dark');
        } else if (index === DarkMode.Light) {
          Appearance.setColorScheme('light');
        } else {
          Appearance.setColorScheme(undefined);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const theme = useTheme();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.normalText, {color: theme.colors.text}]}>
          <Trans>darkMode.caption</Trans>
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

export default DarkModePage;
