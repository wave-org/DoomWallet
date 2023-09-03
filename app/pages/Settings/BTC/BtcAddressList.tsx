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
import {Tab, Text, TabView, Divider} from '@rneui/themed';
import * as wallet from '../../../wallet';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme, Theme} from '../../../util/theme';
import {useTranslation, Trans} from 'react-i18next';

type ItemProps = {
  address: string;
  id: number;
};

const jumpToExplorer = (address: string) => {
  Linking.openURL(
    'https://www.blockchain.com/explorer/addresses/btc/' + address,
  );
};

const Item = ({
  address,
  index,
  theme,
}: {
  address: string;
  index: number;
  theme: Theme;
}) => (
  <TouchableOpacity style={styles.cell} onPress={() => jumpToExplorer(address)}>
    <Text style={[styles.index, {color: theme.colors.title}]}>{index}.</Text>
    <View style={[styles.line, {borderBottomColor: theme.colors.border}]}>
      <View
        style={{
          flex: 1,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          style={{
            color: theme.colors.text,
            textAlign: 'left',
            width: '100%',
            textAlignVertical: 'center',
          }}>
          {address}
        </Text>
      </View>
      <Icon name="chevron-forward" size={24} color={theme.colors.placeholder} />
    </View>
  </TouchableOpacity>
);

const BtcAddressListPage = () => {
  const [externalList, setExternalList] = React.useState<ItemProps[]>([]);
  const [internalList, setInternalList] = React.useState<ItemProps[]>([]);
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [tabIndex, setTabIndex] = React.useState(0);
  const {t} = useTranslation();

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
  React.useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <Tab
        value={tabIndex}
        onChange={e => setTabIndex(e)}
        style={{
          width: '100%',
          height: 50,
          backgroundColor: theme.colors.surface,
        }}
        disableIndicator={true}
        variant="primary">
        <Tab.Item
          title={t('btcAddressList.external')}
          titleStyle={active => ({
            fontSize: active ? 15 : 14,
            fontWeight: active ? 'bold' : 'normal',
            color: active ? theme.colors.inverse : theme.colors.inverse + '80',
          })}
          buttonStyle={active => ({
            backgroundColor: active
              ? theme.colors.primary
              : theme.colors.primary + '80',
          })}
        />
        <Tab.Item
          title={t('btcAddressList.internal')}
          titleStyle={active => ({
            fontSize: active ? 15 : 14,
            fontWeight: active ? 'bold' : 'normal',
            color: active ? theme.colors.inverse : theme.colors.inverse + '80',
          })}
          buttonStyle={active => ({
            backgroundColor: active
              ? theme.colors.primary
              : theme.colors.primary + '80',
          })}
        />
      </Tab>

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
                <Item address={item.address} index={item.id} theme={theme} />
              )}
            />
          </TabView.Item>
          <TabView.Item style={{width: '100%', height: '100%'}}>
            <FlatList
              data={internalList}
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
              renderItem={({item}) => (
                <Item address={item.address} index={item.id} theme={theme} />
              )}
            />
          </TabView.Item>
        </TabView>
        <Divider width={2} color={theme.colors.border} />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 60,
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            disabled={pageNumber === 1}
            style={[
              styles.button,
              {
                backgroundColor: theme.colors.primary,
                opacity: pageNumber === 1 ? 0.5 : 1,
              },
            ]}
            onPress={() => setPageNumber(pageNumber - 1)}>
            <Text style={[styles.buttonText, {color: theme.colors.inverse}]}>
              <Trans>btcAddressList.previousPage</Trans>
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              width: 50,
              fontSize: 20,
              textAlign: 'center',
              color: theme.colors.title,
            }}>
            {pageNumber}
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            style={[
              styles.button,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={() => setPageNumber(pageNumber + 1)}>
            <Text style={[styles.buttonText, {color: theme.colors.inverse}]}>
              <Trans>btcAddressList.nextPage</Trans>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    flexDirection: 'column',
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
    flexDirection: 'row',
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
  button: {
    height: 36,
    width: 140,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 17,
  },
});

export default BtcAddressListPage;
