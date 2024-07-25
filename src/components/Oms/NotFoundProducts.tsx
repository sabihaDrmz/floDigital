import {
  AppButton,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions, Image, ScrollView } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import AppDatePicker from "../AppDatePicker";
import { useOmsService } from "../../contexts/OmsService";
import { translate } from "../../helper/localization/locaizationMain";

const NotFoundProducts: React.FC = (props) => {
  const OmsService = useOmsService();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => { });
  return (
    <View style={styles.container}>
      <View style={{ marginTop: 10 }}>
        <AppDatePicker
          canStartAndFinish
          onStartDateConfirm={(date) =>
            OmsService.setStartNotFoundDateData(date)
          }
          onEndDateConfirm={(date) => OmsService.setEndNotFoundDateData(date)}
          actionButton={
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <AppButton
                style={{
                  width: 40,
                  height: 40,
                  marginLeft: 10,
                  marginVertical: 5,
                }}
                buttonColorType={ColorType.Brand}
                onPress={() => OmsService.loadNotFoundItems()}
              >
                <FontAwesomeIcon icon={"search1"} size={20} color={"#fff"} />
              </AppButton>
            </View>
          }
          containerStyle={{ margin: 0 }}
          defaultDate={OmsService.startNotFoundDate}
          defaultDate2={OmsService.endNotFoundDate}
        />
      </View>
      <View
        style={{ backgroundColor: "#fff", borderRadius: 10, marginTop: 20 }}
      >
        <AppTextBox
          placeholder={translate("OmsNotFoundProducts.search")}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView
        style={{
          marginTop: 10,
        }}
      >
        <FlatList
          data={OmsService.notfoundItems.filter(
            (x) =>
              x.BarcodeNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              x.ProductStatusDescription?.toLowerCase().includes(
                searchQuery.toLowerCase()
              ) ||
              x.OrderNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              x.ModelName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              x.Brand?.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item.ID.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View
                key={item.ID.toString()}
                style={{
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 1.84,

                  elevation: 5,
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={{ uri: item.ImageUrl }}
                  style={{ width: 60, height: 60, resizeMode: "center" }}
                />
                <View style={{ marginLeft: 10 }}>
                  <AppText
                    selectable
                    style={{
                      fontFamily: "Poppins_500Medium",
                      fontSize: 13,
                    }}
                    numberOfLines={1}
                  >
                    {item.Brand}
                    {"  -  "}
                    {item.ModelName}
                    {"  -  "}
                    {item.Quantity} {translate("OmsNotFoundProducts.quantity")}
                  </AppText>
                  <AppText
                    selectable
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 12,
                    }}
                  >
                    {moment(item.CreatedDate).format("DD/MM/YYYY")} -{" "}
                    {item.BarcodeNo}
                  </AppText>
                  <AppText
                    selectable
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 12,
                    }}
                  >
                    {translate("OmsNotFoundProducts.cancelReason")} :{" "}
                    {item.ProductStatusDescription}
                  </AppText>
                  <AppText
                    selectable
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 12,
                    }}
                  >
                    {translate("OmsNotFoundProducts.cancelDate")} :{" "}
                    {moment(item.ActionDate).format(translate("dateFormat"))}
                  </AppText>
                  <AppText
                    selectable
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 12,
                    }}
                  >
                    {translate("OmsNotFoundProducts.orderNo")} : {item.OrderNo}
                  </AppText>
                </View>
              </View>
            );
          }}
        />
      </ScrollView>
    </View>
  );
};
export default NotFoundProducts;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: "#dfdfdf",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});
