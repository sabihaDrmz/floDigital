import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Keyboard,
  Platform,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { FloHeader } from "../../components/Header";
import EasyReturnService from "../../core/services/EasyReturnService";
import { translate } from "../../helper/localization/locaizationMain";

const InputSplit: React.FC<{
  value: string | undefined;
  showIndicator: boolean;
}> = (props) => {
  return (
    <View style={{ zIndex: 9999, elevation: 9999 }}>
      <View>
        <Text
          style={{
            width: 20,
            textAlign: "center",
            fontSize: 20,
            height: 30.5,
          }}
        >
          {props.value}
        </Text>
        <View
          style={{
            height: 1.5,
            backgroundColor: AppColor.FD.Text.Ash,
            width: 20,
            marginRight: 10,
          }}
        />
      </View>
    </View>
  );
};
const CancelListComplete: React.FC = (props) => {
  const [code, setCode] = useState("");
  const txtRef = useRef<TextInput>(null);
  const [remainingTime, setRemainingTime] = useState(150);
  useEffect(() => {
    if (txtRef.current && code.length < 4)
      if (Platform.OS === "ios")
        //@ts-ignore
        txtRef.current.focus();
  });
  return (
    <View style={styles.container}>
      <FloHeader
        enableButtons={["back"]}
        headerType="standart"
        headerTitle={translate("cancellationScreen.smsApprove")}
      />
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <AppText
          labelType={LabelType.Label}
          style={{ textAlign: "center", lineHeight: 30 }}
        >
          {translate("cancellationScreen.smsApproveCode")}
        </AppText>
        <View
          style={{
            width: 30 * 4,
          }}
        >
          <TextInput
            ref={txtRef}
            style={{
              letterSpacing: 24,
              marginLeft: 10,
              width: 30 * 4,
              fontSize: 18,
              height: 50,
              fontFamily: "Poppins_300Light",
              color: "transparent",
              position: "absolute",
            }}
            selectionColor={
              code.length === 4 ? "transparent" : "rgba(255,126,16, .9)"
            }
            placeholder=" "
            maxLength={4}
            onChangeText={setCode}
            value={code}
          />
          <TouchableOpacity
            onPress={() => {
              if (txtRef.current)
                //@ts-ignore
                txtRef.current.focus();
            }}
            style={{ flexDirection: "row", height: 50 }}
          >
            <InputSplit
              value={code.length > 0 ? code[0] : undefined}
              showIndicator={code.length === 0}
            />
            <InputSplit
              value={code.length > 1 ? code[1] : undefined}
              showIndicator={code.length === 1}
            />
            <InputSplit
              value={code.length > 2 ? code[2] : undefined}
              showIndicator={code.length === 2}
            />
            <InputSplit
              value={code.length > 3 ? code[3] : undefined}
              showIndicator={code.length === 3}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Observer>
        {() => {
          return (
            <View style={{ paddingHorizontal: 40 }}>
              <AppButton
                title={translate("cancellationScreen.verify")}
                style={{
                  height: 60,
                  marginBottom: 20,
                }}
                onPress={() => {
                  EasyReturnService.CompleteCancelEvent(code);
                }}
                loading={EasyReturnService.isLoading}
                buttonColorType={
                  code.length === 4 ? ColorType.Brand : undefined
                }
              />
              <AppButton
                title={`${translate("cancellationScreen.resend")} (${EasyReturnService.validationTime})`}
                disabled={EasyReturnService.validationTime > 0}
                transparent
                style={{
                  borderWidth: 1,
                  height: 60,
                  borderColor: "rgb(165 ,165 ,165)",
                }}
                loading={EasyReturnService.isLoading}
                textStyle={{
                  color: "rgb(105 ,105 ,105)",
                  fontFamily: "Poppins_300Light",
                }}
                onPress={() => {
                  EasyReturnService.InitializeCancellationEvent({
                    voucherNo: "",
                    orderNo: EasyReturnService.ErOrder[0].orderNo,
                    ficheNumber: EasyReturnService.ErOrder[0].ficheNumber,
                  });
                }}
              />
              <SafeAreaView />
            </View>
          );
        }}
      </Observer>
    </View>
  );
};
export default CancelListComplete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
