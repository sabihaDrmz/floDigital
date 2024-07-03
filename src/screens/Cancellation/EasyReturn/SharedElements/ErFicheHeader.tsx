import { AppText } from "@flomagazacilik/flo-digital-components";
import moment from "moment";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const TitleComponent: React.FC<{ title: string; val: string }> = (props) => {
  return (
    <View style={styles.horizontalLine}>
      <AppText selectable style={styles.title}>
        {props.title}
        {" : "}
      </AppText>
      <AppText selectable style={styles.description}>
        {props.val || "-"}
      </AppText>
    </View>
  );
};
const ErFicheHeader: React.FC<{
  ficheNumber: string;
  storeNum: string;
  customerName: string;
  customerPhone: string;
  ficheTotal: Number;
  createData: string;
}> = (props) => (
  <View style={styles.container}>
    <View
      style={[
        styles.horizontalLine,
        styles.spcbw,
        styles.mg20,
        { marginBottom: 10 },
      ]}
    >
      <TitleComponent title="Belge No " val={props.ficheNumber} />
      <View style={[styles.horizontalLine, styles.mg20]}>
        <Image
          source={require("../../../../../assets/storeico.png")}
          style={{ width: 40, height: 40 }}
        />
        <AppText selectable>{props.storeNum || "-"}</AppText>
      </View>
    </View>
    <View>
      <View style={[styles.horizontalLine, styles.spcbw]}>
        <TitleComponent title="Müşteri Adı" val={props.customerName} />
        <TitleComponent title="Müşteri Tel" val={props.customerPhone} />
      </View>
      <View style={[styles.horizontalLine, styles.spcbw, styles.mt10]}>
        <TitleComponent title="Fiş Tutarı" val={props.ficheTotal?.toFixed(2)} />
        <TitleComponent
          title="Tarih"
          val={moment(props.createData).format("DD/MM/YYYY HH:mm")}
        />
      </View>
    </View>
  </View>
);
export default ErFicheHeader;

const FONT_SIZE = 12;
const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  horizontalLine: {
    flexDirection: "row",
  },
  spcbw: {
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: FONT_SIZE,
  },
  description: {
    fontSize: FONT_SIZE,
  },
  mg20: { alignItems: "center" },
  mt10: { marginTop: 5 },
});
