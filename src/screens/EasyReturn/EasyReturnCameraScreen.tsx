import { BarCodeEvent, BarCodeScanner } from "expo-barcode-scanner";
import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import BarcodeMask from "react-native-barcode-mask";
import { FloHeader } from "../../components/Header";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { colors } from "../../theme/colors";

interface EasyReturnCameraScreenProps {
  onReadComplete: (barcode: string) => void;
  headerTitle: string;
}

class EasyReturnCameraScreen extends Component<EasyReturnCameraScreenProps> {
  scanning = false;

  state = { camPermission: false };
  componentDidMount() {
    BarCodeScanner.getPermissionsAsync().then((permission) => {
      if (!permission.granted && permission.canAskAgain) {
        BarCodeScanner.requestPermissionsAsync().then((perm) => {
          if (perm.granted) this.setState({ camPermission: true });
        });
      } else if (permission.granted) this.setState({ camPermission: true });
    });
  }

  onBarCodeRead(scanResult: any) {
    if (scanResult.type === "UNKNOWN_FORMAT") return;

    if (scanResult.data != null) {
      if (this.scanning) return;

      this.scanning = true;
      this.props.onReadComplete(scanResult.data);
    }
    return;
  }

  render() {
    let scanning = false;
    return (
      <>
        <FloHeader
          headerType={"standart"}
          headerTitle={
            this.props.headerTitle
              ? this.props.headerTitle
              : translate("findBarcode.camera")
          }
          enableButtons={["back"]}
        />
        {this.state.camPermission ? (
          <View style={styles.container}>
            <View style={styles.cameraInfoContainer}>
              <Text style={styles.cameraInfoText}>
                {translate("easyReturnCamera.infoText")}
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
                  barCodeTypes={[
                    BarCodeScanner.Constants.BarCodeType.ean13,
                    BarCodeScanner.Constants.BarCodeType.code128,
                    BarCodeScanner.Constants.BarCodeType.code39,
                    BarCodeScanner.Constants.BarCodeType.qr,
                    BarCodeScanner.Constants.BarCodeType.upc_e,
                  ]}
                  style={StyleSheet.absoluteFill}
                >
                  <BarcodeMask showAnimatedLine={false} />
                </BarCodeScanner>
              )}
            </View>
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>{translate("easyReturnCamera.dontCameraAuthority")}</Text>
          </View>
        )}
      </>
    );
  }

  handleBarCodeScanned = (barcode: BarCodeEvent) => {
    // this.props.onReadBarcode(barcode.data);
    this.props.onReadComplete(barcode.data);
  };
}
export default EasyReturnCameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraInfoContainer: {
    height: 30,
    backgroundColor: "rgba(255,103,28, 0.15)",
    paddingLeft: 19,
    paddingRight: 19,
    paddingTop: 6,
    paddingBottom: 6,
  },
  cameraInfoText: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(14),
    lineHeight: PerfectFontSize(18),
    color: colors.darkGrey,
  },
});
