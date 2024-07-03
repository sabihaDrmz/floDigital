import { AppColor, FontSizes } from "@flomagazacilik/flo-digital-components";
import {
  AppText,
  ColorType,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { useOmsService } from "../../contexts/OmsService";
import { OmsErrorReasonModel } from "../../core/models/OmsErrorReasonModel";
import { OmsOrderDetail } from "../../core/models/OmsOrderModel";
import { translate } from "../../helper/localization/locaizationMain";
import BarcodeSearchBar from "./partials/BarcodeSearchBar";
import PickCard from "./partials/PickCard";
import ProductPickCard from "./partials/ProductPickCard";
import QuantityPopup from "./partials/QuantityPopup";

const HALF_CIRCLE_WIDTH = 25;
const CIRCLE_WIDTH = HALF_CIRCLE_WIDTH * 2;
const HALF_CIRCLE_WIDTH_WIDTH_PADDING = HALF_CIRCLE_WIDTH + 7;
const CIRCLE_WIDTH_WIDTH_PADDING = HALF_CIRCLE_WIDTH_WIDTH_PADDING * 2;

const PickList: React.FC = (props) => {
  const OmsService = useOmsService();
  const MessageBox = useMessageBoxService();
  const GetBgColoor = (source: "Agt" | "DeliveryHome" | "ComeGet") => {
    return { backgroundColor: AppColor.OMS.Background[source] };
  };

  const GetBorderColoor = (source: "Agt" | "DeliveryHome" | "ComeGet") => {
    return { borderColor: AppColor.OMS.Background[source] };
  };

  const MakeCircle: React.FC<{
    source: "Agt" | "DeliveryHome" | "ComeGet";
    cnt: number;
    selected?: boolean;
    onSelect?: () => void;
    title: string;
  }> = (props) => {
    return (
      <TouchableOpacity onPress={props.onSelect}>
        <View
          style={[
            styles.selectedCircle,
            GetBorderColoor(props.source),
            props.selected && styles.selectedCircleBorder,
          ]}
        >
          <View style={[styles.circleBase, GetBgColoor(props.source)]}>
            <AppText
              selectable
              labelType={LabelType.Label}
              labelColorType={ColorType.Light}
              size={FontSizes.XL}
            >
              {props.cnt.toString()}
            </AppText>
          </View>
        </View>
        <AppText
          selectable
          size={FontSizes.XS}
          style={[
            {
              width: CIRCLE_WIDTH_WIDTH_PADDING,
              textAlign: "center",
              marginTop: 4,
              fontWeight: "500",
            },
            props.selected && {
              color: AppColor.OMS.Background[props.source],
              fontFamily: "Poppins_500Medium",
            },
          ]}
        >
          {props.title}
        </AppText>
      </TouchableOpacity>
    );
  };

  const [currentFilter, setCurrentFilter] = useState(3);
  const [quantityPopup, setQuantityPopup] = useState<{
    shown: boolean;
    imageUri: string;
    maxQuantity: string;
    barcode: string;
    product: OmsOrderDetail | undefined;
  }>({
    shown: false,
    imageUri: "",
    maxQuantity: "0",
    product: undefined,
    barcode: "",
  });
  const getOrderByProduct = (barcode: string) => {
    let m = { type: "BC", orderNo: "" };
    // Brick and collect
    if (
      OmsService.omsPickListOrder.find(
        (x) => x.OrderItems.filter((y) => y.BarcodeNo === barcode).length > 0
      )
    ) {
      m.type = "BC";

      const co = OmsService.omsPickListOrder.find(
        (x) =>
          x.OrderItems.filter((y) => y.BarcodeNo === barcode).length > 0 &&
          x.OrderNo === OmsService.continiousOrder
      )?.OrderNo;

      if (co) m.orderNo = co;
      else {
        // @ts-ignore
        m.orderNo = OmsService.omsPickListOrder.find(
          (x) => x.OrderItems.filter((y) => y.BarcodeNo === barcode).length > 0
        )?.OrderNo;
      }
    } else {
      m.orderNo = "-1";
    }

    return m;
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.circleContainer}>
          <React.Fragment>
            <MakeCircle
              source={"Agt"}
              cnt={
                OmsService.omsPickListGroup.filter(
                  (x) => x.ChannelCode === "PACKUPP"
                ).length
              }
              selected={currentFilter === 1}
              onSelect={() => setCurrentFilter(currentFilter === 1 ? 0 : 1)}
              title={translate("OmsPickList.sameDayHomeDelivery")}
            />
            <MakeCircle
              source={"ComeGet"}
              cnt={OmsService.omsPickListOrder.length}
              selected={currentFilter === 2}
              onSelect={() => setCurrentFilter(currentFilter === 2 ? 0 : 2)}
              title={translate("OmsPickList.sameDayComeAndGet")}
            />
            <MakeCircle
              source={"DeliveryHome"}
              cnt={
                OmsService.omsPickListGroup.filter(
                  (x) => x.ChannelCode !== "BC"
                ).length -
                OmsService.omsPickListGroup.filter(
                  (x) => x.ChannelCode === "PACKUPP"
                ).length
              }
              selected={currentFilter === 3}
              onSelect={() => setCurrentFilter(currentFilter === 3 ? 0 : 3)}
              title={translate("OmsPickList.homeDeliveryByCargo")}
            />
          </React.Fragment>
        </View>
        <BarcodeSearchBar
          onSearch={(query: string) => {
            let order = getOrderByProduct(query);
            if (currentFilter !== 2) {
              let product = OmsService.omsPickListGroup.find(
                (x) => x.BarcodeNo === query
              );
              if (product) {
                if (Number(product.Quantity) - product.FoundCount > 1) {
                  setQuantityPopup({
                    shown: true,
                    imageUri: product.ImageUrl,
                    maxQuantity: product.Quantity,
                    product,
                    barcode: product.BarcodeNo,
                  });
                } else {
                  OmsService.collectGroupProduct(product, 1);
                }
              } else {
                MessageBox.show(
                  translate("OmsPickList.productNotFoundInTheList")
                );
              }
            } else {
              OmsService.collectProduct(order, query, 1, true);
            }
          }}
        />
        <View style={{ marginTop: 40 }}>
          <>
            {currentFilter === 2 &&
              OmsService.omsPickListOrder
                ?.filter((x) => x.ChannelCode === "BC")
                .map((x) => {
                  return <PickCard key={x.ID} {...x} />;
                })}
            {OmsService.omsPickListGroup
              .filter((x) => {
                if (x.ChannelCode === "BC" || currentFilter === 2) return false;

                if (currentFilter === 1 && x.ChannelCode === "PACKUPP")
                  return true;
                else if (
                  currentFilter === 3 &&
                  x.ChannelCode !== "PACKUPP" &&
                  x.ChannelCode !== "BC"
                )
                  return true;

                return false;
              })
              .map((x) => {
                return <ProductPickCard key={x.ID} {...x} />;
              })}
          </>
        </View>
      </ScrollView>

      {quantityPopup.shown && quantityPopup.product && (
        <QuantityPopup
          quantity={quantityPopup.maxQuantity}
          curQuantity={"1"}
          imageUri={quantityPopup.imageUri}
          barcode={quantityPopup.barcode}
          onComplete={async (
            quantity: number,
            reason?: OmsErrorReasonModel,
            continueLater?: boolean
          ) => {
            if (quantityPopup.product) {
              await OmsService.collectGroupProduct(
                quantityPopup.product,
                quantity,
                reason,
                continueLater
              );
              await OmsService.loadMyPickList();
            }

            setQuantityPopup({ ...quantityPopup, shown: false });
          }}
        />
      )}
    </>
  );
};
export default PickList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 50,
    marginRight: 50,
    marginTop: 50,
    marginBottom: 30,
  },
  selectedCircle: {
    width: CIRCLE_WIDTH_WIDTH_PADDING,
    height: CIRCLE_WIDTH_WIDTH_PADDING,
    padding: 4,
    borderRadius: HALF_CIRCLE_WIDTH_WIDTH_PADDING,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCircleBorder: {
    borderWidth: 4,
    margin: 0,
  },
  circleBase: {
    width: CIRCLE_WIDTH,
    height: CIRCLE_WIDTH,
    borderRadius: HALF_CIRCLE_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
  },
  orderWrapper: {
    flexDirection: "row",
    flex: 1,
  },
  orderProductBlock: {
    flex: 1,
  },
  orderInformationBlock: {
    backgroundColor: "pink",
    width: 100,
    justifyContent: "space-between",
  },
});
