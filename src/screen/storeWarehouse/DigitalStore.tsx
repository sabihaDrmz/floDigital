import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    InteractionManager,
    Dimensions,
    Platform,
    TouchableOpacity
} from "react-native";
import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { translate } from "../../helper/localization/locaizationMain";
import { PerfectFontSize, PerfectPixelSize } from "../../helper/PerfectPixel";
import { useNavigation } from "@react-navigation/native";
interface DigitalStoreProps {

}

const DigitalStore: React.FC<DigitalStoreProps> = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back"]}
                headerTitle={translate("warehouseRequest.digitalStore")}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", margin: Platform.OS === "web" ? 40 : 10 }}>
                <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('StoreWarehouse', { screen: 'SalesRepresentativeScreen' })}>
                    <Image source={require("../../../assets/talep_takip.png")} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseRayonDevice' })}>
                    <Image source={require("../../../assets/cihaz_tanimlama.png")} style={styles.image} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default DigitalStore;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    box: {
        backgroundColor: "#fff",
        padding: 20,
        margin: 20,
        shadowColor: AppColor.OMS.Background.Dark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
        width: Dimensions.get("screen").width / 2 - 40,
        maxWidth: 600,
    },
    image: {
        width: PerfectPixelSize(100),
        height: PerfectPixelSize(100),
        resizeMode: "contain"
    },
    text: {
        fontFamily: "Poppins_600SemiBold",
        marginTop: 20,
        fontSize: PerfectFontSize(15),
        fontWeight: "bold",
        textAlign: "center",
    }
});