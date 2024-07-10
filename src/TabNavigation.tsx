import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Dimensions, Platform, TouchableOpacity, StyleSheet, View } from "react-native";

import Animated, {
    Easing,
    interpolate,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { PerfectFontSize } from "./helper/PerfectPixel";
import { translate } from "./helper/localization/locaizationMain";
import { SearchQR } from "./components/CustomIcons/MainPageIcons";
import IsoBarcodeCheck from "./screen/iso/BarcodeCheck";
import Home from "./screen/home";
import OperationMenu from "../OperationMenu";
import { useAccountService } from "./contexts/AccountService";
import { useRoute } from "@react-navigation/native";

const TabNavigation = () => {
    const Tab = createBottomTabNavigator();
    const transformY = useSharedValue(POPUP_WIDTH);
    const scurrentSceneValue = useSharedValue(1);
    const [currentScene, setCurrentScene] = useState(1);
    const [selectedProcess, setSeletedProcess] = useState(false);
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

    const OperationComponent = () => {
        return null
    }

    const CustomTabBarButton: React.FC<any> = () => {
        return (
            <TouchableOpacity style={styles.tab}>
                <Animated.Image
                    source={require("../assets/processicon.png")}
                    style={[
                        {
                            height: 21,
                            width: 22,
                            resizeMode: "contain",
                        },
                        Platform.OS === "web" && { resizeMode: "center" },
                        // You can add additional styles here if needed
                    ]}
                />
                <Animated.Text style={[styles.tabTitle, animateHomeIconColorStyle]}>
                    {translate("tabbar.processBtnTxt")}
                </Animated.Text>
            </TouchableOpacity>
        );
    };

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused }) =>
                    (
                        <View style={styles.tab}>
                            <Animated.Image
                                source={require("../assets/homeicon.png")}
                                style={[
                                    {
                                        width: 21,
                                        height: 21,
                                        tintColor: focused ? ACTIVE_COLOR : PASSIVE_COLOR,
                                    },
                                ]}
                            />
                            <Animated.Text style={[styles.tabTitle, { color: focused ? ACTIVE_COLOR : PASSIVE_COLOR }]}>
                                {translate("tabbar.home")}
                            </Animated.Text>
                        </View>
                    )
                }}
            />
            <Tab.Screen
                name="Search"
                component={IsoBarcodeCheck}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused }) =>
                    (
                        <View
                            style={styles.FABButton}
                        >
                            <SearchQR />
                        </View>
                    )
                }}
            />
            <Tab.Screen
                name="Operation"
                component={OperationComponent}
                options={(props) => ({
                    tabBarButton: (props) => (<OperationMenu {...props} />),
                    tabBarShowLabel: false,
                })}
            />
        </Tab.Navigator>
    )
}

export default TabNavigation

const POPUP_WIDTH = Platform.OS === "web" ? 650 : 600;
const { width, height } = Dimensions.get("window");
const ACTIVE_COLOR = "#FF8600";
const PASSIVE_COLOR = "#c7c7c7";
const FAB_BUTTON_WIDTH = 60;

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
