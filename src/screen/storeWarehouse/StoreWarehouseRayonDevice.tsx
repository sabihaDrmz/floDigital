import React, { useEffect, useState } from 'react';
import {
    View, Text,
    StyleSheet,
    FlatList,
    ScrollView,
    Dimensions,
} from 'react-native';
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { PerfectFontSize } from '../../helper/PerfectPixel';
import { useStoreWarehouseService } from '../../contexts/StoreWarehoseService';
import FloComboBox from '../../components/FloComobox';
import { StoreRayonDeviceList } from '../../contexts/model/StoreRayonModel';
import { TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import Modal from "react-native-modal";
import FloTextBoxNew from '../../components/FloTextBoxNew';
import { useNavigation } from '@react-navigation/native';
import { translate } from "../../helper/localization/locaizationMain";

const { width, height } = Dimensions.get("window");

const StoreWarehouseRayonDevice = ({ }: any) => {
    const { getStoreRayonList, rayonDeviceList, rayonData, isModalVisible, isEdit, getRayonDeviceList, rayonDeviceCreate, changeOpenEditVisible, changeCloseEditVisible, changeModalVisible, rayonDeviceDelete, rayonDeviceUpdate } = useStoreWarehouseService();
    const navigation = useNavigation();
    const [selectedRayon, setSelectedRayon] = useState<number>(-1);
    const [data, setData] = useState<StoreRayonDeviceList[]>([])
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [inputValues, setInputValues] = useState({
        code: "",
        name: "",
    });

    useEffect(() => {
        getStoreRayonList();
    }, [])

    useEffect(() => {
        setData(rayonDeviceList);
    }, [rayonDeviceList])

    const onChangeWarehose = (id: number) => {
        setSelectedRayon(id);
        getRayonDeviceList(id);
        setData(rayonDeviceList);
    };

    const handleOnchange = (text: string, input: string) => {
        setInputValues((prevState) => ({ ...prevState, [input]: text }));
    };

    const closeModal = () => {
        changeCloseEditVisible()
        changeModalVisible();
        setInputValues({ code: "", name: "" });
    };

    const create = () => {
        rayonDeviceCreate(
            selectedRayon,
            inputValues.code,
            inputValues.name
        );
        setInputValues({ code: "", name: "" });
        getStoreRayonList();
    }

    const update = () => {
        rayonDeviceUpdate(
            selectedRayon,
            inputValues.code,
            inputValues.name,
            selectedId
        )
        getStoreRayonList();
    }

    const onDelete = (id: number) => {
        rayonDeviceDelete(
            selectedRayon,
            id
        )
        setInputValues({ code: "", name: "" });
        changeCloseEditVisible();
        getStoreRayonList();
    }

    const editDevice = (item: StoreRayonDeviceList) => {
        changeOpenEditVisible()
        setSelectedId(item?.id)
        setInputValues({ code: item.code, name: item.name });
        changeModalVisible();
    }

    const addDevice = () => {
        changeModalVisible();
    }
    return (
        <View style={styles.container}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back", "customLeftButton"]}
                headerTitle={translate("storeWarehouse.aisleDevices")}
                customLeftButton={() => (
                    <TouchableOpacity onPress={addDevice} style={{ backgroundColor: '#fff', height: 45, width: 45, borderRadius: 45, alignItems: 'center', justifyContent: 'center', right: 10 }}>
                        <Text style={{ color: '#ff7f00', fontWeight: 'bold', fontSize: 20 }}>+</Text>
                    </TouchableOpacity>
                )
                }
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
                    data={rayonData}
                    keyProp="id"
                    valueProp="code"
                    selectedItem={rayonData.find(
                        (x) => x.id === selectedRayon
                    )}
                    onSelectItem={(item) => {
                        onChangeWarehose(item ? item.id : -1);
                    }}
                    placeholder={translate("storeWarehouse.selectSection")}
                    containerStyle={{
                        borderColor: "rgb(206,202,202)",
                        backgroundColor: "#fff",
                        marginTop: 10,
                    }}
                    textColor={"#7c7c7c"}
                    fontSize="14"
                />
            </View>
            {data && data?.length > 0 &&
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                    <View style={styles.wrapper}>
                        <View>
                            <View style={styles.headerContainer}>
                                <View style={{ backgroundColor: '#ff7f00', width: width * 0.45, padding: 10, borderRightColor: '#fff', borderRightWidth: 0.5 }}>
                                    <Text style={styles.headerText}>{translate("storeWarehouse.name")}</Text>
                                </View>
                                <View style={{ backgroundColor: '#ff7f00', width: width * 0.45, padding: 10, borderRightColor: '#fff', borderRightWidth: 0.5 }}>
                                    <Text style={styles.headerText}>{translate("storeWarehouse.code1")}</Text>
                                </View>
                                <View style={{ backgroundColor: '#ff7f00', width: width * 0.09, padding: 10 }} />
                            </View>
                            {data?.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => editDevice(item)}
                                        key={index}
                                        style={styles.itemContainer}
                                    >
                                        <View style={styles.itemWrapper}>
                                            <Text numberOfLines={3} style={styles.itemP}>{item?.name}</Text>
                                        </View>
                                        <View style={[styles.itemWrapper, { borderRightWidth: 0 }]}>
                                            <Text numberOfLines={3} style={styles.itemP}>{item.code}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => onDelete(item?.id)} style={[styles.itemWrapper, { width: width * 0.09, alignItems: 'center', justifyContent: 'center' }]}>
                                            <FontAwesomeIcon icon="trash" size={24} color="#ff0000" />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                </ScrollView>
            }
            <Modal
                onBackdropPress={closeModal}
                isVisible={isModalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalWrapper}>
                        <View style={{ backgroundColor: '#ff7f00' }}>
                            <Text
                                style={{
                                    fontFamily: "Poppins_400Regular",
                                    fontSize: PerfectFontSize(16),
                                    fontWeight: "700",
                                    fontStyle: "normal",
                                    letterSpacing: 0.6,
                                    color: '#fff',
                                    padding: 10
                                }}
                            >
                                {isEdit ? `${translate("storeWarehouse.edit")}` : `${translate("storeWarehouse.add")}`}
                            </Text>

                        </View>
                        <View style={{ marginHorizontal: 12, marginVertical: 12 }}>
                            <View>
                                <Text
                                    style={{

                                        fontSize: PerfectFontSize(16),
                                        fontWeight: "700",
                                        fontStyle: "normal",
                                        letterSpacing: 0.6,
                                        marginTop: 10,
                                        color: '#626262'
                                    }}
                                >
                                    {translate("storeWarehouse.warehouseName")}
                                </Text>
                                <FloTextBoxNew
                                    value={inputValues.code}
                                    onChangeText={(text) => handleOnchange(text, "code")}
                                />
                            </View>
                            <View>
                                <Text
                                    style={{
                                        fontSize: PerfectFontSize(16),
                                        fontWeight: "700",
                                        fontStyle: "normal",
                                        letterSpacing: 0.6,
                                        marginTop: 10,
                                        color: '#626262'
                                    }}
                                >
                                    {translate("storeWarehouse.description")}
                                </Text>
                                <FloTextBoxNew
                                    value={inputValues.name}
                                    onChangeText={(text) => handleOnchange(text, "name")}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginTop: 20,
                                }}
                            >
                                {isEdit ? (
                                    <>
                                        <TouchableOpacity
                                            onPress={closeModal}
                                            style={styles.cancelButton}
                                        >
                                            <Text style={styles.cancelText}>{translate("storeWarehouse.cancel")}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={update}
                                            style={
                                                inputValues.name && inputValues.code
                                                    ? styles.addButton
                                                    : styles.addInactiveButton
                                            }
                                        >
                                            <Text style={styles.addInactiveText}>{translate("storeWarehouse.edit")}</Text>
                                        </TouchableOpacity>

                                    </>
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            onPress={closeModal}
                                            style={styles.cancelButton}
                                        >
                                            <Text style={styles.cancelText}>{translate("storeWarehouse.cancel")}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={create}
                                            style={
                                                inputValues.name && inputValues.code
                                                    ? styles.addButton
                                                    : styles.addInactiveButton
                                            }
                                        >
                                            <Text style={styles.addInactiveText}>{translate("storeWarehouse.add")}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1, width, alignItems: 'center', marginTop: 20
    },
    headerContainer: {
        flexDirection: 'row'
    },
    headerWrapper: {
        padding: 10, width: '50%', alignItems: 'center', justifyContent: 'center'
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: PerfectFontSize(16)
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    itemWrapper: {
        width: width * 0.45,
        borderWidth: 1,
        backgroundColor: "#fff",
        borderColor: '#cecece'
    },
    inactiveItemWrapper: {
        width: "50%",
        borderWidth: 1,
        backgroundColor: "#EEE",
    },
    itemP: {
        padding: 10,
        color: '#626262',
        fontSize: 16
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        left: 0,
        right: 0
    },
    cancelButton: {
        backgroundColor: "#414141",
        padding: 10,
        borderRadius: 21,
        width: "48%",
        alignItems: "center",
        justifyContent: "center",
    },
    cancelText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    deleteButton: {
        backgroundColor: "#F90000",
        padding: 10,
        borderRadius: 21,
        width: "48%",
        alignItems: "center",
        justifyContent: "center",
    },
    deleteText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    editCancelButton: {
        backgroundColor: "#414141",
        padding: 10,
        marginTop: 10,
        borderRadius: 21,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    addButton: {
        backgroundColor: "#00b2ff",
        padding: 10,
        borderRadius: 21,
        width: "48%",
        alignItems: "center",
        justifyContent: "center",
    },
    addInactiveText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    addInactiveButton: {
        backgroundColor: "#EEEEEEEE",
        padding: 10,
        borderRadius: 21,
        width: "48%",
        alignItems: "center",
        justifyContent: "center",
    },
    modalContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
    modalWrapper: {
        width: "95%",
        backgroundColor: "#fff",
    },
    fullAddButtonContainer: {
        position: 'absolute',
        bottom: 0,
        right: width * 0.01,
        top: height * 0.02
    },
});

export default StoreWarehouseRayonDevice;
