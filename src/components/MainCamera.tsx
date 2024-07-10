//TODO: EXPO BarCodeScanner
// import { BarCodeEvent, BarCodeScanner } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import { Portal } from "react-native-portalize";
import FloHeaderNew from "./Header/FloHeaderNew";
import { translate } from "../helper/localization/locaizationMain";
import { PerfectFontSize } from "../helper/PerfectPixel";
import { colors } from "../theme/colors";
import BarcodeMask from "react-native-barcode-mask";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native";

interface CameraProps {
  onReadComplete: (barcode: string) => void;
  isShow: boolean;
  onHide: () => void;
  isKazakistan?: boolean;
  isSelfCheckOut?: boolean;
}

const MainCamera: React.FC<CameraProps> = (props) => {
  const [camPermission, setCamPermission] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);
/*
  const allowedBarCodes = props.isKazakistan
    ? [BarCodeScanner.Constants.BarCodeType.datamatrix]
    : props.isSelfCheckOut
      ? [
        BarCodeScanner.Constants.BarCodeType.datamatrix,
        BarCodeScanner.Constants.BarCodeType.qr,
      ]
      : [
        BarCodeScanner.Constants.BarCodeType.ean13,
        BarCodeScanner.Constants.BarCodeType.code128,
        BarCodeScanner.Constants.BarCodeType.code39,
        BarCodeScanner.Constants.BarCodeType.qr,
        BarCodeScanner.Constants.BarCodeType.upc_e,
      ];

 */
  const handleBarCodeScanned = (barcode: any) => {
    if (!isReading) {
      setIsReading(true);
      if (props.onReadComplete) {
        props.onReadComplete(barcode.data);
      }
      setIsReading(false);
    }
  };

  useEffect(() => {
    /*
    if (Platform.OS !== "web") {
      BarCodeScanner.getPermissionsAsync().then((permission) => {
        if (!permission.granted && permission.canAskAgain) {
          BarCodeScanner.requestPermissionsAsync().then((perm) => {
            if (perm.granted) setCamPermission(true);
          });
        } else if (permission.granted) setCamPermission(true);
      });
    }

     */
  }, []);

  if (!props.isShow) return null;

  return (
    <Portal>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "#000",
        }}
      >
        <View
          style={{
            backgroundColor: "#ff8600",
            paddingTop: Platform.OS === "android" ? 20 : 0,
          }}
        >
          <StatusBar barStyle={"light-content"} backgroundColor="#ff8600" />
          <SafeAreaView
            style={{
              backgroundColor: "#ff8600",
            }}
          />
          <View
            style={{
              borderStyle: "solid",
              borderBottomWidth: 0,
              borderColor: "#e4e4e4",
              zIndex: 10000,
              width: '100%',
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#ff8600",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  display: "flex",
                  height: 80,
                  marginHorizontal: 10,
                  justifyContent: "center",
                }}
                onPress={() => {
                  props.onHide()
                }}
              >
                <AntDesign name={"arrowleft"} size={27} color={"#fff"} />
              </TouchableOpacity>
              <View
                style={{
                  display: "flex",
                  height: 80,
                  marginHorizontal: 10,
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Text style={{
                  color: "#fff",
                  fontSize: PerfectFontSize(18),
                  fontFamily: "Poppins_300Light",
                  marginLeft: -5,
                }}>{props?.isKazakistan ? "Камера" : translate("findBarcode.camera")}</Text>
              </View>
            </View>
          </View>
        </View>

        {camPermission ? (
          <View style={styles.container}>
            <View style={styles.cameraInfoContainer}>
              <Text style={styles.cameraInfoText}>
                {props.isKazakistan
                  ? " Отсканируйте QR, чтобы обновить цену"
                  : props.isSelfCheckOut
                    ? "Kameraya QR'ı Gösterin"
                    : translate("easyReturnCamera.infoText")}
              </Text>
            </View>
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 30,
                bottom: 0,
                width: Dimensions.get("window").width,
              }}
            >
              {
                /*
                Platform.OS !== "web" && (

                <BarCodeScanner
                  onBarCodeScanned={handleBarCodeScanned}
                  barCodeTypes={allowedBarCodes}
                  style={StyleSheet.absoluteFill}
                >
                  <BarcodeMask showAnimatedLine={false} />
                </BarCodeScanner>
              )
                */
              }
            </View>
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#fff" }}>
              {translate("easyReturnCamera.dontCameraAuthority")}
            </Text>
          </View>
        )}
      </View>
    </Portal>
  );
};
export default MainCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraInfoContainer: {
    height: 30,
    backgroundColor: "rgba(255,103,28, 1)",
    paddingLeft: 19,
    paddingRight: 19,
    paddingTop: 6,
    paddingBottom: 6,
  },
  cameraInfoText: {
    fontFamily: "Poppins_400Regular",
    fontSize: PerfectFontSize(14),
    lineHeight: PerfectFontSize(18),
    color: "#fff",
    textAlign: "center",
  },
});
