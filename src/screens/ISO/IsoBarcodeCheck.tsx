import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloButton } from "../../components";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import RoleGroup, { isInRole } from "../../components/RoleGroup";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import ProductService from "../../core/services/ProductService";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import { TextManipulator } from "../../NewComponents/FormElements/AppTextBox";
import { colors } from "../../theme/colors";

class IsoBarcodeCheck extends Component {
  state = { txtInput: __DEV__ ? "8680733650189" : "", isGeneric: false };
  txtInput: TextInput | null | undefined;
  isFind = false;
  findProduct(barcode: string) {
    if (this.isFind) return;
    this.isFind = true;
    if (barcode === "") {
      MessageBox.Show(
        this.state.isGeneric
          ? translate("errorMsgs.pleaseEnterValidGenericCode")
          : translate("errorMsgs.pleaseEnterValidBarcode"),
        MessageBoxDetailType.Information,
        MessageBoxType.Standart,
        () => {},
        () => {}
      );
      this.isFind = false;
      return;
    }
    Actions["isoProduct"]({ hideTabBar: true });

    ProductService.getProduct(barcode, 2, this.state.isGeneric)
      .then(() => {
        this.isFind = false;
      })
      .catch(() => (this.isFind = false));
  }

  setGeneric(value: boolean) {
    this.setState({ isGeneric: value });
  }

  render() {
    return (
      <React.Fragment>
        <FloHeaderNew
          headerType={"standart"}
          enableButtons={
            isInRole("omc-basket-pos") ? ["basket", "profile"] : ["profile"]
          }
          showLogo
        />
        <RoleGroup roleName={"omc-find-product"}>
          <KeyboardAwareScrollView bounces={false}>
            {this.renderBasketButton()}
            {this.renderCameraButton()}
            {this.orLine()}
            {this.renderManual()}
          </KeyboardAwareScrollView>
        </RoleGroup>
        <SafeAreaView />
      </React.Fragment>
    );
  }

  orLine = () => {
    return (
      <View>
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
      </View>
    );
  };

  renderManual = () => {
    return (
      <View style={styles.manualContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 20,
            paddingHorizontal: 2,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              this.state.txtInput = "";
              this.setGeneric(false);
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
                  backgroundColor: this.state.isGeneric ? "#fff" : "#ff8600",
                }}
              ></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              this.state.txtInput = "";
              this.setGeneric(true);
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
                  backgroundColor: this.state.isGeneric ? "#ff8600" : "#fff",
                }}
              ></View>
            </View>
          </TouchableOpacity>
        </View>
        <FloTextBoxNew
          placeholder={
            this.state.isGeneric
              ? translate("findBarcodeManual.enterGenericCode")
              : translate("findBarcodeManual.enterBarcode")
          }
          keyboardType={"number-pad"}
          value={this.state.txtInput}
          maxLength={this.state.isGeneric ? 18 : 13}
          onChangeText={(txt) =>
            this.setState({ txtInput: TextManipulator(txt, "onlyNumber") })
          }
        />
        <FloButton
          title={translate("findBarcode.check")}
          onPress={() => {
            this.findProduct(this.state.txtInput);
          }}
          containerStyle={{
            marginBottom: PerfectPixelSize(10),
            marginRight: 20,
            marginLeft: 20,
            marginTop: 20,
            borderRadius: 8,
          }}
        />
      </View>
    );
  };
  renderCameraButton = () => {
    return (
      <>
        <View style={styles.basketButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              Actions["isoCamera"]({
                onReadBarcode: (barcode: string) => {
                  if (Actions.currentScene === "isoCamera") Actions.pop();

                  this.findProduct(barcode);
                },
              });
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 0,
              marginBottom: PerfectPixelSize(30),
            }}
          >
            <Image
              source={require("../../../assets/S.png")}
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

  renderBasketButton = () => {
    if (isInRole("omc-basket-pos"))
      return (
        <View style={styles.basketButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              Actions["isoBasketList"]();
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              marginBottom: PerfectPixelSize(0),
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../../../assets/basketsicon.png")}
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
}
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
    padding: 30,
    paddingBottom: 0,
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
