import React, { ReactNode } from "react";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";

import { DrawerActions } from "@react-navigation/routers";
import BellIcon from "../../components/CustomIcons/BellIcon";
import HeaderSliderMenu from "./HeaderSliderMenu";
import { useFcmService } from "../../contexts/FcmService";
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

interface CustomButtonAction {
  buttonType:
  | "back"
  | "close"
  | "basket"
  | "findBarcode"
  | "profile"
  | "notification"
  | "profilePic"
  | "customLeftButton";
  customAction: () => void;
}

interface FloHeaderProps {
  headerType: "standart" | "search" | "searchtab";
  enableButtons?: (
    | "back"
    | "close"
    | "basket"
    | "findBarcode"
    | "profile"
    | "notification"
    | "profilePic"
    | "customLeftButton"
  )[];
  data?: any[];
  ignoreKeys?: string[];
  onSearch?: (query: string) => void;
  onFilterData?: (data: any[]) => void;
  showLogo?: boolean;
  headerTitle?: string;
  placeholder?: string;
  //TODO: Özelleştirilmiş buton işlemleri buton aksiyonlarına bağlanacak
  customButtonActions?: CustomButtonAction[];
  tabs?: any[];
  tabActiveStyle?: StyleProp<ViewProps>;
  tabTextActiveStyle?: StyleProp<ViewProps>;
  tabInActiveStyle?: StyleProp<ViewProps>;
  tabInTextActiveStyle?: StyleProp<ViewProps>;
  tabsScreen?: ReactNode[];
  onChangeTab?: (index: number) => void;
  currentTab?: number;
  customLeftButton?: () => void;
}


const SelectedBgMaker = (props: any) => {
  let width = props.width;
  const EDGE_WIDTH = 79;
  width += EDGE_WIDTH;
  if (width < EDGE_WIDTH + 20) width = EDGE_WIDTH + 20;
  return (
    <View
      style={[
        {
          backgroundColor: "rgb(246,246,246)",
          flexDirection: "row",
        },
        props.style,
      ]}
    >
      {/* <View
        style={{
          width: 50,
          height: 59,
          backgroundColor: 'rgb(255, 134, 0)',
          borderBottomRightRadius: 20,
        }}
      />
      <View
        style={{
          backgroundColor: 'rgb(255, 134, 0)',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            height: 59,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingLeft: 20,
            paddingRight: 20,
          }}>
          {props.children}
        </View>
      </View>
      <View
        style={{
          width: 50,
          height: 59,
          backgroundColor: 'rgb(255, 134, 0)',

          borderBottomLeftRadius: 20,
        }}
      /> */}
      <Svg width={width} height={60} style={{ width: "100%" }}>
        <G>
          <Path
            fill={"#ff8600"}
            d={`m ${width} 0 h 0 c 1.914 0 1.709 -0.191 1.709 1.76 v 57 h 0.234 a 21.728 21.728 90 0 1 -21.47 -17.227 a 21.162 21.162 90 0 1 -0.5 -4.443 c -0.056 -6.274 0 -12.548 -0.038 -18.822 a 24.091 24.091 90 0 0 -1.8 -9.6 c -2.01 -4.63 -5.649 -6.91 -10.528 -7.224 c -3.124 -0.2 -6.264 -0.193 -9.4 -0.194 q -47.855 -0.019 -${width - EDGE_WIDTH
              } 0.017 a 23.465 23.465 90 0 0 -7.517 0.82 c -4.306 1.436 -6.684 4.628 -7.723 8.839 a 34.552 34.552 90 0 0 -0.988 7.444 c -0.139 6.144 -0.04 12.293 -0.052 18.439 a 21.957 21.957 90 0 1 -18.324 21.681 a 22.328 22.328 90 0 1 -3.594 0.26 c -1.28 0 -1.282 0 -1.282 -1.345 v -55.95 c 0 -1.452 0 -1.453 1.448 -1.453 z`}
          />
        </G>
      </Svg>
      <View
        style={{
          position: "absolute",
          paddingTop: 10,
          width,
        }}
      >
        {props.children}
      </View>
    </View>
  );
};

