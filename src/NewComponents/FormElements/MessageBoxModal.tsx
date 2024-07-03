import { translate } from "i18n-js";
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ParagraphText, ParagraphTextType } from "..";
import { AppColor } from "../../theme/AppColor";
import AppButton, { AppButtonType } from "./AppButton";

const { width, height } = Dimensions.get("window");

const TextMessageContent: React.FC = (props) => {
  return (
    <View style={styles.textContentContainer}>
      <ParagraphText
        style={{ color: AppColor.FD.Text.Ash }}
        type={ParagraphTextType.L}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore culpa
      </ParagraphText>
      <AppButton style={{ marginTop: 30 }} label={"Tamam"} />
      <AppButton
        style={{ marginTop: 10 }}
        label={translate("OmsStoreChiefReport.cancel")}
        type={AppButtonType.Gray}
      />
    </View>
  );
};

const MessageBoxModal: React.FC = (props) => (
  <View style={styles.container}>
    <View style={styles.wrapper}>
      <TextMessageContent {...props} />
    </View>
  </View>
);
export default MessageBoxModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {},
  textContentContainer: {
    marginHorizontal: 30,
    width: width - 60,
    backgroundColor: AppColor.OMS.Background.LightPossitive,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 30,
    borderRadius: 30,
  },
});

export interface MessageBoxModalProps {}
export enum MessageBoxType {
  Standart,
  YesNo,
  Wait,
  BasketNumber,
  SmsValidation,
  Validation,
  StockOutValidation,
}
