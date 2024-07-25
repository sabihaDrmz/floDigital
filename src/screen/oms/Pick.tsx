import {
  AppButton,
  AppCheckBox,
  AppColor,
  AppText,
  ColorType,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import { translate } from "../../helper/localization/locaizationMain";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import BarcodeSearchBar from "../../components/Oms/partials/BarcodeSearchBar";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { OmsErrorReasonModel } from "../../core/models/OmsErrorReasonModel";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import Radio from "../../components/Oms/partials/Radio";
import FsImage from "../../components/FSImage";
import { OmsOrderDetail } from "../../core/models/OmsOrderModel";
import { MenuIcon } from "../../components/Oms/partials/ReaseonRadios";
import { useOmsService } from "../../contexts/OmsService";
import { useNavigation } from "@react-navigation/native";
interface CProps extends OmsOrderDetail {
  selected: boolean;
  isExpand: boolean;
  onExpand: (state: boolean) => void;
  onPopup: (state: boolean) => void;
}
const Pick: React.FC = (props) => {
  const { continiousOrder, omsPickListOrder, omsPickList, collectProduct, pickingTemp, cancelOrder, cancelLoading, errorReasons } = useOmsService();
  const navigation = useNavigation();
  //#region Sub components
  const ProductCard: React.FC<CProps> = (props) => {
    return (
      <View>
        <View style={styles.productCardContainer}>
          <View style={styles.checkboxContainer}>
            <AppCheckBox disabled checked={props.selected} />
          </View>
          <View>
            <FsImage
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
              <AppText selectable size={FontSizes.L} style={{ flex: 1 }}>
                {props.BarcodeNo}
              </AppText>
              <View style={styles.productCardInfoSizeBlock}>
                <AppText size={FontSizes.L}>|{"  "}</AppText>
                <AppText selectable size={FontSizes.L}>
                  {props.BodySize}
                </AppText>
                <AppText size={FontSizes.L} style={{ marginLeft: 10 }}>
                  |{"  "}
                </AppText>
                <AppText selectable size={FontSizes.L}>
                  {props.Quantity} Ad.
                </AppText>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => props.onExpand(!props.isExpand)}
            style={styles.expandContainer}
          >
            <FontAwesomeIcon
              icon={!props.isExpand ? "caretright" : "caretdown"}
              size={20}
              color={AppColor.FD.Text.Ash}
            />
          </TouchableOpacity>
        </View>
        {props.isExpand && (
          <TouchableOpacity
            onPress={() => props.onPopup(!props.isExpand)}
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
              marginBottom: 20,
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
                {reasons ? reasons.OmsName : "-"}
              </AppText>
              {currentReason === undefined && (
                <AppText style={{ fontWeight: "400" }}>
                  {translate("OmsReaseonRadios.selectReason")}
                </AppText>
              )}
            </View>
            <MenuIcon />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const Sperator: React.FC = (props) => <View style={styles.sperator} />;
  //#endregion

  const GetOrderNumber = () => {
    let order = omsPickListOrder.find(
      (x) => x.OrderNo === continiousOrder
    );

    if (order) return order.OrderNo;

    let pOrder = omsPickList.find(
      (x) => x.OrderNo === continiousOrder
    );

    if (pOrder) return pOrder.OrderNo;
    return "-";
  };

  const [currentPopup, setCurrentPopup] = useState(0);
  const [currentExpanded, setCurrentExpanded] = useState(0);
  const [reasons, setReasons] = useState<OmsErrorReasonModel>();
  const [currentReason, setCurrentReason] = useState<OmsErrorReasonModel>();

  const getOrderByProduct = (barcode: string) => {
    let m = { type: "BC", orderNo: "" };

    // Brick and collect
    if (
      omsPickListOrder.find(
        (x) => x.OrderItems.filter((y) => y.BarcodeNo === barcode).length > 0
      )
    ) {
      m.type = "BC";

      const co = omsPickListOrder.find(
        (x) =>
          x.OrderItems.filter((y) => y.BarcodeNo === barcode).length > 0 &&
          x.OrderNo === continiousOrder
      )?.OrderNo;

      if (co) m.orderNo = co;
      else {
        // @ts-ignore
        m.orderNo = omsPickListOrder.find(
          (x) => x.OrderItems.filter((y) => y.BarcodeNo === barcode).length > 0
        )?.OrderNo;
      }
    } else {
      m.orderNo = "-1";
    }

    return m;
  };

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        enableButtons={["back"]}
        headerTitle={`${translate(
          "OmsPickList.collect"
        )} (${GetOrderNumber()})`}
      />
      <View style={{ marginTop: 40 }}>
        <BarcodeSearchBar
          onSearch={(query) => {
            let order = getOrderByProduct(query);
            collectProduct(order, query, 1);
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
        {omsPickListOrder
          .filter((x) => x.OrderNo === continiousOrder)
          .map((x, index) => {
            return x.OrderItems.map((y) => {
              return (
                <>
                  <ProductCard
                    onExpand={(state) => {
                      if (state) setCurrentExpanded(y.ID);
                      else setCurrentExpanded(0);

                      setCurrentReason(undefined);
                      setReasons(undefined);
                    }}
                    onPopup={() => {
                      setCurrentPopup(y.ID);
                    }}
                    key={y.ID}
                    {...y}
                    isExpand={y.ID === currentExpanded}
                    selected={
                      pickingTemp.findIndex(
                        (z) => z.BarcodeNo === y.BarcodeNo && y.ID === z.ID
                      ) > -1
                    }
                  />
                  <Sperator />
                </>
              );
            });
          })}
        <View style={{ height: 90 }} />
      </ScrollView>
      <SafeAreaView>
        <View style={styles.buttonContainer}>
          {reasons && (
            <AppButton
              title={translate("ProductDetail.cancelOrder")}
              buttonColorType={ColorType.Danger}
              loading={cancelLoading}
              onPress={() => {
                let ordermodel = omsPickListOrder
                  .find((x) => x.OrderNo === continiousOrder)
                  ?.OrderItems.find((x) => x.ID === currentExpanded);
                if (ordermodel)
                  cancelOrder(ordermodel, reasons.OmsName).then(
                    () => navigation.goBack()
                  );
              }}
            />
          )}
        </View>
      </SafeAreaView>
      {currentPopup !== 0 && (
        <TouchableWithoutFeedback
          onPress={() => {
            setCurrentPopup(0);
          }}
        >
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
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: "90%",
                  backgroundColor: "#fff",
                  borderRadius: 15,
                  minHeight: 250,
                  padding: 15,
                }}
              >
                {errorReasons.map((x) => {
                  return (
                    <Radio
                      key={x.OmsName}
                      selected={x === currentReason}
                      onSelect={() =>
                        setCurrentReason(x === currentReason ? undefined : x)
                      }
                      label={x.OmsName}
                    />
                  );
                })}

                <AppButton
                  buttonColorType={ColorType.Success}
                  title={translate("messageBox.ok")}
                  onPress={() => {
                    if (currentReason) {
                      setReasons(currentReason);
                    }

                    setCurrentPopup(0);
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};
export default Pick;

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
