import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FlatList, TouchableOpacity, TextInput } from "react-native";
import {
  AntDesign,
  Entypo,
  FloButton,
  FloTextBox,
  Fontisto,
} from "../../components";
import FloHeader from "../../components/Header/FloHeader";
import BarcodeHeader from "./partials/BarcodeHeader";
import BarcodeRadio from "./partials/BarcodeRadio";
import InformationLine from "./partials/InformationLine";
import { colors } from "../../theme/colors";
import FloComboBox from "../../components/FloComobox";
import { Actions } from "react-native-router-flux";
import { observer } from "mobx-react";
import EasyReturnService, {
  GeniusFicheDetail,
} from "../../core/services/EasyReturnService";
import ProductCard from "./partials/ProductCard";
import { SafeAreaView } from "react-native-safe-area-context";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import { EasyReturnEventType } from "../../core/models/EasyReturnReason";
import { translate } from "../../helper/localization/locaizationMain";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { PerfectFontSize } from "../../helper/PerfectPixel";

// Saya Yırtılması, Rengi Atması , Taban yarılması

const counts = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 16 },
  { id: 17 },
  { id: 18 },
  { id: 19 },
  { id: 20 },
];

const _LangPrefix = "easyReturnSelectProduct.";
@observer
class EasyReturnSelectProduct extends Component<any> {
  /**
   *
   */

  state = {
    selectedItems: [],
    barcode: "",
    selectedType: 1,
  };
  barcodeInput?: TextInput | null;
  barcodeInputC?: FloTextBox | null;

  constructor(props: any) {
    super(props);
  }
  // state: EasyReturnSelectProductProps = {
  //   selectedItems: [],
  // };

  componentDidMount() {
    EasyReturnService.returnType = 0;
  }

  onSelectComboItem(item: any, type: "reason" | "quantity", sku: string) {
    if (type === "reason" && item.conditionId === 1) {
      let items = EasyReturnService.returnSelectItemPropMap.filter(
        (x) => x.barcode !== sku
      );

      items.forEach((x) => {
        EasyReturnService.selectReturneeItem(x);
      });
    }

    let itr = EasyReturnService.returnSelectItemPropMap.findIndex(
      (x) => x.barcode === sku
    );

    let nextList: any[] = this.state.selectedItems;
    if (!itr) return;

    if (type === "reason") {
      nextList[itr].reason = item;
    } else {
      nextList[itr].quantity = item.id;
    }

    this.setState({ selectedItems: nextList });
  }

  getSelectedReason(sku: string) {
    let item = EasyReturnService.returnSelectItemPropMap.find(
      (x) => x.barcode === sku
    );

    if (!item) return undefined;

    return item.reason;
  }

  getSelectedQuantity(sku: string) {
    if (
      EasyReturnService.returnSelectItemPropMap.find(
        (x) => x.reason && x.reason.conditionId === 1
      )
    ) {
      MessageBox.Show(
        "Sadece bir İDES ile devam edebilirsiniz.",
        MessageBoxDetailType.Information,
        MessageBoxType.Standart,
        () => {},
        () => {}
      );
      this.setState({ barcode: "" });
      this.barcodeInput?.clear();
      this.barcodeInput?.blur();
      return;
    }

    let item = EasyReturnService.returnSelectItemPropMap.find(
      (x) => x.barcode === sku
    );

    if (!item) return undefined;

    return { id: item.quantity };
  }

