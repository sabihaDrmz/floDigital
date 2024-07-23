import React, { Component } from "react";
import { Dimensions, Image, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, { Easing, timing, useCode } from "react-native-reanimated";
import { Actions } from "react-native-router-flux";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";

const { width, height } = Dimensions.get("window");
const ACTIVE_COLOR = "#FF8600";
const PASSIVE_COLOR = "#7D7E81";
const FAB_BUTTON_WIDTH = 60;
const POPUP_WIDTH = 355;

class TabBar extends Component<any> {
  state = { currentScene: 1 };

  constructor(props: any) {
    super(props);

    this.setState({ currentScene: 1 });
  }

  isHomePage = () => this.state.currentScene === 1;
  isBarcodeSearch = () => this.state.currentScene === 2;

  navigateTo = (scene: string, st: number) => {
    Actions[scene]();
    this.setState({ currentScene: st });
  };

  transformY = new Animated.Value(width - 75);
  startPos: number = 0;

  openMenu = () => {
    timing(this.transformY, {
      toValue: -30,
      duration: 300,
      easing: Easing.circle,
    }).start();
  };

  render() {
    return (
      <View style={{ backgroundColor: "#fff" }}>
        <Animated.View
          style={[
            styles.popupMenu,
            {
              transform: [{ translateY: this.transformY }],
              opacity: 1,
            },
          ]}
        >
          <PanGestureHandler>
            <View
              style={{
                height: 44,
                backgroundColor: "#FF8600",
                borderRadius: 20,
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#fff",
                  fontFamily: "Poppins_400Regular",
                }}
              >
                İŞLEMLER
              </Text>
              <Image
                source={require("../../assets/processicon.png")}
                style={{
                  width: 21,
                  height: 21,
                  tintColor: "#fff",
                }}
              />
            </View>
          </PanGestureHandler>

          <View style={{ backgroundColor: "#fff" }}>
            <Text>asd</Text>
          </View>
        </Animated.View>
        <View style={styles.container}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => this.navigateTo("scTbHome", 1)}
            >
              <Image
                source={require("../../assets/homeicon.png")}
                style={{
                  width: 21,
                  height: 21,
                  tintColor:
                    this.state.currentScene === 1
                      ? ACTIVE_COLOR
                      : PASSIVE_COLOR,
                }}
              />
              <Text
                style={[
                  styles.tabTitle,
                  {
                    color:
                      this.state.currentScene === 1
                        ? ACTIVE_COLOR
                        : PASSIVE_COLOR,
                  },
                ]}
              >
                HOME
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.FABButton}
              onPress={() => this.navigateTo("scTbFindBarcode", 2)}
            >
              <Image
                source={require("../../assets/searchico.png")}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: "#fff",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => this.openMenu()}
            >
              <Image
                source={require("../../assets/processicon.png")}
                style={{
                  width: 21,
                  height: 21,
                }}
              />
              <Text style={[styles.tabTitle]}>İŞLEMLER</Text>
            </TouchableOpacity>
          </View>
          <SafeAreaView />
        </View>
      </View>
    );
  }
}
export default TabBar;

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
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
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
  },
  popupMenu: {
    width: width - 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
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
    bottom: 40,
  },
});
