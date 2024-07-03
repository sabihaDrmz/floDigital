import { Observer } from "mobx-react-lite";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  ColorPropType,
} from "react-native";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import { FloButton } from "../../components";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { FloHeader } from "../../components/Header";
import CrmService from "../../core/services/CrmService";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import {
  AppButton,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import { Poppins_200ExtraLight_Italic } from "@expo-google-fonts/poppins";
import EasyReturnService from "../../core/services/EasyReturnService";

const CrmSearchFiche: React.FC = (props) => {
  const [inputValue, setInputValue] = useState("");

  const clearChars = (txt: string): string => {
    let charArray = Array.from(txt);
    txt = charArray
      .filter((x) => {
        x = x.trim();
        if (!x) {
          return false;
        }
        x = x.replace(/^0+/, "") || "0";
        var n = Math.floor(Number(x));
        return n !== Infinity && String(n) === x && n >= 0;
      })
      .join("");

    return txt;
  };
  return (
    <View style={styles.container}>
      <FloHeader
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={"Fiş Bul / Sorgula"}
      />
      <Observer>
        {() => {
          return (
            <KeyboardAwareScrollView bounces={false}>
              <Image
                source={require("../../../assets/ficheSearchIcon.png")}
                style={{
                  marginHorizontal: "40%",
                  width: 100,
                  height: 150,
                  marginTop: 50,
                }}
              />
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Fiş No</Text>
                <FloTextBoxNew
                  onChangeText={setInputValue}
                  // style={styles.input}
                  value={inputValue}
                  placeholder={"Fiş No Giriniz"}
                />
              </View>
              <FloButton
                linearColos={["rgb(255,134,0)", "rgb(219,118,7)"]}
                containerStyle={styles.button}
                title={translate("crmFindOrderScreen.execCheckOrder")}
                onPress={() => {
                  EasyReturnService.ErFindFiche({
                    receiptNumber: inputValue,
                  }).then(() => {});
                }}
                isLoading={EasyReturnService.isLoading}
                disabled={EasyReturnService.isLoading}
              />
              <AppButton
                buttonColorType={ColorType.Warning}
                title={"Belge Bul"}
                onPress={() => {
                  Actions["erFindFiche"]();
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30,
                  marginLeft: 55,
                  marginRight: 55,
                  height: 56,
                }}
              />
            </KeyboardAwareScrollView>
          );
        }}
      </Observer>
    </View>
  );
};
export default CrmSearchFiche;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraButtonIco: {
    width: PerfectPixelSize(112),
    height: PerfectPixelSize(103),
  },
  cameraButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: PerfectPixelSize(35),
    marginBottom: PerfectPixelSize(28),
  },
  orContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  orTextContainer: { paddingLeft: 15, paddingRight: 15 },
  orText: {
    fontSize: PerfectFontSize(16),
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: PerfectFontSize(34),
    letterSpacing: 0.8,
    textAlign: "left",
    color: "#abaaac",
    fontFamily: "Poppins_300Light",
  },
  orLine: {
    height: 1,
    backgroundColor: "#e4e4e4",
    flex: 1,
  },
  inputLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: PerfectFontSize(16),
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: PerfectFontSize(34),
    letterSpacing: 0.8,
    textAlign: "center",
    color: "#707071",
    marginBottom: PerfectPixelSize(5),
  },
  inputContainer: {
    justifyContent: "center",
    paddingLeft: 40,
    paddingRight: 40,
  },
  input: {
    borderRadius: 44,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cecaca",
    paddingVertical: 20,
    paddingHorizontal: 34,
    fontFamily: "Poppins_200ExtraLight_Italic",
    fontSize: PerfectFontSize(15),
    fontWeight: "200",
    fontStyle: "italic",
    lineHeight: PerfectFontSize(18),
    letterSpacing: 0,
    textAlign: "left",
    color: "#a0a0a0",
    ...(Platform.OS === "android" && { padding: 0 }),
  },
  button: {
    marginLeft: 55,
    marginRight: 55,
    marginTop: PerfectPixelSize(30),
  },
});
