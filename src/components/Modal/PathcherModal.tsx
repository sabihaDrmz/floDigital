import { BlurView } from "expo-blur";
import {
  AppColor,
  AppText,
  ColorType,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const MaxWidth = Dimensions.get("window").width - 100;
const PatcherModal: React.FC = (props) => {
  const currentProgress = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => {
    return {
      width: (MaxWidth * currentProgress.value) / 100,
    };
  });

  setInterval(() => {
    if (currentProgress.value < 100)
      currentProgress.value = withSpring(currentProgress.value + 10);
  }, 2000);
  return (
    <BlurView
      style={{
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
    >
      <View
        style={{
          width: Dimensions.get("window").width - 40,
          backgroundColor: "#fff",
          position: "absolute",
          top: (Dimensions.get("window").height - 150) / 2,
          left: 20,
          borderRadius: 20,
          padding: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <ActivityIndicator color={AppColor.FD.Brand.Solid} />
          <AppText
            style={{ marginLeft: 20 }}
            labelType={LabelType.Label}
            labelColorType={ColorType.Dark}
          >
            Yamalar Kontrol Ediliyor
          </AppText>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={{ width: MaxWidth, height: 20 }}>
            <View
              style={{
                position: "absolute",
                height: 10,
                width: MaxWidth + 15,
                borderRadius: 5,
                backgroundColor: AppColor.FD.Text.Light,
              }}
            />
            <Animated.View
              style={[
                {
                  position: "absolute",
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: AppColor.FD.Brand.Solid,
                },
                animStyle,
              ]}
            />
          </View>
        </View>
      </View>
    </BlurView>
  );
};
export default PatcherModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
