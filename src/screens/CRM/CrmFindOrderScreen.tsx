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
} from "react-native";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import { FloButton } from "../../components";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { FloHeader } from "../../components/Header";
import CrmService from "../../core/services/CrmService";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";

const CrmFindOrder: React.FC = (props) => {
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
        headerTitle={translate("crmFindOrderScreen.title")}
      />
      <Observer>
        {() => {
          return (
            <KeyboardAwareScrollView bounces={false}>
              <View style={styles.cameraButton}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (!CrmService.isLoading)
                      Actions["crmCameraScreen"]({
                        onReadComplete: (barcode: string) => {
                          if (
                            !CrmService.isLoading &&
                            Actions.currentScene === "crmCameraScreen"
                          )
                            CrmService.crmGetOrders(barcode);
                        },
                        headerTitle: translate("crmFindOrderScreen.checkOrder"),
                      });
                  }}
                >
                  <Image
                    style={styles.cameraButtonIco}
                    source={require("../../../assets/S.png")}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <View style={styles.orTextContainer}>
                  <Text style={styles.orText}>
                    {" "}
                    {translate("crmFindOrderScreen.or")}
                  </Text>
                </View>
                <View style={styles.orLine} />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {translate("crmFindOrderScreen.orderFicheNo")}
                </Text>
                <FloTextBoxNew
                  onChangeText={(txt) => setInputValue(clearChars(txt))}
                  // style={styles.input}
                  value={inputValue}
                  placeholder={translate("crmFindOrderScreen.enterNumber")}
                  keyboardType={"number-pad"}
                />
              </View>
              <FloButton
                linearColos={["rgb(255,134,0)", "rgb(219,118,7)"]}
                containerStyle={styles.button}
                title={translate("crmFindOrderScreen.execCheckOrder")}
                onPress={() => {
                  CrmService.crmGetOrders(inputValue).then((r) => {
                    setInputValue("");
                  });
                }}
                isLoading={CrmService.isLoading}
              />
            </KeyboardAwareScrollView>
          );
        }}
      </Observer>
    </View>
  );
};
export default CrmFindOrder;

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
    marginBottom: PerfectPixelSize(15),
  },
  inputContainer: {
    justifyContent: "center",
    marginTop: PerfectPixelSize(40),
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
    marginTop: PerfectPixelSize(70),
  },
});
