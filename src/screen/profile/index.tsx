import { useNavigation, DrawerActions } from "@react-navigation/native";
import { ProfilePictureBox } from "../../components/CustomIcons/MainPageIcons";
import { VersionInfo } from "../../constant/ApplicationVersionInfo";
import { useAccountService } from "../../contexts/AccountService";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import moment from "moment";
import {
    Platform,
    ScrollView,
    TouchableOpacity,
    View,
    Image,
    Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import { FontAwesome } from "../../../src/components";

const Profile = () => {
    const { employeeInfo, logout } = useAccountService();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

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
        <View
            style={{
                backgroundColor: colors.brightOrange,
                flex: 1,
                paddingHorizontal: 20,
                paddingBottom: insets.bottom + 10,
                paddingTop: insets.top + 10,
            }}
        >
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
                            source={require("../../assets/profile_image_default.png")}
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
                        {employeeInfo?.FirstName}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                >
                    <FontAwesome name="arrow-left" color={"#fff"} size={25} />
                </TouchableOpacity>
            </View>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <Info
                    style={{ marginTop: 30 }}
                    title={translate("profileDetailScreen.birthDay")}
                    value={
                        employeeInfo?.JobStartDate
                            ? moment(employeeInfo.BirthDate).format("DD/MM/yyyy")
                            : ""
                    }
                />
                <Info
                    title={translate("profileDetailScreen.email")}
                    value={employeeInfo?.Email}
                />
                <Info
                    title={translate("profileDetailScreen.efficiencyRecord")}
                    value={employeeInfo?.EfficiencyRecord}
                />
                <Info
                    title={translate("profileDetailScreen.department")}
                    value={employeeInfo?.DepartmentName}
                />
                <Info
                    title={translate("profileDetailScreen.position")}
                    value={employeeInfo?.PositionName}
                />
                <Info
                    title={translate("profileDetailScreen.expenseCentre")}
                    value={employeeInfo?.ExpenseLocationCode}
                />
                <Info
                    title={translate("profileDetailScreen.expenseCentreName")}
                    value={employeeInfo?.ExpenseLocationName}
                />
                <Info
                    title={translate("profileDetailScreen.jobStartDate")}
                    value={
                        employeeInfo?.JobStartDate
                            ? moment(employeeInfo.JobStartDate).format("DD/MM/YYYY")
                            : ""
                    }
                />
            </ScrollView>
            <View style={{ height: 80 }} />
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    logout();
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
                    <FontAwesome name={"power-off"} color={"#8c8e90"} size={25} />
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
        </View>
    )
}

export default Profile
