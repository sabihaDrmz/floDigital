import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  AppCard,
  AppColor,
  AppText,
} from "@flomagazacilik/flo-digital-components";
import { ErFiche } from "../../core/models/ErFindFicheItem";
import moment from "moment";
import FloLoading from "../../components/FloLoading";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useEasyReturnService } from "../../contexts/EasyReturnService";

const FindFicheListScreen: React.FC = () => {
  const { SearchFiche, erFicheList, isLoading } = useEasyReturnService();
  const FicheCard: React.FC<ErFiche> = (props) => {
    const LineText = (props: { title: string; value: string }) => {
      return (
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <AppText style={{ fontFamily: "Poppins_700Bold", width: 90 }}>
            {props.title}
          </AppText>
          <AppText style={{ fontFamily: "Poppins_700Bold" }}>:</AppText>
          <AppText selectable style={{ fontFamily: "Poppins_500Medium" }}>
            {"  "}
            {props.value}
          </AppText>
        </View>
      );
    };
    return (
      <TouchableOpacity
        onPress={() => {
          SearchFiche({
            voucherNo: "",
            orderNo: props.orderNo,
            ficheNumber: props.ficheNumber,
          });
        }}
      >
        {/* @ts-ignore appCard error */}
        <AppCard color={AppColor.OMS.Background.OpacityOrange}>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View>
              <LineText title="Sipariş No" value={props.orderNo} />
              <LineText title="Fiş No" value={props.ficheNumber} />
              <LineText
                title="Müşteri Adı"
                value={`${props.name} ${props.surname}`}
              />
              <LineText
                title="Tarih"
                value={moment(props.orderDate)
                  .tz("Europe/Istanbul")
                  .format("DD/MM/YYYY HH:mm")}
              />
            </View>
            <View
              style={{
                position: "absolute",
                right: 0,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: -7.5,
                }}
              >
                <Image
                  source={require("../../../assets/storeico.png")}
                  style={{ width: 35, height: 35 }}
                />
                <AppText selectable>{props.storeId}</AppText>
              </View>
            </View>
          </View>
        </AppCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType="standart"
        enableButtons={["back"]}
        headerTitle="Sipariş Listesi"
      />
      <>
        <FlatList
          style={{ paddingTop: 20 }}
          data={erFicheList}
          renderItem={({ item }) => <FicheCard {...item} />}
          keyExtractor={(x) => x.orderNo}
          ListFooterComponent={() => {
            return <SafeAreaView />;
          }}
        />
        {isLoading && <FloLoading />}
      </>
    </View>
  );
};
export default FindFicheListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
