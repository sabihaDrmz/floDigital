import { AppText } from "@flomagazacilik/flo-digital-components";
import { useFcm } from "contexts/FcmContext";
import { Observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { ifIphoneX } from "react-native-iphone-x-helper";
import Animated, {
  Easing,
  FadeInUp,
  FadeOut,
  FadeOutUp,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const NotificationToast: React.FC = (props) => {
  const transformY = useSharedValue(0);
  const FcmService = useFcm();
  const gestureEvt = useAnimatedGestureHandler({
    onStart: (state, ctx: any) => {
      ctx.startY = transformY.value;
    },
    onActive: (state, ctx: any) => {
      transformY.value = ctx.startY + state.translationY;
    },
    onEnd: (state, ctx) => {
      if (state.translationY + state.velocityY < 95) {
        transformY.value = withTiming(0, {
          duration: 300,
          easing: Easing.ease,
        });
      } else {
        transformY.value = withTiming(140, {
          duration: 300,
          easing: Easing.ease,
        });
      }
    },
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transformY.value < 0 ? 0 : transformY.value }],
      zIndex: -1,
    };
  });

  if (FcmService.currentShowingId === FcmService.lastNotificationId) {
    return null;
  }

  return (
    <PanGestureHandler onGestureEvent={gestureEvt}>
      <Animated.View
        entering={FadeInUp.duration(400)}
        exiting={FadeOutUp.duration(400)}
        style={[styles.container, animatedContainerStyle]}
      >
        <AppText style={styles.title}>{FcmService.notification.title}</AppText>
        <AppText selectable style={styles.description}>
          {FcmService.notification.body}
        </AppText>
      </Animated.View>
    </PanGestureHandler>
  );
};
export default NotificationToast;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: 100,
    backgroundColor: "#fff",
    width: width - 40,
    left: 20,
    borderRadius: 20,
    padding: 20,
    ...ifIphoneX(
      {
        top: 40,
      },
      { top: 20 }
    ),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
  },
  description: {
    fontFamily: "Poppins_400Regular",
  },
});
