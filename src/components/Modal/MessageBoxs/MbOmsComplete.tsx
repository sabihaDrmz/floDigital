import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import { useMessageBoxService } from "../../../contexts/MessageBoxService";
import { MessageBoxOptions } from "../../../contexts/model/MessageBoxOptions";
import { translate } from "../../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import Svg, { Circle, Defs, G, Path, TSpan } from "react-native-svg";
import { Octicons } from "@expo/vector-icons";
const MbOmsComplete: React.FC<{
  message: string;
  options?: MessageBoxOptions;
}> = (props) => {
  const { hide } = useMessageBoxService();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Octicons name="checklist" size={40} color="black" />
        </View>
        <AppText style={{ textAlign: "center" }} labelType={LabelType.Label}>
          {props.message.split("|")[0]}{" "}
          {translate("messageBox.allCollectOrders")}
        </AppText>
        <View style={styles.buttonContainer}>
          <AppButton
            transparent
            onPress={() => {
              if (props.options && props.options.yesButtonEvent)
                props.options.yesButtonEvent();

              hide();
            }}
          >
            <AppText
              labelColorType={ColorType.Success}
              labelType={LabelType.Label}
              size={FontSizes.XL}
            >
              {translate("messageBox.allCollect")}
            </AppText>
          </AppButton>
        </View>
      </View>
    </View>
  );
};
export default MbOmsComplete;

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
