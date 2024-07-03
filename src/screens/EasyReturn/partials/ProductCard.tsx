import { observer } from "mobx-react";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { AntDesign } from "../../../components";
import FloComboBox from "../../../components/FloComobox";
import ApplicationGlobalService from "../../../core/services/ApplicationGlobalService";
import EasyReturnService, {
  GeniusFicheDetail,
} from "../../../core/services/EasyReturnService";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../../core/services/MessageBox";
import { colors } from "../../../theme/colors";
import { translate } from "../../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../../helper/PerfectPixel";

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

interface ProductCardProp {
  model: GeniusFicheDetail;
}

const ProductCard = observer((props: ProductCardProp) => {
  let model = props.model;

  var product: any = EasyReturnService.returnSelectItemPropMap.find(
    (x) => x.barcode === model.barcode
  );

  const _selectItem = () => {
    EasyReturnService.selectReturneeItem(model);
  };

  const _reasonChange = (item: any) => {
    if (item.conditionId === 1) {
      let items = EasyReturnService.returnSelectItemPropMap.filter(
        (x) => x.barcode !== product.barcode
      );

      items.forEach((x) => {
        EasyReturnService.selectReturneeItem(x);
      });
    }

    EasyReturnService.selectReasonForProduct(product.barcode, item);
  };

  const _quantityChange = (item: any) => {
    if (
      EasyReturnService.returnSelectItemPropMap.find(
        (x) => x.reason && x.reason.conditionId === 1
      ) &&
      Number(item.id) > 1
    ) {
      MessageBox.Show(
        translate("easyReturnProductCard.continueWithProduct"),
        MessageBoxDetailType.Information,
        MessageBoxType.Standart,
        () => {},
        () => {}
      );
      return;
    }

    EasyReturnService.selectQuantityForProduct(product.barcode, item);
  };
  var availableQuantity = counts.filter((x) => x.id <= Number(model.quantity));
  return (
    <TouchableOpacity
      onPress={() => {
        _selectItem();
      }}
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
              <AntDesign name={"check"} size={20} color={colors.brightOrange} />
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
              Beden: {model.size}{" "}
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
              | Adet: {Number(model.quantity)}
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
            {model.barcode} / {model.variantNo}
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
            Satış Fiyatı: {Number(model.price).toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={{ marginLeft: 16, marginRight: 16 }}>
        {product ? (
          <FloComboBox
            data={ApplicationGlobalService.allEasyReturnReasons.filter(
              (x) => x.subId === 0
            )}
            onSelectItem={(item) => {
              _reasonChange(item);
              // this.onSelectComboItem(item, 'reason', product.barcode)
            }}
            selectedItem={
              EasyReturnService.returnSelectItemPropMap.find(
                (x) => x.barcode == product.barcode
              )?.reason
            }
            keyProp={"id"}
            valueProp={"name"}
            placeholder={translate("easyReturnProductCard.pleaseGiveReason")}
          />
        ) : null}
        {product?.reason && Number(model.quantity) > 1 ? (
          <FloComboBox
            data={availableQuantity}
            keyProp={"id"}
            valueProp={"id"}
            placeholder={"Adet Seçin"}
            onSelectItem={
              (item) => {
                _quantityChange(item);
              }
              // this.onSelectComboItem(item, 'quantity', product.barcode)
            }
            selectedItem={availableQuantity.find(
              (x) =>
                x.id ==
                EasyReturnService.returnSelectItemPropMap.find(
                  (x) => x.barcode == product.barcode
                )?.item_quantity
            )}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
});
export default ProductCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
