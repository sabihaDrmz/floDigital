import {
  AppText,
  ColorType,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useOmsService } from "../../contexts/OmsService";
import { translate } from "../../helper/localization/locaizationMain";
import BarcodeSearchBar from "./partials/BarcodeSearchBar";
import PackageCard from "./partials/PackageCard";
import { useMessageBoxService } from "../../contexts/MessageBoxService";

const PackageList: React.FC = (props) => {
  const OmsService = useOmsService();
  const MessageBox = useMessageBoxService();

  const getOrderByProduct = (barcode: string) => {
    let order = OmsService.packageList
      .filter((x) => x.Orders && x.Orders.length > 0)
      .find(
        (x) =>
          x.Orders.find(
            (y) =>
              y.BarcodeNo === barcode &&
              y.OrderNo === OmsService.packageContiniousOrder
          ) !== undefined
      );

    if (order) return order.OrderNo;
    order = OmsService.packageList.find(
      (x) => x.Orders.find((y) => y.BarcodeNo === barcode) !== undefined
    );

    if (order) return order.OrderNo;

    return "-1";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center", marginVertical: 30 }}>
        <AppText
          selectable
          labelColorType={ColorType.Brand}
          labelType={LabelType.Heading}
          size={FontSizes.XXL}
        >
          {OmsService.packageList.length // .filter((x) => x.Orders[0].ChannelCode === 'BC')
            .toString()}
        </AppText>
        <AppText>{translate("OmsPackageList.numberOfOrdersListed")}</AppText>
      </View>
      <BarcodeSearchBar
        onSearch={(barcode) => {
          let orderId = getOrderByProduct(barcode);
          var product = OmsService.packageList
            .find((x) => x.OrderNo === orderId)
            ?.Orders.find((x) => x.BarcodeNo === barcode);

          if (product) {OmsService.pickItem(orderId, product.BarcodeNo, true)}else{
            MessageBox.show(
              translate("OmsPickList.productNotFoundInTheList")
            );
          }
        }}
      />
      <View style={{ marginTop: 50 }}>
        {OmsService.packageList.map((x) => {
          return <PackageCard {...x} />;
        })}
      </View>
    </ScrollView>
  );
};
export default PackageList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    marginHorizontal: 50,
  },
  scrollContainer: {
    marginHorizontal: 32,
    paddingTop: 72,
  },
  sperator: {
    height: 1,
    backgroundColor: "#ededed",
    marginHorizontal: 15,
    marginVertical: 20,
  },
  productCardContainer: {
    flexDirection: "row",
  },
  productCardInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  productCardInfoSizeBlock: {
    flexDirection: "row",
  },
  imageStyle: {
    width: 76,
    height: 86,
    top: -10,
  },
  checkboxContainer: {
    position: "absolute",
    zIndex: 1,
    elevation: 1,
    top: -10,
    left: 5,
  },
  expandContainer: {
    justifyContent: "center",
    width: 35,
    alignItems: "flex-end",
  },
});
