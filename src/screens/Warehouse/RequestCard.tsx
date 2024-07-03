import {
  AppButton,
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import I18n from "i18n-js";
import moment from "moment";
import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import FullScreenImage from "../../components/FullScreenImage";
import { WarehouseResModel } from "../../core/models/WarehouseModel";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import { translate } from "../../helper/localization/locaizationMain";
import { AppCardColorizeSvg } from "../Cancellation/EasyReturn/BrokenProduct/BrokenComplete";

interface RequestCardProps extends WarehouseResModel {
  onProcessButtonPress?: () => void;
  mylist?: boolean;
  waitingList?: boolean;
}

const Sperator = () => (
  <View
    style={{
      height: 1,
      backgroundColor: AppColor.FD.Text.Light,
      marginVertical: 5,
    }}
  />
);
const RequestCard: React.FC<RequestCardProps> = (props) => (
  <View style={styles.cardContainer}>
    <AppCardColorizeSvg color={AppColor.FD.Brand.Solid} />
    <View style={styles.cardWrapper}>
      <AppText style={{ fontFamily: "Poppins_600SemiBold" }} selectable>
        {I18n.translate(
          `warehouseRequest.${
            props.mylist ? "requestTitleWithStatus" : "requestTitle"
          }`,
          {
            status:
              props.mylist &&
              I18n.translate(
                `warehouseRequest.${
                  props.status === 0
                    ? "statusWaiting"
                    : props.productState === 0
                    ? "statusStatusNotFound"
                    : "statusFound"
                }`
              ),
          }
        )}
        {/* Ürün Talebi{" "}
        {props.mylist &&
          (props.status === 0
            ? "( Bekliyor )"
            : props.productState === 0
            ? "( Ürün Bulunamadı )"
            : "( Ürün Bulundu )")} */}
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
          {I18n.translate("warehouseRequest.requestMessage", {
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
            {I18n.translate(
              `warehouseRequest.${
                props.productState === 0
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
            {translate("warehouseRequest.cancelReason")} : {props.cancelReason}
          </AppText>
        )}
      {props.requestNote?.length > 0 && (
        <View>
          <Sperator />
          <AppText>
            <AppText style={{ fontFamily: "Poppins_600SemiBold" }}>
              {I18n.translate(`warehouseRequest.requestNote`, {
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
            {I18n.translate(`warehouseRequest.completeNote`, {
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
            {I18n.translate(`warehouseRequest.completedFrom`, {
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
          {I18n.translate(`warehouseRequest.createdAt`, {
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
            title={I18n.translate("warehouseRequest.takeTransaction")}
          />
        </React.Fragment>
      )}
    </View>
  </View>
);
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
