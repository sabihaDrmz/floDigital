import {
  AppButton,
  AppText,
  ColorType,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import OmsService from "../../core/services/OmsService";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  getLocale,
  translate,
} from "../../helper/localization/locaizationMain";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import AppTextBox from "../../NewComponents/FormElements/AppTextBox";
import AppDatePicker from "../../components/AppDatePicker";

interface OmsWaybillStatusProps {}

const DatePickButton: React.FC<{
  setShowStartDate: (st: boolean) => void;
  title: string;
  type: "start" | "end";
  current: string;
  onWebDate: (date: Date) => void;
}> = (props) => {
  return (
    <Observer>
      {() => (
        <View>
          <AppText
            selectable
            labelType={LabelType.Label}
            style={{ fontWeight: "500", fontSize: 14 }}
          >
            {props.title}
          </AppText>
          {Platform.OS === "web" ? (
            <AppTextBox
              placeholder="gg/aa/yyyy"
              onChangeText={(text) => {
                if (text.length === "gg/aa/yyyy".length) {
                  const splitted = text.split("/");

                  const date = new Date(
                    `${splitted[2]}-${splitted[1]}-${splitted[0]}`
                  );

                  if (props.onWebDate) props.onWebDate(date);
                }
              }}
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                props.setShowStartDate(true);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              {props.type === "start" && (
                <AppText selectable style={{ fontWeight: "400", fontSize: 14 }}>
                  <Fontisto name={"date"} size={15} />
                  {"  "}
                  {props.current}
                </AppText>
              )}
              {props.type === "end" && (
                <AppText selectable style={{ fontWeight: "400", fontSize: 14 }}>
                  <Fontisto name={"date"} size={15} />
                  {"  "}
                  {props.current}
                  {/* ? moment(OmsService.endNotFoundDate).format('DD/MM/YYYY')
                  : props.title + ' Seçin'} */}
                </AppText>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </Observer>
  );
};

const OmsWaybillStatus: React.FC<OmsWaybillStatusProps> = (props) => {
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
                  title={translate("OmsWaybillStatus.printBarcode")}
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
export default OmsWaybillStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
