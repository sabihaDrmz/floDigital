import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { FloHeader } from "../../components/Header";
import { colors } from "../../theme/colors";
import { BarCodeEvent, BarCodeScanner } from "expo-barcode-scanner";
import { translate } from "../../helper/localization/locaizationMain";
import BarcodeMask from "react-native-barcode-mask";
import { PerfectFontSize } from "../../helper/PerfectPixel";

interface IsoKzCameraProps {
  onReadBarcode: (barcode: string) => void;
}

const allowedBarCodes = [BarCodeScanner.Constants.BarCodeType.datamatrix];
class IsoKzCamera extends Component<IsoKzCameraProps> {
  state = {
    scanned: false,
  };

  render() {
    return (
      <React.Fragment>
        <FloHeader
          headerType={"standart"}
          headerTitle={"Камера"}
          enableButtons={["back"]}
        />

        <View style={styles.container}>
          <View style={styles.cameraInfoContainer}>
            <Text style={styles.cameraInfoText}>
              Отсканируйте QR, чтобы обновить цену
            </Text>
          </View>
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 30,
              bottom: -23,
              width: Dimensions.get("window").width,
            }}
          >
            {Platform.OS !== "web" && (
              <BarCodeScanner
                onBarCodeScanned={this.handleBarCodeScanned}
                focusable={true}
                barCodeTypes={allowedBarCodes}
                style={StyleSheet.absoluteFill}
              >
                <BarcodeMask showAnimatedLine={false} />
              </BarCodeScanner>
            )}
          </View>
        </View>
      </React.Fragment>
    );
  }

  handleBarCodeScanned = (barcode: BarCodeEvent) => {
    if (!allowedBarCodes.includes(barcode.type)) {
      return;
    }
    this.props.onReadBarcode(barcode.data);
  };
}
export default IsoKzCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraInfoContainer: {
    height: 30,
    backgroundColor: "rgba(255,103,28, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 19,
  },
  cameraInfoText: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(14),
    lineHeight: PerfectFontSize(18),
    color: colors.darkGrey,
  },
});
