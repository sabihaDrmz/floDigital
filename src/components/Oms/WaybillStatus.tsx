import {
  AppButton,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { translate } from "../../helper/localization/locaizationMain";
import { AntDesign } from "@expo/vector-icons";
import AppDatePicker from "../../components/AppDatePicker";
import { useOmsService } from "../../contexts/OmsService";

interface OmsWaybillStatusProps { }

const WaybillStatus: React.FC<OmsWaybillStatusProps> = (props) => {
  const OmsService = useOmsService();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [waybills, setWaybils] = useState<any>();
  const GetWaybills = () => {
    OmsService.GetWaybillStatus(startDate, endDate)
      .then((res) => setWaybils(res))
      .catch(() => setWaybils([]));
  };
  return (
    <View style={styles.container}>
      <AppDatePicker
        canStartAndFinish
        onStartDateConfirm={(date) => {
          setStartDate(date);
        }}
        onEndDateConfirm={(date) => {
          setEndDate(date);
        }}
        actionButton={
          <AppButton
            buttonColorType={ColorType.Brand}
            style={{ width: 40, height: 40, marginVertical: 5 }}
            onPress={GetWaybills}
          >
            <AntDesign name={"search1"} color={"#fff"} size={23} />
          </AppButton>
        }
        containerStyle={{ margin: 0, marginBottom: 20 }}
        defaultDate={startDate}
        defaultDate2={endDate}
      />
      <FlatList
        data={waybills}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `itm_${index}_${item.OrderNo}`}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 5,
                shadowColor: "#000000",
                shadowOffset: {
                  width: 1,
                  height: 1,
                },
                shadowOpacity: 0.16,
                shadowRadius: 2.51,
                elevation: 3,
                marginBottom: 10,
              }}
            >
              <AppText style={{ fontFamily: "Poppins_500Medium" }}>
                {translate("OmsWaybillStatus.orderNo")}:{" "}
                <AppText
                  selectable
                  style={{ fontFamily: "Poppins_400Regular" }}
                >
                  {item.OrderNo}
                </AppText>
              </AppText>
              <AppText style={{ fontFamily: "Poppins_300Light", fontSize: 13 }}>
                <AppText style={{ fontFamily: "Poppins_400Regular" }}>
                  {translate("OmsWaybillStatus.status")} :{" "}
                </AppText>
                {item.Messages}
                <AppText
                  selectable
                  style={{
                    fontFamily: "Poppins_300Light_Italic",
                    fontSize: 11,
                    textAlign: "right",
                  }}
                >
                  {"   "}
                  {translate("OmsWaybillStatus.time")}: {item.DurationName}
                </AppText>
              </AppText>
              <View style={{ marginTop: 10 }}>
                <AppButton
                  title={translate("OmsPackageCard.printIrsaliye")}
                  buttonColorType={ColorType.Brand}
                  onPress={() => OmsService.printWaybillTry(item.OrderNo)}
                />
                <AppButton
                  title={translate("OmsWaybillStatus.completeTheOrder")}
                  buttonColorType={ColorType.Success}
                  onPress={() => OmsService.waybillComplete(item)}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};
export default WaybillStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
