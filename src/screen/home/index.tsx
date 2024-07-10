import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Keyboard,
    Platform,
    TouchableWithoutFeedback,
    TouchableOpacity
} from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { AppText } from "@flomagazacilik/flo-digital-components";
import {
    PerfectFontSize,
    PerfectPixelSize,
} from "../../helper/PerfectPixel";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import {
    CrmIcon,
    LinksIcon,
    PrinterIcon,
    ProfilePictureBox,
} from "../../components/CustomIcons/MainPageIcons";
import { translate } from "../../helper/localization/locaizationMain";
import EventsearchComponent from "../../components/EventSearchComponent";
import OmsIcon from "../../components/CustomIcons/OmsIcon";
import FullScreenImage from "../../components/FullScreenImage";
import FloLoading from "../../components/FloLoading";
import { useAccountService } from "../../contexts/AccountService";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { useApplicationGlobalService } from "../../contexts/ApplicationGlobalService";
import { useNavigation } from "@react-navigation/native";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import { usePrinterConfigService } from "../../contexts/PrinterConfigService";


const { width, height } = Dimensions.get("window");
const PADDING_TOTAL = Platform.OS === "android" ? 50 : 50;
const BOX_WIDTH = PerfectPixelSize((width - 2) / 2) - PADDING_TOTAL;
const BOX_HEIGHT = Platform.OS === "ios" ? 130 : 100;
const BOX_PB = Platform.OS === "ios" ? 12 : 5;
interface TabMainProps {
}

export enum PrinterType {
    PATHFINDER,
    MERTECH,
    ZEBRA
}

const Home: React.FC<TabMainProps> = (props) => {
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const { isInRole, employeeInfo, testMode, changeTestMode } = useAccountService();
    const {setPrinterType} = usePrinterConfigService()
    const navigation = useNavigation();
    const { show } = useMessageBoxService();
    const { isLoading } = useApplicationGlobalService();
    const { getUserStoreId } = useAccountService();
    const { allStore } = useApplicationGlobalService();
    const store = allStore.find(
      (x) => x.werks === getUserStoreId()
    );

    return (
        <View style={styles.hardContainer}>
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
                            {employeeInfo?.FirstName}
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
                                onPress={() => changeTestMode(!testMode)}
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
                                        alignItems: testMode ? "flex-end" : "flex-start",
                                        backgroundColor: testMode
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
                <EventsearchComponent
                    onFocus={() => setIsShowKeyboard(true)}
                    onBlur={() => setIsShowKeyboard(false)}
                />
            </DismissKeyboardView>
            {!isShowKeyboard && (
                <View style={styles.container}>
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
                            onPress={() =>
                                navigation.navigate('Oms', { screen: 'OmsMain', params: { tab: 0 } })
                            }
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
                            onPress={() => navigation.navigate("Link")}
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
                            onPress={() => navigation.navigate("Crm")}
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
                                    ? show(
                                        "Yazıcı ayarları web ekranında kullanılamaz"
                                    ) :
                                    getUserStoreId() === "8801" || store?.country === "RU" ? (
                                        show("Kullanıcağınız cihazı seçiniz",{
                                            type: MessageBoxType.YesNo,
                                            yesButtonTitle: "Mertech",
                                            noButtonTitle: "Pathfinder",
                                            yesButtonEvent: () => {
                                                setPrinterType(PrinterType.MERTECH)
                                             //@ts-ignore
                                              navigation.navigate("Printer", { screen: "PrinterScreen",params:{page:PrinterType.MERTECH}})
                                            },
                                            noButtonEvent: () => {
                                             setPrinterType(PrinterType.PATHFINDER)
                                             //@ts-ignore
                                              navigation.navigate("Printer", { screen: "PrinterScreen",params:{page:PrinterType.PATHFINDER}})

                                            }
                                          })
                                             //@ts-ignore
                                    ) :  navigation.navigate("Printer", { screen: "PrinterScreen" })


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
                    </View>
                </View>
            )}

            <FullScreenImage />
            {isLoading && <FloLoading />}
        </View>
    );
};
export default Home;

const styles = StyleSheet.create({
    hardContainer: {
        flex: 1,
    },
    boxBottomTitleStyle: { position: "absolute", bottom: BOX_PB },
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
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
