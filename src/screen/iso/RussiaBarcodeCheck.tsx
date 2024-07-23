import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Vibration } from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { translate } from "../../helper/localization/locaizationMain";
import { colors } from "../../theme/colors";
import {
  PerfectFontSize,
  PerfectPixelSize,
} from "../../helper/PerfectPixel";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { TextManipulator } from "../../NewComponents/FormElements/AppTextBox";
import { FloButton } from "../../components";
import RoleGroup from "../../components/RoleGroup";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { useAccountService } from "../../contexts/AccountService";
import { useProductService } from "../../contexts/ProductService";
import MainCamera from "../../components/MainCamera";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { MaterialIcons } from "../../components";
//TODO: EXPO AV expo-av ++++++ only test
// import { Audio } from 'expo-av';
import { NavigationType } from "./Navigation";
import FloLoading from "../../components/FloLoading";

import { playSound } from "../../core/Util";

interface IsoBarcodeCheckProps {
}

interface barcodeOrGeneric {
  barcode: string;
  generic: string;
};

const RussiaBarcodeCheck: React.FC<IsoBarcodeCheckProps> = (props) => {
  const { getRussiaQrCode, isLoading } = useProductService();
  const [state, setState] = useState({
    txtInput: "",
    isGeneric: false,
  });
  const [isCameraShow, setIsCameraShow] = useState(false);
  const [barcodes, setbarcodes] = useState<barcodeOrGeneric[]>([]);



  const handleVibratePattern = async () => {
    const vibrationPromise = new Promise<void>((resolve) => {
      Vibration.vibrate([1000]);
      resolve();
    });

    // Ses oynatma Promise'i
    const soundPromise =
      new Promise<void>((resolve) => {
        playSound(require('../../assets/ping.mp3'));
        resolve();
      });

    // Her iki Promise'i aynı anda başlatıyoruz
    await Promise.all([vibrationPromise, soundPromise]);
  };
  const addBarcode = async (barcodeOrGeneric: barcodeOrGeneric) => {

    if (barcodeOrGeneric.barcode) {
      const existingProductIndex = barcodes.findIndex(x => x.barcode === barcodeOrGeneric.barcode);
      if (existingProductIndex === -1) {
        setbarcodes([...barcodes, barcodeOrGeneric]);
        await handleVibratePattern();
      }
    } else {
      const existingProductIndex = barcodes.findIndex(x => x.generic === barcodeOrGeneric.generic);
      if (existingProductIndex === -1) {
        setbarcodes([...barcodes, barcodeOrGeneric]);
        await handleVibratePattern();
      }
    }
  };

  const deleteBarcode = async (barcodeOrGeneric: barcodeOrGeneric) => {
    if (barcodeOrGeneric.barcode) {
      const tmpBarcodes = barcodes.filter(x => x.barcode !== barcodeOrGeneric.barcode);
      setbarcodes(tmpBarcodes)
    } else {
      const tmpBarcodes = barcodes.filter(x => x.generic !== barcodeOrGeneric.generic);
      setbarcodes(tmpBarcodes)
    }
  }

  const orLine = () => {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              height: 1,
              width: "25%",
              backgroundColor: colors.warm_grey_three,
            }}
          ></View>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: PerfectFontSize(16),
              fontWeight: "500",
              fontStyle: "normal",
              lineHeight: PerfectFontSize(21),
              letterSpacing: 0,
              textAlign: "center",
              color: "rgb(171,170,172)",
              // backgroundColor: colors.white,
              padding: 5,
            }}
          >
            {translate("or")}
          </Text>
          <View
            style={{
              width: "25%",
              height: 1,
              backgroundColor: colors.warm_grey_three,
            }}
          ></View>
        </View>
      </>
    );
  };



  const renderManual = () => {
    return (
      <View style={styles.manualContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 2,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              setState({
                txtInput: "",
                isGeneric: false,
              });
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                color: "#707070",
                marginRight: 10,
              }}
            >
              {translate("isoBarcodeCheck.barcode")}
            </Text>
            <View
              style={{
                width: 21,
                height: 21,
                borderRadius: 10.5,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ff8600",
              }}
            >
              <View
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 7.5,
                  backgroundColor: state.isGeneric ? "#fff" : "#ff8600",
                }}
              ></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              setState({
                txtInput: "",
                isGeneric: true,
              });
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                color: "#707070",
                marginRight: 10,
              }}
            >
              {translate("isoBarcodeCheck.generic")}
            </Text>
            <View
              style={{
                width: 21,
                height: 21,
                borderRadius: 10.5,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ff8600",
              }}
            >
              <View
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 7.5,
                  backgroundColor: state.isGeneric ? "#ff8600" : "#fff",
                }}
              ></View>
            </View>
          </TouchableOpacity>
        </View>
        <FloTextBoxNew
          placeholder={
            state.isGeneric
              ? translate("findBarcodeManual.enterGenericCode")
              : translate("findBarcodeManual.enterBarcode")
          }
          keyboardType={"number-pad"}
          value={state.txtInput}
          maxLength={state.isGeneric ? 18 : 13}
          onChangeText={(txt) =>
            setState({
              txtInput: TextManipulator(txt, "onlyNumber"),
              isGeneric: state.isGeneric,
            })
          }
        />
        <FloButton
          //   title={translate("findBarcode.check")}
          title={"Добавить в список"}
          onPress={() => {
            // findProduct(state.txtInput);
            if (state.txtInput) {
              let data: barcodeOrGeneric;
              if (state.isGeneric) {
                data = {
                  barcode: "",
                  generic: state.txtInput
                }
                addBarcode(data)
              } else {
                data = {
                  barcode: state.txtInput,
                  generic: ""
                }
                addBarcode(data)
              }
            }
          }}
          containerStyle={{
            marginBottom: 40,
            marginTop: 10,
            borderRadius: 8,
          }}
        />
      </View>
    );
  };

  const renderCameraButton = () => {
    return (
      <>
        <View style={styles.basketButtonContainer}>
          <TouchableOpacity
            onPress={() => setIsCameraShow(true)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 0,
              marginBottom: PerfectPixelSize(30),
            }}
          >
            <Image
              source={require("../../assets/S.png")}
              style={{
                width: PerfectPixelSize(112),
                height: PerfectPixelSize(103),
              }}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderQrList = () => {
    return (
      <View style={{ backgroundColor: "#FFFFFF", flex: 1, marginHorizontal: 30, borderRadius: 20, padding: 15 }}>
        <FlatList
          data={barcodes}
          renderItem={({ item, index }) => {
            return (
              (
                <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.barcodeText} key={index}>{item.barcode ? item.barcode : item.generic}</Text>
                  <TouchableOpacity onPress={() => deleteBarcode(item)}>
                    <MaterialIcons name="cancel" size={32} color="red" />
                  </TouchableOpacity>
                </View>
              )
            )
          }}
          ListEmptyComponent={<Text style={{ fontFamily: "Poppins_500Medium", fontSize: PerfectFontSize(16), textAlign: "center", marginBottom: 30,flexShrink:1 }}>Добавить штрих-код или универсальный</Text>}
        />
        <FloButton
          title={"Создать Qr"}
          onPress={() => {
            // navigation.navigate("RussiaQrList")
            const { generic, barcode } = barcodes.reduce(
              (acc, item) => {
                if (item.generic !== "") {
                  acc.generic.push(item.generic);
                }
                if (item.barcode !== "") {
                  acc.barcode.push(item.barcode);
                }
                return acc;
              },
              { generic: [] as string[], barcode: [] as string[] }
            );
            getRussiaQrCode(false, barcode, generic)

          }}
          containerStyle={{
            marginVertical: 10,
            borderRadius: 8,
            backgroundColor: barcodes.length > 0 ? colors.floOrange : colors.lightGrayText
          }}
          disabled={barcodes.length > 0 ? false : true}
        />
      </View>
    )
  }

  return (
    <>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        showLogo
      />
      <KeyboardAwareScrollView
        enableAutomaticScroll
        extraHeight={50}
        extraScrollHeight={50}
        enableOnAndroid
        style={{ backgroundColor: "#F2F2F2" }}
      >

        {renderCameraButton()}
        {orLine()}
        {renderManual()}
        {renderQrList()}
      </KeyboardAwareScrollView>

      <MainCamera
        isShow={isCameraShow}
        onReadComplete={(barcode) => {
          const data: barcodeOrGeneric = {
            barcode: barcode,
            generic: ""
          }
          addBarcode(data)
        }}
        onHide={() => setIsCameraShow(false)}
      />
      {isLoading && <FloLoading />}

    </>
  );
};
export default RussiaBarcodeCheck;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  manualContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    paddingHorizontal: 40,
  },
  cameraContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cameraTitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(14),
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: PerfectFontSize(18),
    letterSpacing: 0,
    textAlign: "center",
    color: colors.darkGrey,
    marginBottom: PerfectPixelSize(30),
  },
  basketButtonTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  basketButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: colors.whiteThree,
    borderBottomWidth: 0,
  },
  basketButtonTitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(18),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.white,
    marginLeft: 10,
  },
  basketButtonInfo: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(12),
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: PerfectFontSize(15),
    letterSpacing: 0,
    textAlign: "center",
    color: colors.darkGrey,
    marginTop: 10,
  },
  barcodeText: {
    fontFamily: "Poppins_500Medium",
    fontSize: PerfectFontSize(16),
    marginHorizontal: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    marginBottom: 10,
    width: "80%"
  }
});
