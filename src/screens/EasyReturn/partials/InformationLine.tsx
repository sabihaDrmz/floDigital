import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "../../../components";
import { translate } from "../../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../../helper/PerfectPixel";

const InformationLine = (props: any) => (
  <View style={styles.container}>
    <Ionicons color="#FD6620" name="information-circle-outline" size={20} />
    <Text
      style={{
        fontFamily: "Poppins_300Light",
        fontSize: PerfectFontSize(14),
        lineHeight: PerfectFontSize(20),
        letterSpacing: -0.35,
        marginLeft: 12,
      }}
    >
      {translate(`easyReturnSelectProduct.infoText${props.type}`)}
    </Text>
  </View>
);
export default InformationLine;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 14,
    marginBottom: 23,
    padding: 16,
    marginRight: 32,
  },
});
