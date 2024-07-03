import { observer } from "mobx-react";
import moment from "moment";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TextInput,
  SectionList,
  Image,
  TouchableOpacity,
} from "react-native";
import {} from "react-native-gesture-handler";
import { FlatList } from "react-native-gesture-handler";
import { color } from "react-native-reanimated";
import { Actions } from "react-native-router-flux";
import {
  AntDesign,
  FloButton,
  FloTextBox,
  FontAwesome,
} from "../../components";
import { FloHeader } from "../../components/Header";
import { TransactionSource } from "../../core/models/EasyReturnTrasnaction";
import AccountService from "../../core/services/AccountService";
import EasyReturnService from "../../core/services/EasyReturnService";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import FicheHeader from "./partials/FicheHeader";

@observer
class EasyReturnFicheList extends Component {
  state = { selectedFiche: "" };

  _renderSearchBar = () => {
    return (
      <View
        style={{
          marginTop: 10,
          marginLeft: 25,
          marginRight: 25,
          backgroundColor: colors.whiteThree,
          borderRadius: 7,
          marginBottom: 10,
          paddingLeft: 10,
        }}
      >
        <AntDesign
          name={"search1"}
          style={{ position: "absolute", left: 10, top: 10 }}
          size={25}
          color={colors.darkGrey}
        />
        <TextInput
          placeholder={translate("OmsCargoConsensus.search") + "..."}
          style={{
            paddingLeft: 31,
            color: colors.darkGrey,
            fontFamily: "Poppins_400Regular",
            fontSize: PerfectFontSize(13),
            lineHeight: PerfectFontSize(17),
            borderWidth: 0,
          }}
          placeholderTextColor={colors.darkGrey}
          underlineColorAndroid={"transparent"}
        />
      </View>
    );
  };

