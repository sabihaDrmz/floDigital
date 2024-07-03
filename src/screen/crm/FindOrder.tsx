import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { FloButton } from "../../components";
import { FloHeader } from "../../components/Header";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import { useCrmService } from "../../contexts/CrmService";
import MainCamera from "../../components/MainCamera";
const FindOrder: React.FC = () => {
  const [isCameraShow, setIsCameraShow] = useState(false);
  const [inputValue, setInputValue] = useState(""),
    {
      container,
      cameraButton,
      cameraButtonIco,
      orContainer,
      orLine,
      orTextContainer,
      orText,
      inputContainer,
      inputLabel,
      button,
    } = styles,
    CrmService = useCrmService(),
    clearChars = (txt: string): string => {
      return txt.replace(/[^a-zA-Z0-9]/g, '');
    };

  return (
    <View style={container}>
      <FloHeader
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={translate("crmFindOrderScreen.title")}
      />
      <KeyboardAwareScrollView bounces={false}>
        <View style={cameraButton}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsCameraShow(true)}
          >
            <Image
              style={cameraButtonIco}
              source={require("../../../assets/S.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={orContainer}>
          <View style={orLine} />
          <View style={orTextContainer}>
            <Text style={orText}> {translate("crmFindOrderScreen.or")}</Text>
          </View>
          <View style={orLine} />
        </View>
        <View style={inputContainer}>
          <Text style={inputLabel}>
            {translate("crmFindOrderScreen.orderFicheNo")}
          </Text>
          <FloTextBoxNew
            onChangeText={(txt) => setInputValue(clearChars(txt))}
            value={inputValue}
            placeholder={translate("crmFindOrderScreen.enterNumber")}
          />
        </View>
        <FloButton
          disabled={!inputValue}
          linearColos={["rgb(255,134,0)", "rgb(219,118,7)"]}
          containerStyle={button}
          title={translate("crmFindOrderScreen.execCheckOrder")}
          onPress={() => {
            CrmService.crmGetOrders(inputValue).then((r) => {
              setInputValue("");
            });
          }}
          isLoading={CrmService.isLoading}
        />
      </KeyboardAwareScrollView>

      <MainCamera
        isShow={isCameraShow}
        onReadComplete={(barcode) => {
          if (!CrmService.isLoading) CrmService.crmGetOrders(barcode);
          setIsCameraShow(false);
        }}
        onHide={() => setIsCameraShow(false)}
      />
    </View>
  );
};
export default FindOrder;

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
