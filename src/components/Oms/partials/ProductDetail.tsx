import {
  FontSizes,
  ColorType,
  AppButton,
  AppText,
} from "@flomagazacilik/flo-digital-components";
import moment from "moment";
import React, { useState } from "react";
import { View } from "react-native";
import { useOmsService } from "../../../contexts/OmsService";
import { OmsErrorReasonModel } from "../../../core/models/OmsErrorReasonModel";
import { translate } from "../../../helper/localization/locaizationMain";
import ReaseonRadios from "./ReaseonRadios";
import { useProductService } from "../../../contexts/ProductService";
import { useNavigation } from '@react-navigation/native';

const ProductDetail: React.FC<any> = (props) => {
  const OmsService = useOmsService();
  const [selectedReason, setSelectedReason] = useState<OmsErrorReasonModel>();
  const navigation = useNavigation();
  const ProductService = useProductService();
  const findProduct = (barcode: string) => {
    //@ts-ignore
    navigation.navigate("Iso", { screen: "Product" });
    ProductService.getProduct(barcode, 2, false, true).then((res) => {
      if (!res)
        navigation.navigate("Oms" as never);
    });
  };

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <AppText selectable size={FontSizes.XL}>
            {props.ProductNo}
          </AppText>
          <View style={{ flexDirection: "row" }}>
            <AppText size={FontSizes.XL} style={{ marginRight: 5 }}>
              {translate("ProductDetail.color")}:
            </AppText>
            <AppText
              selectable
              size={FontSizes.XL}
              style={{ fontWeight: "700", marginRight: 5 }}
            >
              {props.Color}
            </AppText>
            <AppText size={FontSizes.XL} style={{ marginRight: 5 }}>
              |
            </AppText>
            <AppText selectable size={FontSizes.XL} style={{ marginRight: 5 }}>
              {props.BodySize}
            </AppText>
            <AppText size={FontSizes.XL} style={{ marginRight: 5 }}>
              |
            </AppText>
            <AppText selectable size={FontSizes.XL} style={{ marginRight: 5 }}>
              {props.Quantity + " " + translate("foundProduct.quantity")}
            </AppText>
          </View>
        </View>
        <View style={{ width: 80 }}>
          <AppText selectable>{props.SourceCode}</AppText>
        </View>
      </View>
      <View style={{ margin: 30 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText size={FontSizes.XL}>
            {translate("ProductDetail.date")}
          </AppText>
          <AppText selectable size={FontSizes.XL}>
            {moment(
              props.hiddenDate ? props.CreatedDate : props.CreateDate
            ).format("DD/MM/yyyy HH:mm")}
          </AppText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText size={FontSizes.XL}>
            {translate("ProductDetail.orderNo")}
          </AppText>
          <AppText selectable size={FontSizes.XL}>
            {props.OrderNo}
          </AppText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText size={FontSizes.XL}>
            {translate("ProductDetail.barcode")}
          </AppText>
          <AppText selectable size={FontSizes.XL}>
            {props.BarcodeNo}
          </AppText>
        </View>

        <View style={{ marginTop: 20 }}>
          <ReaseonRadios
            reasons={OmsService.errorReasons}
            onSave={(reason: any) => {
              setSelectedReason(reason);
              props.selectReason(reason);
            }}
          />
          {selectedReason && (
            <>
              <View style={{ height: 20 }} />
              <AppButton
                title={translate("ProductDetail.cancelOrder")}
                buttonColorType={ColorType.Danger}
                loading={OmsService.cancelLoading}
                onPress={() => {
                  OmsService.cancelOrder(props, selectedReason.OmsName);
                }}
              />
            </>
          )}
        </View>
        <AppButton buttonColorType={ColorType.Brand} title={translate("ProductDetail.inquireStock")} style={{ marginTop: 20 }} onPress={() => findProduct(props.BarcodeNo)} />
      </View>
    </View>
  );
};

export default ProductDetail;
