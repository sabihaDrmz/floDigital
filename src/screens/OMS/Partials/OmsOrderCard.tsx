import {
  FontSizes,
  LabelType,
  AppColor,
  AppCard,
  AppText,
  AppCheckBox,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { OmsOrderModel } from "../../../core/models/OmsOrderModel";
import OmsService from "../../../core/services/OmsService";
import { durationToString } from "../../../helper/DurationParseHelper";
import { OmsBoxIco } from "../../../Icons/OmsBoxIco";
import OmsClockIcon from "../../../Icons/OmsClockIco";
import OmsExpandIcon from "../../../Icons/OmsExpandIco";
import ApplicationGlobalService from "../../../core/services/ApplicationGlobalService";
import FsImage from "../../../components/FSImage";
import { translate } from "../../../helper/localization/locaizationMain";

const OmsOrderCard: React.FC<{
  color?: string;
  order: OmsOrderModel;
  assignState: boolean;
}> = (props) => {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <AppCard {...props}>
      <TouchableOpacity
        hitSlop={{ bottom: 20, top: 20 }}
        disabled={isExpanded}
        onPress={() => setExpanded(true)}
      >
        <View style={{ flexDirection: "row" }}>
          {!isExpanded && <OmsExpandIcon />}
          <AppText
            selectable
            style={{ marginLeft: 10, marginRight: 40 }}
            size={FontSizes.S}
          >
            {props.order.OrderNo}
          </AppText>
          <OmsClockIcon />
          <AppText selectable style={{ marginLeft: 10 }} size={FontSizes.S}>
            {durationToString(props.order.Duration)}
          </AppText>
        </View>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {!isExpanded ? (
          <View
            style={{
              flexDirection: isExpanded ? "column" : "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                ApplicationGlobalService.showFullScreenImage(
                  props.order.OrderItems[0].ImageUrl
                );
              }}
            >
              {props.order.OrderItems.length >= 1 && (
                <Image
                  source={{
                    uri: props.order.OrderItems[0].ImageUrl,
                  }}
                  resizeMode="cover"
                  style={{ width: 70, height: 77, marginRight: 10 }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                ApplicationGlobalService.showFullScreenImage(
                  props.order.OrderItems[1].ImageUrl
                );
              }}
            >
              {props.order.OrderItems.length >= 2 && (
                <Image
                  source={{
                    uri: props.order.OrderItems[1].ImageUrl,
                  }}
                  resizeMode="cover"
                  style={{ width: 70, height: 77, marginRight: 10 }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity>
              {props.order.OrderItems.length >= 3 && (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#F0F0F0",
                    borderRadius: 15,
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 14,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                  }}
                >
                  <AppText selectable>
                    +{props.order.OrderItems.length - 2}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {props.order.OrderItems.map((oitem) => {
              return (
                <View style={{ flexDirection: "row" }}>
                  <FsImage
                    source={{
                      uri: oitem.ImageUrl,
                    }}
                    resizeMode="cover"
                    style={{ width: 70, height: 77, marginRight: 10 }}
                  />
                  <View style={{ maxWidth: "63%" }}>
                    <AppText selectable size={FontSizes.S}>
                      {oitem.Color}
                    </AppText>
                    <AppText
                      selectable
                      size={FontSizes.M}
                      labelType={LabelType.Label}
                      numberOfLines={1}
                    >
                      {oitem.Brand}-{oitem.ModelName}
                    </AppText>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <AppText
                        selectable
                        size={FontSizes.S}
                        style={{ width: 110 }}
                      >
                        {oitem.BarcodeNo}
                      </AppText>
                      <AppText selectable size={FontSizes.S}>
                        | {oitem.BodySize}{" "}
                      </AppText>
                      <AppText selectable size={FontSizes.S}>
                        | {oitem.Quantity} {translate("OmsOrderCard.quantity")}
                      </AppText>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
        {props.assignState ? (
          <Observer>
            {() => {
              let checked = OmsService.assignTemp.includes(props.order.ID);
              return (
                <AppCheckBox
                  onSelect={(state) =>
                    OmsService.addAssignQueue(
                      "order",
                      state ? "check" : "uncheck",
                      props.order.ID
                    )
                  }
                  checked={checked}
                />
              );
            }}
          </Observer>
        ) : (
          <Observer>
            {() => {
              if (
                OmsService.assignLoading.isLoading &&
                OmsService.assignLoading.orderId === props.order.ID
              )
                return <ActivityIndicator />;
              return (
                <TouchableOpacity
                  disabled={OmsService.assignLoading.isLoading}
                  onPress={() => OmsService.assignOrderToMe(props.order.ID)}
                  style={styles.plusButtonContainer}
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
        )}
      </View>
      {isExpanded && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: OmsBoxIco }}
                resizeMode="center"
                style={{ width: 23, height: 23, tintColor: "#707070" }}
              />
              <View>
                <AppText selectable style={{ marginLeft: 10 }}>
                  {props.order.OrderItems.reduce(
                    (a, b) => a + Number(b.Quantity),
                    0
                  )}{" "}
                  {translate("OmsOrderCard.quantity")}
                </AppText>
              </View>
            </View>
            <Image
              resizeMode="center"
              style={{ marginTop: 10, alignItems: "flex-end" }}
              source={require("../../../../assets/floLogo.png")}
            />
          </View>
          <TouchableOpacity
            hitSlop={{ bottom: 20, top: 20 }}
            onPress={() => setExpanded(false)}
            style={{ flexDirection: "row", marginRight: 20 }}
          >
            <AppText size={FontSizes.S}>
              {translate("OmsOrderCard.closeDetails")}
            </AppText>
            <View
              style={{ transform: [{ rotateZ: "-90deg" }], marginLeft: 10 }}
            >
              <OmsExpandIcon />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </AppCard>
  );
};

export default OmsOrderCard;

const styles = StyleSheet.create({
  container: {},

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
});
