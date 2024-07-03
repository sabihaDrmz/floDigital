import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import moment from "moment";
import React from "react";
import { View, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { WarehouseResModel } from "../../core/models/WarehouseModel";
import { translate } from "../../helper/localization/locaizationMain";
import Svg, { Path } from "react-native-svg";
interface RequestCardProps extends WarehouseResModel {
  onProcessButtonPress?: () => void;
  mylist?: boolean;
  waitingList?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = (props) => {
  const ApplicationGlobalService = useApplicationGlobalService();

  const Sperator = () => (
    <View
      style={{
        height: 1,
        backgroundColor: AppColor.FD.Text.Light,
        marginVertical: 5,
      }}
    />
  );

  const AppCardColorizeSvg: React.FC<{ color: string }> = (props) => {
    return (
      <Svg width={10} height={53} {...props}>
        <Path
          data-name="AGT Siparis karti"
          d="M10 0v43A10 10 0 0 1 0 53V10A10 10 0 0 1 10 0Z"
          fill={props.color}
        />
      </Svg>
    );
  };

  return (
    <View style={styles.cardContainer}>
      <AppCardColorizeSvg color={AppColor.FD.Brand.Solid} />
      <View style={styles.cardWrapper}>
        <AppText style={{ fontFamily: "Poppins_600SemiBold" }} selectable>
          {translate(
            `warehouseRequest.${props.mylist ? "requestTitleWithStatus" : "requestTitle"
            }`,
            {
              status:
                props.mylist &&
                translate(
                  `warehouseRequest.${props.status === 0
                    ? "statusWaiting"
                    : props.productState === 0
                      ? "statusStatusNotFound"
                      : "statusFound"
                  }`
                ),
            }
          )}
        </AppText>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() =>
              ApplicationGlobalService.showFullScreenImage(
                "https://www.flo.com.tr/V1/product/image?sku=" +
                parseInt(props.parentSku)
              )
            }
          >
            <Image
              source={{
                uri:
                  "https://www.flo.com.tr/V1/product/image?sku=" +
                  parseInt(props.parentSku),
              }}
              style={{ width: 60, height: 60 }}
            />
          </TouchableOpacity>
          <AppText
            selectable
            style={{
              fontFamily: "Poppins_400Regular",
              width: Dimensions.get("window").width - 115,
              marginLeft: 10,
            }}
          >
            {translate("warehouseRequest.requestMessage", {
              barcode: props.barcode,
              model: props.model,
              color: props.model,
              sku: props.parentSku,
              employeeName: props.requestPersonName,
              size: props.size,
            })}
          </AppText>
        </View>
        {props.status === 1 && (
          <View>
            <Sperator />
            <AppText style={{ fontFamily: "Poppins_600SemiBold" }}>
              {translate(
                `warehouseRequest.${props.productState === 0
                  ? "statusStatusNotFound"
                  : "statusFound"
                }`
              )}
            </AppText>
          </View>
        )}
        {props.cancelReason !== undefined &&
          props.cancelReason !== null &&
          props.cancelReason !== "" && (
            <AppText selectable style={{ fontFamily: "Poppins_600SemiBold" }}>
              {translate("warehouseRequest.cancelReason")} :{" "}
              {props.cancelReason}
            </AppText>
          )}
        {props.requestNote?.length > 0 && (
          <View>
            <Sperator />
            <AppText>
              <AppText style={{ fontFamily: "Poppins_600SemiBold" }}>
                {translate(`warehouseRequest.requestNote`, {
                  note: props.requestNote,
                })}
              </AppText>
            </AppText>
          </View>
        )}
        {props.completeNote?.length > 0 && (
          <View>
            {/* <Sperator /> */}
            {/* <AppText> */}
            <AppText style={{ fontFamily: "Poppins_600SemiBold" }}>
              {translate(`warehouseRequest.completeNote`, {
                note: props.completeNote,
              })}
            </AppText>
            {/* {props.completeNote} */}
            {/* </AppText> */}
          </View>
        )}
        {props.status === 1 && (
          <View>
            {/* <Sperator /> */}
            <AppText selectable>
              {translate(`warehouseRequest.completedFrom`, {
                person: props.completePersonName,
                dateStr:
                  //@ts-ignore
                  moment(props.modifiedDate).format("DD/MM/YYYY HH:mm"),
              })}
            </AppText>
          </View>
        )}
        <View>
          {/* <Sperator /> */}
          <AppText selectable>
            {translate(`warehouseRequest.createdAt`, {
              date:
                //@ts-ignore
                moment(props.createDate).format("DD/MM/YYYY HH:mm"),
            })}
          </AppText>
        </View>
        {props.onProcessButtonPress && (
          <React.Fragment>
            <Sperator />
            <AppButton
              onPress={props.onProcessButtonPress}
              buttonColorType={ColorType.Brand}
              title={translate("warehouseRequest.takeTransaction")}
            />
          </React.Fragment>
        )}
      </View>
    </View>
  );
};
export default RequestCard;

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingRight: 20,
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
  },
  cardWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});
