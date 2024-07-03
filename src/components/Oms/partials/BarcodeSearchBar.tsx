import { AppColor } from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Platform, TouchableOpacity, TextInput } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SearchQR } from "../../CustomIcons/MainPageIcons";
import { translate } from "../../../helper/localization/locaizationMain";
import MainCamera from "../../MainCamera";

const DMW = Dimensions.get("window").width - 75;
const AnimatedQrButton = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const BarcodeSearchBar: React.FC<{ onSearch: (query: string) => void }> = (
  props
) => {
  const [isCameraShow, setIsCameraShow] = useState(false);

  const pos = useSharedValue(0);
  const txtInput2With = useSharedValue(DMW);
  const txtInput1With = useSharedValue(DMW);
  const qrButtonPosStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: 140 }],
    };
  });
  const txtRef = useRef();
  const buttonEnabledStyle = useAnimatedStyle(() => {
    const opacity = interpolate(pos.value, [0, 150], [1, 0]);
    return {
      opacity,
    };
  });
  const txtInput1 = useAnimatedStyle(() => {
    const maxWidth = interpolate(pos.value, [0, 150], [DMW, DMW * 2]);
    return {
      maxWidth,
      width: maxWidth,
    };
  });
  const txtInput2 = useAnimatedStyle(() => {
    const maxWidth = interpolate(pos.value, [-150, 0], [DMW * 1.5, DMW / 1.5]);
    return {
      maxWidth,
      width: maxWidth,
    };
  });
  const [query, setQuery] = useState("");

  return (
    <View>
      <View style={styles.container}>
        <Animated.View style={txtInput1}>
          <TextInput
            maxLength={13}
            placeholderTextColor={AppColor.FD.Text.Default}
            selectionColor={AppColor.FD.Brand.Solid}
            underlineColorAndroid={"transparent"}
            placeholder={translate("OmsBarcodeSearchBar.scanOrCode")}
            onChangeText={setQuery}
            value={query}
            onFocus={() => {
              pos.value = withTiming(150);
              txtInput2With.value = withTiming(0);
            }}
            onBlur={() => {
              if (query.length === 0) {
                pos.value = withTiming(0);
                txtInput2With.value = withTiming(DMW);
              }
            }}
            keyboardType={"number-pad"}
          />
        </Animated.View>
      </View>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: -35,
            left: DMW - 35,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            query ? props.onSearch(query) : setIsCameraShow(true);
            setQuery("");
          }}
          style={Platform.OS !== "web" && styles.shadow}
        >
          <SearchQR />
        </TouchableOpacity>
      </Animated.View>

      <MainCamera
        isShow={isCameraShow}
        onReadComplete={(barcode) => {
          props.onSearch(barcode);
          setIsCameraShow(false);
        }}
        onHide={() => setIsCameraShow(false)}
      />
    </View>
  );
};
export default BarcodeSearchBar;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderColor: "#b7b5b5",
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    height: 45,
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    zIndex: 5,
  },
});