  render() {
    if (!EasyReturnService.currentFicheList) {
      return null;
    }
    return (
      <React.Fragment>
        <FloHeader
          headerType={"standart"}
          enableButtons={["back", "profile"]}
          headerTitle={translate("easyReturnFicheList.title")}
        />

        <SectionList
          sections={EasyReturnService.currentFicheList}
          stickySectionHeadersEnabled
          initialNumToRender={50}
          style={{ flex: 1, backgroundColor: "#fff" }}
          renderItem={(itr) => (
            <View
              style={{
                padding: 20,
                backgroundColor: "rgba(0,0,0,0.040)",
                flexDirection: "row",
              }}
            >
              <Image
                source={{ uri: itr.item.picture }}
                style={{ height: 64, width: 64 }}
              />
              <View style={{ marginLeft: 20 }}>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: PerfectFontSize(14),
                    lineHeight: PerfectFontSize(15),
                    letterSpacing: -0.35,
                    width: Dimensions.get("window").width - 100,
                  }}
                >
                  {itr.item.productName}
                </Text>
                <View>
                  <Text>
                    {translate("easyReturnFicheList.size")}
                    {itr.item.size}
                  </Text>
                  <Text>{`${translate("easyReturnFicheList.quantity")} ${
                    itr.item.quantity
                  }`}</Text>
                  {/* <Text>
                    Ürün Fiyatı: {Number(itr.item.price).toFixed(2)} TL
                  </Text> */}
                  {/* <Text>
                    Satış Tutarı: {itr.item.paymentPrice.toFixed(2)} TL
                  </Text> */}
                </View>
              </View>
            </View>
          )}
          SectionSeparatorComponent={() => <View style={{ height: 20 }} />}
          renderSectionHeader={(header) => (
            <TouchableOpacity
              onPress={() =>
                header.section.ficheKey.includes("RFDM") ||
                EasyReturnService.currentFicheList.find(
                  (x) => x.ficheRef === header.section.ficheKey
                )
                  ? null
                  : this.setState({ selectedFiche: header.section.ficheKey })
              }
              activeOpacity={0.9}
              style={{
                padding: 5,
                flexDirection: "row",
                backgroundColor: colors.white,
                borderBottomWidth: 1,
                borderColor: "rgba(0,0,0,0.4)",
                justifyContent: "space-between",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderWidth: 1,
              }}
            >
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontFamily: "Poppins_300Light",
                      fontSize: PerfectFontSize(12),
                      lineHeight: PerfectFontSize(18),
                      letterSpacing: -0.3,
                    }}
                  >
                    {translate("easyReturnFicheList.ficheNumber")}{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: PerfectFontSize(12),
                      lineHeight: PerfectFontSize(18),
                      letterSpacing: -0.3,
                    }}
                  >
                    {header.section.ficheKey}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontFamily: "Poppins_300Light",
                      fontSize: PerfectFontSize(12),
                      lineHeight: PerfectFontSize(18),
                      letterSpacing: -0.3,
                    }}
                  >
                    {translate("easyReturnFicheList.customerName")}{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: PerfectFontSize(12),
                      lineHeight: PerfectFontSize(18),
                      letterSpacing: -0.3,
                    }}
                  >
                    {header.section.customerName}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontFamily: "Poppins_300Light",
                      fontSize: PerfectFontSize(12),
                      lineHeight: PerfectFontSize(18),
                      letterSpacing: -0.3,
                    }}
                  >
                    {translate("easyReturnFicheList.phone")}{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: PerfectFontSize(12),
                      lineHeight: PerfectFontSize(18),
                      letterSpacing: -0.3,
                    }}
                  >
                    {header.section.customerPhone}
                  </Text>
                </View>
              </View>
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontFamily: "Poppins_300Light",
                      fontSize: PerfectFontSize(12),
                      lineHeight: PerfectFontSize(18),
                      letterSpacing: -0.3,
                    }}
                  >
                    {translate("easyReturnFicheList.price")}{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: PerfectFontSize(12),
                      lineHeight: PerfectFontSize(18),
                      letterSpacing: -0.3,
                    }}
                  >
                    {Number(header.section.totalPrice).toFixed(2)} TL
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontFamily: "Poppins_300Light",
                      fontSize: PerfectFontSize(12),
                      lineHeight: PerfectFontSize(18),
                      letterSpacing: -0.3,
                    }}
                  >
                    {translate("easyReturnFicheList.date")}{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: PerfectFontSize(12),
                      lineHeight: PerfectFontSize(18),
                      letterSpacing: -0.3,
                    }}
                  >
                    {moment(new Date(header.section.ficheDate)).format(
                      "DD/MM/yyyy"
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    position: "absolute",
                    bottom: 2,
                    width: 145,
                    right: 0,
                  }}
                >
                  {header.section.ficheKey.includes("RFDM") ||
                  EasyReturnService.currentFicheList.find(
                    (x) => x.ficheRef === header.section.ficheKey
                  ) ? (
                    <Text
                      style={{ color: "red", fontSize: PerfectFontSize(11) }}
                    >
                      {translate("easyReturnFicheList.orderNotCancelled")}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={{ justifyContent: "center", paddingRight: 10 }}>
                <FontAwesome
                  name={
                    this.state.selectedFiche === header.section.ficheKey
                      ? "dot-circle-o"
                      : "circle-o"
                  }
                  size={25}
                  color={colors.brightOrange}
                />
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={() => <View style={{ height: 80 }}></View>}
        />
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            borderTopColor: "rgba(0,0,0,0.1)",
            borderTopWidth: 1,
          }}
        >
          <FloButton
            activeOpacity={0.9}
            style={{}}
            title={translate("easyReturnFicheList.continue")}
            onPress={() => {
              EasyReturnService.returnSelectItemPropMap = [];

              var temp = EasyReturnService.findFicheRequest;
              EasyReturnService.findFicheRequest = {
                activeStore: AccountService.getUserStoreId(),
                gsm: "",
                paymentType: "",
                receiptNumber: this.state.selectedFiche,
                shippingStore: "",
                shippingDate: "",
                barcode: "",
              };
              EasyReturnService.checkEasyReturn(
                TransactionSource.WithDocInquiry
              ).then((res) => {
                EasyReturnService.findFicheRequest = temp;
              });
              // EasyReturnService.currentFiche = EasyReturnService.currentFicheList.find(
              //   (x) => x.ficheKey === this.state.selectedFiche,
              // );
              // Actions['easyReturnProduct']();
            }}
          />
        </View>
        <SafeAreaView />
      </React.Fragment>
    );
  }

  getRandomColor = () => {
    return (
      "rgb(" +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      ")"
    );
  };
}
export default EasyReturnFicheList;

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: wWidth - 50,
    borderWidth: 2,
    borderColor: colors.whiteTwo,
    marginLeft: 25,
    marginBottom: 25,
    marginRight: 25,
    borderRadius: 8,
  },
  cardTr: {
    flexDirection: "row",
  },
  cardTh: {
    width: 100,
    borderColor: colors.whiteTwo,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cardThLast: {
    borderBottomWidth: 0,
  },
  cardTd: {
    borderColor: colors.whiteTwo,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    padding: 10,
    width: wWidth - 152,
  },
  cardTdLast: {
    borderBottomWidth: 0,
  },
  cardCheckInfo: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    width: wWidth - 52,
  },
});
