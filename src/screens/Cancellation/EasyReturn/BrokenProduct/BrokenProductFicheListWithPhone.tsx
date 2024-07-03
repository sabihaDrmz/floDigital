import {
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react-lite";
import moment from "moment";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Actions } from "react-native-router-flux";
import Svg, { Path, SvgWithCss } from "react-native-svg";
import FloLoading from "../../../../components/FloLoading";
import { FloHeader } from "../../../../components/Header";
import { BrokenProductSearchModel } from "../../../../core/models/BrokenProductSearchModel";
import { TransactionType } from "../../../../core/models/EasyReturnTrasnaction";
import EasyReturnService from "../../../../core/services/EasyReturnService";

const Card: React.FC<BrokenProductSearchModel> = (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        EasyReturnService.brokenProductFindResult = props;
        EasyReturnService.transaction = props.easyReturnTransaction;
        EasyReturnService.transaction.processType =
          TransactionType.BrokenComplete;
        Actions["erBrokenResult"]();
      }}
      style={{
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        borderRadius: 10,
        backgroundColor: "#fff",
        minHeight: 100,
        paddingBottom: 20,
        paddingTop: 20,
      }}
    >
      <View style={{ position: "absolute" }}>
        <AppCardColorizeSvg color={AppColor.OMS.Background.OpacityOrange} />
      </View>
      <View style={{ marginLeft: 30 }}>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <Image
            source={{
              uri: props.easyReturnTransaction
                ? props.images
                : "https://www.flo.com.tr/V1/product/image?sku=" +
                  props.sapResult.uruN_KODU
                    .replace(/^0+/, "")
                    .substring(
                      0,
                      props.sapResult.uruN_KODU.replace(/^0+/, "").length - 3
                    ),
            }}
            style={{ width: 50, height: 50, marginRight: 10 }}
            resizeMode={"center"}
          />
          <View>
            <AppText
              selectable
              numberOfLines={1}
              style={{ fontFamily: "Poppins_700Bold" }}
            >
              {props.easyReturnTransaction &&
              props.easyReturnTransaction.easyReturnTrasactionLine
                ? props.easyReturnTransaction.easyReturnTrasactionLine[0]
                    .productName
                : props.sapResult.uruN_ADI}
            </AppText>
            {props.easyReturnTransaction?.easyReturnTrasactionLine?.length && (
              <AppText selectable numberOfLines={1}>
                Beden :{" "}
                {props.easyReturnTransaction?.easyReturnTrasactionLine[0]
                  ?.size ?? ""}{" "}
                | Adet :{" "}
                {props.easyReturnTransaction?.easyReturnTrasactionLine[0]
                  ?.quantity ?? ""}
              </AppText>
            )}
            {props.easyReturnTransaction &&
            props.easyReturnTransaction.easyReturnTrasactionLine &&
            props.easyReturnTransaction?.easyReturnTrasactionLine.length ? (
              <AppText selectable numberOfLines={1}>
                {
                  props.easyReturnTransaction?.easyReturnTrasactionLine[0]
                    ?.barcode
                }{" "}
                |{" "}
                {props.easyReturnTransaction?.easyReturnTrasactionLine[0]?.sku}
              </AppText>
            ) : (
              <AppText selectable numberOfLines={1}>
                {props.sapResult.uruN_KODU}
              </AppText>
            )}
            {props.easyReturnTransaction &&
              props.easyReturnTransaction.easyReturnTrasactionLine &&
              props.easyReturnTransaction?.easyReturnTrasactionLine.length && (
                <AppText
                  selectable
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  labelColorType={ColorType.Brand}
                >
                  Satış Fiyatı :{" "}
                  {
                    props.easyReturnTransaction?.easyReturnTrasactionLine[0]
                      .productPrice
                  }
                </AppText>
              )}
          </View>
        </View>
      </View>
      <View
        style={{
          marginHorizontal: 40,
          width: "70%",
          height: 1,
          backgroundColor: "rgb(228,228,228)",
          marginBottom: 20,
        }}
      ></View>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <AppText style={{ fontFamily: "Poppins_700Bold" }}>
              Müşteri Adı:{" "}
            </AppText>
            <AppText selectable>
              {props.easyReturnTransaction?.customerName ??
                props.sapResult.mgZ_MUSTERI_ADI}
            </AppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <AppText style={{ fontFamily: "Poppins_700Bold" }}>
              Müşteri Tel:{" "}
            </AppText>
            <AppText selectable>
              {props.easyReturnTransaction?.customerGsm ??
                props.sapResult.mgZ_MUSTERI_TEL}
            </AppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <AppText style={{ fontFamily: "Poppins_700Bold" }}>Tarih: </AppText>
            <AppText selectable>
              {moment(props.easyReturnTransaction?.ficheDate).format(
                "DD/MM/YYYY HH:mm"
              ) || "-"}
            </AppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <AppText style={{ fontFamily: "Poppins_700Bold" }}>
              Fiş No:{" "}
            </AppText>
            <AppText selectable>
              {props.easyReturnTransaction?.ficheNumber}
            </AppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <AppText style={{ fontFamily: "Poppins_700Bold" }}>
              ÜİB No:{" "}
            </AppText>
            <AppText selectable>{props.sapResult.mgZ_UIB_NO}</AppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <AppText style={{ fontFamily: "Poppins_700Bold" }}>
              İade Sebebi:{" "}
            </AppText>
            <AppText selectable>{props.sapResult.iadE_SEBEBI}</AppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <AppText style={{ fontFamily: "Poppins_700Bold" }}>Karar: </AppText>
            <AppText selectable>{props.sapResult.karaR_TEXT}</AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const BrokenProductFicheListWithPhone: React.FC = (props) => (
  <View style={styles.container}>
    <FloHeader
      headerType="standart"
      enableButtons={["back"]}
      headerTitle="İDES Listesi"
    />

    <FlatList
      style={{ paddingTop: 20 }}
      data={EasyReturnService.brokenProductFindResultList}
      keyExtractor={(item) =>
        item.easyReturnTransaction?.ficheNumber || item.sapResult.mgZ_UIB_NO
      }
      renderItem={({ item }) => (
        <Card
          {...item}
          key={
            item.easyReturnTransaction?.ficheNumber || item.sapResult.mgZ_UIB_NO
          }
        />
      )}
    />
    <Observer>
      {() => {
        return EasyReturnService.isLoading ? <FloLoading /> : null;
      }}
    </Observer>
  </View>
);
export default BrokenProductFicheListWithPhone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const AppCardColorizeSvg: React.FC<{ color: string }> = (props) => {
  return (
    <Svg width={10} height={53} viewBox="0 0 10 53">
      <Path
        data-name="AGT Siparis karti"
        d="M10 0v43A10 10 0 010 53V10A10 10 0 0110 0z"
        fill={`${props.color}`}
      />
    </Svg>
  );
};
