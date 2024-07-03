import React, { useState } from "react";
import { View, StyleSheet, FlatList, Image, Text, TouchableOpacity, ScrollView } from "react-native";
import moment from "moment";
import FloLoading from "../../components/FloLoading";
import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import AppCardColorizeSVG from "../../components/AppColorizeSvg";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { GeniusFicheModel } from "../../contexts/model/GeniusFicheModel";
import linq from "linq";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { useCrmService } from "../../contexts/CrmService";

const FicheResult: React.FC = () => {
  const [selectedPlace, setselectedPlace] = useState(false)

  const { currentFicheList, isLoading } = useCrmService();
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
                <View style={{ flex: 1, paddingRight: 10 }}>
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
  };

  const FicheRadioButton: React.FC<any> = (props) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        onPress={() => setselectedPlace((prev) => !prev)}
      >
        <View
          style={{
            width: 21,
            height: 21,
            borderRadius: 10.5,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ff8600",
          }}
        >
          <View
            style={{
              width: 15,
              height: 15,
              borderRadius: 7.5,
              backgroundColor:
                selectedPlace === props.control ? "#ff8600" : "#fff",
            }}
          ></View>
        </View>
        <AppText selectable style={{ fontFamily: "Poppins_700Bold", color: "#fffff", marginLeft: 8, marginRight: 15 }}>
          {props.title}
        </AppText>
      </TouchableOpacity>
    );
  }

  const renderEmpty = () => (
    <View style={styles.emptyText}>
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: PerfectFontSize(14),
          color: "#6B7280",
        }}
      >
        Ürün bulunamadı
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <FloHeaderNew
        headerType="standart"
        enableButtons={["back"]}
        headerTitle="Fiş Listesi"
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          marginVertical: 30,
        }}
      >
        <FicheRadioButton title="Ecom" control={false}></FicheRadioButton>
        <FicheRadioButton title="Mağaza" control={true}></FicheRadioButton>
      </View>
      <FlatList
        data={linq.from(currentFicheList).where((x) => x.source === (selectedPlace ? "Mağaza" : "Ecom")).toArray()}
        keyExtractor={(item) => item.ficheKey}
        renderItem={({ item }) => <FicheCard {...item} key={item.ficheKey} />}
        ListEmptyComponent={renderEmpty}
      />
      {isLoading ? <FloLoading /> : null}
    </ScrollView>
  );
};
export default FicheResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
});
