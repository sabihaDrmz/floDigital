import { FloButton, FloTextBox } from "components";
import { useMessageBoxService } from "contexts/MessageBoxService";
import { MessageBoxType } from "contexts/model/MessageBoxOptions";
import { translate } from "helper/localization/locaizationMain";
import { PerfectFontSize } from "helper/PerfectPixel";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { colors } from "theme/colors";

interface MbSmsValidationProps { }

const MbSmsValidation: React.FC<MbSmsValidationProps> = (props) => {
  const [validationCode, setValidationCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const MessageBox = useMessageBoxService();
  useEffect(() => {
    if (
      MessageBox.isShow &&
      MessageBox.options?.type === MessageBoxType.SmsValidation
    )
      setTimeLeft(MessageBox.options?.customSmsValidationTime || 180);
  }, [MessageBox.isShow]);

  useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
  }, [timeLeft]);
  return (
    <TouchableWithoutFeedback  onPress={() => {Platform.OS !== "web" && Keyboard.dismiss()}}>
      <View style={styles.container}>
        <View style={styles.card}>
          <FloTextBox
            placeholder={translate("messageBox.smsValidationCode")}
            floatingLabel
            keyboardType={"number-pad"}
            maxLength={6}
            onlyNumber
            onChangeText={setValidationCode}
          />
          {MessageBox.message ? (
            <Text
              style={{
                marginBottom: 20,
                fontSize: PerfectFontSize(17),
                fontFamily: "Poppins_400Regular",
              }}
            >
              {MessageBox.message}
            </Text>
          ) : null}
          {timeLeft > 0 ? (
            <Text
              style={{
                fontSize: PerfectFontSize(30),
                fontFamily: "Poppins_700Bold",
                color: colors.darkGrey,
                textAlign: "center",
                marginBottom: 30,
              }}
            >
              {`${new Date(timeLeft * 1000).toISOString().substr(14, 5)}`}
            </Text>
          ) : (
            <FloButton
              title={translate("messageBox.resened")}
              containerStyle={{
                width: Dimensions.get("window").width - 70,
                marginBottom: 10,
              }}
              onPress={() => {
                if (MessageBox.options?.reSendSms) {
                  setTimeLeft(MessageBox.options.customSmsValidationTime || 180);
                  MessageBox.options.reSendSms();
                }
              }}
            />
          )}
          <FloButton
            title={translate("messageBox.validate")}
            containerStyle={{
              width: Dimensions.get("window").width - 70,
              marginBottom: 10,
            }}
            onPress={() => {
              if (MessageBox.options?.onValidate) {
                MessageBox.options.onValidate(validationCode);
              }
            }}
          />
          <FloButton
            title={translate("messageBox.cancel")}
            containerStyle={{
              backgroundColor: "red",
              width: Dimensions.get("window").width - 70,
              marginBottom: 10,
            }}
            onPress={() => {
              MessageBox.hide();
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default MbSmsValidation;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
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
});
