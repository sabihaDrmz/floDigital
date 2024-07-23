import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native"
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import FloComboBox from "../../components/FloComobox";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { useStoreWarehouseService } from "../../contexts/StoreWarehoseService";
import { PerfectPixelSize } from "../../helper/PerfectPixel";
import MainCamera from "../../components/MainCamera";
import { FloButton } from "../../components";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import { ColorType } from "@flomagazacilik/flo-digital-components";
import { useNavigation } from "@react-navigation/native";
import { translate } from "../../helper/localization/locaizationMain";

const { width, height } = Dimensions.get("window");

const StoreWarehouseDeleteProduct = ({ }: any) => {
    const navigation = useNavigation;
    const { getListForStoreWarehouse, deleteProductsFromUnit, deleteProductsFromWh, storeWarehouseList } = useStoreWarehouseService();
    const { show } = useMessageBoxService();

    const [selectedWarehose, setSelectedWarehouse] = useState<string>('');
    const [isUnitCameraShow, setIsUnitCameraShow] = useState<boolean>(false);
    const [whLabel, setWhLabel] = useState<string>('')

    useEffect(() => {
        getListForStoreWarehouse();
    }, [])

    const removeUnitAlert = () => {
        show(
            `${translate("storeWarehouse.allProductsUnitDeleted")}`,
            {
                type: MessageBoxType.YesNo,
                yesButtonColorType: ColorType.Danger,
                noButtonColorType: ColorType.Brand,
                yesButtonEvent: () => {
                    removeUnit()
                },
                noButtonTitle: `${translate("storeWarehouse.cancel")}`,
                yesButtonTitle: `${translate("storeWarehouse.confirm")}`
            }
        );
    }

    const removeUnit = () => {
        deleteProductsFromUnit(selectedWarehose, whLabel);
        setSelectedWarehouse('');
        setWhLabel('');
    }

    const removeWarehouseAlert = () => {
        show(
            `${translate("storeWarehouse.allProductsWarehouseDeleted")}`,
            {
                type: MessageBoxType.YesNo,
                yesButtonColorType: ColorType.Danger,
                noButtonColorType: ColorType.Brand,
                yesButtonEvent: () => {
                    removeWarehouse()
                },
                noButtonTitle: `${translate("storeWarehouse.cancel")}`,
                yesButtonTitle: `${translate("storeWarehouse.confirm")}`
            }
        );
    }

    const removeWarehouse = () => {
        deleteProductsFromWh(selectedWarehose);
        setSelectedWarehouse('');
        setWhLabel('');
    }

    return (
        <View style={styles.container}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back"]}
                headerTitle={translate("storeWarehouse.removeProductFromWarehouse")}
            />
            <View style={{
                marginHorizontal: 10, backgroundColor: '#fff', marginTop: 43, padding: 12, shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
            }}>
                <FloComboBox
                    data={storeWarehouseList}
                    keyProp="id"
                    valueProp="code"
                    selectedItem={storeWarehouseList.find(
                        (x) => x.id === selectedWarehose
                    )}
                    onSelectItem={(item) => {
                        setSelectedWarehouse(item.id)
                    }}
                    placeholder={translate("storeWarehouse.selectWarehouse")}
                    containerStyle={{
                        borderColor: "rgb(206,202,202)",
                        backgroundColor: "#fff",
                        marginTop: 10,
                    }}
                    textColor={"#7c7c7c"}
                    fontSize="14"
                />
                <View
                    style={{
                        borderColor: "#CECACA",
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderRadius: 8,
                        height: 60,
                        paddingLeft: 5,
                        marginTop: 10,
                        marginBottom: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: 'space-between'
                    }}
                >
                    <FloTextBoxNew
                        onChangeText={(txt) => setWhLabel(txt)}
                        value={whLabel}
                        placeholder={translate("storeWarehouse.readEnterUnitQR")}
                        style={{
                            backgroundColor: "transparent",
                            width: width * 0.75,
                            fontFamily: "Poppins_200ExtraLight",
                            fontSize: 15,
                            color: "#707070",
                        }}
                    />
                    <TouchableOpacity onPress={() => setIsUnitCameraShow(true)}>
                        <Image
                            source={require("../../assets/S.png")}
                            style={{
                                width: PerfectPixelSize(50),
                                height: PerfectPixelSize(50),
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <>
                {selectedWarehose &&
                    <View style={{ marginHorizontal: 15 }}>
                        <FloButton
                            disabled={!whLabel}
                            onPress={removeUnitAlert}
                            title={translate("storeWarehouse.removeAllProductsfromTheUnit")}
                            containerStyle={{
                                marginTop: 50,
                                backgroundColor: '#00b2ff',
                                borderRadius: 20.5
                            }}
                        />
                        <FloButton
                            onPress={removeWarehouseAlert}
                            title={translate("storeWarehouse.removeAllProductsFromTheWarehouse")}
                            containerStyle={{
                                marginBottom: 40,
                                marginTop: 10,
                                backgroundColor: '#F90000',
                                borderRadius: 20.5
                            }}
                        />
                    </View>
                }
            </>
            <MainCamera
                isShow={isUnitCameraShow}
                onReadComplete={(barcode) => {
                    if (barcode.startsWith("0"))
                        barcode = barcode.substring(1, barcode.length);
                    setWhLabel(barcode);
                    setIsUnitCameraShow(false);
                }}
                onHide={() => setIsUnitCameraShow(false)}
            />
        </View>
    )
}

export default StoreWarehouseDeleteProduct

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
