import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme} from '../util/theme';

const MnemonicView = ({
  mnemonic,
  theme,
}: {
  mnemonic: string[];
  theme: Theme;
}) => {
  return (
    <View style={styles.container}>
      {mnemonic.map((word, index) => {
        return (
          <View
            key={index}
            style={[
              styles.background,
              {backgroundColor: theme.colors.surface},
            ]}>
            <Text style={[styles.text, {color: theme.colors.text}]}>
              {index + 1}.{word}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  text: {
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
  },
  background: {
    margin: 2.5,
    borderRadius: 5,
  },
});

export default MnemonicView;
