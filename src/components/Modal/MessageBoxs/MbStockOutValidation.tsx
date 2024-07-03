import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, StyleSheet, Dimensions, Text, Platform } from "react-native";
import { useMessageBoxService } from "../../../contexts/MessageBoxService";
import { MessageBoxOptions } from "../../../contexts/model/MessageBoxOptions";
import { translate } from "../../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import Svg, { Circle, Defs, G, Path, TSpan } from "react-native-svg";

const MbStockOutValidation: React.FC<{
  message: string;
  options?: MessageBoxOptions;
}> = (props) => {
  const { hide } = useMessageBoxService();
  return (
    <View style={styles.container}>
      <View
        style={[styles.card, { paddingVertical: 35, paddingHorizontal: 50 }]}
      >
        <Text
          style={{
            fontFamily: "Poppins_200ExtraLight_Italic",
            fontSize: 18,
            color: "rgb(96 ,96, 96)",
            textAlign: "center",
          }}
        >
          {translate("messageBox.stockOut1")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 13,
            marginBottom: 42,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: "rgb(124, 120, 120)",
            }}
          >
            {translate("messageBox.stockOut2")}
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 18,
              color: "rgb(124, 120, 120)",
            }}
          >
            {translate("messageBox.stockOut3")}
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_500Medium",
              fontSize: 18,
              color: "rgb(124, 120, 120)",
            }}
          >
            {translate("messageBox.stockOut4")}
          </Text>
        </View>
        <AppButton
          onPress={() => {
            if (props.options && props.options.yesButtonEvent)
              props.options.yesButtonEvent();
            hide();
          }}
          style={{ borderRadius: 8 }}
          title={translate("messageBox.add")}
        />
        <AppButton
          onPress={() => {
            if (props.options && props.options.noButtonEvent)
              props.options.noButtonEvent();
            hide();
          }}
          title={translate("messageBox.cancel")}
          style={{
            marginTop: 16,
            borderRadius: 8,
            backgroundColor: "rgb(199, 199, 199)",
          }}
        />
      </View>
    </View>
  );
};
export default MbStockOutValidation;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    flex: 1,
    padding: 20,
    ...Platform.select({
      android: {
        backgroundColor: "rgba(0,0,0,0.5)",
      }
    })
  },
  card: {
    width: Dimensions.get("window").width - 40,
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 10,
    maxWidth: 400,
  },
  title: {
    fontSize: PerfectFontSize(16),
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 0.3,
    color: "#000",
  },
  message: {
    fontSize: PerfectFontSize(20),
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0.3,
    color: "#000",
  },
  description: {
    fontFamily: "Poppins_500Medium",
    letterSpacing: 0.3,
    fontSize: PerfectFontSize(15),
    marginTop: 9,
    textAlign: "center",
    color: AppColor.FD.Text.Ash,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
