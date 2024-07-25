import React, { useState, useEffect } from "react";
import { ViewStyle, StyleProp, View, Platform, TouchableOpacity, Text, StyleSheet, Pressable } from "react-native";
import moment from "moment";
import { colors } from "../../theme/colors";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { PerfectFontSize } from "../../../src/helper/PerfectPixel";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AppColor } from "../../theme/AppColor";

interface DateTimePickerProps {
  defaultDate?: string;
  defaultTime?: string;
  canSelectTime?: boolean;
  style?: StyleProp<ViewStyle>;
  timeTitle?: string;
  dateTitle: string;
  isStart?: boolean;
  isEnd?: boolean;
  onDateConfirm?: (date: string) => void;
  onTimeConfirm?: (time: string) => void;
}

const DateTimePicker = (props: DateTimePickerProps) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const stringToDate = (dateString: string) => {
    if (dateString.length === "gg.aa.yyyy".length) {
      const splitted = dateString.split(".");
      const date = new Date(`${splitted[2]}-${splitted[1]}-${splitted[0]}`);
      return date;
    };
  };

  const stringToTime = (timeString: string) => {
    if (timeString.length === "ss:dd".length) {
      const splitted = timeString.split(":");
      const time = new Date(0, 0, 0, parseInt(splitted[0]), parseInt(splitted[1]));
      return time;
    };
  };

  const clearDate = () => {
    if (props.onDateConfirm) {
      const formattedDate = moment(new Date()).format("DD.MM.YYYY");
      props.onDateConfirm(formattedDate)
    }

    if (props.isStart && props.onTimeConfirm) {
      const formattedTime = moment(new Date().setHours(0, 0, 0, 0)).format("HH:mm");
      props.onTimeConfirm(formattedTime)
    }
    else if (props.isEnd && props.onTimeConfirm) {
      const formattedTime = moment(new Date().setHours(23, 59, 0, 0)).format("HH:mm");
      props.onTimeConfirm(formattedTime)
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const formattedDate = (dateString: string) => {
    if (dateString.length === "gg.aa.yyyy".length) {
      const splitted = dateString.split(".");
      return `${splitted[2]}-${splitted[1]}-${splitted[0]}`;
    };
  }

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
      {Platform.OS === "web" ? (
        <>
          <View>
            <Text style={[styles.text, { marginLeft: 5 }]}>{props.dateTitle}</Text>
            <View style={[styles.container, { width: Platform.OS === "web" ? 120 : "100%", }]}>
              <input
                type={"date"}
                onChange={(event) => {
                  const date = stringToDate(event.target.value);
                  if (date !== undefined) {
                    const formattedDate = moment(date).format("DD.MM.YYYY");
                    props.onDateConfirm && props.onDateConfirm(formattedDate);
                  } else {
                    props.onDateConfirm && props.onDateConfirm("");
                  }
                }}
                style={{
                  height: "100%",
                  borderWidth: 0,
                  color: colors.floOrange,
                  fontSize: PerfectFontSize(14),
                  fontFamily: "Poppins_500Medium",
                  marginRight: 3
                }}
                max={getCurrentDate()}
                defaultValue={!props.defaultDate ? "Başlangıç" : formattedDate(props.defaultDate)}
              />
            </View>
          </View>
          {props.canSelectTime && <View>
            <Text style={[styles.text, { marginLeft: 5 }]}>{props.timeTitle}</Text>
            <View style={[styles.container, { width: Platform.OS === "web" ? 90 : "100%", }]}>
              <input
                type={"time"}
                onChange={(event) => {
                  const time = stringToTime(event.target.value);
                  if (time !== undefined) {
                    const formattedTime = moment(time).format("HH:mm");
                    props.onTimeConfirm && props.onTimeConfirm(formattedTime);
                  } else {
                    props.onTimeConfirm && props.onTimeConfirm("");
                  }
                }}
                style={{
                  height: "100%",
                  borderWidth: 0,
                  color: colors.floOrange,
                  fontSize: PerfectFontSize(14),
                  fontFamily: "Poppins_500Medium"
                }}
                value={props.defaultTime === "00:00" || !props.defaultDate ? "00:00" : props.defaultTime === "23:59" || !props.defaultDate ? "23:59" : props.defaultTime}
              />
            </View>
          </View>}

        </>
      ) : (
        <View style={{ flex: 1, flexDirection: 'row'}}>
          <View style={styles.buttonView}>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", }} onPress={() => setIsDatePickerVisible(true)}>
              <FontAwesomeIcon icon="calendar-outline" size={18} color={"#acacac"} />
              <Text style={[styles.text, { marginLeft: 5 }]}>{props.defaultDate ? props.defaultDate : props.dateTitle}</Text>
            </TouchableOpacity >
          </View>
          {props.canSelectTime && <View style={styles.buttonView}>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", }} onPress={() => setIsTimePickerVisible(true)}>
              <FontAwesomeIcon icon="time-outline" size={18} color={"#acacac"} />
              <Text style={[styles.text, { marginLeft: 5 }]}>{props.defaultTime ? props.defaultDate ? props.defaultTime : "" : ""}</Text>
            </TouchableOpacity >
          </View>}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={stringToDate(props.defaultDate || "")}
            onConfirm={(res: any) => {
              const formattedDate = moment(res).format("DD.MM.YYYY");
              props.onDateConfirm && props.onDateConfirm(formattedDate);
              setIsDatePickerVisible(false);
            }}
            onCancel={() => {
              setIsDatePickerVisible(false);
            }}
            maximumDate={new Date()}
          />

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={(res: any) => {
              const formattedTime = moment(res).format("HH:mm");
              props.onTimeConfirm && props.onTimeConfirm(formattedTime);
              setIsTimePickerVisible(false);
            }}
            onCancel={() => {
              setIsTimePickerVisible(false);
            }}

          />
        </View>
      )}
    </View>
  );
};
export default DateTimePicker;

const styles = StyleSheet.create({
  container: {
    height: 37,
    borderRadius: 7,
    marginRight: Platform.OS === "web" ? 20 : undefined,
    backgroundColor: Platform.OS === "web" ? undefined : AppColor.OMS.Background.Light,
    borderColor: AppColor.OMS.Background.Fundamental,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 10,
    flexDirection: "row"
  },
  buttonView: {
    flexDirection: "row",
    padding:5,
    margin: 5,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 7,
    borderColor: AppColor.OMS.Background.Fundamental,
    borderWidth: 1,
  },
  text: {
    color: colors.floOrange,
    fontSize: PerfectFontSize(14),
    fontFamily: "Poppins_500Medium"
  }
});
