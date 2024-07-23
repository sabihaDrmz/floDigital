import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    Platform,
    SafeAreaView
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
import { translate } from "../../helper/localization/locaizationMain";
import { useAccountService } from "../../contexts/AccountService";
import { PerfectPixelSize } from "../../helper/PerfectPixel";
import {
    LabelText,
    LabelTextType,
    ParagraphText,
} from "../../../src/NewComponents";

const { width } = Dimensions.get("window");
const INTRO = [
    {
        image: require("../../assets/slide1.png"),
        title1: translate("intro.intro1.title1"),
        title2: translate("intro.intro1.title2"),
        description: translate("intro.intro1.description"),
    },
    {
        image: require("../../assets/slide2.png"),
        title1: translate("intro.intro2.title1"),
        title2: translate("intro.intro2.title2"),
        description: translate("intro.intro2.description"),
    },
    {
        image: require("../../assets/slide3.png"),
        title1: translate("intro.intro3.title1"),
        title2: translate("intro.intro3.title2"),
        description: translate("intro.intro3.description"),
    },
];
const MAX_PAGE = INTRO.length;
const Intro = () => {
    const scrollPos = useSharedValue(0);
    const [page, setPage] = useState(1);
    const { completeIntro } = useAccountService();
    const scrollAnimatedEvent = useAnimatedScrollHandler({
        onBeginDrag: (evt, ctx: any) => { },
        onScroll: (evt, ctx: any) => {
            scrollPos.value = evt.contentOffset.x;
            runOnJS(setPage)(parseInt((scrollPos.value / width).toFixed(0)));
        },
        onEndDrag: (evt, ctx: any) => { },
    });

    const scrollViewRef = useRef<Animated.ScrollView>(null);
    useEffect(() => {
        onComplete();
    }, []);

    const onComplete = () => {
        completeIntro();
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
        let inputRange: any[] = [],
            outputRange: any[] = [],
            posInputRange: any[] = [],
            posOutpuRange: any[] = [];

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
        ),
            cleft = interpolate(
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
        <SafeAreaView style={styles.container}>

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
        </SafeAreaView>
    );
};
export default Intro;

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
