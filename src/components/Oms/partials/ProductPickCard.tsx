import { AppCard, AppText } from "@flomagazacilik/flo-digital-components";
import {
  AppColor,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { translate } from "../../../helper/localization/locaizationMain";
import { useOmsService } from "../../../contexts/OmsService";
import { OmsOrderDetail } from "../../../core/models/OmsOrderModel";
import { OmsErrorReasonModel } from "../../../core/models/OmsErrorReasonModel";
import FsImage from "../../FSImage";
import ProductDetail from "./ProductDetail";

const ProductPickCard: React.FC<OmsOrderDetail> = (props) => {
  const OmsService = useOmsService();
  const [isExpand, setExpand] = useState(false);
  const [selectedReason, setSelectedReason] = useState<OmsErrorReasonModel>();
  return (
    <AppCard
      color={
        props.ChannelCode === "BC"
          ? AppColor.OMS.Background.ComeGet
          : props.ChannelCode === "PACKUPP"
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
        <View>
          {OmsService.omsPickList
            .filter(
              (x) =>
                x.BarcodeNo === props.BarcodeNo &&
                x.ChannelCode === props.ChannelCode &&
                x.OrderNo === props.OrderNo
            )
            .map((x) => (
              <ProductDetail
                {...x}
                selectedReason={selectedReason}
                selectReason={setSelectedReason}
              />
            ))}
        </View>
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
