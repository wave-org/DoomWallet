import React from 'react';
import {useWindowDimensions, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// default width is screen width
const AnimatedQRCode = ({
  width,
  urList,
}: {
  width?: number;
  urList: string[];
}) => {
  const screenWidth = useWindowDimensions().width;
  const viewWidth = width || screenWidth;

  const [index, setIndex] = React.useState<number>(0);
  const length = urList.length;
  const [currentUR, setCurrentUR] = React.useState<string>(urList[0]);

  React.useEffect(() => {
    if (length > 1) {
      const timer = setInterval(() => {
        // setIndex((index + 1) % length);
        setIndex(i => (i + 1) % length);
      }, 500);
      return () => clearInterval(timer);
    }
  }, [length]);

  React.useEffect(() => {
    setCurrentUR(urList[index]);
  }, [index, urList]);

  return (
    <View
      style={{
        width: '100%',
        padding: 20,
        aspectRatio: 1,
        backgroundColor: '#DFE0E2',
      }}>
      <QRCode size={viewWidth - 40} value={currentUR} />
    </View>
  );
};

export default AnimatedQRCode;
