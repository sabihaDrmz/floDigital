import { AppCard, AppText } from "@flomagazacilik/flo-digital-components";
import {
  AppColor,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import React, { useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import FsImage from "../../../components/FSImage";
import { OmsErrorReasonModel } from "../../../core/models/OmsErrorReasonModel";
import { OmsOrderDetail } from "../../../core/models/OmsOrderModel";
import OmsService from "../../../core/services/OmsService";
import ProductDetail from "./ProductDetail";
import { translate } from "../../../helper/localization/locaizationMain";

const ProductPickCard: React.FC<OmsOrderDetail> = (props) => {
  const [isExpand, setExpand] = useState(false);
  const [selectedReason, setSelectedReason] = useState<OmsErrorReasonModel>();
  return (
    <AppCard
      color={
        props.ChannelCode === "BC"
          ? AppColor.OMS.Background.ComeGet
          : props.ChannelCode === "BGK"
          ? AppColor.OMS.Background.Agt
          : AppColor.OMS.Background.DeliveryHome
      }
    >
      <View style={styles.orderWrapper}>
        <View style={styles.orderProductBlock}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <TouchableOpacity
                onPress={() => setExpand(!isExpand)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <AntDesign
                  name={!isExpand ? "caretright" : "caretdown"}
                  size={15}
                  color={AppColor.FD.Text.Ash}
                />
                <AppText selectable style={{ marginLeft: 10 }}>
                  {props.BodySize} {props.Color}
                </AppText>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 7,
                }}
              >
                <AppText
                  selectable
                  size={FontSizes.L}
                  labelType={LabelType.Label}
                >
                  {props.Brand}
                </AppText>
                <AppText
                  selectable
                  size={FontSizes.L}
                  style={{ marginLeft: 10 }}
                >
                  {props.ModelName}
                </AppText>
              </View>
              <View>
                <AppText selectable style={{ fontWeight: "700", marginTop: 7 }}>
                  {props.Quantity} {translate("ProductPickCard.product")}
                </AppText>
              </View>
            </View>
            <View style={{ justifyContent: "center" }}>
              <FsImage
                source={{ uri: props.ImageUrl }}
                style={{ width: 60, height: 60 }}
              />
            </View>
          </View>
        </View>
        {/* <View style={styles.orderInformationBlock}>
            <AppText>11dk</AppText>
            <View>
              <Text>7 Ürün</Text>
              <Text>55 dk</Text>
            </View>
          </View> */}
      </View>
      {isExpand && (
        <Observer>
          {() => {
            return (
              <View>
                {OmsService.omsPickList
                  .filter(
                    (x) =>
                      x.BarcodeNo === props.BarcodeNo &&
                      x.ChannelCode === props.ChannelCode
                  )
                  .map((x) => (
                    <ProductDetail
                      {...x}
                      selectedReason={selectedReason}
                      selectReason={setSelectedReason}
                    />
                  ))}
              </View>
            );
            // return OmsService.omsPickList
            //   .filter(
            //     (y) =>
            //       y.BarcodeNo === props.BarcodeNo &&
            //   )
            //   .map((x) => {
            //     return (
            //       <ProductDetail
            //         {...props}
            //         selectedReason={selectedReason}
            //         selectReason={setSelectedReason}
            //       />
            //     );
            //   });
          }}
        </Observer>
      )}
    </AppCard>
  );
};

export default ProductPickCard;

const styles = StyleSheet.create({
  orderWrapper: {
    flexDirection: "row",
    flex: 1,
  },
  orderProductBlock: {
    flex: 1,
  },
});
