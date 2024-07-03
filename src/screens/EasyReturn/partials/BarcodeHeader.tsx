import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";
import EasyReturnService from "../../../core/services/EasyReturnService";
import { toCensorText } from "../../../core/Util";
import { translate } from "../../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../../helper/PerfectPixel";
import { colors } from "../../../theme/colors";

interface BarcodeHeaderProps {
  onBarcodeSelect: (barcode: string) => void;
}

const BarcodeHeader = observer((props: BarcodeHeaderProps) => {
  var currentItem = EasyReturnService.currentFiche;
  if (!currentItem) return null;
  return (
    <View style={styles.container}>
      <View style={[styles.textLine, { justifyContent: "space-between" }]}>
        <View>
          <View style={styles.textLine}>
            <Text style={styles.infoText1}>Belge No: </Text>
            <Text selectable style={[styles.infoText1, styles.infoText2]}>
              {currentItem.ficheKey}
            </Text>
          </View>
          <View style={styles.textLine}>
            <Text style={styles.infoText1}>
              {translate("easyReturnBarcodeHearder.customerName")}
            </Text>
            <Text style={[styles.infoText1, styles.infoText2]}>
              {toCensorText(currentItem.customerName)}
            </Text>
          </View>
          <View style={styles.textLine}>
            <Text style={styles.infoText1}>Müşteri Telefonu: </Text>
            <Text style={[styles.infoText1, styles.infoText2]}>
              {toCensorText(currentItem.customerPhone)}
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.textLine}>
            <Text style={styles.infoText1}>Fatura Tutarı: </Text>
            <Text style={[styles.infoText1, styles.infoText2]}>
              {Number(currentItem.totalPrice).toFixed(2)} ₺
            </Text>
          </View>
          <View style={styles.textLine}>
            <Text style={styles.infoText1}>
              {translate("easyReturnFicheList.date")}
            </Text>
            <Text style={[styles.infoText1, styles.infoText2]}>
              {moment(
                // @ts-ignore
                new Date(EasyReturnService.currentFiche?.ficheDate)
              ).format("DD/MM/yyyy")}
            </Text>
          </View>
          <View style={styles.textLine}>
            <Text style={styles.infoText1}>Mgz. : </Text>
            <Text style={[styles.infoText1, styles.infoText2]}>
              {currentItem.storeNumber}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});
export default BarcodeHeader;

const styles = StyleSheet.create({
  container: {
    padding: 7,
    justifyContent: "space-between",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.whiteTwo,
    marginBottom: 18,
  },
  findBarcodeContainer: {
    flexDirection: "row",
    paddingLeft: 20,
  },
  barcodeLine: {
    height: 18.3,
    backgroundColor: "#000000",
    marginRight: 2,
  },
  findBarcodeText: {
    width: 76,
    height: 18,
    fontFamily: "Poppins_500Medium",
    fontSize: PerfectFontSize(14),
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: PerfectFontSize(18),
    letterSpacing: -0.35,
    textAlign: "left",
    color: "#000000",
    marginLeft: 7,
  },
  textLine: {
    flexDirection: "row",
  },
  infoText1: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(12),
    lineHeight: PerfectFontSize(18),
    letterSpacing: -0.03,
  },
  infoText2: {
    fontFamily: "Poppins_300Light",
    fontSize: PerfectFontSize(12),
    lineHeight: PerfectFontSize(18),
    letterSpacing: -0.03,
  },
});
