import { observer } from "mobx-react";
import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, FloButton } from "../../components";
import { FloHeader } from "../../components/Header";
import { BrokenProductSearchModel } from "../../core/models/BrokenProductSearchModel";
import { EasyReturnTrasactionLine } from "../../core/models/EasyReturnTrasnaction";
import EasyReturnService from "../../core/services/EasyReturnService";
import { toCensorText } from "../../core/Util";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import BarcodeRadio from "./partials/BarcodeRadio";
import ProductCard from "./partials/ProductCard";

const _LangPrefix = "easyReturnSelectProduct.";
@observer
class EasyReturnUibScreen extends Component<{
  sapRes: {
    uruN_TAKIP_NO: string;
    karar: string;
    karaR_TEXT: string;
    soN_ISTASYON: string;
    istasyoN_TEXT: string;
    depoyA_GELIS_TARIHI: string;
    depoyA_GELIS_SAATI: string;
    soN_HAREKET_TARIHI: string;
    magazA_KODU: string;
    mgZ_MUSTERI_ADI: string;
    uruN_KODU: string;
    uruN_ADI: string;
    uruN_MARKASI: string;
    uruN_ACIKLAMASI: string;
    iadE_SEBEBI: string;
    hatA_DETAYI: string;
    mgZ_UIB_NO: string;
    mgZ_MUSTERI_TEL: string;
    iadE_TARIHI: string;
  };
}> {
  state = { selectedType: 1 };

  render() {
    const { sapRes } = this.props;
    return (
      <>
        <FloHeader
          headerType={"standart"}
          enableButtons={["back"]}
          headerTitle={translate(`${_LangPrefix}title`)}
        />
        <View style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            <BarcodeRadio
              buttons={[
                translate(`${_LangPrefix}return`),
                translate(`${_LangPrefix}change`),
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
            <KeyboardAwareScrollView bounces={false} style={{ marginTop: 20 }}>
              {/* @ts-ignore */}
              {EasyReturnService.transaction?.easyReturnTrasactionLine?.map(
                (x: EasyReturnTrasactionLine) => {
                  return (
                    <View>
                      <View
                        style={{
                          paddingTop: 14,
                          paddingLeft: 16,
                          paddingBottom: 14,
                          paddingRight: 5,
                          flexDirection: "row",
                        }}
                      >
                        <View
                          style={{
                            padding: 20,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={{
                              uri: EasyReturnService.currentFiche?.data.find(
                                (y) => y.barcode === x.barcode
                              )?.picture,
                            }}
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
                            {x.productName}
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
                              Beden: {x.size}{" "}
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
                              | Adet: {Number(x.quantity)}
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
                            {x.barcode} / {x.sku}
                          </Text>
                          <Text
                            style={{
                              fontFamily: "Poppins_700Bold",
                              fontSize: PerfectFontSize(14),
                              lineHeight: PerfectFontSize(17.6),
                              letterSpacing: -0.38,
                              color: colors.brightOrange,
                              marginBottom: 4,
                            }}
                          >
                            İade Fiyatı:{" "}
                            {Number(x.productReturnPrice).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }
              )}

              <View
                style={{
                  borderBottomColor: "rgba(0,0,0,0.4)",
                  borderBottomWidth: 0.2,
                  paddingBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: PerfectFontSize(14),
                    fontFamily: "Poppins_400Regular",
                    fontWeight: "500",
                  }}
                >
                  Değerlendirme :
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <Text>Müşteri Adı: </Text>
                <Text>
                  {toCensorText(sapRes.mgZ_MUSTERI_ADI.split(" ")[0])}{" "}
                  {toCensorText(sapRes.mgZ_MUSTERI_ADI.split(" ")[1])}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <Text>Müşteri Tel: </Text>
                <Text>{toCensorText(sapRes.mgZ_MUSTERI_TEL)}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <Text>Karar: </Text>
                <Text>{sapRes.karaR_TEXT?.toUpperCase()}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <Text>İade Sebebi: </Text>
                <Text>{sapRes.iadE_SEBEBI?.toUpperCase()}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <Text>İstasyon: </Text>
                <Text>{sapRes.istasyoN_TEXT?.toUpperCase()}</Text>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
        <FloButton
          containerStyle={{ margin: 20 }}
          title={"Devam et"}
          onPress={() => Actions["easyReturnSelectReturnType"]()}
        />
        <SafeAreaView />
      </>
    );
  }
}
export default EasyReturnUibScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
