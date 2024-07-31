import { Observer } from "mobx-react-lite";
import moment from "moment";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import { PanGestureHandler, ScrollView } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

import { VersionInfo } from "../constant/ApplicationVersionInfo";
import AccountService from "../core/services/AccountService";
import ApplicationGlobalService from "../core/services/ApplicationGlobalService";
import { translate } from "../helper/localization/locaizationMain";
import { PerfectFontSize } from "../helper/PerfectPixel";
import { colors } from "../theme/colors";

import { ProfilePictureBox } from "./CustomIcons/MainPageIcons";

const FloDrawerComponent: React.FC = (props) => {
  const drawerPos = useSharedValue(-250);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (state, ctx: any) => {
      ctx.startX = drawerPos.value;
    },
    onActive: (state, ctx: any) => {
      if (ctx.startX + state.translationX > 0) return;
      drawerPos.value = ctx.startX + state.translationX;
    },
    onEnd: (state, ctx) => {
      if (
        drawerPos.value < -5 ||
        Math.sqrt(state.translationY - state.velocityY) > 0
      ) {
        drawerPos.value = withTiming(-250);
      } else {
        drawerPos.value = withTiming(0);
      }
    },
  });

  const openDrawer = () => {
    drawerPos.value = withTiming(0);
  };

  const closeDrawer = () => {
    drawerPos.value = withTiming(-250);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drawerPos.value }],
    };
  });

  const Info: React.FC<{ title: string; value: string; style?: any }> = (
    props
  ) => {
    return (
      <View style={[props.style, { marginBottom: 20 }]}>
        <Text
          style={{
            fontFamily: "Poppins_300Light",
            fontSize: PerfectFontSize(14),
            fontStyle: "normal",
            lineHeight: PerfectFontSize(27),
            letterSpacing: 0.7,
            textAlign: "left",
            color: "#ffffff",
          }}
        >
          {props.title}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: PerfectFontSize(14),
            fontStyle: "normal",
            lineHeight: PerfectFontSize(27),
            letterSpacing: 0.7,
            textAlign: "left",
            color: "#ffffff",
          }}
        >
          {props.value}
        </Text>
      </View>
    );
  };

  return (
    <Observer>
      {() => {
        if (ApplicationGlobalService.isOpenDrawer) {
          openDrawer();
        } else {
          closeDrawer();
        }
        return (
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View style={[styles.container, animatedStyle]}>
              {/* <SafeAreaView /> */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingRight: 25,
                }}
              >
                <View>
                  <View>
                    <Image
                      source={require("../assets/profile_image_default.png")}
                      style={{ width: 90, height: 90, resizeMode: "contain" }}
                    />
                    <View style={{ position: "absolute", left: -3, top: -0.5 }}>
                      <ProfilePictureBox />
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize:
                        Platform.OS === "web"
                          ? PerfectFontSize(11)
                          : PerfectFontSize(14),
                      lineHeight: PerfectFontSize(27),
                      letterSpacing: 0.7,
                      color: colors.white,
                      marginTop: 15,
                    }}
                  >
                    {AccountService.employeeInfo.FirstName}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    (ApplicationGlobalService.isOpenDrawer = false)
                  }
                >
                  <FontAwesomeIcon icon={"arrowleft"} color={"#fff"} size={25} />
                </TouchableOpacity>
              </View>
              <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <Info
                  style={{ marginTop: 30 }}
                  title={translate("profileDetailScreen.birthDay")}
                  value={moment(AccountService.employeeInfo.BirthDate).format(
                    "DD/MM/yyyy"
                  )}
                />
                <Info
                  title={translate("profileDetailScreen.email")}
                  value={AccountService.employeeInfo.Email}
                />
                <Info
                  title={translate("profileDetailScreen.efficiencyRecord")}
                  value={AccountService.employeeInfo.EfficiencyRecord}
                />
                <Info
                  title={translate("profileDetailScreen.department")}
                  value={AccountService.employeeInfo.DepartmentName}
                />
                <Info
                  title={translate("profileDetailScreen.position")}
                  value={AccountService.employeeInfo.PositionName}
                />
                <Info
                  title={translate("profileDetailScreen.expenseCentre")}
                  value={AccountService.employeeInfo.ExpenseLocationCode}
                />
                <Info
                  title={translate("profileDetailScreen.expenseCentreName")}
                  value={AccountService.employeeInfo.ExpenseLocationName}
                />
                <Info
                  title={translate("profileDetailScreen.jobStartDate")}
                  value={
                    AccountService.employeeInfo.JobStartDate
                      ? moment(AccountService.employeeInfo.JobStartDate).format(
                          "DD/MM/YYYY"
                        )
                      : ""
                  }
                />
              </ScrollView>
              <View style={{ height: 80 }} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  ApplicationGlobalService.isOpenDrawer = false;
                  AccountService.logOut();
                }}
                style={{
                  backgroundColor: "#fff",
                  height: 49,
                  width: 170,
                  position: "absolute",
                  bottom: 45,
                  borderBottomRightRadius: 26,
                  borderTopRightRadius: 26,
                  paddingLeft: 47,
                  alignItems: "center",
                  flexDirection: "row",
                  left: 0,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_300Light",
                    fontSize: PerfectFontSize(13),
                    fontWeight: "300",
                    fontStyle: "normal",
                    lineHeight: PerfectFontSize(30),
                    letterSpacing: 0.98,
                    textAlign: "left",
                    color: "#8c8e90",
                  }}
                >
                  {translate("drawer.logout")}
                </Text>
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    shadowColor: "rgba(0, 0, 0, 0.16)",
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowRadius: 6,
                    shadowOpacity: 1,
                    borderStyle: "solid",
                    borderWidth: 0.5,
                    borderColor: "#e4e4e4",
                    width: 35,
                    height: 35,
                    borderRadius: 35 / 2,
                    marginRight: 16,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faPowerOff} color={"#8c8e90"} size={25} />
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: PerfectFontSize(13),
                  fontStyle: "normal",
                  lineHeight: PerfectFontSize(30),
                  letterSpacing: 0.98,
                  textAlign: "left",
                  color: "#fff",
                  position: "absolute",
                  bottom: 55,
                  right: 10,
                }}
              >
                V:{VersionInfo.code}
              </Text>
            </Animated.View>
          </PanGestureHandler>
        );
      }}
    </Observer>
  );
};
export default FloDrawerComponent;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 250,
    height: Dimensions.get("window").height,
    left: 0,
    right: 0,
    backgroundColor: "#ff8600",
    shadowColor: "rgba(0, 0, 0, 0.16)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 34,
    shadowOpacity: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e4e4e4",
    borderBottomEndRadius: 16,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingTop: 50,
    paddingLeft: 30,
  },
});
