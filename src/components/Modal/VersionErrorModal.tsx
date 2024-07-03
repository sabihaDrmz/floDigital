import {
    AppButton,
    AppColor,
    AppText,
    ColorType,
  } from "@flomagazacilik/flo-digital-components";
  import React from "react";
  import { View, StyleSheet, Dimensions, Platform, Linking } from "react-native";
  import { useVersionService } from "../../contexts/VersionService";
  import { translate } from "../../helper/localization/locaizationMain";
  
  interface VersionErrorModalProps { }
  
  const VersionErrorModal: React.FC<VersionErrorModalProps> = (props) => {
    const VersionService = useVersionService();
    if (VersionService.hasShowError)
      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <AppText style={styles.text}>{VersionService.versionMessage}</AppText>
            <AppButton
              buttonColorType={ColorType.Brand}
              onPress={() => {
                Platform.OS === "web"
                  ? window.location.reload()
                  : Platform.OS === "ios"
                    ? Linking.openURL("https://go.flo.com.tr/fdios")
                    : Linking.openURL("https://go.flo.com.tr/fdandroid");
              }}
              title={translate("newVersion.goto")}
            />
          </View>
        </View>
      );
    else return null;
  };
  export default VersionErrorModal;
  
  const { width, height } = Dimensions.get("window");
  const styles = StyleSheet.create({
    container: {
      backgroundColor: AppColor.FD.Brand.Solid,
      position: "absolute",
      width,
      height,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 10,
      // minHeight: 200,
      height: 130,
      minWidth: width - 40,
    },
    text: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 20,
      textAlign: "center",
      fontFamily: "Poppins_600SemiBold",
      flex: 1,
    },
  });
  