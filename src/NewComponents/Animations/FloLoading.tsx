import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {HeadingText} from '..';
import {AppColor} from '../../theme/AppColor';

const FloLoading: React.FC = (props) => {
  const anim1Val = useSharedValue(80);
  const [isPlay, setIsPlay] = useState(false);
  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      width: anim1Val.value,
      height: anim1Val.value,
      borderRadius: anim1Val.value / 2,
    };
  });

  useEffect(() => {
    if (!isPlay) {
      anim1Val.value = withRepeat(
        withTiming(130, {duration: 800}),
        9999,
        true,
        (finished) => {},
      );
      setIsPlay(true);
    }
  });
  return (
    <>
      <Animated.View
        style={[styles.container, {position: 'absolute'}, animatedStyle1]}
      />
      <View style={styles.container}>
        <HeadingText style={{color: '#fff'}}>FLO</HeadingText>
      </View>
    </>
  );
};
export default FloLoading;

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    backgroundColor: AppColor.FD.Brand.Solid,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
});
