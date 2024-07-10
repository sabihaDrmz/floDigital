import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useState, useRef} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import LinearGradient from "../../components/LinearGradient";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountService from "../../core/services/AccountService";
import { appIntroKey } from "../../core/StorageKeys";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectPixelSize } from "../../helper/PerfectPixel";
import { LabelText, LabelTextType, ParagraphText } from "../../NewComponents";

const { width, height } = Dimensions.get("window");
const INTRO = [
  {
    image: require("../../../assets/slide1.png"),
    title1: translate("intro.intro1.title1"),
    title2: translate("intro.intro1.title2"),
    description: translate("intro.intro1.description"),
  },
  {
    image: require("../../../assets/slide2.png"),
    title1: translate("intro.intro2.title1"),
    title2: translate("intro.intro2.title2"),
    description: translate("intro.intro2.description"),
  },
  {
    image: require("../../../assets/slide3.png"),
    title1: translate("intro.intro3.title1"),
    title2: translate("intro.intro3.title2"),
    description: translate("intro.intro3.description"),
  },
];
const MAX_PAGE = INTRO.length;
const IntroScreen = (props: any) => {
  const scrollPos = useSharedValue(0);
  const currentPage = useSharedValue(1);
  const [page, setPage] = useState(1);
  const scrollAnimatedEvent = useAnimatedScrollHandler({
    onBeginDrag: (evt, ctx: any) => {},
    onScroll: (evt, ctx: any) => {
      scrollPos.value = evt.contentOffset.x;
      runOnJS(setPage)(parseInt((scrollPos.value / width).toFixed(0)));
    },
    onEndDrag: (evt, ctx: any) => {},
  });

  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const onComplete = () => {
    AsyncStorage.setItem(appIntroKey, "ok").then(() =>
      AccountService.restore()
    );
    // Actions.replace('mainStack');
  };

  const onNextPage = () => {
    var curPage = parseInt((scrollPos.value / width).toFixed(0));

    if (scrollViewRef.current !== undefined && curPage + 1 < MAX_PAGE) {
      scrollPos.value = withTiming(width * (curPage + 1));
      scrollViewRef.current?.scrollTo({
        x: width * (curPage + 1),
        animated: true,
      });
    }
  };

  const circleAnimation = useAnimatedStyle(() => {
    const half = width / 2;
    let inputRange: any[] = [];
    let outputRange: any[] = [];
    let posInputRange: any[] = [];
    let posOutpuRange: any[] = [];

    for (var i = 0; i < MAX_PAGE; i++) {
      let diff = width * i;
      inputRange = [...inputRange, ...[diff, diff + width / 2, diff + width]];
      outputRange = [...outputRange, ...[18, 36, 18]];
      posInputRange = [...posInputRange, ...[diff, diff + width]];
      posOutpuRange = [...posOutpuRange, ...[i * 28, 28 * i + 28]];
    }

    const cwidth = interpolate(
      scrollPos.value,
      inputRange,
      outputRange,
      Extrapolate.CLAMP
    );

    const cleft = interpolate(
      scrollPos.value,
      posInputRange,
      posOutpuRange,
      Extrapolate.CLAMP
    );

    return {
      width: cwidth,
      left: cleft,
    };
  });

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.wrapper}>
        <Image
          source={require("../../../assets/flodigitallogo.png")}
          style={{ marginTop: 40, marginBottom: 10 }}
        />

        <Animated.ScrollView
          ref={scrollViewRef}
          scrollEventThrottle={16}
          onScroll={scrollAnimatedEvent}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {INTRO.map((item, index) => {
            return (
              <Animated.View
                style={[
                  { width, alignItems: "center" },
                  useAnimatedStyle(() => {
                    let opacity = interpolate(
                      scrollPos.value,
                      [(index - 1) * width, index * width, width * (index + 1)],
                      [-1, 1, -1]
                    );
                    return { opacity };
                  }),
                ]}
              >
                <Image
                  source={item.image}
                  style={[
                    {
                      width: PerfectPixelSize(
                        Platform.OS === "android" ? 250 : 350
                      ),
                      height: PerfectPixelSize(
                        Platform.OS === "android" ? 240 : 340
                      ),
                      marginBottom: PerfectPixelSize(10),
                      resizeMode: "contain",
                    },
                  ]}
                />
                <LabelText
                  type={LabelTextType.L}
                  style={{
                    color: "#FF8600",
                  }}
                >
                  {item.title1}
                </LabelText>
                <LabelText
                  type={LabelTextType.L}
                  style={{
                    color: "#7D7E81",
                    marginBottom: PerfectPixelSize(15),
                  }}
                >
                  {item.title2}
                </LabelText>
                <ParagraphText
                  style={{
                    color: "#7D7E81",
                    textAlign: "center",
                  }}
                >
                  {item.description}
                </ParagraphText>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.circleContainer}>
          <View style={styles.circle} />
          <View style={styles.circle} />
          <View style={styles.circle} />
          <Animated.View
            style={[
              {
                position: "absolute",
                height: 18,
                borderRadius: 9,
                backgroundColor: "#FC8401",
                marginRight: 10,
              },
              circleAnimation,
            ]}
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              page >= MAX_PAGE - 1 ? onComplete() : onNextPage();
            }}
          >
            <LinearGradient
              style={{
                borderRadius: PerfectPixelSize(23),
                flex: 1,
                alignItems: "flex-end",
                justifyContent: "center",
                paddingRight: PerfectPixelSize(20),
              }}
              colors={["#FF8600", "#FF671C"]}
            >
              <LabelText
                type={LabelTextType.M}
                style={{
                  color: "#fff",
                }}
              >
                {page >= MAX_PAGE - 1
                  ? translate("intro.complete")
                  : translate("intro.next")}
              </LabelText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <SafeAreaView />
    </View>
  );
};
export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingLeft: PerfectPixelSize(30),
    paddingRight: PerfectPixelSize(30),
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "android" ? PerfectPixelSize(40) : 0,
  },
  circleContainer: {
    flexDirection: "row",
  },
  circle: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderRadius: 9,
    borderColor: "#FC8401",
    marginRight: 10,
  },
  button: {
    width: PerfectPixelSize(154),
    height: PerfectPixelSize(50),
    borderRadius: PerfectPixelSize(23),
  },
});
