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
import EasyReturnService, {
  GeniusFicheDetail,
} from "../../core/services/EasyReturnService";
import { toCensorText } from "../../core/Util";
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

        <FlatList
          data={EasyReturnService.currentFicheList}
          style={{ padding: 10 }}
          keyExtractor={(item) => item.ficheKey}
          renderItem={(itr) => {
            return (
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 20,
                  borderColor: "rgba(0,0,0,0.2)",
                }}
                key={itr.item.ficheKey}
              >
                <TouchableOpacity
                  style={{
                    height: 67,
                    padding: 10,
                    backgroundColor:
                      this.state.selectedFiche === itr.item.ficheKey
                        ? "rgba(255,103,28,0.05)"
                        : "#FAFAFA",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}
                  disabled={
                    this.state.selectedFiche === itr.item.ficheKey ||
                    itr.item.ficheKey.includes("RFDM") ||
                    EasyReturnService.currentFicheList.find(
                      (x) => x.ficheRef === itr.item.ficheKey
                    )
                  }
                  onPress={() =>
                    this.setState({ selectedFiche: itr.item.ficheKey })
                  }
                >
                  <View style={{ width: 35, justifyContent: "center" }}>
                    <View
                      style={{ justifyContent: "center", paddingRight: 10 }}
                    >
                      <FontAwesome
                        name={
                          this.state.selectedFiche === itr.item.ficheKey
                            ? "dot-circle-o"
                            : "circle-o"
                        }
                        size={25}
                        color={colors.brightOrange}
                      />
                    </View>
                  </View>
                  <View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: PerfectFontSize(12),
                        }}
                      >
                        {translate("easyReturnFicheList.ficheNumber")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_300Light",
                          fontSize: PerfectFontSize(11),
                          lineHeight: PerfectFontSize(16),
                        }}
                      >
                        {itr.item.ficheKey}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: PerfectFontSize(12),
                        }}
                      >
                        {translate("easyReturnFicheList.customerName")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_300Light",
                          fontSize: PerfectFontSize(11),
                          lineHeight: PerfectFontSize(16),
                        }}
                      >
                        {toCensorText(itr.item.customerName)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: PerfectFontSize(12),
                        }}
                      >
                        {translate("easyReturnFicheList.phone")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_300Light",
                          fontSize: PerfectFontSize(11),
                          lineHeight: PerfectFontSize(16),
                        }}
                      >
                        {toCensorText(itr.item.customerPhone)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ right: 10, position: "absolute", top: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: PerfectFontSize(12),
                        }}
                      >
                        {translate("easyReturnFicheList.price")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_300Light",
                          fontSize: PerfectFontSize(11),
                          lineHeight: PerfectFontSize(16),
                        }}
                      >
                        {Number(itr.item.totalPrice).toFixed(2)} TL
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: PerfectFontSize(12),
                        }}
                      >
                        {translate("easyReturnFicheList.date")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_300Light",
                          fontSize: PerfectFontSize(11),
                          lineHeight: PerfectFontSize(16),
                        }}
                      >
                        {moment(new Date(itr.item.ficheDate)).format(
                          "DD/MM/yyyy"
                        )}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: PerfectFontSize(12),
                        }}
                      >
                        {translate("easyReturnFicheList.str")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_300Light",
                          fontSize: PerfectFontSize(11),
                          lineHeight: PerfectFontSize(16),
                        }}
                      >
                        {itr.item.storeNumber}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {itr.item.ficheKey.includes("RFDM") ||
                EasyReturnService.currentFicheList.find(
                  (x) => x.ficheRef === itr.item.ficheKey
                ) ? (
                  <View
                    style={{
                      height: 20,
                      backgroundColor: "rgba(209,0,0,0.05)",
                    }}
                  >
                    <Text
                      style={{
                        color: "rgba(209,0,0,1.00)",
                        fontFamily: "Poppins_400Regular_Italic",
                        fontWeight: "400",
                        fontSize: PerfectFontSize(12),
                        textAlign: "center",
                        lineHeight: PerfectFontSize(18),
                      }}
                    >
                      {translate("easyReturnFicheList.orderNotCancelled")}
                    </Text>
                  </View>
                ) : null}

                <View style={{ padding: 10 }}>
                  {itr.item.data.map((product: GeniusFicheDetail) => {
                    return (
                      <View
                        style={{ flexDirection: "row" }}
                        key={product.barcode}
                      >
                        <Image
                          source={{ uri: product.picture }}
                          style={{ height: 60, width: 60, marginRight: 20 }}
                        />
                        <View>
                          <Text
                            style={{
                              fontFamily: "Poppins_400Regular",
                              fontSize: PerfectFontSize(14),
                            }}
                          >
                            {product.productName.length > 27
                              ? product.productName.substring(0, 27) + "..."
                              : product.productName}
                          </Text>
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={{
                                fontFamily: "Poppins_400Regular",
                                fontSize: PerfectFontSize(14),
                              }}
                            >
                              {translate("easyReturnFicheList.size")}
                            </Text>
                            <Text
                              style={{
                                fontFamily: "Poppins_300Light",
                                fontSize: PerfectFontSize(14),
                              }}
                            >
                              {product.size}
                            </Text>
                          </View>
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={{
                                fontFamily: "Poppins_400Regular",
                                fontSize: PerfectFontSize(14),
                              }}
                            >
                              {translate("easyReturnFicheList.quantity")}
                            </Text>
                            <Text
                              style={{
                                fontFamily: "Poppins_300Light",
                                fontSize: PerfectFontSize(14),
                              }}
                            >
                              {product.quantity}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListFooterComponent={<View style={{ height: 40 }} />}
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
