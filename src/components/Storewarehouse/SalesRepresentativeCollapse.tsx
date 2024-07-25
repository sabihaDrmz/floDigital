import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import { PerfectFontSize, PerfectPixelSize } from "../../../src/helper/PerfectPixel";
import { useApplicationGlobalService } from "../../../src/contexts/ApplicationGlobalService";
import { WarehouseRequestGroupReponseModel } from "../../contexts/model/WarehouseRequestGroupReponseModel";
import moment from "moment";

interface componentNameProps {
    item: WarehouseRequestGroupReponseModel;
}

const orangeColor = "#ff8800";
const imageWindowColor = "#adadad";

const componentName: React.FC<componentNameProps> = (props) => {
    const [isSelected, setIsSelected] = useState(false);
    const ApplicationGlobalService = useApplicationGlobalService();

    const getStatus = (statusId: number) => {
        var res = "";
        switch (statusId) {
            case 0:
                res = "Beklemede";
                break;
            case 1:
                res = "İşleme Alındı";
                break;
            case 2:
                res = "Tamamlandı";
                break;
            case 3:
                res = "Reddedildi";
                break;
            default:
                res = "Beklemede";
                break;
        }
        return res;
    }

    const RenderDetails = () => {
        return (
            <View
                style={{
                    backgroundColor: "#fff",
                    shadowColor: AppColor.OMS.Background.Dark,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10
                }}
            >
                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <View style={styles.topSquare}>
                        <AppText style={{ color: orangeColor, fontFamily: "Poppins_500Medium", fontSize: PerfectFontSize(12) }}>Cihaz Adı</AppText>
                        <AppText style={{ color: orangeColor, fontFamily: "Poppins_500Medium", fontSize: PerfectFontSize(12) }}>{props.item.warehouseRequests[0].requestPersonName}</AppText>
                    </View>
                    <View style={styles.topSquare}>
                        <AppText style={{ color: orangeColor, fontFamily: "Poppins_500Medium", fontSize: PerfectFontSize(12) }}>Reyon Adı</AppText>
                        <AppText style={{ color: orangeColor, fontFamily: "Poppins_500Medium", fontSize: PerfectFontSize(12) }}>{props.item.warehouseRequests[0].unitQr}</AppText>
                    </View>
                    <View style={styles.topSquare}>
                        <AppText style={{ color: orangeColor, fontFamily: "Poppins_500Medium", fontSize: PerfectFontSize(12) }}>Tarih</AppText>
                        <AppText style={{ color: orangeColor, fontFamily: "Poppins_500Medium", fontSize: PerfectFontSize(12) }}>{moment(props.item.warehouseRequests[0].createDate).format("DD.MM.YYYY HH:mm")}</AppText>
                    </View>
                </View>

                <ScrollView>
                    {props.item.warehouseRequests.map((item, index) => (
                        <View
                            style={{
                                borderBottomColor: "#cecece",
                                borderBottomWidth: 1,
                                marginHorizontal: 20,
                                padding: 10
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() =>
                                        ApplicationGlobalService.showFullScreenImage(`https://www.flo.com.tr/V1/product/image?sku=${parseInt(item.sku)}`)
                                        // ApplicationGlobalService.showFullScreenImage("https://www.flo.com.tr/V1/product/image?sku=101399915")
                                    }
                                >
                                    <Image
                                        // source={{ uri: "https://www.flo.com.tr/V1/product/image?sku=101399915" }}
                                        source={{ uri: `https://www.flo.com.tr/V1/product/image?sku=${parseInt(item.sku)}` }}
                                        style={{
                                            width: PerfectPixelSize(80),
                                            height: PerfectPixelSize(80),
                                            borderRadius: 14,
                                            borderColor: imageWindowColor,
                                            borderWidth: 3,
                                        }}
                                        resizeMode="center"
                                    />
                                </TouchableOpacity>
                                <View style={{ flex: 2, marginHorizontal: 20 }}>
                                    <AppText
                                        style={{
                                            fontSize: PerfectFontSize(13),
                                            fontFamily: "Poppins_400Regular",
                                        }}
                                        selectable
                                    >
                                        {item.barcode}
                                    </AppText>
                                    <AppText
                                        style={{
                                            fontSize: PerfectFontSize(13),
                                            fontFamily: "Poppins_500Medium",
                                            color: "#000"
                                        }}
                                        selectable
                                    >
                                        {item.model}
                                    </AppText>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <AppText style={{
                                                fontSize: PerfectFontSize(13),
                                                fontFamily: "Poppins_500Medium",
                                            }}>
                                                Renk:
                                            </AppText>
                                            <AppText
                                                style={{
                                                    color: "#000",
                                                    fontSize: PerfectFontSize(13),
                                                    fontFamily: "Poppins_500Medium",
                                                    marginLeft: 5
                                                }}
                                            >
                                                {item.color}
                                            </AppText>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginHorizontal: 10 }}>
                                            <AppText style={{
                                                fontSize: PerfectFontSize(13),
                                                fontFamily: "Poppins_500Medium",
                                            }}>
                                                Beden:
                                            </AppText>
                                            <AppText
                                                style={{
                                                    color: "#000",
                                                    fontSize: PerfectFontSize(13),
                                                    fontFamily: "Poppins_500Medium",
                                                    marginLeft: 5
                                                }}
                                            >
                                                {item.size}
                                            </AppText>
                                        </View>
                                    </View>
                                    <AppText style={{ flexDirection: "row", color: orangeColor, fontFamily: "Poppins_500Medium", fontSize: PerfectFontSize(13) }}>
                                        Durum: <AppText style={{ color: orangeColor, fontFamily: "Poppins_400Regular", fontSize: PerfectFontSize(13) }}>{getStatus(item.status)}</AppText>
                                    </AppText>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{
                    padding: 15,
                    backgroundColor: isSelected ? orangeColor : "#fff",
                    borderRadius: 10,
                    borderBottomLeftRadius: isSelected ? 0 : 10,
                    borderBottomRightRadius: isSelected ? 0 : 10,
                    shadowColor: AppColor.OMS.Background.Dark,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
                onPress={() => setIsSelected(!isSelected)}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <AppText style={{ color: isSelected ? "#fff" : "#000", fontFamily: "Poppins_600SemiBold", fontSize: PerfectFontSize(16) }}>
                        Sepet No : {props.item.basketKey}
                    </AppText>
                    <FontAwesomeIcon
                        icon={isSelected ? "caretup" : "caretdown"}
                        size={24}
                        color={isSelected ? "#fff" : orangeColor}
                    />
                </View>
            </TouchableOpacity>
            {isSelected && <RenderDetails />}
        </View>
    )
}
export default componentName;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 5
    },
    topSquare: {
        flex: 1,
        alignItems: "center",
        borderWidth: 1,
        borderColor: orangeColor,
        paddingVertical: 5,

    }
});
