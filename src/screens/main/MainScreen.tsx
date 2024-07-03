import { observer } from "mobx-react";
import React, { Component } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View, Text, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import {
  CrmIcon,
  LinksIcon,
  PrinterIcon,
  ProfilePictureBox,
} from "../../components/CustomIcons/MainPageIcons";
import EventsearchComponent from "../../components/EventSearchComponent";

import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { isInRole } from "../../components/RoleGroup";
import AccountService from "../../core/services/AccountService";
import ApplicationGlobalService from "../../core/services/ApplicationGlobalService";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import { translate } from "../../helper/localization/locaizationMain";
import OmsIcon from "../../components/CustomIcons/OmsIcon";
import { AppText } from "@flomagazacilik/flo-digital-components";
import MessageBoxNew from "../../core/services/MessageBoxNew";
import MediaSelectorPopup from "../../components/MediaSelector/MediaSelectorPopup";
import { useMediaSelector } from "../../components/MediaSelector/MediaSelector";

const { width, height } = Dimensions.get("window");
const PADDING_TOTAL = Platform.OS === "android" ? 50 : 50;
const BOX_WIDTH = PerfectPixelSize((width - 2) / 2) - PADDING_TOTAL;
const BOX_HEIGHT = Platform.OS === "ios" ? 130 : 100;
const BOX_PB = Platform.OS === "ios" ? 12 : 5;
@observer
class MainScreen extends Component {
  state = { isShowKeyboard: false };
  componentDidMount() {
    if (Platform.OS !== "web") {
      Keyboard.addListener("keyboardDidShow", () => {
        this.setState({ isShowKeyboard: true });
      });

      Keyboard.addListener("keyboardDidHide", () => {
        this.setState({ isShowKeyboard: false });
      });
    }
  }