const FloHeaderNew = (props: FloHeaderProps) => {
  const navigation = useNavigation(),
    path = useRoute().name,
    BUTTON_DEFAULT_ACTIONS = {
      back: () => navigation.goBack(), // Bir önceki sayfaya geri dön
      close: () => { }, // Anasayfaya resetlen
      basket: () =>
        //@ts-ignore
        navigation.navigate("Iso", { screen: "Basket" }), // Sepet Sayfasına git
      findBarcode: () => {
        const navState = navigation.getState();

        if (!navState.history || navState.history.length <= 0) return;

        const index = navState.history
          .reverse()
          .findIndex((x: any) => x.path === "Main");

        const backCount = navState.history.length - index;

        for (let i = 0; i < backCount; i++) {
          if (navigation.canGoBack()) navigation.goBack();
        }
      }, // Ürün arama sayfasına git
      profile: () => navigation.navigate("ProfileScreen" as never), // Profil Sayfasına git
    };

  const runButtonAction = (
    buttonType: "back" | "close" | "basket" | "findBarcode" | "profile"
  ) => {
    if (props.customButtonActions) {
      var btAction = props.customButtonActions.find(
        (x) => x.buttonType === buttonType
      );

      if (btAction) {
        btAction.customAction();
        return;
      }
    }

    BUTTON_DEFAULT_ACTIONS[buttonType]();
  };
  const FcmService = useFcmService();
  return (
    <View
      style={{
        backgroundColor: "#ff8600",
      }}
    >
      <StatusBar barStyle={"light-content"} backgroundColor="#ff8600" />
      <SafeAreaView
        style={{
          backgroundColor: "#ff8600",
        }}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: props.showLogo ? "rgb(230,230,230)" : "#ff8600",
          },
        ]}
      >
        <View style={{ flexDirection: "row" }}>
          {props.showLogo && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: 0,
                width: Dimensions.get("window").width,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ff8600",
                height: 80,
              }}
            >
              {path === "Main" || path === "BarcodeCheck" ? (
                <SelectedBgMaker width={100} style={{ marginTop: 22 }}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: PerfectPixelSize(10),
                      flex: 1,
                    }}
                  >
                    <Image
                      source={require("../../assets/logo.png")}
                      style={{
                        height: 35, //PerfectPixelSize(35),
                        width: 76, //PerfectPixelSize(76),
                      }}
                    />
                  </View>
                </SelectedBgMaker>
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: PerfectPixelSize(10),
                    flex: 1,
                  }}
                >
                  <Image
                    style={{
                      height: PerfectPixelSize(35),
                      width: PerfectPixelSize(76),
                    }}
                    source={require("../../assets/fdheaderlogo.png")}
                  />
                </View>
              )}
            </View>
          )}

          {props.enableButtons?.includes("back") && (
            <TouchableOpacity
              style={[styles.backBtn, props.tabs && { height: 40 }]}
              onPress={() => {
                runButtonAction("back");
              }}
            >
              <FontAwesomeIcon icon={"arrowleft"} size={27} color={"#fff"} />
            </TouchableOpacity>
          )}
          {!props.enableButtons?.includes("back") && (
            <TouchableOpacity
              style={[styles.backBtn, props.tabs && { height: 40 }]}
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}
            >
              <View
                style={{
                  width: 26,
                  height: 2,
                  backgroundColor: "#fff",
                  marginBottom: 6.5,
                }}
              />
              <View
                style={{
                  width: 26,
                  height: 2,
                  backgroundColor: "#fff",
                  marginBottom: 6.5,
                }}
              />
              <View style={{ width: 13, height: 2, backgroundColor: "#fff" }} />
            </TouchableOpacity>
          )}

          {
            // Title
            props.headerTitle && (
              <View
                style={[styles.titleContainer, props.tabs && { height: 40 }]}
              >
                <Text style={styles.title}>{props.headerTitle || ""}</Text>
              </View>
            )
          }
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {
            // Notifications
            props.enableButtons?.includes("notification") && (
              <TouchableOpacity
                style={styles.notifiContainer}
                onPress={() =>
                  navigation.navigate("Notification", { screen: "NotificationMain" })
                }
              >
                <BellIcon />
                {FcmService.badgeCnt && FcmService.badgeCnt > 0 ? (
                  <View style={styles.notificationCountBox}>
                    {FcmService.badgeCnt > 0 ? (
                      <Text style={styles.notifiCount}>
                        {FcmService.badgeCnt > 9
                          ? `+9`
                          : `${FcmService.badgeCnt}`}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
              </TouchableOpacity>
            )
          }
          {props.enableButtons?.includes("basket") && (
            <TouchableOpacity
              style={{
                width: 40,
                height: 80,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
              onPress={() =>
                //@ts-ignore
                navigation.navigate("Iso", { screen: "Basket" })
              }
            >
              <Image
                source={require("../../assets/cart.png")}
                style={{ tintColor: "#fff", width: 25, height: 23 }}
              />
            </TouchableOpacity>
          )}
          {props.enableButtons?.includes("close") && (
            <TouchableOpacity
              style={{
                width: 40,
                height: 80,
                alignItems: "center",
                marginRight: 10,
                justifyContent: "center",
              }}
              onPress={() => runButtonAction("close")}
            >
              <FontAwesomeIcon icon={"close"} size={30} color={"#fff"} />
            </TouchableOpacity>
          )}
          {props.enableButtons?.includes("findBarcode") && (
            <TouchableOpacity
              style={{
                width: 40,
                height: 80,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
              onPress={() =>
                //@ts-ignore
                navigation.navigate("Iso", { screen: "BarcodeCheck" })
              }
            >
              <Image
                source={require("../../assets/searchico.png")}
                style={{ tintColor: "#fff", width: 25, height: 23 }}
              />
            </TouchableOpacity>
          )}
          {props.enableButtons?.includes("customLeftButton") && (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {props.customLeftButton()}
            </View>
          )}
        </View>
      </View>
      {props.tabs && (
        <HeaderSliderMenu
          currentTab={props.currentTab}
          onChangeTab={props.onChangeTab}
          tabs={props.tabs}
        />
      )}
    </View>
  );
};
export default FloHeaderNew;

const styles = StyleSheet.create({
  container: {
    // height: 40,
    borderStyle: "solid",
    borderBottomWidth: 0,
    borderColor: "#e4e4e4",
    zIndex: 10000,
    width,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  whiteCircle: {
    position: "absolute",
    top: -(80 / 2),
    right: (width - 128) / 2,
    zIndex: 10000,
    transform: [
      {
        scale: 0.75,
      },
    ],
  },
  notifiContainer: {
    // position: 'relative',
    // display: 'flex',
    top: 7,
    paddingRight: 30,
    height: 80,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCountBox: {
    position: "absolute",
    right: 15,
    top: 15,
    height: 20,
    minWidth: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "red",
  },
  notifiCount: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    fontSize: PerfectFontSize(13),
  },
  drawerIcon: {
    display: "flex",
    flexDirection: "column",
    width: 40,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    position: "relative",
    justifyContent: "center",
  },
  backBtn: {
    display: "flex",
    height: 80,
    marginHorizontal: 10,
    justifyContent: "center",
  },
  titleContainer: {
    display: "flex",
    height: 80,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "flex-start",
    color: "#fff",
  },
  title: {
    color: "#fff",
    fontSize: PerfectFontSize(18),
    fontFamily: "Poppins_300Light",
    marginLeft: -5,
  },
});
