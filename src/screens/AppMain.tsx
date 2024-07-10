import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Platform,
  Linking,
} from "react-native";
import { colors } from "../theme/colors";
import { observer } from "mobx-react";
import AccountService from "../core/services/AccountService";
import ApplicationGlobalService from "../core/services/ApplicationGlobalService";
import { FloButton } from "../components";
import { PerfectFontSize } from "../helper/PerfectPixel";
import { translate } from "../helper/localization/locaizationMain";
//TODO: EXPO expo-device
// import * as Device from "expo-device";
import DeviceInfo from 'react-native-device-info';
import { GetServiceUri, ServiceUrlType } from "../core/Settings";
import axios from "axios";
import RNExitApp from "react-native-exit-app";
import FcmService from "../core/services/FcmService";
import { notificationEvent } from "../core/libraries/FcmFroground";
@observer
class AppMain extends Component<any> {
  state = { isJailBroken: false };
  async componentDidMount() {
    await ApplicationGlobalService.restoreTestMode();
    console.log("1");
    const checkRootStatus = async () => {
      const isRooted = await DeviceInfo.isRooted();
      return isRooted;
    };
    if (!__DEV__) {

      let res = checkRootStatus();
      if (res || DeviceInfo.isEmulator()) this.setState({ isJailBroken: true });

      console.log("2");
      if (this.state.isJailBroken) return;
    }
    console.log("2");

    if (!this.props.restoreComplete) {
      console.log("3");

      ApplicationGlobalService.checkVersion()
        .then(async (x: boolean) => {
          if (!x) return;
          console.log("4");

          if (!__DEV__) {
            var rooted = checkRootStatus;

            if (rooted || DeviceInfo.isEmulator()) return;
          }
          console.log("5");

          AccountService.restore()
            .then(async (x) => {
              console.log("6");
//TODO: EXPO test edilmeli

              let deviceBrokenModel = {
                employeeId: AccountService.employeeInfo.EfficiencyRecord || "",
                employeeName: AccountService.employeeInfo?.FirstName,
                rooted: checkRootStatus(),
                brand: DeviceInfo.getBrand() || "",
                // TODO: EXPO add designName
                designName: "",
                deviceName: DeviceInfo.getDeviceName() || "",
                isEmulator: DeviceInfo.isEmulator(),
                //TODO: EXPO add yearClass
                yearClass:  "",
                manufacturer: DeviceInfo.getManufacturer() || "",
                model: DeviceInfo.getModel() || "",
                osName: DeviceInfo.getSystemName() || "",
                osVersion: DeviceInfo.getSystemVersion() || "",
              };
              if (Platform.OS !== "web") {
                axios
                  .post(
                    GetServiceUri(ServiceUrlType.SYSTEM_API) + "App/LogDevice",
                    deviceBrokenModel
                  )
                  .then((res) => {})
                  .catch((res) => {});
              }
              ApplicationGlobalService.fetchAllStores().then(() => {
                FcmService.getNoficationPermission();
              });
              console.log("7");

              ApplicationGlobalService.applicationRestoration()
                .then(() => {})
                .catch((e) => {})
                .finally(() => {
                  console.log("8");

                  setTimeout(() => {
                    if (FcmService.waitingRemoteRouting) {
                      notificationEvent(FcmService.waitingRemoteRouting.data);
                      FcmService.waitingRemoteRouting = undefined;
                    }
                  }, 100);
                });

              ApplicationGlobalService.getAllEcomStoreList()
                .then(() => {})
                .catch((e) => {})
                .finally(() => {
                  console.log("9");
                });
            })
            .catch((e) => {
              // SplashScreen.hide();
            });
        })
        .catch((e) => {
          // SplashScreen.hide();
        });
    }
  }

  render() {
    return (
      <>
        <ImageBackground
          style={styles.container}
          source={require("../../assets/background_splash.png")}
          imageStyle={{ resizeMode: "cover" }}
        ></ImageBackground>
        {ApplicationGlobalService.isShowVersionError && (
          <View
            style={{
              width: Dimensions.get("window").width - 40,
              height: 150,
              backgroundColor: "#fff",
              position: "absolute",
              top: (Dimensions.get("window").height - 150) / 2,
              left: 20,
              borderRadius: 20,
              padding: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: PerfectFontSize(15),
                  fontWeight: "500",
                  letterSpacing: -0.02,
                  textAlign: "center",
                }}
              >
                {translate(ApplicationGlobalService.versionErrorMessage)}
              </Text>
            </View>
            <FloButton
              onPress={() => {
                if (ApplicationGlobalService.isForceVersion)
                  Platform.OS === "ios"
                    ? Linking.openURL("https://go.flo.com.tr/fdios")
                    : Linking.openURL("https://go.flo.com.tr/fdandroid");
                else {
                  ApplicationGlobalService.restoreTestMode().then(() => {
                    AccountService.restore().then((x) => {
                      ApplicationGlobalService.applicationRestoration().then(
                        () => {
                          // SplashScreen.hide();
                        }
                      );
                    });
                  });
                }
              }}
              title={translate("newVersion.goto")}
            />
          </View>
        )}
        {this.state.isJailBroken && (
          <View
            style={{
              width: Dimensions.get("window").width - 40,
              height: 150,
              backgroundColor: "#fff",
              position: "absolute",
              top: (Dimensions.get("window").height - 150) / 2,
              left: 20,
              borderRadius: 20,
              padding: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: PerfectFontSize(15),
                  fontWeight: "500",
                  letterSpacing: -0.02,
                  textAlign: "center",
                }}
              >
                {translate("newVersion.jailBrokenMessage")}
              </Text>
            </View>
            <FloButton
              onPress={() => {
                RNExitApp.exitApp();
              }}
              title={translate("newVersion.jailBrokenOkButton")}
            />
          </View>
        )}
      </>
    );
  }
}
export default AppMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brightOrange,
  },
});
