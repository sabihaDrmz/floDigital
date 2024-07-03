import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    Keyboard
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useStoreWarehouseService } from "../../contexts/StoreWarehoseService";
import FloComboBox from "../../components/FloComobox";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { PerfectPixelSize } from "../../helper/PerfectPixel";
import MainCamera from "../../components/MainCamera";
import { FloButton } from "../../components";
import StorewarehouseProductSearchList from "../../components/Storewarehouse/StorewarehouseProductSearchList";
import { useNavigation } from "@react-navigation/native";
import { translate } from "../../helper/localization/locaizationMain";

const { width, height } = Dimensions.get("window");

const StoreWarehoseProductFind = ({ }: any) => {
    const {
        warehouseProductList,
        storeWarehouseList,
        getWarehouseProductList,
        getListForStoreWarehouse,

    } = useStoreWarehouseService();
    const navigation = useNavigation();

    const [sku, setSku] = useState<string>("");
    const [isCameraShow, setIsCameraShow] = useState(false);
    const [selectedWarehose, setSelectedWarehouse] = useState<string>('0');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [data, setData] = useState([])

    const getProductList = (_sku) => {
        const skuData = _sku ? _sku : sku;
        console.log('skuData:', skuData)
        setData([]);
        getWarehouseProductList(skuData, selectedWarehose);
    }
    useEffect(() => {
        getListForStoreWarehouse();
    }, [])

    useEffect(() => {
        if (sku) {
            const groupedData = warehouseProductList.reduce((acc, current) => {
                const existingItem = acc.find(item => item.depoAdi === current.whName);

                if (existingItem) {
                    existingItem.product.push({
                        sku: current.sku,
                        unitLabel: current.unitName
                    });
                } else {
                    acc.push({
                        depoAdi: current.whName,
                        product: [{
                            sku: current.sku,
                            unitLabel: current.unitName
                        }]
                    });
                }

                return acc;
            }, []);
            setData(groupedData);
        }

    }, [warehouseProductList])

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const customButtonAction = () => {
        //@ts-ignore
        navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseNavigationList' });
        setData([]);
        setSku('')
    };

    { console.log('data:', data) }
    return (
        <View style={styles.container}>
            <FloHeaderNew
                headerType={"standart"}
                enableButtons={["back"]}
                headerTitle={translate("storeWarehouse.warehouseProductSearch")}
                customButtonActions={[
                    {
                        customAction: customButtonAction,
                        buttonType: "back",
                    },
                ]}
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
                    placeholder={translate("storeWarehouse.allWarehouses")}
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
                        onSubmitEditing={() => getProductList(null)}
                        onChangeText={(txt) => setSku(txt)}
                        value={sku}
                        style={{
                            backgroundColor: "transparent",
                            width: width * 0.75,
                            fontFamily: "Poppins_200ExtraLight",
                            fontSize: 15,
                            color: "#707070",
                        }}
                        placeholder={translate("storeWarehouse.scanEnterBarcode")}
                    />
                    <TouchableOpacity onPress={() => {
                        setIsCameraShow(true);
                        Keyboard.dismiss();
                    }}>
                        <Image
                            source={require("../../../assets/S.png")}
                            style={{
                                width: PerfectPixelSize(50),
                                height: PerfectPixelSize(50),
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {data && data?.length > 0 &&
                <StorewarehouseProductSearchList data={data} />
            }
            <MainCamera
                isShow={isCameraShow}
                onReadComplete={(barcode) => {
                    if (barcode.startsWith("0"))
                        barcode = barcode.substring(1, barcode.length);
                    setSku(barcode)
                    setIsCameraShow(false);
                    getProductList(barcode)
                }}
                onHide={() => setIsCameraShow(false)}
            />
        </View>
    )
}

export default StoreWarehoseProductFind;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})