import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ModalProps,
  Dimensions,
  Animated,
} from "react-native";
import { colors } from "../../theme/colors";

import { PerfectFontSize } from "../../helper/PerfectPixel";
import { usePrinterConfigService } from "../../contexts/PrinterConfigService";

interface FloPrinterConfigLoadingModalProps { }

const FloPrinterConfigLoadingModal: React.FC<
  FloPrinterConfigLoadingModalProps
> = (props) => {
  var animVal = new Animated.Value(80);
  var animVal2 = new Animated.Value(40);

  Animated.loop(
    Animated.timing(animVal, {
      toValue: 120,
      duration: 900,
      useNativeDriver: false,
    })
  ).start();

  const radiusAnim = animVal.interpolate({
    inputRange: [80, 120],
    outputRange: [40, 60],
    extrapolate: "clamp",
  });
  const PrinterConfigService = usePrinterConfigService();
  if (PrinterConfigService.showLoadingPopup) {
    let vb =
      "0 0 " +
      Dimensions.get("window").width +
      " " +
      (Dimensions.get("window").height - 100);

    return (
      <View
        style={{
          position: "absolute",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          justifyContent: "center",
          backgroundColor: "rgba(255, 103, 28, 0.01)",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            width: animVal,
            height: animVal,
            borderRadius: radiusAnim,
            backgroundColor: "rgba(255, 103, 28, 0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            style={{
              width: animVal2,
              height: animVal2,
              borderRadius: animVal2,
              backgroundColor: "rgba(255, 103, 28, 0.6)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.brightOrange,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: PerfectFontSize(20),
                  color: colors.white,
                }}
              >
                FLO
              </Text>
              {/* <ActivityIndicator size={'large'} color={colors.brightOrange} /> */}
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    );
  } else return null;
};
export default FloPrinterConfigLoadingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
  },
});
