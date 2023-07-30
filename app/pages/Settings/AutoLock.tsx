import React from 'react';
import {SafeAreaView, Text, View, StyleSheet} from 'react-native';
import * as AutoLock from '../../wallet/autolock';
import PickerView from '../../components/PickerView';

const AutoLockPage = () => {
  const options = AutoLock.AutoLockTimeText;
  const selectedIndex: number = AutoLock.getAutoLockTime();
  const onSelect = (index: number) => {
    AutoLock.setAutoLockTime(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.normalText}>
          Choose the amount of time before the application locks automatically.{' '}
          {'\n'}
          Doom wallet will lock after the specified amount of time has passed
          when the app is in the background.
        </Text>
        <PickerView
          options={options}
          onSelect={onSelect}
          selectedIndex={selectedIndex}
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
