import { AppText } from "@flomagazacilik/flo-digital-components";
import moment from "moment";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import AppTextBox from "../NewComponents/FormElements/AppTextBox";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getLocale, translate } from "../helper/localization/locaizationMain";

interface AppDatePickerProps {
  canStartAndFinish?: boolean;
  onDateConfirm?: (date: Date) => void;
  onStartDateConfirm?: (date: Date) => void;
  onEndDateConfirm?: (date: Date) => void;
  actionButton?: React.ReactChild;
  containerStyle?: StyleProp<ViewStyle>;
  defaultDate?: Date;
  defaultDate2?: Date;
}

const AppDatePicker: React.FC<AppDatePickerProps> = (props) => {
  const [date1, setDate1] = useState(
    moment(props.defaultDate || new Date()).format("DD/MM/YYYY")
  );
  const [date2, setDate2] = useState(
    moment(props.defaultDate2 || new Date()).format("DD/MM/YYYY")
  );
  const [canShowDatePicker1, setCanShowDatePicker1] = useState(false);
  const [canShowDatePicker2, setCanShowDatePicker2] = useState(false);

  const stringToDate = (dateString: string) => {
    if (dateString.length === "gg/aa/yyyy".length) {
      const splitted = dateString.split("/");

      const date = new Date(`${splitted[2]}-${splitted[1]}-${splitted[0]}`);

      return date;
    }
  };
  return (
    <View
      style={[
        styles.container,
        (props.canStartAndFinish || props.actionButton !== undefined) && {
          flexDirection: "row",
          justifyContent: "space-between",
        },
        props.containerStyle,
      ]}
    >
      {!props.canStartAndFinish ? (
        <View>
          <AppText
            style={{ fontFamily: "Poppins_600SemiBold", marginBottom: 4 }}
          >
            {translate("easyRerturnFindFicheManual.dtpTitle")}
          </AppText>
          {Platform.OS === "web" ? (
            // <AppTextBox
            //   format="date"
            //   value={date1}
            //   onChangeText={(txt) => {
            //     setDate1(txt);
            //     const date = stringToDate(txt);

            //     if (date !== undefined)
            //       props.onDateConfirm && props.onDateConfirm(date);
            //   }}
            //   placeholder={"DD/MM/YYYY"}
            // />
            <input
              type={"date"}
              defaultValue={new Date().toISOString().substring(0, 10)}
              onChange={(event) => { 
                const date = stringToDate(event.target.value);
                if (date !== undefined)
                  props.onDateConfirm && props.onDateConfirm(date);
              }}
              style={{
                borderRadius: 7,
                padding: 10,
              }}
            />
          ) : (
            <React.Fragment>
              <TouchableOpacity onPress={() => setCanShowDatePicker1(true)}>
                <AppText>{date1}</AppText>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={canShowDatePicker1}
                mode="date"
                date={stringToDate(date1)}
                cancelTextIOS={translate("OmsCargoConsensusDatePopup.cancel")}
                confirmTextIOS={translate(`easyRerturnFindFicheManual.dtpOk`)}
                // @ts-ignore
                headerTextIOS={translate(`easyRerturnFindFicheManual.dtpTitle`)}
                neutralButtonLabel={translate(
                  "OmsCargoConsensusDatePopup.cancel"
                )}
                locale={getLocale()}
                onConfirm={(res: any) => {
                  setCanShowDatePicker1(false);
                  setDate1(moment(res).format("DD/MM/YYYY"));
                  props.onDateConfirm && props.onDateConfirm(res);
                }}
                onCancel={() => {
                  setCanShowDatePicker1(false);
                }}
              />
            </React.Fragment>
          )}
        </View>
      ) : (
        <React.Fragment>
          <View>
            <AppText
              style={{
                fontFamily: "Poppins_600SemiBold",
                marginBottom: 4,
                fontWeight: "700",
              }}
            >
              {translate("OmsWaybillStatus.startDate")}
            </AppText>
            {Platform.OS === "web" ? (
              // <AppTextBox
              //   format="date"
              //   onChangeText={(txt) => {
              //     const date = stringToDate(txt);

              //     if (date !== undefined)
              //       props.onStartDateConfirm && props.onStartDateConfirm(date);
              //   }}
              //   placeholder={"DD/MM/YYYY"}
              // />
              <input
                type={"date"}
                defaultValue={
                  props.defaultDate
                    ? props.defaultDate.toISOString().substring(0, 10)
                    : new Date().toISOString().substring(0, 10)
                }
                onChange={(event) => {
                  const date = stringToDate(event.target.value);
                  if (date !== undefined)
                    props.onStartDateConfirm && props.onStartDateConfirm(date);
                }}
                style={{
                  borderRadius: 7,
                  padding: 10,
                }}
              />
            ) : (
              <React.Fragment>
                <TouchableOpacity onPress={() => setCanShowDatePicker1(true)}>
                  <AppText>{date1}</AppText>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={canShowDatePicker1}
                  mode="date"
                  date={stringToDate(date1)}
                  cancelTextIOS={translate("OmsCargoConsensusDatePopup.cancel")}
                  confirmTextIOS={translate(`easyRerturnFindFicheManual.dtpOk`)}
                  // @ts-ignore
                  headerTextIOS={translate(
                    `easyRerturnFindFicheManual.dtpTitle`
                  )}
                  neutralButtonLabel={translate(
                    "OmsCargoConsensusDatePopup.cancel"
                  )}
                  locale={getLocale()}
                  onConfirm={(res: any) => {
                    setCanShowDatePicker1(false);
                    setDate1(moment(res).format("DD/MM/YYYY"));
                    props.onStartDateConfirm && props.onStartDateConfirm(res);
                  }}
                  onCancel={() => {
                    setCanShowDatePicker1(false);
                  }}
                />
              </React.Fragment>
            )}
          </View>
          <View>
            <AppText
              style={{ fontFamily: "Poppins_600SemiBold", marginBottom: 4 }}
            >
              {translate("OmsWaybillStatus.endDate")}
            </AppText>
            {Platform.OS === "web" ? (
              // <AppTextBox
              //   format="date"
              //   value={date2}
              //   onChangeText={(txt) => {
              //     setDate2(txt);
              //   }}
              //   placeholder={"DD/MM/YYYY"}
              // />
              <input
                type={"date"}
                defaultValue={
                  props.defaultDate2
                    ? props.defaultDate2.toISOString().substring(0, 10)
                    : new Date().toISOString().substring(0, 10)
                }
                onChange={(event) => {
                  const date = stringToDate(event.target.value);
                  if (date !== undefined)
                    props.onEndDateConfirm && props.onEndDateConfirm(date);
                }}
                style={{
                  borderRadius: 7,
                  padding: 10,
                }}
              />
            ) : (
              <React.Fragment>
                <TouchableOpacity onPress={() => setCanShowDatePicker2(true)}>
                  <AppText>{date2}</AppText>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={canShowDatePicker2}
                  mode="date"
                  date={stringToDate(date2)}
                  cancelTextIOS={translate("OmsCargoConsensusDatePopup.cancel")}
                  confirmTextIOS={translate(`easyRerturnFindFicheManual.dtpOk`)}
                  // @ts-ignore
                  headerTextIOS={translate(
                    `easyRerturnFindFicheManual.dtpTitle`
                  )}
                  neutralButtonLabel={translate(
                    "OmsCargoConsensusDatePopup.cancel"
                  )}
                  locale={getLocale()}
                  onConfirm={(res: any) => {
                    setCanShowDatePicker2(false);
                    setDate2(moment(res).format("DD/MM/YYYY"));
                    props.onEndDateConfirm && props.onEndDateConfirm(res);
                  }}
                  onCancel={() => {
                    setCanShowDatePicker2(false);
                  }}
                />
              </React.Fragment>
            )}
          </View>
        </React.Fragment>
      )}
      {props.actionButton}
    </View>
  );
};
export default AppDatePicker;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
  },
});
