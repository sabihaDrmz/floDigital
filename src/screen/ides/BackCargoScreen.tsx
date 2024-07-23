import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import QrSearchBar from "../../components/IdesComponents/QrSearchBar";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import {
  AppButton,
  AppCard,
  AppCheckBox,
  AppColor,
  ColorType,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import { AppText } from "@flomagazacilik/flo-digital-components";
import { FloHeader } from "../../components/Header";
import { translate } from "../../helper/localization/locaizationMain";
import { ErRejectModel } from "../../contexts/model/ErRejectModel";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { useEasyReturnService } from "../../contexts/EasyReturnService";

const BackCargoScreen: React.FC = () => {
  const { show } = useMessageBoxService();
  const { omsRejectCargoRes, RemoveRejectCargo, selectedRejectCargos, loadingCompleteReject, CompleteRejectCargo } = useEasyReturnService();

  const FicheNumberInfo = () => {
    return (
      <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <AppText style={{ fontFamily: "Poppins_500Medium", width: 80 }}>
            {translate("cancellationScreen.orderNo")}
          </AppText>
          <AppText style={{ fontFamily: "Poppins_500Medium" }}> : </AppText>
          <AppText selectable style={{ fontFamily: "Poppins_700Bold" }}>
            {omsRejectCargoRes?.order.orderId}
          </AppText>
        </View>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <AppText style={{ fontFamily: "Poppins_500Medium", width: 80 }}>
            {translate("cancellationScreen.billNo")}
          </AppText>
          <AppText style={{ fontFamily: "Poppins_500Medium" }}> : </AppText>
          <AppText selectable style={{ fontFamily: "Poppins_700Bold" }}>
            {omsRejectCargoRes?.order.ficheNumber}
          </AppText>
        </View>
      </View>
    );
  },
    CustomerInfo = () => {
      return (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginTop: 40,
            }}
          >
            <View>
              <View style={{ flexDirection: "row" }}>
                <AppText
                  style={{ fontFamily: "Poppins_600SemiBold", width: 100 }}
                >
                  {translate("cancellationScreen.customerName")}:
                </AppText>
                <AppText selectable>
                  {" "}
                  {omsRejectCargoRes?.order.aliciAdi}{" "}
                  {omsRejectCargoRes?.order.aliciSoyadi}
                </AppText>
              </View>
              <View style={{ flexDirection: "row" }}>
                <AppText
                  style={{ fontFamily: "Poppins_600SemiBold", width: 100 }}
                >
                  {translate("cancellationScreen.customerPhone")}
                  {"  "}:
                </AppText>
                <AppText selectable>
                  {" "}
                  {omsRejectCargoRes?.order.telefon}
                </AppText>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: -20,
              }}
            >
              <Image
                source={require("../../assets/storeico.png")}
                style={{ width: 40, height: 40 }}
              />
              <AppText selectable>
                {omsRejectCargoRes?.order.storeId}
              </AppText>
            </View>
          </View>
          <View>
            <View
              style={{ flexDirection: "row", marginLeft: 20, marginTop: 20 }}
            >
              <AppText
                style={{ fontFamily: "Poppins_600SemiBold", width: 100 }}
              >
                {translate("cancellationScreen.date")} :
              </AppText>
              <AppText selectable>
                {" "}
                {moment(
                  omsRejectCargoRes?.order.createdDate
                ).format("DD/MM/yyyy")}
              </AppText>
            </View>
          </View>
        </View>
      );
    },
    [selectedProducts, setSelectedProducts] = useState<ErRejectModel[]>([]),
    PushBarcode = (barcode: string) => {
      //8682791042425

      let totalQuantity =
        omsRejectCargoRes?.basketItems.filter(
          (x) => x.barcode === barcode && x.isEasyReturn
        ).length;
      let currentQty = selectedProducts
        .filter((x) => x.barcode === barcode)
        .reduce((x, y) => x + y.qty, 0);
      let matchBarcode =
        omsRejectCargoRes?.basketItems.findIndex(
          (x) => x.barcode === barcode
        ) !== -1;

      if (
        totalQuantity !== undefined &&
        currentQty < totalQuantity &&
        matchBarcode
      ) {
        if (
          selectedProducts.findIndex((x) => x.barcode === barcode) === -1 &&
          omsRejectCargoRes?.basketItems.findIndex(
            (x) => x.barcode === barcode && x.isEasyReturn
          ) === -1
        ) {
          show("Ürünün mevcut durumu iadeye uygun\ndeğildir.", {
            type: MessageBoxType.OrderNotFound,
            customParameters: {
              description: "*Kargo durumunun güncellenmesini\niçin bekleyiniz",
              type: "3",
              orderNumber: barcode,
            },
          });
          return;
        }

        if (
          selectedProducts.findIndex((x) => x.barcode === barcode) === -1 &&
          omsRejectCargoRes?.basketItems.findIndex(
            (x) =>
              x.barcode === barcode && x.isEasyReturn && x.virmanStatusId === 3
          ) === -1
        ) {
          show(
            "İadeye devam edebilmek için virman\nkaydının tamamlanması gerekmektedir.",
            {
              type: MessageBoxType.OrderNotFound,
              customParameters: {
                description:
                  "Size yardımcı olabilmemiz için\nbu uyarının ekran görüntüsünü alarak\nFİT üzerinden Ticket Oluşturunuz",
                type: "2",
                orderNumber: barcode,
              },
            }
          );
          return;
        }

        let temp = selectedProducts;

        if (totalQuantity !== undefined && totalQuantity > 1) {
          // virmanStatusId
          show(
            `Bu Siparişte,\nAynı barkodtan ${totalQuantity} adet ürün listelendi`,
            {
              type: MessageBoxType.OrderNotFound,
              customParameters: {
                description: "İade alınacak ürün adedi seçiniz",
                type: "4",
                orderNumber: barcode,
                maxQuantity: totalQuantity,
              },
              yesButtonEvent: (params) => {
                temp.push({ barcode, qty: params.qty });
                RemoveRejectCargo(temp);
                setSelectedProducts(temp);
              },
            }
          );
          return;
        } else {
          temp.push({ barcode, qty: 1 });
          RemoveRejectCargo(temp);
          setSelectedProducts(temp);
        }
      } else {
        show("Ürün bulunamadı.", {
          type: MessageBoxType.OrderNotFound,
          customParameters: {
            type: "1",
            description:
              "Lütfen barkod numaranızı kontrol edip,\ntekrar deneyiniz.",
            orderNumber: barcode,
          },
        });
      }
    },
    RejectBarcode = (barcode: string) => {
      RemoveRejectCargo(
        selectedProducts.filter((y) => y.barcode != barcode)
      );
      setSelectedProducts(selectedProducts.filter((y) => y.barcode != barcode));
    };

  return (
    <View style={styles.container}>
      <FloHeader
        enableButtons={["back"]}
        headerType={"standart"}
        headerTitle={"Oms Ret Kargo"}
      />
      <KeyboardAwareScrollView>
        <FicheNumberInfo />
        <CustomerInfo />
        <QrSearchBar
          onSearch={(barcode: string) => {
            if (barcode) PushBarcode(barcode);
          }}
        />
        <View style={{ marginTop: 30 }}>
          <>
            {omsRejectCargoRes?.basketItems
              .filter((x) => {
                var res = selectedRejectCargos.findIndex(
                  (y) => y.barcode === x.barcode
                );
                return res !== -1;
              })
              .filter(
                (value, index, self) =>
                  self.findIndex((x) => x.barcode === value.barcode) === index
              )
              .map((x) => {
                return (
                  //@ts-ignore
                  <AppCard color={AppColor.OMS.Background.OpacityOrange}>
                    <TouchableOpacity
                      onPress={() => RejectBarcode(x.barcode)}
                      style={{ flexDirection: "row", marginVertical: 15 }}
                    >
                      <View style={{ width: 50, height: 50 }}>
                        <Image
                          source={{
                            uri:
                              "https://floimages.mncdn.com/" + x.productImage,
                          }}
                          style={{ width: 60, height: 60, marginTop: 20 }}
                          resizeMode={"cover"}
                        />
                      </View>
                      <View style={{ marginLeft: 15 }}>
                        <AppText
                          selectable
                          labelColorType={ColorType.Dark}
                          numberOfLines={1}
                          style={{ fontWeight: "400", width: "100%" }}
                        >
                          {x.title}
                        </AppText>
                        <AppText selectable size={FontSizes.S}>
                          Beden: {x.size}| Adet:{" "}
                          {
                            selectedRejectCargos.find(
                              (y) => y.barcode === x.barcode
                            )?.qty
                          }
                        </AppText>
                        <AppText selectable size={FontSizes.S}>
                          {x.barcode} / {x.sku}
                        </AppText>
                        <AppText
                          selectable
                          labelColorType={ColorType.Brand}
                          style={{ fontWeight: "500" }}
                        >
                          Satış Fiyatı : {Number(x.price)}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        width: 25,
                        position: "absolute",
                        height: 25,
                        left: 0,
                        top: 0,
                      }}
                    >
                      <AppCheckBox
                        onSelect={(state) => {
                          RejectBarcode(x.barcode);
                        }}
                        checked
                      />
                    </View>
                  </AppCard>
                );
              })}
          </>
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <AppButton
            buttonColorType={
              selectedRejectCargos.length > 0
                ? ColorType.Success
                : ColorType.Gray
            }
            loading={loadingCompleteReject}
            disabled={selectedRejectCargos.length === 0}
            onPress={CompleteRejectCargo}
            title={translate(
              "easyReturnBrokenProductCompletePopup.completeTransaction"
            )}
          />
        </View>
        <View style={{ height: 4 }} />
      </KeyboardAwareScrollView>
    </View>
  );
};
export default BackCargoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  txtContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderColor: "#b7b5b5",
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    height: 45,
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    zIndex: 5,
  },
});
