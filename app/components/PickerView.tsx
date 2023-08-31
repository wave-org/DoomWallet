import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  FlatList,
} from 'react-native';
import {Theme} from '../util/theme';

// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';

const Item = ({
  title,
  index,
  selected,
  onSelect,
  theme,
}: {
  title: string;
  index: number;
  selected: boolean;
  theme: Theme;
  onSelect: (index: number) => void;
}) => (
  <TouchableOpacity style={styles.cell} onPress={() => onSelect(index)}>
    <View style={[styles.line, {borderBottomColor: theme.colors.border}]}>
      <Text
        style={[
          styles.title,
          {color: selected ? theme.colors.primary : theme.colors.text},
        ]}>
        {title}
      </Text>
      {selected ? (
        <Icon name="checkmark" size={30} color={theme.colors.primary} />
      ) : null}
    </View>
  </TouchableOpacity>
);

const PickerView = ({
  options,
  onSelect,
  style,
  selectedIndex,
  theme,
}: {
  options: string[];
  onSelect: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  selectedIndex: number;
  theme: Theme;
}) => {
  const items = options.map((title, index) => {
    return {id: index, title: title};
  });

  const [currentSelectedIndex, setCurrentSelectedIndex] =
    React.useState(selectedIndex);

  const selectItem = (index: number) => {
    setCurrentSelectedIndex(index);
    onSelect(index);
  };

  return (
    <FlatList
      data={items}
      style={style}
      scrollEnabled={false}
      contentContainerStyle={styles.contentContainer}
      renderItem={({item}) => (
        <Item
          title={item.title}
          index={item.id}
          onSelect={selectItem}
          selected={currentSelectedIndex === item.id}
          theme={theme}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
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
    height: 40,
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
  title: {
    fontSize: 16,
    marginTop: 2,
  },
});
export default PickerView;
