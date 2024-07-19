//TODO: EXPO BarCodeScanner only test
import type { Code } from 'react-native-vision-camera';
import {
  useCameraDevice,
  useCodeScanner,
  Camera,
} from 'react-native-vision-camera';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Linking } from "react-native";
import { Portal } from "react-native-portalize";
import { translate } from "../helper/localization/locaizationMain";
import { PerfectFontSize } from "../helper/PerfectPixel";
import BarcodeMask from "react-native-barcode-mask";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native";
import { useMessageBoxService } from "../contexts/MessageBoxService";

interface CameraProps {
  onReadComplete: (barcode: string) => void;
  isShow: boolean;
  onHide: () => void;
  isKazakistan?: boolean;
  isSelfCheckOut?: boolean;
}

const MainCamera: React.FC<CameraProps> = (props) => {
  const [isPermitted, setIsPermitted] = useState<boolean>(false);
  const device = useCameraDevice('back');
  const MessageBoxShow = useMessageBoxService(state => state.show);

  const allowedBarCodes = props.isKazakistan
    ? ['data-matrix']
    : props.isSelfCheckOut
      ? [
        'data-matrix',
        'qr',
      ]
      : [
        'ean-13',
        'code-128',
        'code-39',
        'qr',
        'upc-e',
      ];


  const onCodeScanned = useCallback((codes: Code[]) => {
    const value = codes[0]?.value;
    if (value == null) return;

    props.onReadComplete(value);
  }, []);

  useEffect(() => {
    if (props.isShow) {
      if (Platform.OS === 'android') {
        check(PERMISSIONS.ANDROID.CAMERA)
          .then(result => {
            setIsPermitted(RESULTS.GRANTED === result)
            if (RESULTS.DENIED === result || RESULTS.BLOCKED === result) {
              MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından kamera yetkisini aktif ediniz!', {
                yesButtonEvent: () => {
                  Linking.openSettings().then();
                },
              })
              request(PERMISSIONS.ANDROID.CAMERA).then((res) => setIsPermitted(RESULTS.GRANTED === result)).catch(error => {
                console.error(error);
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
      if (Platform.OS === 'ios') {
        check(PERMISSIONS.IOS.CAMERA)
          .then(result => {
            setIsPermitted(RESULTS.GRANTED === result)
            if (RESULTS.DENIED === result || RESULTS.BLOCKED === result) {
              MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından kamera yetkisini aktif ediniz!', {
                yesButtonEvent: () => {
                  Linking.openSettings().then();
                },
              })
              request(PERMISSIONS.IOS.CAMERA).then((res) => setIsPermitted(RESULTS.GRANTED === result)).catch(error => {
                console.error(error);
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }, [props.isShow]);


  const codeScanner = useCodeScanner({
    codeTypes: allowedBarCodes,
    onCodeScanned: onCodeScanned,
  });

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

        {isPermitted ? (
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
              {device != null && (
                <Camera
                  style={StyleSheet.absoluteFill}
                  device={device}
                  isActive={props.isShow}
                  codeScanner={codeScanner}
                  torch={'off'}
                  enableZoomGesture={true}
                />
              )}
              <BarcodeMask showAnimatedLine={false} />

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
