import {
  FontSizes,
  LabelType,
  AppColor,
  AppCard,
  AppText,
  AppCheckBox,
} from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { OmsOrderModel } from "../../../core/models/OmsOrderModel";
import OmsExpandIcon from "../../../Icons/OmsExpandIco";
import OmsClockIcon from "../../../Icons/OmsClockIco";
import { durationToString } from "../../../helper/DurationParseHelper";
import { translate } from "../../../helper/localization/locaizationMain";
import { useOmsService } from "../../../contexts/OmsService";
import { OmsBoxIco } from "../../../Icons/OmsBoxIco";
import { Portal } from "react-native-portalize";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { PerfectPixelSize } from "../../../helper/PerfectPixel";

const OrderCard: React.FC<{
  color?: string;
  order: OmsOrderModel;
  assignState: boolean;
}> = (props) => {
  const OmsService = useOmsService();
  const [isExpanded, setExpanded] = useState(false);
  const [showFullScreenModal, setShowFullScreenModal] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const { width, height } = Dimensions.get("window");

  const scale = new Animated.Value(1);
  const onZoomEvent = Animated.event(
    [
      {
        nativeEvent: { scale: scale },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  const onZoomStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

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
            {props.order.OrderItems.length >= 1 && (
              <TouchableOpacity
                onPress={() => {
                  setImageUri(props.order.OrderItems[0].ImageUrl);
                  setShowFullScreenModal(true);
                }}
              >
                <Image
                  source={{
                    uri: props.order.OrderItems[0].ImageUrl,
                  }}
                  resizeMode="cover"
                  resizeMethod="resize"
                  style={{ width: 70, height: 77, marginRight: 10 }}
                />
              </TouchableOpacity>
            )}

            {props.order.OrderItems.length >= 2 && (
              <TouchableOpacity
                onPress={() => {
                  setImageUri(props.order.OrderItems[1].ImageUrl);
                  setShowFullScreenModal(true);
                }}
              >
                <Image
                  source={{
                    uri: props.order.OrderItems[1].ImageUrl,
                  }}
                  resizeMode="cover"
                  resizeMethod="resize"
                  style={{ width: 70, height: 77, marginRight: 10 }}
                />
              </TouchableOpacity>
            )}

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
          </View>
        ) : (
          <View>
            {props.order.OrderItems.map((oitem) => {
              return (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      setImageUri(oitem.ImageUrl);
                      setShowFullScreenModal(true);
                    }}
                  >
                    <Image
                      source={{
                        uri: oitem.ImageUrl,
                      }}
                      resizeMode="cover"
                      resizeMethod="resize"
                      style={{ width: 70, height: 77, marginRight: 10 }}
                    />
                  </TouchableOpacity>
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
          <AppCheckBox
            onSelect={(state) =>
              OmsService.addAssignQueue(
                "order",
                state ? "check" : "uncheck",
                props.order.ID
              )
            }
            checked={OmsService.assignTemp.includes(props.order.ID)}
          />
        ) : OmsService.assignLoading.isLoading &&
          OmsService.assignLoading.orderId === props.order.ID ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            disabled={OmsService.assignLoading.isLoading}
            onPress={() => OmsService.assignOrderToMe(props.order.ID)}
            style={styles.plusButtonContainer}
          >
            <FontAwesomeIcon
              icon={"plus"}
              size={20}
              color={AppColor.FD.Brand.Solid}
            />
          </TouchableOpacity>
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
              source={require("../../../assets/floLogo.png")}
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

      {showFullScreenModal && (
        <Portal>
          <View
            style={{
              width,
              height,
              backgroundColor: "#fff",
              position: "absolute",
            }}
          >
            <PinchGestureHandler
              onGestureEvent={onZoomEvent}
              onHandlerStateChange={onZoomStateChange}
            >
              <Animated.Image
                source={{
                  uri: imageUri,
                }}
                style={{
                  width: width,
                  height: height,
                  transform: [{ scale: scale }],
                }}
                resizeMode="contain"
              />
            </PinchGestureHandler>
            <View
              style={{
                position: "absolute",
                top: PerfectPixelSize(50),
                right: 30,
              }}
            >
              <TouchableOpacity onPress={() => setShowFullScreenModal(false)}>
                <FontAwesomeIcon icon={"close"} size={40} />
              </TouchableOpacity>
            </View>
          </View>
        </Portal>
      )}
    </AppCard>
  );
};

export default OrderCard;

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
