import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import KeyboardAwareScrollView from "../../components/KeyboardScroll/KeyboardScroll";
import { FloButton } from "../../components";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import { AppButton, ColorType } from "@flomagazacilik/flo-digital-components";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useCrmService } from "../../contexts/CrmService";
import { useNavigation } from "@react-navigation/native";

const SearchFiche: React.FC = ({ }: any) => {
  const navigation = useNavigation();
  const { container, inputContainer, inputLabel, button, imageStyle, appBtn } =
    styles,
    [inputValue, setInputValue] = useState("");

  const { ErFindFiche, isLoading } = useCrmService();

  return (
    <View style={container}>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={"Fiş Bul / Sorgula"}
      />
      <KeyboardAwareScrollView bounces={false}>
        <Image
          source={require("../../assets/ficheSearchIcon.png")}
          style={imageStyle}
        />
        <View style={inputContainer}>
          <Text style={inputLabel}>Fiş No</Text>
          <FloTextBoxNew
            onChangeText={setInputValue}
            value={inputValue}
            placeholder={"Fiş No Giriniz"}
          />
        </View>
        <FloButton
          linearColos={["rgb(255,134,0)", "rgb(219,118,7)"]}
          containerStyle={button}
          title={translate("crmFindOrderScreen.execCheckOrder")}
          onPress={() => {
            ErFindFiche({
              receiptNumber: inputValue,
              isDateRequired: false
            }).then(() => { });
          }}
          isLoading={isLoading}
          disabled={isLoading}
        />
        <AppButton
          buttonColorType={ColorType.Warning}
          title={"Belge Bul"}
          onPress={() => {
            //@ts-ignore
            navigation.navigate("Crm", { screen: "CrmFindFiche" });
          }}
          style={appBtn}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};
export default SearchFiche;

const styles = StyleSheet.create({
  container: {
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
    marginTop: PerfectPixelSize(50),
  },
  imageStyle: {
    marginHorizontal: "40%",
    width: 100,
    height: 150,
    marginTop: 50,
  },
  appBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginLeft: 55,
    marginRight: 55,
    height: 56,
  },
});
