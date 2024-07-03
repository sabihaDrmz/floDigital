import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";
import FloButton from "../FloButton";

class FloYesNoPopup extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Uyarı !</Text>
          <Text style={styles.description}>
            Sepet No: 2 Silinecektir. Emin misiniz ?
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <FloButton
              title={translate("messageBox.cancel")}
              containerStyle={{
                backgroundColor: colors.whiteTwo,
                width: Dimensions.get("window").width / 2 - 40,
              }}
            />
            <FloButton
              title={translate("messageBox.delete")}
              containerStyle={{
                backgroundColor: "red",
                width: Dimensions.get("window").width / 2 - 40,
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}
export default FloYesNoPopup;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  card: {
    width: Dimensions.get("window").width - 40,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0.3,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    letterSpacing: 0.3,
    fontSize: PerfectFontSize(12),
    marginTop: 9,
  },
});
