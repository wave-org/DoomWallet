import React from 'react';
import {SafeAreaView, Text, View, StyleSheet} from 'react-native';
import * as AutoLock from '../../wallet/autolock';
import PickerView from '../../components/PickerView';
import {useTheme} from '../../util/theme';
import {Trans} from 'react-i18next';

const AutoLockPage = () => {
  const options = AutoLock.AutoLockTimeText;
  const selectedIndex: number = AutoLock.getAutoLockTime();
  const onSelect = (index: number) => {
    AutoLock.setAutoLockTime(index);
  };
  const theme = useTheme();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.normalText, {color: theme.colors.text}]}>
          <Trans>autoLock.caption</Trans>
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

export default AutoLockPage;
