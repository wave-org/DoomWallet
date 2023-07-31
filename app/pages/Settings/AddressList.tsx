import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import * as wallet from '../../wallet';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';

const jumpToEthscan = (address: string) => {
  Linking.openURL('https://etherscan.io/address/' + address);
};

type ItemProps = {
  address: string;
  id: number;
};

const Item = ({address, index}: {address: string; index: number}) => (
  <TouchableOpacity style={styles.cell} onPress={() => jumpToEthscan(address)}>
    <Text style={styles.index}>{index}.</Text>
    <View style={styles.line}>
      <Text style={styles.address}>{address}</Text>
      <Icon name="chevron-forward" size={24} color="#AAAAAA" />
    </View>
  </TouchableOpacity>
);

const AddressList = () => {
  const [addressList, setAddressList] = React.useState<ItemProps[]>([]);

  React.useEffect(() => {
    const _addressList = wallet
      .derivedAddressList(100)
      .map((address, index) => {
        return {id: index + 1, address: address};
      });

    setAddressList(_addressList);
  }, []);

  if (addressList.length === 0) {
    return (
      <SafeAreaView style={styles.indicatorContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={addressList}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        renderItem={({item}) => <Item address={item.address} index={item.id} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  indicatorContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  cell: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    height: 32,
    marginTop: 10,
  },
  line: {
    flex: 1,
    marginLeft: 4,
    borderBottomWidth: 1,
    height: '100%',
    borderBottomColor: 'lightgray',
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 17,
  },
  index: {
    fontSize: 17,
    width: 24,
  },
  address: {
    fontSize: 14,
    marginTop: 2,
  },
});
export default AddressList;
