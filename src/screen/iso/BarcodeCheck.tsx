import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
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
import KeyboardAwareScrollView from "../../components/KeyboardScroll/KeyboardScroll";
import { useAccountService } from "../../contexts/AccountService";
import { useProductService } from "../../contexts/ProductService";
import MainCamera from "../../components/MainCamera";
import { useNavigation } from "@react-navigation/native";
interface IsoBarcodeCheckProps {
}

const IsoBarcodeCheck: React.FC<IsoBarcodeCheckProps> = (props) => {
  const { show } = useMessageBoxService();
  const navigation = useNavigation();
  const { getProduct } = useProductService();
  const [state, setState] = useState({
    txtInput: __DEV__ ? "8680733650189" : "",
    isGeneric: false,
  });
  const [isFind, setIsFind] = useState(false);
  const { isInRole } = useAccountService();
  const [isCameraShow, setIsCameraShow] = useState(false);

  useEffect(() => {
    if (isFind) setIsFind(false);
  }, []);

  const findProduct = (barcode: string) => {
    if (isFind) return;
    setIsFind(true);
    if (barcode === "") {
      show(
        state.isGeneric
          ? translate("errorMsgs.pleaseEnterValidGenericCode")
          : translate("errorMsgs.pleaseEnterValidBarcode")
      );
      setIsFind(false);
      return;
    }
    //@ts-ignore
    navigation.navigate("Iso", { screen: "Product" });
    getProduct(barcode, 2, state.isGeneric)
      .then((res) => {
        console.log('res:', res)
        if (!res) {
          navigation.navigate('Main', { screen: 'Search' });
        }
      })
      .finally(() => setIsFind(false));
  };

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
          title={translate("findBarcode.check")}
          onPress={() => {
            findProduct(state.txtInput);
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

  const renderBasketButton = () => {
    if (isInRole("omc-basket-pos"))
      return (
        <View style={styles.basketButtonContainer}>
          <TouchableOpacity
            onPress={() =>
              //@ts-ignore
              navigation.navigate("Iso", { screen: "BasketList" })
            }
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              marginBottom: PerfectPixelSize(0),
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../../assets/basketsicon.png")}
              style={{
                width: PerfectPixelSize(73),
                height: PerfectPixelSize(73),
                marginRight: 15,
              }}
            />
            <View>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  color: "#707070",
                  fontSize: PerfectFontSize(16),
                }}
              >
                {translate("isoBarcodeCheck.myBaskets")}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_200ExtraLight",
                  fontSize: PerfectFontSize(13),
                  color: "#A5A5A5",
                }}
              >
                {translate("isoBarcodeCheck.myBasketsDescription")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    else return null;
  };

  return (
    <>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={
          isInRole("omc-basket-pos") ? ["basket", "profile"] : ["profile"]
        }
        showLogo
      />
      <KeyboardAwareScrollView
        enableAutomaticScroll
        extraHeight={50}
        extraScrollHeight={50}
        enableOnAndroid
      >

        <RoleGroup roleName={"omc-find-product"}>
          {renderBasketButton()}
          {renderCameraButton()}
          {orLine()}
          {renderManual()}
        </RoleGroup>
      </KeyboardAwareScrollView>

      <MainCamera
        isShow={isCameraShow}
        onReadComplete={(barcode) => {
          findProduct(barcode);
          setIsCameraShow(false);
        }}
        onHide={() => setIsCameraShow(false)}
      />
    </>
  );
};
export default IsoBarcodeCheck;

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
});
