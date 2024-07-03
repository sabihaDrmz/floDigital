import {
  FontSizes,
  ColorType,
  AppButton,
  AppText,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react";
import moment from "moment";
import React, { useState } from "react";
import { View } from "react-native";
import { OmsErrorReasonModel } from "../../../core/models/OmsErrorReasonModel";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../../core/services/MessageBox";
import OmsService from "../../../core/services/OmsService";
import { translate } from "../../../helper/localization/locaizationMain";
import OmsReaseonRadios from "./OmsReasonRadios";

const ProductDetail: React.FC<any> = (props) => {
  const [selectedReason, setSelectedReason] = useState<OmsErrorReasonModel>();
  return (
    <Observer>
      {() => (
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
                <AppText
                  selectable
                  size={FontSizes.XL}
                  style={{ marginRight: 5 }}
                >
                  {props.BodySize}
                </AppText>
                <AppText size={FontSizes.XL} style={{ marginRight: 5 }}>
                  |
                </AppText>
                <AppText
                  selectable
                  size={FontSizes.XL}
                  style={{ marginRight: 5 }}
                >
                  {props.Quantity} {translate("OmsOrderCard.quantity")}
                </AppText>
              </View>
            </View>
            <View style={{ width: 80 }}>
              <AppText selectable>{props.SourceCode}</AppText>
            </View>
          </View>
          <View style={{ margin: 30 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <AppText size={FontSizes.XL}>
                {translate("ProductDetail.date")}
              </AppText>
              <AppText selectable size={FontSizes.XL}>
                {moment(
                  props.hiddenDate ? props.CreatedDate : props.CreateDate
                ).format("DD/MM/yyyy HH:mm")}
              </AppText>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <AppText size={FontSizes.XL}>
                {translate("ProductDetail.orderNo")}
              </AppText>
              <AppText selectable size={FontSizes.XL}>
                {props.OrderNo}
              </AppText>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <AppText size={FontSizes.XL}>
                {translate("ProductDetail.barcode")}
              </AppText>
              <AppText selectable size={FontSizes.XL}>
                {props.BarcodeNo}
              </AppText>
            </View>

            <View style={{ marginTop: 20 }}>
              <OmsReaseonRadios
                order={props}
                onSave={(reason) => {
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
          </View>
        </View>
      )}
    </Observer>
  );
};

export default ProductDetail;
