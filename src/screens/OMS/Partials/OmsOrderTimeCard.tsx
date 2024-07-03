import {
  ColorType,
  LabelType,
  AppColor,
  AppText,
  ProgressBar,
  AppCheckBox,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { OmsOrderModel } from "../../../core/models/OmsOrderModel";
import OmsService from "../../../core/services/OmsService";
import { translate } from "../../../helper/localization/locaizationMain";

const OmsOrderTimeCard: React.FC<{
  color?: ColorType;
  timeLeft: string;
  icon?: React.ReactNode;
  assignState: boolean;
  data: { qty: number; timeLeft: string; order: OmsOrderModel };
  orderID: number;
  source: string;
}> = (props) => (
  <View style={styles.timeCard}>
    <View style={styles.head}>
      {props.icon}
      <AppText
        selectable
        labelColorType={props.color}
        style={{ marginLeft: 5 }}
        labelType={LabelType.Label}
      >
        {props.timeLeft}
      </AppText>
      {props.assignState ? (
        <View style={{ position: "absolute", right: 5 }}>
          <Observer>
            {() => {
              return (
                <AppCheckBox
                  onSelect={() =>
                    OmsService.addAssignQueue(
                      "order",
                      OmsService.assignTemp.includes(props.data?.order?.ID)
                        ? "uncheck"
                        : "check",
                      props.data.order.ID
                    )
                  }
                  checked={OmsService.assignTemp.includes(
                    props.data?.order?.ID
                  )}
                />
              );
            }}
          </Observer>
        </View>
      ) : (
        <View style={[styles.plusButtonContainer, { marginRight: 0 }]}>
          <Observer>
            {() => {
              if (
                OmsService.assignLoading.isLoading &&
                OmsService.assignLoading.orderId === props.orderID
              )
                return <ActivityIndicator />;

              return (
                <TouchableOpacity
                  disabled={OmsService.assignLoading.isLoading}
                  onPress={() => OmsService.assignOrderToMe(props.orderID)}
                >
                  <FontAwesome5
                    name={"plus"}
                    size={20}
                    color={AppColor.FD.Brand.Solid}
                  />
                </TouchableOpacity>
              );
            }}
          </Observer>
        </View>
      )}
    </View>
    <View style={styles.timeContent}>
      <AppText selectable style={{ marginBottom: 4 }}>
        {props.data?.timeLeft}
      </AppText>
      <AppText selectable style={{ fontWeight: "bold", marginBottom: 12 }}>
        {props.data?.qty} {translate("OmsOrderTimeCard.product")}
      </AppText>
      <AppText selectable numberOfLines={1}>
        {props.source === "BC"
          ? translate("OmsOrderTimeCard.sameDayCome")
          : props.source === "BGK"
          ? translate("OmsOrderTimeCard.sameDayDelivery")
          : translate("OmsOrderTimeCard.homeCargo")}
      </AppText>
      {/* <ProgressBar
        current={1}
        currentTitle={'{%current}/{%maxValue} Aynı gün eve teslim'}
        maxValue={3}
        color={'#C6C9CC'}
        maxWidth={130}
        textStyle={{fontSize: 11}}
      /> */}
    </View>
  </View>
);

export default OmsOrderTimeCard;

const styles = StyleSheet.create({
  timeContent: {
    padding: 10,
  },
  plusButtonContainer: {
    width: 41,
    height: 41,
    backgroundColor: "#FFF",
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    top: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: "absolute",
    right: 5,
    elevation: 5,
  },
  timeLine: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  timeCard: {
    width: 150,
    height: 145,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: 14,
    marginRight: 15,
    margin: 5,
  },

  head: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F6F4F4",
    height: 50,
    paddingHorizontal: 20,
  },
});
