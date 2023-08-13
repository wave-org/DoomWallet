import React, {useCallback} from 'react';
import {
  SafeAreaView,
  // Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Tab, Text, TabView, Divider, Button} from '@rneui/themed';
import * as wallet from '../../wallet';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';

type ItemProps = {
  address: string;
  id: number;
};

const jumpToExplorer = (address: string) => {
  Linking.openURL(
    'https://www.blockchain.com/explorer/addresses/btc/' + address,
  );
};

const Item = ({address, index}: {address: string; index: number}) => (
  <TouchableOpacity style={styles.cell} onPress={() => jumpToExplorer(address)}>
    <Text style={styles.index}>{index}.</Text>
    <View style={styles.line}>
      <Text style={styles.address}>{address}</Text>
      <Icon name="chevron-forward" size={24} color="#AAAAAA" />
    </View>
  </TouchableOpacity>
);

const BtcAddressListPage = () => {
  //   const [evmUR, setEvmUR] = React.useState<string | undefined>(undefined);
  //   const [btcUR, setBtcUR] = React.useState<string | undefined>(undefined);

  const [externalList, setExternalList] = React.useState<ItemProps[]>([]);
  const [internalList, setInternalList] = React.useState<ItemProps[]>([]);
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [tabIndex, setTabIndex] = React.useState(0);

  const loadAddresses = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      // external
      const addressList1 = wallet
        .derivedBTCAddressList(pageNumber - 1, false)
        .map((address, index) => {
          const showIndex = (pageNumber - 1) * 20 + index;
          return {id: showIndex, address: address};
        });
      setExternalList(addressList1);
      // internal
      const addressList = wallet
        .derivedBTCAddressList(pageNumber - 1, true)
        .map((address, index) => {
          const showIndex = (pageNumber - 1) * 20 + index;
          return {id: showIndex, address: address};
        });
      setInternalList(addressList);
      setLoading(false);
    }, 20);
  }, [pageNumber]);
  //   const {width} = useWindowDimensions();
  React.useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  return (
    <SafeAreaView style={styles.container}>
      <Tab
        value={tabIndex}
        onChange={e => setTabIndex(e)}
        style={{width: '100%', height: 45}}
        indicatorStyle={{
          backgroundColor: 'white',
          height: 3,
        }}
        variant="primary">
        <Tab.Item title="External(Receive)" titleStyle={{fontSize: 14}} />
        <Tab.Item title="Internal(Change)" titleStyle={{fontSize: 14}} />
      </Tab>
      {loading ? (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            // backgroundColor: 'gray',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      ) : null}
      <View style={{width: '100%', flex: 1}}>
        <TabView
          containerStyle={{
            // flex: 1,
            width: '100%',
            height: '100%',
          }}
          value={tabIndex}
          onChange={setTabIndex}
          disableSwipe={true}
          animationType="spring">
          <TabView.Item style={{width: '100%', height: '100%'}}>
            <FlatList
              data={externalList}
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
              renderItem={({item}) => (
                <Item address={item.address} index={item.id} />
              )}
            />
          </TabView.Item>
          <TabView.Item style={{width: '100%', height: '100%'}}>
            <FlatList
              data={internalList}
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
              renderItem={({item}) => (
                <Item address={item.address} index={item.id} />
              )}
            />
          </TabView.Item>
        </TabView>
        <Divider width={2} />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 60,
          }}>
          <Button
            title="Preview Page"
            disabled={pageNumber === 1}
            onPress={() => setPageNumber(pageNumber - 1)}
          />
          <Text style={{width: 50, textAlign: 'center'}}>{pageNumber}</Text>
          <Button
            title="Next Page"
            onPress={() => setPageNumber(pageNumber + 1)}
          />
        </View>
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
    // alignItems: 'center',
    // justifyContent: 'center',
    overflow: 'hidden',
  },
  normalText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  textContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
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
  contentContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
});

export default BtcAddressListPage;