  renderButtonCard = (
    pos: "topRight" | "topLeft" | "bottomLeft" | "bottomRight",
    title: string,
    image: any,
    navigate: string
  ) => {
    let cardStyle =
      pos === "topRight"
        ? styles.topRight
        : pos === "topLeft"
        ? styles.topLeft
        : pos === "bottomLeft"
        ? styles.bottomLeft
        : pos === "bottomRight"
        ? styles.bottomRight
        : {};

    return (
      <View style={[styles.card, cardStyle]}>
        <TouchableOpacity
          style={styles.subCard}
          onPressIn={() => Actions[navigate]()}
        >
          {image && image}
          <View style={styles.titleContainer}>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <>
        <FloHeaderNew
          headerType={"standart"}
          enableButtons={["notification"]}
          showLogo
        />
        <DismissKeyboardView>
          <View
            style={{
              marginLeft: 40,
              marginTop: 40,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <Image
                source={require("../../../assets/profile_image_default.png")}
                style={{ width: 90, height: 90, resizeMode: "contain" }}
              />
              <View style={{ position: "absolute", left: -3, top: -0.5 }}>
                <ProfilePictureBox />
              </View>
            </View>
            <View style={{ marginLeft: 15 }}>
              <Text
                style={{
                  fontSize: PerfectFontSize(15),
                  color: "#707070",
                  fontFamily: "Poppins_300Light",
                }}
              >
                {translate("mainScreen.welcome")},
              </Text>
              <Text
                style={{
                  fontSize: PerfectFontSize(15),
                  color: "#FF8600",
                  fontFamily: "Poppins_500Medium",
                }}
              >
                {AccountService.employeeInfo.FirstName as string}
              </Text>
            </View>
            {isInRole("omc-test-mode") && (
              <View
                style={{
                  transform: [{ rotateZ: "90deg" }],
                  alignItems: "center",
                  position: "absolute",
                  right: 0,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_300Light",
                    fontSize: PerfectFontSize(12),
                    letterSpacing: 0.6,
                  }}
                >
                  Test Modu
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    ApplicationGlobalService.changeApplicationTestMode()
                  }
                >
                  <View
                    style={{
                      width: 80,
                      height: 30,
                      borderWidth: 1,
                      borderRadius: 15,
                      borderColor: "#dddddd",
                      padding: 3,
                      justifyContent: "center",
                      alignItems: ApplicationGlobalService.testMode
                        ? "flex-end"
                        : "flex-start",
                      backgroundColor: ApplicationGlobalService.testMode
                        ? "rgb(255,134,0)"
                        : "transparent",
                    }}
                  >
                    <View
                      style={{
                        borderColor: "#dddddd",
                        borderWidth: 1,
                        width: 23,
                        height: 23,
                        borderRadius: 13.5,
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <EventsearchComponent />
        </DismissKeyboardView>
        {!this.state.isShowKeyboard && (
          <View style={styles.container}>
            {/* <MediaSelectorPopup
              alertMessage="Eklenen fotoğraflar kayıt sonrası silinemez ve değiştirirlemez
Maksimum 2 adet fotoğraf eklenebilmektedir."
            /> */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: width - 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => Actions.jump("omsStack")}
                style={{
                  width: (width - 60) / 2,
                  height: BOX_HEIGHT,
                  borderRightWidth: 1,
                  borderBottomWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 10,
                  borderColor: "rgba(0,0,0,.1)",
                }}
                disabled={isInRole("omc-oms") ? false : true}
              >
                <OmsIcon />
                <AppText style={styles.boxBottomTitleStyle}>
                  {translate("mainScreen.oms")}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Actions.jump("scnLinks")}
                style={{
                  width: (width - 60) / 2,
                  height: BOX_HEIGHT,
                  borderBottomWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 10,
                  borderColor: "rgba(0,0,0,.1)",
                }}
                disabled={isInRole("omc-help-links") ? false : true}
              >
                <LinksIcon />
                <AppText style={styles.boxBottomTitleStyle}>
                  {translate("mainScreen.links")}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Actions.jump("crmMain")}
                style={{
                  width: (width - 60) / 2,
                  height: BOX_HEIGHT,
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 10,
                  borderColor: "rgba(0,0,0,.1)",
                }}
              >
                <CrmIcon />
                <AppText style={styles.boxBottomTitleStyle}>
                  {translate("mainScreen.crm")}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Platform.OS === "web"
                    ? MessageBoxNew.show(
                        "Yazıcı ayarları web ekranında kullanılamaz"
                      )
                    : Actions.jump("printerConfig")
                }
                style={{
                  width: (width - 60) / 2,
                  height: BOX_HEIGHT,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 10,
                  borderColor: "rgba(0,0,0,.1)",
                }}
                disabled={isInRole("omc-printer-config") ? false : true}
              >
                <PrinterIcon />
                <AppText style={styles.boxBottomTitleStyle}>
                  {translate("mainScreen.printer")}
                </AppText>
              </TouchableOpacity>
              {/* {this.renderButtonCard(
                "topLeft",
                translate("mainScreen.oms"),
                // <AnnouncementIcon />,
                <OmsIcon />,
                "omsStack"
              )}
              {this.renderButtonCard(
                "topRight",
                translate("mainScreen.links"),
                <LinksIcon />,
                "scnLinks"
              )}
              {this.renderButtonCard(
                "bottomLeft",
                translate("mainScreen.crm"),
                <CrmIcon />,
                "crmMain"
              )}
              {this.renderButtonCard(
                "bottomRight",
                translate("mainScreen.printer"),
                <PrinterIcon />,
                "printerConfig"
              )} */}
            </View>
          </View>
        )}
      </>
    );
  }
}

export default MainScreen;

const styles = StyleSheet.create({
  boxBottomTitleStyle: { position: "absolute", bottom: BOX_PB },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#F7F7F7",
  },
  subCard: {
    width: BOX_WIDTH - PerfectPixelSize(40),
    height: BOX_WIDTH - PerfectPixelSize(40),
    borderRadius: 2,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 9,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#f8f7f7",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    width: BOX_WIDTH - PerfectPixelSize(200.8),
  },
  cardTitle: {
    fontSize: PerfectFontSize(14),
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0.65,
    textAlign: "center",
    color: "#707070",
    width: BOX_WIDTH - PerfectPixelSize(40),
    marginTop: 12.2,
    flexWrap: "wrap",
    alignItems: "stretch",
  },
  topLeft: {
    width: BOX_WIDTH,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: BOX_WIDTH,
  },
  topRight: {
    width: BOX_WIDTH,
    borderBottomWidth: 1,
    height: BOX_WIDTH,
  },
  bottomLeft: {
    width: BOX_WIDTH,
    borderRightWidth: 1,
    height: BOX_WIDTH,
  },
  bottomRight: {
    width: BOX_WIDTH,
    height: BOX_WIDTH,
  },
});

//@ts-ignore
const DismissKeyboardHOC = (Comp) => {
  //@ts-ignore
  return ({ children, ...props }) => {
    if (Platform.OS === "web") return children;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Comp {...props}>{children}</Comp>
      </TouchableWithoutFeedback>
    );
  };
};
const DismissKeyboardView = DismissKeyboardHOC(View);