  _renderProductCard(model: GeniusFicheDetail) {
    var product: any = EasyReturnService.returnSelectItemPropMap.find(
      (x) => x.barcode === model.barcode
    );

    var availableQuantity = counts.filter(
      (x) => x.id <= Number(model.quantity) - Number(model.returnItemCount)
    );

    const listReasons = ApplicationGlobalService.allEasyReturnReasons.filter(
      (x) => x.subId === 0
    );
    return (
      <TouchableOpacity
        onPress={() => EasyReturnService.selectReturneeItem(model)}
        activeOpacity={0.8}
        style={{
          backgroundColor: product ? "rgba(255,103,28,0.05)" : colors.white,
        }}
      >
        <View
          style={{
            paddingTop: 14,
            paddingLeft: 16,
            paddingBottom: 14,
            paddingRight: 5,
            flexDirection: "row",
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
              style={{
                width: 25,
                height: 25,
                borderColor: colors.brightOrange,
                borderWidth: 1,
                borderRadius: 4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {product ? (
                <AntDesign
                  name={"check"}
                  size={20}
                  color={colors.brightOrange}
                />
              ) : null}
            </View>
          </View>
          <View
            style={{
              padding: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: model.picture }}
              style={{ width: 50, height: 50 }}
            />
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: PerfectFontSize(14),
                lineHeight: PerfectFontSize(15),
                letterSpacing: -0.35,
                marginBottom: 4,
              }}
            >
              {model.productName}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: "Poppins_300Light",
                  fontSize: PerfectFontSize(14),
                  lineHeight: PerfectFontSize(15),
                  letterSpacing: -0.35,
                  marginBottom: 4,
                }}
              >
                {translate(`${_LangPrefix}size`)} {model.size}{" "}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_300Light",
                  fontSize: PerfectFontSize(14),
                  lineHeight: PerfectFontSize(15),
                  letterSpacing: -0.35,
                  marginBottom: 4,
                }}
              >
                {" "}
                | {translate(`${_LangPrefix}quantity`)}:{" "}
                {Number(model.quantity)}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Poppins_300Light",
                fontSize: PerfectFontSize(14),
                lineHeight: PerfectFontSize(15),
                letterSpacing: -0.35,
                color: colors.warmGrey,
                marginBottom: 4,
              }}
            >
              {translate(`${_LangPrefix}price`)}:{" "}
              {Number(model.price).toFixed(2)}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: PerfectFontSize(15),
                lineHeight: PerfectFontSize(17.6),
                letterSpacing: -0.38,
                color: colors.brightOrange,
                marginBottom: 4,
              }}
            >
              {translate(`${_LangPrefix}sellPrice`)}:{" "}
              {Number(model.price).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={{ marginLeft: 16, marginRight: 16 }}>
          {product ? (
            <FloComboBox
              data={ApplicationGlobalService.allEasyReturnReasons
                .filter((x) => x && x.subId === 0)
                .map((x) => x)}
              onSelectItem={(item) =>
                this.onSelectComboItem(item, "reason", product.barcode)
              }
              selectedItem={this.getSelectedReason(product.barcode)}
              keyProp={"id"}
              valueProp={"text"}
              placeholder={translate(`${_LangPrefix}returnReason`)}
            />
          ) : null}
          {product?.reason && Number(model.quantity) > 1 ? (
            <FloComboBox
              data={availableQuantity}
              keyProp={"id"}
              valueProp={"id"}
              placeholder={translate(`${_LangPrefix}pickQuantity`)}
              onSelectItem={(item) =>
                this.onSelectComboItem(item, "quantity", product.barcode)
              }
              selectedItem={this.getSelectedQuantity(product.barcode)}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  getSelectedProductCount() {
    if (EasyReturnService.returnSelectItemPropMap.length === 0) return 0;

    return EasyReturnService.returnSelectItemPropMap.reduce(
      (a: number, b) => a + b.item_quantity,
      0
    );
  }
  render() {
    return (
      <>
        <View style={{ flex: 1 }}>
          <FloHeader
            headerType={"standart"}
            enableButtons={["back"]}
            headerTitle={translate(`${_LangPrefix}title`)}
          />
          <KeyboardAwareScrollView bounces={false}>
            <>
              <BarcodeHeader
                onBarcodeSelect={(barcode) => {
                  let model = EasyReturnService.currentFiche?.data.find(
                    (x) => x.barcode === barcode
                  );
                  model && EasyReturnService.selectReturneeItem(model);
                }}
              />
              <BarcodeRadio
                buttons={[
                  translate(`${_LangPrefix}return`),
                  translate(`${_LangPrefix}change`),
                  translate(`${_LangPrefix}cancel`),
                ]}
                onSelectChange={
                  (selectedButton: number) => {
                    let n = selectedButton + 1;
                    this.setState({ selectedType: n });
                    EasyReturnService.setReturnType(n);
                  }
                  // (EasyReturnService.returnType = selectedButton)
                }
                currentIndex={this.state.selectedType}
              />
              <InformationLine type={this.state.selectedType} />
              <Text style={styles.infoText}>
                İade Etmek İstediğiniz Ürünü Seçiniz
              </Text>
              <View style={styles.line}></View>
              {this.state.selectedType === 3 ? null : (
                <View style={{ padding: 10 }}>
                  <FloTextBox
                    placeholder={translate(`${_LangPrefix}productBarcode`)}
                    onChangeText={(txt) => this.setState({ barcode: txt })}
                    // floatingLabel
                    value={this.state.barcode}
                    refText={(input) => (this.barcodeInput = input)}
                    ref={(input) => (this.barcodeInputC = input)}
                  />
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 55,
                      width: 55,
                      right: 10,
                      top: 10,
                    }}
                    onPress={() => this._addProduct(this.state.barcode)}
                  >
                    <Fontisto
                      name={"search"}
                      size={30}
                      color={colors.warmGrey}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Actions["easyReturnCamera"]({
                        onReadComplete: (barcode: string) => {
                          if (Actions.currentScene !== "easyReturnProduct") {
                            Actions.pop();

                            this._addProduct(barcode);
                          }
                        },
                        headerTitle: translate("easyReturnCamera.infoText"),
                      })
                    }
                    style={{
                      position: "absolute",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 55,
                      width: 55,
                      right: 65,
                      top: 10,
                    }}
                  >
                    <Entypo name={"camera"} size={40} color={colors.warmGrey} />
                  </TouchableOpacity>
                </View>
              )}
            </>

            <FlatList
              data={
                EasyReturnService.currentFiche?.data.filter((i) => {
                  let e = EasyReturnService.returnSelectItemPropMap.find(
                    (x) => x.barcode === i.barcode
                  );
                  return e ? true : false;
                })
                // .sort(
                // (a, b) => {
                //   let aa = this.state.selectedItems.find(
                //     (x: Product) => x.sku === a.uruN_SKU,
                //   )
                //     ? true
                //     : false;
                //   let bb = this.state.selectedItems.find(
                //     (x: Product) => x.sku === b.uruN_SKU,
                //   )
                //     ? true
                //     : false;
                //   return aa === bb ? 0 : aa ? -1 : 1;
                // },)
              }
              ItemSeparatorComponent={() => (
                <View
                  style={{ height: 1, backgroundColor: colors.whiteFour }}
                />
              )}
              renderItem={(data) => <ProductCard model={data.item} />}
            />
            <View style={{ marginLeft: 16, marginRight: 16, marginTop: 30 }}>
              <Text
                style={{
                  marginBottom: 10,
                  color: colors.brightOrange,
                  fontFamily: "Poppins_300Light",
                  fontSize: PerfectFontSize(14),
                  lineHeight: PerfectFontSize(18),
                }}
              >
                {translate(`${_LangPrefix}pleaseSelectProduct`)}
              </Text>
              <FloButton
                title={
                  EasyReturnService.returnSelectItemPropMap.filter(
                    (x) => x.reason
                  ).length > 0
                    ? EasyReturnService.returnSelectItemPropMap
                        .filter((x) => x.reason)
                        .reduce((a, b) => a + b.item_quantity, 0) +
                      translate(`${_LangPrefix}continueTo`)
                    : translate(`${_LangPrefix}selectProduct`)
                }
                containerStyle={
                  EasyReturnService.returnSelectItemPropMap.filter(
                    (x) => x.reason
                  ).length === 0
                    ? { backgroundColor: colors.whiteTwo }
                    : null
                }
                activeOpacity={
                  EasyReturnService.returnSelectItemPropMap.filter(
                    (x) => x.reason
                  ).length === 0
                    ? 1
                    : 0.8
                }
                onPress={() => {
                  let qo = EasyReturnService.returnSelectItemPropMap.filter(
                    (x) =>
                      x.reason?.conditionId ===
                      EasyReturnEventType.BrokenProductEvent
                  ).length;
                  EasyReturnService.returnSelectItemPropMap.filter(
                    (x) => x.reason
                  ).length === 0
                    ? null
                    : qo > 0
                    ? Actions["easyReturnReturnEvent"]()
                    : Actions["easyReturnSelectReturnType"]();
                }}
              />
            </View>
          </KeyboardAwareScrollView>

          <SafeAreaView />
        </View>
      </>
    );
  }

  private _addProduct(barcode: string): void {
    if (
      EasyReturnService.returnSelectItemPropMap.find(
        (x) => x.reason && x.reason.conditionId === 1
      )
    ) {
      MessageBox.Show(
        "Sadece bir İDES ile devam edebilirsiniz.",
        MessageBoxDetailType.Information,
        MessageBoxType.Standart,
        () => {},
        () => {}
      );
      this.setState({ barcode: "" });
      this.barcodeInput?.clear();
      this.barcodeInput?.blur();
      return;
    }

    let current = EasyReturnService.returnSelectItemPropMap.find(
      (x) => x.barcode === barcode
    );

    if (current) {
      this.setState({ barcode: "" });
      this.barcodeInput?.clear();
      return;
    }
    let model = EasyReturnService.currentFiche?.data.find(
      (x) => x.barcode == barcode
    );

    if (model) {
      EasyReturnService.selectReturneeItem(model).then((R) => {
        this.setState({ barcode: "" });
      });
    } else {
      MessageBox.Show(
        "Aradığınız ürün bulunamadı",
        MessageBoxDetailType.Information,
        MessageBoxType.Standart,
        () => {},
        () => {}
      );
      this.setState({ barcode: "" });
      this.barcodeInput?.clear();
      this.barcodeInput?.blur();
    }
  }
}
export default EasyReturnSelectProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: colors.whiteFour,
    marginTop: 10,
  },
  infoText: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(14),
    lineHeight: PerfectFontSize(18),
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  warningText: {
    textAlign: "left",
    fontFamily: "Poppins_300Light",
    fontSize: PerfectFontSize(14),
  },
  mainText: {
    textAlign: "left",
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(14),
    fontWeight: "bold",
  },
  sizeAndQuantity: {
    textAlign: "left",
    color: "#000000",
    fontFamily: "Poppins_300Light",
    fontSize: PerfectFontSize(14),
  },
  productPrice: {
    textAlign: "left",
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(14),
    color: "#727272",
  },
  productSalePrice: {
    textAlign: "left",
    fontFamily: "Poppins_400Regular_ItalicBod",
    fontSize: PerfectFontSize(15),
    color: "#FF6600",
    paddingLeft: 7,
    fontWeight: "bold",
  },
  configListButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  configListImage: {
    height: 80,
    width: 80,
    resizeMode: "contain",
  },
});
