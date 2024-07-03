import {
  AppButton,
  AppText,
  ColorType,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import OmsService from "../../core/services/OmsService";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  getLocale,
  translate,
} from "../../helper/localization/locaizationMain";
import { Observer } from "mobx-react";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import AppDatePicker from "../../components/AppDatePicker";

const OmsNotFoundProducts: React.FC = (props) => {
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {});
  return (
    <View style={styles.container}>
      <Observer>
        {() => (
          <View style={{ marginTop: 10 }}>
            <AppDatePicker
              canStartAndFinish
              onStartDateConfirm={(date) =>
                (OmsService.startNotFoundDate = date)
              }
              onEndDateConfirm={(date) => (OmsService.endNotFoundDate = date)}
              actionButton={
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
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
                    <AntDesign name={"search1"} size={20} color={"#fff"} />
                  </AppButton>
                </View>
              }
              containerStyle={{ margin: 0 }}
              defaultDate={OmsService.startNotFoundDate}
              defaultDate2={OmsService.endNotFoundDate}
            />
          </View>
        )}
      </Observer>
      <View
        style={{ backgroundColor: "#fff", borderRadius: 10, marginTop: 20 }}
      >
        <AppTextBox
          placeholder={translate("OmsNotFoundProducts.search")}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View
        style={{
          height: Dimensions.get("window").height - 320,
          marginTop: 10,
        }}
      >
        <Observer>
          {() => (
            <FlatList
              data={OmsService.notfoundItems.filter(
                (x) =>
                  x.BarcodeNo?.includes(searchQuery) ||
                  x.ProductStatusDescription?.includes(searchQuery) ||
                  x.OrderNo?.includes(searchQuery) ||
                  x.ModelName?.includes(searchQuery) ||
                  x.Brand?.includes(searchQuery)
              )}
              keyExtractor={(item) => item.ID.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={(item) => {
                console.log(item.item);
                return (
                  <View
                    key={item.item.ID.toString()}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,

                      elevation: 5,
                      marginVertical: 10,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Image
                      source={{ uri: item.item.ImageUrl }}
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
                        {item.item.Brand}
                        {"  -  "}
                        {item.item.ModelName}
                        {"  -  "}
                        {item.item.Quantity}{" "}
                        {translate("OmsNotFoundProducts.quantity")}
                      </AppText>
                      <AppText
                        selectable
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: 12,
                        }}
                      >
                        {moment(item.item.CreatedDate).format("DD/MM/YYYY")} -{" "}
                        {item.item.BarcodeNo}
                      </AppText>
                      <AppText
                        selectable
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: 12,
                        }}
                      >
                        {translate("OmsNotFoundProducts.cancelReason")} :{" "}
                        {item.item.ProductStatusDescription}
                      </AppText>
                      <AppText
                        selectable
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: 12,
                        }}
                      >
                        {translate("OmsNotFoundProducts.cancelDate")} :{" "}
                        {moment(item.item.ActionDate).format(
                          translate("dateFormat")
                        )}
                      </AppText>
                      <AppText
                        selectable
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: 12,
                        }}
                      >
                        {translate("OmsNotFoundProducts.orderNo")} :{" "}
                        {item.item.OrderNo}
                      </AppText>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </Observer>
      </View>
      <View style={{ height: 400 }} />
    </View>
  );
};
export default OmsNotFoundProducts;

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
