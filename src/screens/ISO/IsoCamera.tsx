import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { FloHeader } from "../../components/Header";
import { colors } from "../../theme/colors";
//TODO: EXPO BarCodeScanner
// import { BarCodeEvent, BarCodeScanner } from "expo-barcode-scanner";
import { translate } from "../../helper/localization/locaizationMain";
import BarcodeMask from "react-native-barcode-mask";
//TODO: EXPO expo-camera
// import * as exCamera from "expo-camera";
import { PerfectFontSize } from "../../helper/PerfectPixel";

interface IsoCameraProps {
  onReadBarcode: (barcode: string) => void;
}

class IsoCamera extends Component<IsoCameraProps> {
  state = {
    hasCameraPermission: 0,
    scanned: false,
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
   /* const permission = await exCamera.getCameraPermissionsAsync();

    console.log(permission);

    if (!permission?.granted) {
      if (Platform.OS === "android" || permission?.canAskAgain) {
        const last = await exCamera.requestCameraPermissionsAsync();
        this.setState({ hasCameraPermission: last.granted ? 1 : 2 });
      }
    } else {
      this.setState({ hasCameraPermission: permission.granted ? 1 : 2 });
    }

    */
  };

  render() {
    return (
      <React.Fragment>
        <FloHeader
          headerType={"standart"}
          headerTitle={translate("findBarcode.camera")}
          enableButtons={["back"]}
        />
        {this.state.hasCameraPermission === 2 ? (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text>{translate("isoCamera.permissionError")}</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.cameraInfoContainer}>
              <Text style={styles.cameraInfoText}>
                {translate("findBarcode.enterBarcode")}
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
              {
                /*
                Platform.OS !== "web" && (
                <BarCodeScanner
                  onBarCodeScanned={this.handleBarCodeScanned}
                  focusable={true}
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
              )
                 */
              }
            </View>
          </View>
        )}
      </React.Fragment>
    );
  }

  handleBarCodeScanned = (barcode: any) => {
    this.props.onReadBarcode(barcode.data);
  };
}
export default IsoCamera;

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
