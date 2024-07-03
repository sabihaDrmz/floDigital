import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  AppButton,
  AppText,
  ColorType,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { translate } from "../../helper/localization/locaizationMain";
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { useEasyReturnService } from "../../contexts/EasyReturnService";
const CancelListComplete: React.FC = (props) => {
  const [code, setCode] = useState("");
  const [validationTime, setValidationTime] = useState(150);
  const { erOrder, isLoading, CompleteCancelEvent, InitializeCancellationEvent } = useEasyReturnService();
  useEffect(() => {
    if (validationTime > 0) {
      setTimeout(() => {
        setValidationTime(validationTime - 1);
      }, 1000);
    }
  }, [validationTime]);
  return (
    <View style={styles.container}>
      <FloHeaderNew
        enableButtons={["back"]}
        headerType="standart"
        headerTitle={translate("cancellationScreen.smsApprove")}
      />
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ height: 100, justifyContent: "center", alignItems: "center" }}>
            <AppText
              labelType={LabelType.Label}
              style={{ textAlign: "center", lineHeight: 25 }}
            >
              {translate("cancellationScreen.smsApproveCode")}
            </AppText>
          </View>
          <View style={[{ flex: 1, justifyContent: "center" }, Platform.OS === "web" && { alignItems: "center" }]}>
            <OTPInputView
              style={{ height: 100, bottom: 40, paddingHorizontal: 80 }}
              autoFocusOnLoad
              pinCount={4}
              code={code}
              onCodeChanged={setCode}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
            />
          </View>
          <View style={{ paddingHorizontal: 40, marginBottom: 20 }}>
            <AppButton
              title={translate("cancellationScreen.verify")}
              style={{
                height: 60,
                marginBottom: 10,
              }}
              onPress={() => {
                if (code.length === 4)
                  CompleteCancelEvent(code);
              }}
              disabled={code.length !== 4}
              loading={isLoading}
              buttonColorType={code.length === 4 ? ColorType.Brand : undefined}
            />
            <AppButton
              title={`${translate(
                "cancellationScreen.resend"
              )} (${validationTime})`}
              disabled={validationTime > 0}
              transparent
              style={{
                borderWidth: 1,
                height: 60,
                borderColor: "rgb(165 ,165 ,165)",
              }}
              loading={isLoading}
              textStyle={{
                color: "rgb(105 ,105 ,105)",
                fontFamily: "Poppins_300Light",
              }}
              onPress={() => {
                setValidationTime(150);
                InitializeCancellationEvent({
                  voucherNo: "",
                  orderNo: erOrder[0].orderNo,
                  ficheNumber: erOrder[0].ficheNumber,
                });
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View >
  );
};
export default CancelListComplete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  borderStyleHighLighted: {
    borderColor: "#03DAC6"
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 2,
    color: "#ff8600",
    fontSize: 24,
    marginHorizontal: 10
  },

  underlineStyleHighLighted: {
    borderColor: "#ff8600"
  },
});
