import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Theme} from '../util/theme';

const SimpleToggleButton = ({
  titles,
  defaultSelectedIndex,
  onChange,
  theme,
}: {
  titles: string[];
  defaultSelectedIndex: number;
  onChange: (index: number) => void;
  theme: Theme;
}) => {
  const [selected, setSelected] = React.useState(defaultSelectedIndex);

  const onClick = (index: number) => {
    if (index === selected) {
      return;
    }
    setSelected(index);
    onChange(index);
  };
  return (
    <View
      style={{
        height: 36,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: theme.colors.border,
        borderWidth: 0.5,
        borderRadius: 8,
        overflow: 'hidden',
      }}>
      {titles.map((title, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onClick(index);
          }}
          style={{
            paddingHorizontal: 12,
            height: '100%',
            backgroundColor:
              selected === index ? theme.colors.surface : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: theme.colors.border,
            borderRightWidth: index !== titles.length - 1 ? 1 : 0,
          }}>
          <Text
            style={{
              fontSize: 16,
              color:
                selected === index
                  ? theme.colors.primary
                  : theme.colors.placeholder,
            }}>
            {title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SimpleToggleButton;
