import {
  ColorType,
  FontSizes,
  LabelType,
} from "@flomagazacilik/flo-digital-components";
import { AppText } from "@flomagazacilik/flo-digital-components";
import { translate } from "../../helper/localization/locaizationMain";
import moment from "moment-timezone";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LinearGradient from "../LinearGradient";
import { PerfectFontSize } from "../../helper/PerfectPixel";

const CrmCaseCard: React.FC<{
  subject: string;
  description: string;
  createdon: Date;
  phone: string;
  firstname: string;
  ticketNumber: string;
  timeToClosingDate: string;
  onSelect: () => void;
}> = (props) => {
  const clearNewLines = (txt: string, maxLen: number = 90) => {
    return txt;
  };
  const clearHtmlText = (txt: string) => {
    if (txt === undefined) return txt;
    let des = txt?.replace(/<[^>]+>/g, "").trim();
    des = des.replace(/\xA0/g, " ");
    while (des.includes("&nbsp;")) des = des.replace("&nbsp;", " ");

    return des;
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => props.onSelect()}
      activeOpacity={0.8}
    >
      <LinearGradient
        style={styles.startOrangeLine}
        colors={["rgb(255,134,0)", "rgb(219,118,7)"]}
      />
      <View>
        <Text style={styles.title} numberOfLines={1}>
          {clearNewLines(props.subject, 33)}
        </Text>
        <Text style={styles.timeLine}>{`${translate(
          "crmCaseCard.createdon"
        )} ${moment(props.createdon)
          .tz("Europe/Istanbul")
          .format("DD/MM/YYYY HH:mm")}`}</Text>

        <View style={{ flexDirection: "row" }}>
          <AppText
            selectable
            size={FontSizes.XS}
            labelType={LabelType.Label}
            labelColorType={ColorType.Brand}
          >
            {clearHtmlText(props.firstname)}
          </AppText>
          <AppText selectable size={FontSizes.XS} labelType={LabelType.Label}>
            {" - "}
            {clearHtmlText(props.phone)}
          </AppText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.ticket}>
            {translate("crmCaseCard.ticketNumber")}
            {" : "}
          </Text>
          <AppText
            selectable
            size={FontSizes.XS}
            labelType={LabelType.Label}
            labelColorType={ColorType.Brand}
            style={styles.ticket}
          >
            {clearNewLines(props.ticketNumber, 33)}
          </AppText>
        </View>

        <AppText
          selectable
          size={FontSizes.S}
          labelType={LabelType.Paragraph}
          numberOfLines={2}
        >
          {clearHtmlText(props.description)}
        </AppText>
        <AppText>
          {translate("crmCaseCard.remainingTime")} :
          {props.timeToClosingDate && props.timeToClosingDate.length > 0
            ? props.timeToClosingDate
            : "-"}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};
export default CrmCaseCard;

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginRight: 40,
    marginVertical: 25,
    flexDirection: "row",
  },
  startOrangeLine: {
    width: 5,
    height: 100,
    marginRight: 11,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: PerfectFontSize(15),
    letterSpacing: 0.75,
    color: "#3a3a3b",
    marginBottom: 5,
  },
  ticket: {
    fontSize: PerfectFontSize(12),
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0.65,
    textAlign: "left",
    fontFamily: "Poppins_300Light",
    marginTop: 5,
  },
  description: {
    fontSize: PerfectFontSize(12),
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0.65,
    textAlign: "left",
    color: "#484848",
    fontFamily: "Poppins_300Light",
    marginTop: 5,
  },
  fisrtname: {
    fontSize: PerfectFontSize(11),
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0.65,
    textAlign: "left",
    color: "#ff8600",
    fontFamily: "Poppins_300Light",
  },
  lastname: {
    fontSize: PerfectFontSize(11),
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0.65,
    textAlign: "left",
    color: "#ff8600",
    fontFamily: "Poppins_300Light",
  },
  phone: {
    fontSize: PerfectFontSize(11),
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0.65,
    textAlign: "left",
    color: "#484848",
    fontFamily: "Poppins_300Light",
  },
  timeLine: {
    fontSize: PerfectFontSize(11),
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0.55,
    textAlign: "left",
    fontFamily: "Poppins_300Light",
    color: "#7c7c7c",
    marginBottom: 5,
  },
});
