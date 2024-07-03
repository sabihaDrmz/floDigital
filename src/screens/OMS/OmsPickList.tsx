import { AppColor, FontSizes } from "@flomagazacilik/flo-digital-components";
import {
  AppText,
  ColorType,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { OmsErrorReasonModel } from "../../core/models/OmsErrorReasonModel";
import { OmsOrderDetail, OmsOrderModel } from "../../core/models/OmsOrderModel";
import MessageBox from "../../core/services/MessageBox";
import MessageBoxNew from "../../core/services/MessageBoxNew";
import OmsService from "../../core/services/OmsService";
import { translate } from "../../helper/localization/locaizationMain";
import OmsBarcodeSearchBar from "./Partials/OmsBarcodeSearchBar";
import OmsQuantityPopup from "./Partials/OmsQuantityPopup";
import OrderPickCard from "./Partials/OrderPickCard";
import ProductPickCard from "./Partials/ProductPickCard";

const HALF_CIRCLE_WIDTH = 25;
const CIRCLE_WIDTH = HALF_CIRCLE_WIDTH * 2;
const HALF_CIRCLE_WIDTH_WIDTH_PADDING = HALF_CIRCLE_WIDTH + 7;
const CIRCLE_WIDTH_WIDTH_PADDING = HALF_CIRCLE_WIDTH_WIDTH_PADDING * 2;
const OmcPickList: React.FC = (props) => {
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

  const [currentFilter, setCurrentFilter] = useState(2);

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
      <Observer>
        {() => {
          let comeget = OmsService.omsPickListOrder.length;
          let CC = OmsService.omsPickListGroup.filter(
            (x) => x.ChannelCode === "BGK"
          ).length;
          let BCC = OmsService.omsPickListGroup.filter(
            (x) => x.ChannelCode !== "BC"
          ).length;
          let BC = BCC - CC;
          return (
            <ScrollView style={styles.container}>
              <View style={styles.circleContainer}>
                <React.Fragment>
                  <MakeCircle
                    source={"Agt"}
                    cnt={CC}
                    selected={currentFilter === 1}
                    onSelect={() =>
                      setCurrentFilter(currentFilter === 1 ? 0 : 1)
                    }
                    title={translate("OmsPickList.sameDayHomeDelivery")}
                  />
                  <MakeCircle
                    source={"ComeGet"}
                    cnt={comeget}
                    selected={currentFilter === 2}
                    onSelect={() =>
                      setCurrentFilter(currentFilter === 2 ? 0 : 2)
                    }
                    title={translate("OmsPickList.sameDayComeAndGet")}
                  />
                  <MakeCircle
                    source={"DeliveryHome"}
                    cnt={BC}
                    selected={currentFilter === 3}
                    onSelect={() =>
                      setCurrentFilter(currentFilter === 3 ? 0 : 3)
                    }
                    title={translate("OmsPickList.homeDeliveryByCargo")}
                  />
                </React.Fragment>
              </View>
              <OmsBarcodeSearchBar
                onSearch={(query: string) => {
                  let order = getOrderByProduct(query);

                  // if (order.orderNo === '-1') {
                  //   MessageBoxNew.show('Okuttuğunuz ürün listede bulunamadı');
                  //   return;
                  // }

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
                      MessageBoxNew.show(
                        translate("OmsPickList.productNotFoundInTheList")
                      );
                    }
                  } else {
                    OmsService.collectProduct(order, query, 1);
                  }
                }}
              />
              <View style={{ marginTop: 40 }}>
                <>
                  {currentFilter === 2 &&
                    OmsService.omsPickListOrder
                      ?.filter((x) => x.ChannelCode === "BC")
                      .map((x) => {
                        return <OrderPickCard key={x.ID} {...x} />;
                      })}
                  {OmsService.omsPickListGroup
                    .filter((x) => {
                      if (x.ChannelCode === "BC" || currentFilter === 2)
                        return false;

                      if (currentFilter === 1 && x.ChannelCode === "BGK")
                        return true;
                      else if (
                        (currentFilter === 0 || currentFilter === 3) &&
                        x.ChannelCode !== "BGK" &&
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
          );
        }}
      </Observer>
      {quantityPopup.shown && quantityPopup.product && (
        <OmsQuantityPopup
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
export default OmcPickList;

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
