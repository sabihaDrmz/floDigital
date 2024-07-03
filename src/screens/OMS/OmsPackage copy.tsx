import {
  AppButton,
  AppCheckBox,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { FloHeader } from "../../components/Header";
import { OmsErrorReasonModel } from "../../core/models/OmsErrorReasonModel";
import { PackageOrder } from "../../core/models/OmsPackageModel";
import MessageBox, {
  MessageBoxDetailType,
  MessageBoxType,
} from "../../core/services/MessageBox";
import OmsService from "../../core/services/OmsService";
import OmsBarcodeSearchBar from "./Partials/OmsBarcodeSearchBar";
import { MenuIcon } from "./Partials/OmsReasonRadios";
import Radio from "./Partials/Radio";
import { translate } from "../../helper/localization/locaizationMain";

interface CProps extends PackageOrder {
  selected: boolean;
}
const OmsPackage: React.FC = (props) => {
  //#region Sub components
  const ProductCard: React.FC<CProps> = (props) => {
    return (
      <>
        <View style={styles.productCardContainer}>
          <View style={styles.checkboxContainer}>
            <AppCheckBox disabled checked={props.selected} />
          </View>
          <View>
            <Image
              resizeMethod={"scale"}
              resizeMode={"cover"}
              style={styles.imageStyle}
              source={{
                uri: props.ImageUrl,
              }}
            />
          </View>
          <View style={styles.productCardInfoContainer}>
            <AppText selectable size={FontSizes.L}>
              {props.Color}
            </AppText>
            <AppText selectable labelType={LabelType.Label}>
              {props.ModelName}
            </AppText>
            <View style={styles.productCardInfoSizeBlock}>
              <AppText size={FontSizes.L} style={{ flex: 1 }} selectable>
                {props.BarcodeNo}
              </AppText>
              <View style={styles.productCardInfoSizeBlock}>
                <AppText size={FontSizes.L}>|</AppText>
                <AppText selectable size={FontSizes.L}>
                  {props.BodySize}
                </AppText>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setIsExpand(!isExpand)}
            style={styles.expandContainer}
          >
            <AntDesign
              name={!isExpand ? "caretright" : "caretdown"}
              size={20}
              color={AppColor.FD.Text.Ash}
            />
          </TouchableOpacity>
        </View>
        {isExpand && (
          <TouchableOpacity
            onPress={() => setCurrentPopup(props.ID)}
            style={{
              height: 44,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#c1bdbd",
              opacity: 0.42,
              borderRadius: 4,
              backgroundColor: "#ffffff",
              alignItems: "center",
              flexDirection: "row",
              paddingLeft: 15,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 10,
              }}
            >
              <AppText selectable style={{ fontWeight: "400" }}>
                {reasons.find((x) => x.popupId === props.ID)
                  ? reasons.find((x) => x.popupId === props.ID)?.reason.OmsName
                  : "-"}
              </AppText>
              {currentReason === undefined && (
                <AppText style={{ fontWeight: "400" }}>
                  {translate("OmsPackageCard.whyChooseList")}
                </AppText>
              )}
            </View>
            <MenuIcon />
          </TouchableOpacity>
        )}
      </>
    );
  };

  const Sperator: React.FC = (props) => <View style={styles.sperator} />;
  //#endregion

  const GetOrderNumber = () => {
    return OmsService.packageContiniousOrder;
  };
  useEffect(() => {
    OmsService.loadErrorReasons();
  });
  const [isExpand, setIsExpand] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(0);
  const [reasons, setReasons] = useState<
    { reason: OmsErrorReasonModel; popupId: number }[]
  >([]);
  const [currentReason, setCurrentReason] = useState<OmsErrorReasonModel>();

  const getOrderByProduct = (barcode: string) => {
    let order = OmsService.packageList
      .filter(
        (x) =>
          x.Orders && x.Orders.length > 0 && x.Orders[0].ChannelCode === "BC"
      )
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
      (x) =>
        x.Orders.find(
          (y) => y.BarcodeNo === barcode && y.ChannelCode === "BC"
        ) !== undefined
    );

    if (order) return order.OrderNo;

    return "-1";
  };

  return (
    <View style={styles.container}>
      <FloHeader
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={`Paketleme (${GetOrderNumber()})`}
      />
      <View style={{ marginTop: 50 }}>
        <OmsBarcodeSearchBar
          onSearch={(barcode) => {
            let orderId = getOrderByProduct(barcode);

            var product = OmsService.packageList
              .find((x) => x.OrderNo === orderId)
              ?.Orders.find((x) => x.BarcodeNo === barcode);

            if (product) OmsService.pickItem(orderId, product.BarcodeNo);
          }}
        />
      </View>
      <ScrollView
        bounces={false}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <Observer>
          {() => {
            return (
              <>
                {OmsService.packageList
                  .filter(
                    (x) => x.OrderNo === OmsService.packageContiniousOrder
                  )
                  .map((x, index) => {
                    return x.Orders.map((y) => {
                      return (
                        <>
                          <ProductCard
                            key={y.ID}
                            {...y}
                            selected={
                              OmsService.packagingTemp.findIndex(
                                (t) => t.ID === y.ID
                              ) > -1
                            }
                          />
                          {index < OmsService.pickingTemp.length - 1 && (
                            <Sperator />
                          )}
                        </>
                      );
                    });
                  })}
              </>
            );
          }}
        </Observer>
        <View style={{ height: 90 }} />
      </ScrollView>
      <SafeAreaView>
        <View style={styles.buttonContainer}>
          <Observer>
            {() => {
              let order = OmsService.omsPickListOrder.find(
                (x) => x.OrderNo === OmsService.packageContiniousOrder
              );
              let quantity =
                OmsService.packageList.find(
                  (x) => x.OrderNo === OmsService.packageContiniousOrder
                )?.Orders.length || 0;
              if (reasons.length > 0)
                return (
                  <AppButton
                    title={"Siparişi İptalet"}
                    buttonColorType={ColorType.Danger}
                    onPress={() => {
                      MessageBox.yesButton = "İptal Et";
                      MessageBox.Show(
                        "Sipariş iptal edilecek emin misiniz?",
                        MessageBoxDetailType.Danger,
                        MessageBoxType.YesNo,
                        () => {
                          let ordermodel = OmsService.pickingTemp.find(
                            (x) =>
                              x.OrderNo === OmsService.packageContiniousOrder
                          );
                          if (ordermodel)
                            OmsService.cancelOrder(
                              ordermodel,
                              reasons[0].reason.OmsName
                            );
                        },
                        () => {}
                      );
                    }}
                  />
                );
              return (
                <AppButton
                  title={"Etiket Bas"}
                  buttonColorType={
                    quantity > OmsService.packagingTemp.length
                      ? ColorType.Gray
                      : ColorType.Success
                  }
                  disabled={quantity > OmsService.packagingTemp.length}
                  loading={OmsService.onLoadingPrintLabel}
                  onPress={() => OmsService.printLabel()}
                />
              );
            }}
          </Observer>
          {/* <AppButton title={'Etiket Bas'} buttonColorType={ColorType.Gray} /> */}
        </View>
      </SafeAreaView>
      {currentPopup !== 0 && (
        <View
          style={{
            position: "absolute",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: "#fff",
              borderRadius: 15,
              minHeight: 250,
              padding: 15,
            }}
          >
            <Observer>
              {() => {
                return (
                  <>
                    {OmsService.errorReasons.map((x) => {
                      return (
                        <Radio
                          key={x.OmsName}
                          selected={x === currentReason}
                          onSelect={() => setCurrentReason(x)}
                          label={x.OmsName}
                        />
                      );
                    })}
                  </>
                );
              }}
            </Observer>
            <AppButton
              buttonColorType={ColorType.Success}
              title={translate("OmsCargoConsensusDatePopup.ok")}
              onPress={() => {
                if (currentReason) {
                  let temp = reasons;
                  let index = temp.findIndex((y) => y.popupId === currentPopup);
                  if (index === -1)
                    temp.push({ reason: currentReason, popupId: currentPopup });
                  else temp[index].reason = currentReason;
                  setReasons(temp);
                }

                setCurrentPopup(0);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};
export default OmsPackage;

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
