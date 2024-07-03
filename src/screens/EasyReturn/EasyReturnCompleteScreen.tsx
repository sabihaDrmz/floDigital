import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { AntDesign } from "@expo/vector-icons";
import { FloButton } from "../../components";
import { FloHeader } from "../../components/Header";
import AccountService from "../../core/services/AccountService";
import EasyReturnService from "../../core/services/EasyReturnService";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";

class EasyReturnCompleteScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <FloHeader headerType={"standart"} enableButtons={["close"]} />
        <View style={styles.info}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <AntDesign
              name={"checkcircleo"}
              size={45}
              color={colors.brightOrange}
            />
          </View>
          <Text style={styles.infoText}>
            İade İşleminiz Başarıyla Tamamlanmıştır
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            paddingBottom: 30,
            justifyContent: "flex-end",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <FloButton
            title={"Anasayfa Dön"}
            onPress={() => {
              EasyReturnService.clearTransaction();
              EasyReturnService.findFicheRequest = {
                activeStore: AccountService.getUserStoreId(),
                gsm: "",
                paymentType: "",
                receiptNumber: "",
                shippingStore: "",
                shippingDate: "",
                barcode: "",
              };
              EasyReturnService.returnSelectItemPropMap = [];
              Actions.reset("mainStack");
            }}
          />
        </View>
      </View>
    );
  }
}
export default EasyReturnCompleteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    marginTop: 46,
    justifyContent: "center",
    alignContent: "center",
  },
  infoText: {
    fontFamily: "Poppins_500Medium",
    fontSize: PerfectFontSize(16),
    lineHeight: PerfectFontSize(24),
    letterSpacing: -0.4,
    textTransform: "uppercase",
    textAlign: "center",
    color: colors.brightOrange,
  },
});
