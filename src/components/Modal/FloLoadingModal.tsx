import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ModalProps,
  Dimensions,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";
import { colors } from "../../theme/colors";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { useProductService } from "../../contexts/ProductService";
import { useEasyReturnService } from "../../contexts/EasyReturnService";

interface FloLoadingModalProps extends ModalProps {
  loadingVisibibility?: boolean;
}

const FloLoadingModal = (props: FloLoadingModalProps) => {
  const ProductService = useProductService();
  const EasyReturnService = useEasyReturnService();
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
  if (ProductService.isLoading) {
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
        {ProductService.animationType === 1 || Platform.OS === "web" ? (
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
        ) : (
          <View
            style={{
              flex: 1,
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width,
              backgroundColor: "#fff",
            }}
          >
            <ContentLoader
              viewBox={vb}
              foregroundColor={"rgba(255, 103, 28, 0.3)"}
            >
              <Rect x="10" y="17" rx="10" ry="10" width="80" height="80" />
              <Rect x="100" y="17" rx="4" ry="4" width="40" height="13" />
              <Rect x="100" y="40" rx="3" ry="3" width="200" height="10" />
              <Rect x="100" y="60" rx="3" ry="3" width="200" height="10" />
              <Rect x="100" y="150" rx="4" ry="4" width="100" height="13" />
              <Rect x="100" y="190" rx="4" ry="4" width="100" height="13" />
              <Rect
                x="100"
                y="250"
                rx="4"
                ry="4"
                width={Dimensions.get("window").height - 60 - 30 - 180}
                height="13"
              />
              <Rect x="10" y="320" rx="4" ry="4" width="80" height="10" />
              <Rect x="10" y="350" rx="4" ry="4" width="300" height="10" />
              <Rect x="10" y="370" rx="4" ry="4" width="300" height="10" />
              <Rect
                x="10"
                y={Dimensions.get("window").height - 60 - 30 - 120}
                rx="3"
                ry="3"
                width={Dimensions.get("window").width - 20}
                height="60"
              />
            </ContentLoader>
          </View>
        )}
      </View>
    );
  } else {
    try {
      if (EasyReturnService.isLoading) {
        return (
          <View
            style={{
              position: "absolute",
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.30)",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: Dimensions.get("window").width - 50,
                minHeight: 50,
                borderRadius: 10,
                padding: 20,
              }}
            >
              <ActivityIndicator size={"large"} color={colors.brightOrange} />
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins_400Regular",
                  marginTop: 20,
                  fontWeight: "600",
                }}
              >
                Siparişler aranıyor. Lütfen bekleyin.
              </Text>
            </View>
          </View>
        );
      } else return null;
    } catch (err) {
      return null;
    }
  }
};

export default FloLoadingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
  },
});
