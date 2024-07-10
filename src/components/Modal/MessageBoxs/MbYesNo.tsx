import {
  AppButton,
  AppText,
  ColorType,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import { useMessageBoxService } from "../../../contexts/MessageBoxService";
import { MessageBoxOptions } from "../../../contexts/model/MessageBoxOptions";
import { translate } from "../../../helper/localization/locaizationMain";

const MbYesNo: React.FC<{ message: string; options?: MessageBoxOptions }> = (
  props
) => {
  const { hide } = useMessageBoxService();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {props.options && props.options.icon && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <View style={{ width: 50, height: 50 }}>{props.options.icon}</View>
          </View>
        )}
        <AppText
          style={{ marginBottom: 20, textAlign: "center", fontWeight: "400" }}
          labelType={LabelType.Label}
        >
          {props.message}
        </AppText>
        <View style={styles.buttonContainer}>
          <AppButton
            title={
              props.options !== undefined &&
                props.options.noButtonTitle !== undefined
                ? props.options.noButtonTitle
                : "Hayır"
            }
            buttonColorType={
              props.options !== undefined &&
                props.options.noButtonColorType !== undefined
                ? props.options.noButtonColorType
                : ColorType.Danger
            }
            style={{ width: "49%" }}
            onPress={() => {
              if (props.options && props.options.noButtonEvent)
                props.options.noButtonEvent();

              hide();
            }}
          />
          <AppButton
            title={
              props.options !== undefined &&
                props.options.yesButtonTitle !== undefined
                ? props.options.yesButtonTitle
                : translate("warehouseRequest.yes")
            }
            style={{ width: "49%" }}
            buttonColorType={
              props.options !== undefined &&
                props.options.yesButtonColorType !== undefined
                ? props.options.yesButtonColorType
                : ColorType.Brand
            }
            onPress={() => {
              if (props.options && props.options.yesButtonEvent)
                props.options.yesButtonEvent();

              hide();
            }}
          />
        </View>
      </View>
    </View>
  );
};
export default MbYesNo;

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
    padding: 16,
    maxWidth: 400,
    borderRadius: 10,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0.3,
  },
  description: {
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0.3,
    fontSize: PerfectFontSize(15),
    marginTop: 9,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
