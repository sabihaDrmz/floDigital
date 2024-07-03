import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';
import {PerfectFontSize} from '../helper/PerfectPixel';
import {colors} from '../theme/colors';

const MAX_WIDTH = 130;
const MIN_WIDTH = 70;
const PADDING = 40;

const FloLoading = (props: any) => {
  const anim1val = useSharedValue(MIN_WIDTH);
  const anim2val = useSharedValue(MIN_WIDTH);

  anim1val.value = withRepeat(
    withTiming(0, {duration: 1000}),
    0,
    undefined,
    (isFinish) => {
      if (isFinish) anim1val.value = MIN_WIDTH;
    },
  );

  anim2val.value = withRepeat(
    withTiming(MAX_WIDTH, {duration: 999}),
    0,
    undefined,
    (isFinish) => {
      if (isFinish) anim2val.value = 0;
    },
  );

  var anim1Style = useAnimatedStyle(() => {
    var opacity = interpolate(anim1val.value, [MIN_WIDTH, MAX_WIDTH], [0.3, 1]);
    return {
      width: anim1val.value,
      height: anim1val.value,
      top: (MAX_WIDTH - anim1val.value) / 2,
      left: (MAX_WIDTH - anim1val.value) / 2,
      opacity,
    };
  });

  var anim2Style = useAnimatedStyle(() => {
    var opacity = interpolate(anim2val.value, [MIN_WIDTH, MAX_WIDTH], [1, 0.3]);
    return {
      width: anim2val.value,
      height: anim2val.value,
      top: (MAX_WIDTH - anim2val.value) / 2,
      left: (MAX_WIDTH - anim2val.value) / 2,
      opacity,
    };
  });
  return (
    <View
      style={{
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          borderRadius: 20,
          width: MAX_WIDTH,
          height: MAX_WIDTH,
          flexDirection: 'row',
          marginBottom: 80,
        }}>
        <View style={styles.container}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                backgroundColor: 'rgba(255, 103, 28, 0.4)',
                borderRadius: MAX_WIDTH / 2,
              },
              anim1Style,
            ]}
          />
          <Animated.View
            style={[
              {
                position: 'absolute',

                backgroundColor: 'rgba(255, 103, 28, 0.6)',
                borderRadius: MAX_WIDTH / 2,
              },
              anim2Style,
            ]}
          />
          <View
            style={{
              position: 'absolute',
              width: MIN_WIDTH,
              height: MIN_WIDTH,
              left: (MAX_WIDTH - MIN_WIDTH) / 2,
              top: (MAX_WIDTH - MIN_WIDTH) / 2,
              backgroundColor: colors.brightOrange,
              borderRadius: MAX_WIDTH / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: PerfectFontSize(20),
                fontWeight: 'bold',
                color: 'white',
              }}>
              FLO
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default FloLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
