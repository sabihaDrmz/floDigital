import { Observer } from "mobx-react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import {
  PanGestureHandler,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Actions } from "react-native-router-flux";
import { AntDesign } from "@expo/vector-icons";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { BrokenProductIcon } from "../CustomIcons/BrokenProductIcon";
import {
  CancelOrderIcon,
  ReturnOrderIcon,
  SearchQR,
} from "../CustomIcons/MainPageIcons";
import { isInRole } from "../RoleGroup";
import { FontAwesome5 } from "@expo/vector-icons";
import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";

const TabBar = (props: any) => {
  const transformY = useSharedValue(POPUP_WIDTH);
  const scurrentSceneValue = useSharedValue(1);
  const [currentScene, setCurrentScene] = useState(1);
  const [isOpenProcessMenu, setIsOpenProcessMenu] = useState(false);
  const navigateTo = (scene: string, tabIndex: number) => {
    setCurrentScene(tabIndex);
    scurrentSceneValue.value = withTiming(tabIndex);
    Actions[scene]();
    closeMenu();
  };
  const openMenu = () => {
    transformY.value = withTiming(0, {
      duration: 300,
      easing: Easing.cubic,
    });
    setIsOpenProcessMenu(true);
  };

  const closeMenu = () => {
    transformY.value = withTiming(POPUP_WIDTH + 10, {
      duration: 300,
      easing: Easing.ease,
    });
    setIsOpenProcessMenu(false);
  };

  useEffect(() => {
    setCurrentScene(Actions.currentScene === "_scTbHome" ? 1 : 2);
    scurrentSceneValue.value = Actions.currentScene === "_scTbHome" ? 1 : 2;
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(transformY.value, [0, POPUP_WIDTH], [1, 0.8]);
    return {
      transform: [{ translateY: transformY.value < 0 ? 0 : transformY.value }],
      opacity,
      zIndex: -1,
    };
  });

  const animateHomeIconColorStyle = useAnimatedStyle(() => {
    return {
      color:
        transformY.value > 50
          ? scurrentSceneValue.value === 1
            ? ACTIVE_COLOR
            : PASSIVE_COLOR
          : PASSIVE_COLOR,
    };
  }, [currentScene]);
  const animateHomeIconTintColorStyle = useAnimatedStyle(() => {
    return {
      tintColor:
        transformY.value > 50
          ? scurrentSceneValue.value === 1
            ? ACTIVE_COLOR
            : PASSIVE_COLOR
          : PASSIVE_COLOR,
    };
  }, [currentScene]);

  const animateProcessIconColorStyle = useAnimatedStyle(() => {
    return {
      color: transformY.value !== 0 ? PASSIVE_COLOR : ACTIVE_COLOR,
    };
  });
  const animateProcessIconTintColorStyle = useAnimatedStyle(() => {
    return { tintColor: transformY.value !== 0 ? PASSIVE_COLOR : ACTIVE_COLOR };
  });

  const gestureEvt = useAnimatedGestureHandler({
    onStart: (state, ctx: any) => {
      ctx.startY = transformY.value;
    },
    onActive: (state, ctx: any) => {
      transformY.value = ctx.startY + state.translationY;
    },
    onEnd: (state, ctx) => {
      if (state.translationY + state.velocityY < 95) {
        transformY.value = withTiming(0, {
          duration: 300,
          easing: Easing.ease,
        });
      } else {
        transformY.value = withTiming(POPUP_WIDTH + 10, {
          duration: 300,
          easing: Easing.ease,
        });
      }
    },
  });

  const processMenuItem = (
    title: string,
    navigate: string,
    icon: any,
    showSperator: boolean = true,
    role: string
  ) => {
    if (!isInRole(role)) return null;
    return (
      <React.Fragment>
        <TouchableWithoutFeedback
          onPressIn={() => {
            Actions.jump(navigate);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {icon}
            <Text
              style={{
                fontSize: PerfectFontSize(16),
                color: "#7D7E81",
                fontFamily: "Poppins_500Medium",
              }}
            >
              {title}
            </Text>
          </View>
          <AntDesign name={"right"} size={17} color={"#7D7E81"} />
        </TouchableWithoutFeedback>
        {showSperator && (
          <View
            style={{
              borderBottomWidth: 0.3,
              borderColor: "rgba(0,0,0,0.3)",
            }}
          ></View>
        )}
      </React.Fragment>
    );
  };

  const MainBadgeCount = () => {
    return (
      <Observer>
        {() => (
          <View
            style={{
              position: "absolute",
              backgroundColor: "red",
              width: 20,
              height: 20,
              borderRadius: 14,
              top: -10,
              right: -20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                color: "#fff",
                fontSize: 10,
              }}
            >
              1
            </Text>
          </View>
        )}
      </Observer>
    );
  };
  return (
    <View style={{ backgroundColor: "#fff" }}>
      <PanGestureHandler onGestureEvent={gestureEvt}>
        <Animated.View style={[styles.popupMenu, animatedContainerStyle]}>
          <TouchableOpacity
            onPress={() => closeMenu()}
            style={{
              height: 44,
              backgroundColor: "#FF8600",
              borderRadius: 15,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 15,
              paddingRight: 15,
              shadowColor: "rgba(0, 0, 0, 0.16)",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 6,
              shadowOpacity: 1,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "Poppins_500Medium",
                fontSize: PerfectFontSize(18),
              }}
            >
              {translate("tabbar.processBtnTxt")}
            </Text>
            <Image
              source={require("../../../assets/processicon.png")}
              style={{
                height: 21,
                tintColor: "#fff",
              }}
            />
          </TouchableOpacity>
          <View style={{ backgroundColor: "#fff", padding: 20 }}>
            {processMenuItem(
              "İptal İşlemleri",
              "cancellationScreen",
              <CancelOrderIcon />,
              true,
              "omc-easy-return-cancel"
            )}
            {/* {processMenuItem(
              'Değişim İşlemleri',
              'easyFindFiche',
              <ChangeOrderIcon />,
              true,
              'omc-easy-return',
            )} */}
            {/* {processMenuItem(
              'İade İşlemleri',
              'erReturnFindFiche',
              <ReturnOrderIcon />,
              true,
              'omc-easy-return',
            )} */}
            {Platform.OS === "web" &&
              processMenuItem(
                "Belge Yazdırma",
                "listprint",
                <ReturnOrderIcon />,
                true,
                "omc-easy-return"
              )}
            {processMenuItem(
              "İDES",
              "erBrokenFindFiche",
              <BrokenProductIcon />,
              isInRole("omc-warehouse-request"),
              "omc-easy-return-ides"
            )}
            {processMenuItem(
              "Raporlar",
              "reportScreen",
              <BrokenProductIcon />,
              isInRole("omc-warehouse-request"),
              "omc-rapor"
            )}
            {isInRole("omc-warehouse-request") && (
              <TouchableOpacity
                style={{ marginVertical: 5, flexDirection: "row" }}
                onPress={() => {
                  Actions.jump("scWarehouseRequest");
                  closeMenu();
                }}
              >
                <View>
                  <Image
                    source={require("../../../assets/depoekle.png")}
                    style={{ width: 47, height: 40, resizeMode: "contain" }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <AppText
                    style={{
                      fontSize: PerfectFontSize(16),
                      color: "#7D7E81",
                      fontFamily: "Poppins_500Medium",
                    }}
                  >
                    {translate("warehouseRequest.title")}
                  </AppText>
                  <AntDesign name={"right"} size={17} color={"#7D7E81"} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigateTo("scTbHome", 1)}
          >
            <Animated.Image
              source={require("../../../assets/homeicon.png")}
              style={[
                {
                  width: 21,
                  height: 21,
                  tintColor: currentScene === 1 ? ACTIVE_COLOR : PASSIVE_COLOR,
                },
                animateHomeIconTintColorStyle,
              ]}
            />
            <Animated.Text style={[styles.tabTitle, animateHomeIconColorStyle]}>
              {translate("tabbar.home")}
            </Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.FABButton}
            onPress={() => {
              navigateTo("scTbFindBarcode", 2);
              Actions.popTo("isoBarcodeCheck");
            }}
          >
            <SearchQR />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => openMenu()}>
            <View>
              <Animated.Image
                source={require("../../../assets/processicon.png")}
                style={[
                  {
                    height: 21,
                    width: 22,
                    resizeMode: "contain",
                  },
                  Platform.OS === "web" && { resizeMode: "center" },
                  animateProcessIconTintColorStyle,
                ]}
              />
              {/* {!isOpenProcessMenu && <MainBadgeCount />} */}
            </View>
            <Animated.Text
              style={[styles.tabTitle, animateProcessIconColorStyle]}
            >
              {translate("tabbar.processBtnTxt")}
            </Animated.Text>
          </TouchableOpacity>
        </View>
        <SafeAreaView />
      </View>
    </View>
  );
};
export default TabBar;

const { width, height } = Dimensions.get("window");
const ACTIVE_COLOR = "#FF8600";
const PASSIVE_COLOR = "#c7c7c7";
const FAB_BUTTON_WIDTH = 60;
const POPUP_WIDTH = 440;

const styles = StyleSheet.create({
  container: {
    borderTopColor: "rgba(0,0,0,0.104)",
    borderTopWidth: 1,
    backgroundColor: "#fff",

    elevation: 17,
  },
  tabContainer: {
    minHeight: 48,
    flexDirection: "row",
  },
  tab: {
    width: width / 2,
    justifyContent: "flex-end",
    alignItems: "center",
    height: 48,
  },
  tabTitle: {
    fontSize: PerfectFontSize(12),
    fontWeight: "500",
    fontFamily: "Poppins_300Light",
    color: PASSIVE_COLOR,
    marginTop: 5,
  },
  FABButton: {
    width: FAB_BUTTON_WIDTH,
    height: FAB_BUTTON_WIDTH,
    backgroundColor: "#FF671C",
    position: "absolute",
    borderRadius: FAB_BUTTON_WIDTH,
    left: width / 2 - FAB_BUTTON_WIDTH / 2,
    top: -(FAB_BUTTON_WIDTH / 2),
    zIndex: 9,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  popupMenu: {
    width: width - 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 6,
    height: POPUP_WIDTH,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    backgroundColor: "#fff",
    borderTopWidth: 0.1,
    borderLeftWidth: 0.1,
    borderRightWidth: 0.1,
    borderColor: "rgba(0,0,0,0.19)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    zIndex: 99999,
  },
});
