import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import AppCardColorizeSVG from "../../components/AppColorizeSvg";
import FloLoading from "../../components/FloLoading";
import {
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import { BrokenProductSearchModel } from "../../core/models/BrokenProductSearchModel";
import { TransactionType } from "../../core/models/EasyReturnTrasnaction";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import { useEasyReturnService } from "../../contexts/EasyReturnService";
import { useNavigation } from "@react-navigation/native";

const BrokenProductFicheListWithPhone: React.FC = ({ }: any) => {
  const { setBrokenProductFicheListWithPhone, brokenProductFindResultList, isLoading } = useEasyReturnService();
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const Card: React.FC<BrokenProductSearchModel> = (props) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setBrokenProductFicheListWithPhone(props);
          //@ts-ignore
          navigation.navigate("Ides", { screen: "BrokenProductResult" });
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
          <AppCardColorizeSVG color={AppColor.OMS.Background.OpacityOrange} />
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
              {props.easyReturnTransaction?.easyReturnTrasactionLine
                ?.length && (
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
                  {
                    props.easyReturnTransaction?.easyReturnTrasactionLine[0]
                      ?.sku
                  }
                </AppText>
              ) : (
                <AppText selectable numberOfLines={1}>
                  {props.sapResult.uruN_KODU}
                </AppText>
              )}
              {props.easyReturnTransaction &&
                props.easyReturnTransaction.easyReturnTrasactionLine &&
                props.easyReturnTransaction?.easyReturnTrasactionLine
                  .length && (
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <AppText style={{ fontFamily: "Poppins_700Bold" }}>
                Tarih:{" "}
              </AppText>
              <AppText selectable>
                {moment(props.easyReturnTransaction?.ficheDate).format(
                  "DD/MM/YYYY HH:mm"
                ) || "-"}
              </AppText>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <AppText style={{ fontFamily: "Poppins_700Bold" }}>
                Fiş No:{" "}
              </AppText>
              <AppText selectable>
                {props.easyReturnTransaction?.ficheNumber}
              </AppText>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <AppText style={{ fontFamily: "Poppins_700Bold" }}>
                ÜİB No:{" "}
              </AppText>
              <AppText selectable>{props.sapResult.mgZ_UIB_NO}</AppText>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <AppText style={{ fontFamily: "Poppins_700Bold" }}>
                İade Sebebi:{" "}
              </AppText>
              <AppText selectable>{props.sapResult.iadE_SEBEBI}</AppText>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <AppText style={{ fontFamily: "Poppins_700Bold" }}>
                Karar:{" "}
              </AppText>
              <AppText selectable>{props.sapResult.karaR_TEXT}</AppText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType="standart"
        enableButtons={["back"]}
        headerTitle="İDES Listesi"
      />

      <AppTextBox
        placeholder="Ara"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          marginHorizontal: 10,
          marginVertical: 10,
          padding: 16,
          borderRadius: 10,
        }}
      />

      <FlatList
        style={{ paddingTop: 20 }}
        data={brokenProductFindResultList?.filter(x =>
          x.easyReturnTransaction?.customerName.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
          x.easyReturnTransaction?.customerGsm.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
          moment(x.easyReturnTransaction?.ficheDate).format(
            "DD/MM/YYYY HH:mm"
          ).includes(searchQuery) ||
          x.easyReturnTransaction?.ficheNumber.includes(searchQuery) ||
          x.sapResult?.mgZ_UIB_NO.includes(searchQuery) ||
          x.sapResult.iadE_SEBEBI.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
          x.sapResult.karaR_TEXT.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
        )}
        keyExtractor={(item) =>
          item.easyReturnTransaction?.ficheNumber || item.sapResult.mgZ_UIB_NO
        }
        renderItem={({ item }) => (
          <Card
            {...item}
            key={
              item.easyReturnTransaction?.ficheNumber ||
              item.sapResult.mgZ_UIB_NO
            }
          />
        )}
      />
      {isLoading ? <FloLoading /> : null}
    </View>
  );
};
export default BrokenProductFicheListWithPhone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
