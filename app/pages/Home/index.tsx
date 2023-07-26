import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView, Text, View, Button} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const HomePage = () => {
  return (
    // <NavigationContainer>
    <SafeAreaView>
      <View>
        <Text>Home</Text>
      </View>
    </SafeAreaView>
    // </NavigationContainer>
  );
};

export default HomePage;
