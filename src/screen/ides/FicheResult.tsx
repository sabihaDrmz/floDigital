import React from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import moment from "moment";
import FloLoading from "../../components/FloLoading";
import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import { FloHeader } from "../../components/Header";
import AppCardColorizeSVG from "../../components/AppColorizeSvg";
import { GeniusFicheModel } from "../../contexts/model/GeniusFicheModel";
import { useEasyReturnService } from "../../contexts/EasyReturnService";

const FicheCard: React.FC<GeniusFicheModel> = (props) => {
  return (
    <View
      style={{
        marginHorizontal: 20,
        marginVertical: 15,
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
        {props.data.map((item) => {
          return (
            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              <Image
                source={{ uri: item.picture }}
                style={{ width: 50, height: 50, marginRight: 10 }}
                resizeMode={"center"}
              />
              <View>
                <AppText selectable style={{ fontFamily: "Poppins_700Bold" }}>
                  {item.productName}
                </AppText>
                <AppText selectable>
                  Beden : {item.size} | Adet : {item.quantity}
                </AppText>
                <AppText selectable>{item.barcode}</AppText>
                <AppText selectable>{item.sku}</AppText>
              </View>
            </View>
          );
        })}
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
            <AppText>Belge No: </AppText>
            <AppText selectable>{props.ficheKey}</AppText>
          </View>
        </View>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <View style={{ flexDirection: "row" }}>
            <AppText>Fiş No: </AppText>
            <AppText selectable>{props.ficheRef}</AppText>
          </View>
        </View>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <View style={{ flexDirection: "row" }}>
            <AppText>Mğz: </AppText>
            <AppText selectable>
              {props.storeNumber || "-"} / {props.storeName || "-"}
            </AppText>
          </View>
        </View>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <View style={{ flexDirection: "row" }}>
            <AppText>Müşteri Adı: </AppText>
            <AppText selectable>{props.customerName || "-"}</AppText>
          </View>
        </View>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <View style={{ flexDirection: "row" }}>
            <AppText>Fatura Tutarı: </AppText>
            <AppText selectable>{props.totalPrice || "-"}</AppText>
          </View>
        </View>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <View style={{ flexDirection: "row" }}>
            <AppText>Tarih: </AppText>
            <AppText selectable>
              {moment(props.ficheDate).format("DD/MM/YYYY HH:mm") || "-"}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
},
  FicheResult: React.FC = () => {
    const { isLoading, currentFicheList } = useEasyReturnService();
    return (
      <View style={styles.container}>
        <FloHeader
          headerType="standart"
          enableButtons={["back"]}
          headerTitle="Fiş Listesi"
        />
        <FlatList
          data={currentFicheList}
          keyExtractor={(item) => item.ficheKey}
          renderItem={({ item }) => <FicheCard {...item} key={item.ficheKey} />}
        />
        {isLoading ? <FloLoading /> : null}
      </View>
    );
  };
export default FicheResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
