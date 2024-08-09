import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Theme} from '../util/theme';

// @ts-ignore
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Pagination = ({
  count,
  onPageChange,
  theme,
}: {
  count: number;
  onPageChange: (index: number) => void;
  theme: Theme;
}) => {
  const [page, setPage] = React.useState(0);
  // titles of showing page buttons.
  const [pageTitles, setPageTitles] = React.useState<string[]>([]);
  React.useEffect(() => {
    const maxShowPage = 5;
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      titles.push((i + 1).toString());
    }
    console.log('p titles : ', titles, page, count);
    if (count > maxShowPage) {
      if (page <= 2) {
        titles.splice(3, count - maxShowPage + 1, '...');
      } else if (page >= count - 3) {
        titles.splice(1, count - maxShowPage + 1, '...');
      } else {
        titles.splice(page + 1, count - page - 2, '...');
        titles.splice(1, page - 1, '...');
      }
    }
    setPageTitles(titles);
  }, [count, page]);
  const changePage = (index: number) => {
    if (index < 0 || index >= count) {
      return;
    }
    setPage(index);
    onPageChange(index);
  };
  return (
    <View
      style={{
        width: '100%',
        height: 32,
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        onPress={() => changePage(page - 1)}
        disabled={page === 0}
        style={{
          width: 32,
          height: 32,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MCIcon name="chevron-left" size={32} color={theme.colors.inverse} />
      </TouchableOpacity>
      {pageTitles.map((title, index) => {
        return (
          <TouchableOpacity
            key={title + index}
            onPress={() => {
              if (title !== '...' && title !== (page + 1).toString()) {
                changePage(Number(title) - 1);
              }
            }}
            style={{
              width: 32,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                (page + 1).toString() === title
                  ? theme.colors.surface
                  : 'transparent',
              borderRadius: 16,
            }}>
            <Text
              style={{
                color: theme.colors.inverse,
                fontSize: 18,
              }}>
              {title}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={() => changePage(page + 1)}
        disabled={page === count - 1}
        style={{
          width: 32,
          height: 32,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MCIcon name="chevron-right" size={32} color={theme.colors.inverse} />
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;
