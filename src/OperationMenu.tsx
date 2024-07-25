
import { PerfectFontSize } from "./helper/PerfectPixel";
import Modal from 'react-native-modal';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    Platform,
    ScrollView,
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Animated from "react-native-reanimated";
import React, { useState, useEffect } from "react";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { useAccountService } from "./contexts/AccountService";
import { translate } from "./helper/localization/locaizationMain";
import { BrokenProductIcon } from "./components/CustomIcons/BrokenProductIcon";
import {
    CancelOrderIcon,
    ReturnOrderIcon,
    SearchQR,
} from "./components/CustomIcons/MainPageIcons";
import { AppText } from "@flomagazacilik/flo-digital-components";
import { useApplicationGlobalService } from "./contexts/ApplicationGlobalService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { accountInfoKey, salesOrgKey } from "./core/StorageKeys";
import { NavigationType } from "./StackNavigator";
const OperationMenu = () => {
    const navigation = useNavigation<NavigationType>()
    const [modalVisible, setModalVisible] = useState(false);
    const user = useAccountService();
    const ApplicationGlobalService = useApplicationGlobalService();
    const allStores = ApplicationGlobalService.allStore;
    const [salesOrg, setSalesOrg] = useState("");
    const [scrolling, setScrolling] = useState(false);
    const [accountInfo, setAccountInfo] = useState("")
    const isFocused = useIsFocused()
    const completionShortageOrganizations = ["3011", "6116", "3112", "3111", "3122","3121","3114","3014","3017","3018","3012","3161","3162","3164","3171","3172","3131","3132","3151","3152"]

    const store = allStores.find(
      (x) => x.werks === user.getUserStoreId()
    );
    useEffect(() => {
        getSalesOrganization();
    }, [allStores])

    const getOrg = async () => {
        const orgJson = await AsyncStorage.getItem("organizationCode")
        let org;
        if(orgJson){
          org = JSON.parse(orgJson)
        }
        setAccountInfo(org)
    }
    useEffect(() => {
        getOrg()
    }, [isFocused])

    const getSalesOrganization = async () => {
        const salesOrg = await AsyncStorage.getItem(salesOrgKey)
        if (salesOrg) setSalesOrg(JSON.parse(salesOrg));
    }


    const SelfCheckOutIcon = () => {
        return (
            <Image
                source={require("./assets/selfCheckIcon1.png")}
                style={{ width: 47, height: 46, resizeMode: "contain" }}
            />
        )
    }

    const DigitalStoreIcon = () => {
        return (
            <Image
                source={require("./assets/dijital_magaza.png")}
                style={{ width: 47, height: 46, resizeMode: "contain" }}
            />
        )
    }

    const processMenuItem = (
        title: string,
        navigate: () => void,
        icon: any,
        role: boolean
    ) => {
        if (!role) return null;
        return (
            <>
                <TouchableOpacity
                    onPress={() => {
                        navigate();
                        setModalVisible(false)
                    }}
                    activeOpacity={0.7}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginVertical: 5,
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
                    <FontAwesomeIcon icon={"right"} size={17} color={"#7D7E81"} />
                </TouchableOpacity>
                <View
                    style={{
                        borderBottomWidth: 0.3,
                        borderColor: "rgba(0,0,0,0.3)",
                    }}
                />
            </>
        );
    };

    // const getSalesOrg = async () => {
    //     const code = await AsyncStorage.getItem('organizationCode')
    //     return code === "3011" || code === "6116"
    // }

    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.tab}>
                <Animated.Image
                    source={require("./assets/processicon.png")}
                    style={[
                        {
                            height: 21,
                            width: 22,
                            resizeMode: "contain",
                            tintColor: PASSIVE_COLOR
                        },
                        Platform.OS === "web" && { resizeMode: "center" },
                    ]}
                />
                <Animated.Text style={[styles.tabTitle]}>
                    {translate("tabbar.processBtnTxt")}
                </Animated.Text>
            </TouchableOpacity>

            <Modal
                backdropOpacity={0}
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                style={styles.contentView}
            >
                <View style={styles.content}>
                    <View style={{ height: height / 1.75, width: width - 10 }}>
                        <TouchableOpacity
                            disabled={scrolling}
                            activeOpacity={0.9}
                            onPress={() => setModalVisible(false)}
                            style={{
                                height: 40,
                                backgroundColor: "#FF8600",
                                borderRadius: 15,
                                justifyContent: "space-between",
                                flexDirection: "row",
                                alignItems: "center",
                                paddingHorizontal: 15,
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
                                source={require("./assets/img/ui/closeIcon.png")}
                                style={{
                                    height: 21,
                                    width: 20,
                                    tintColor: "#fff",
                                }}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                backgroundColor: "#fff",
                                padding: 10,
                            }}
                        >
                            <ScrollView onScrollBeginDrag={() => setScrolling(true)}
                                onScrollEndDrag={() => setScrolling(false)} contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }} showsVerticalScrollIndicator={false} scrollEnabled={true}>
                                {processMenuItem(
                                    "İptal İşlemleri",
                                    //@ts-ignore
                                    () => navigation.navigate("Ides", { screen: "CancellationScreen" }),
                                    <CancelOrderIcon />,
                                    user.isInRole("omc-easy-return-cancel"),
                                )}
                                {processMenuItem(
                                    "Belge Yazdırma",
                                    //@ts-ignore
                                    () => navigation.navigate("Ides", { screen: "ListAuiDocScreen" }),
                                    <ReturnOrderIcon />,
                                    user.isInRole("omc-easy-return-cancel") && Platform.OS === "web"
                                )}
                                {processMenuItem(
                                    "İDES",
                                    //@ts-ignore
                                    () => navigation.navigate("Ides", { screen: "FindFiche" }),
                                    <BrokenProductIcon />,
                                    user.isInRole("omc-easy-return-ides")
                                )}
                                {processMenuItem(
                                    "Raporlar",
                                    //@ts-ignore
                                    () => navigation.navigate("PowerBi", { screen: "ReportList" }),
                                    <BrokenProductIcon />,
                                    user.isInRole("omc-rapor"),
                                )}
                                {processMenuItem(
                                    "Depo Adresleme",
                                    //@ts-ignore
                                    () => navigation.navigate("StoreWarehouse", { screen: "StoreWarehouseNavigationList" }),
                                    <BrokenProductIcon />,
                                    user.isInRole("omc-depo"),
                                )}
                                {processMenuItem(
                                    "Mobil App İle Ödeme",
                                    //@ts-ignore
                                    () => navigation.navigate("SelfCheckout"),
                                    <SelfCheckOutIcon />,
                                    user.isInRole("omc-self-check-out")
                                )}
                                {processMenuItem(
                                    translate("completionOfSalesShortageMainScreen.title"),
                                    //@ts-ignore
                                    () => navigation.navigate("Completionofsalesshortage"),
                                    <BrokenProductIcon />,
                                    completionShortageOrganizations.includes(accountInfo?.toString())
                                )}
                                {processMenuItem(
                                    translate("warehouseRequest.digitalStore"),
                                    //@ts-ignore
                                    () => navigation.navigate("StoreWarehouse", { screen: "DigitalStore" }),
                                    <DigitalStoreIcon />,
                                    user.getUserStoreId() === "6513"
                                )}
                                {processMenuItem(
                                    "Rusya Qr",
                                    //@ts-ignore
                                    () => navigation.navigate("Iso", { screen: "RussiaQr" }),
                                    <CancelOrderIcon />,
                                    user.getUserStoreId() === "8801" || store?.country === "RU" ,
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}
export default OperationMenu
const { width, height } = Dimensions.get("window");
const POPUP_WIDTH = Platform.OS === "web" ? 650 : 600;
const ACTIVE_COLOR = "#FF8600";
const PASSIVE_COLOR = "#c7c7c7";
const FAB_BUTTON_WIDTH = 60;

const styles = StyleSheet.create({
    container: {
        borderTopColor: "rgba(0,0,0,0.104)",
        borderTopWidth: 1,
        backgroundColor: "red",
        zIndex: -9999,
        elevation: 17,
    },
    tabContainer: {
        minHeight: 48,
        flexDirection: "row",
    },
    tab: {
        width: width / 3,
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
    content: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 17,
        borderTopLeftRadius: 17,
        position: 'absolute',
        bottom: 0,
        height: height / 1.75,
        right: 0,
        left: 0,
        width: width,
        zIndex: -999
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    contentView: {
        justifyContent: 'flex-end',
        margin: 0,
    },
});
