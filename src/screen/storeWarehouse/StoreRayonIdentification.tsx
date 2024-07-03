import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from "react-native";
import React, { useEffect, useState } from "react";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import Modal from "react-native-modal";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { useStoreWarehouseService } from "../../contexts/StoreWarehoseService";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { StoreRayonListModel } from "../../contexts/model/StoreRayonModel";
import { AppText } from "@flomagazacilik/flo-digital-components";
import { useNavigation } from "@react-navigation/native";
import { translate } from "../../helper/localization/locaizationMain";
export interface InputItem {
    code: string,
    name: string,
    id?: number,
    ryType?: number
}
const StoreRayonIdentification = ({ }: any) => {
    const { rayonData, getStoreRayonList, changeOpenEditVisible, isEdit, isModalVisible, changeModalVisible, changeCloseEditVisible, createStoreRayon, deleteStoreRayon, updateStoreRayon } = useStoreWarehouseService();
    const navigation = useNavigation();
    const [inputValues, setInputValues] = useState({
        code: "",
        name: ""
    });

    const [selectedId, setSelectedId] = useState<number>(-1);
    const [data, setData] = useState<StoreRayonListModel[] | undefined>();

    useEffect(() => {
        setData(rayonData)
    }, [rayonData])

    useEffect(() => {
        getStoreRayonList();
    }, []);

    const handleOnchange = (text: string, input: string) => {
        setInputValues((prevState) => ({ ...prevState, [input]: text }));
    };

    const customButtonAction = () => {
        //@ts-ignore
        navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseNavigationList' })
    };

    const selectedCode = (item: InputItem) => {
        changeOpenEditVisible()
        setSelectedId(item?.id || -1)
        setInputValues({ code: item.code, name: item.name });
        changeModalVisible();
    };

    const closeModal = () => {
        changeCloseEditVisible()
        changeModalVisible();
        setInputValues({ code: "", name: "" });
    };
    const create = () => {
        const data = {
            code: inputValues.code,
            name: inputValues.name,
            ryType: 0
        }
        createStoreRayon(
            data
        );
        getStoreRayonList();
        setInputValues({ code: "", name: "" });
        setSelectedId(-1)
    };

    const update = () => {
        const data = {
            code: inputValues.code,
            name: inputValues.name,
            id: selectedId,
            ryType: 0
        }
        updateStoreRayon(data)
        getStoreRayonList();
        setInputValues({ code: "", name: "" });
        setSelectedId(-1)
    }

    const onDelete = (id: number) => {
        deleteStoreRayon(
            id
        )
        getStoreRayonList();
        setInputValues({ code: "", name: "" });
        setSelectedId(-1)
    }

    const addedModalOpen = () => {
        changeCloseEditVisible();
        changeModalVisible();
    }
    return (
        <View style={styles.container}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back", "customLeftButton"]}
                headerTitle={translate("storeWarehouse.rayonIdentification")}
                customButtonActions={[
                    {
                        customAction: customButtonAction,
                        buttonType: "back",
                    },
                ]}
                customLeftButton={() => (
                    <TouchableOpacity onPress={addedModalOpen} style={{ backgroundColor: '#fff', height: 45, width: 45, borderRadius: 45, alignItems: 'center', justifyContent: 'center', right: 10 }}>
                        <Text style={{ color: '#ff7f00', fontWeight: 'bold', fontSize: 20 }}>+</Text>
                    </TouchableOpacity>
                )
                }
            />
            {data && data?.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 10 }} contentContainerStyle={{ paddingBottom: 20 }}>
                    <View style={styles.headerContainer}>
                        <View style={{ backgroundColor: '#ff7f00', width: '50%', padding: 10, borderRightColor: '#fff', borderRightWidth: 0.5 }}>
                            <AppText style={styles.headerText}>{translate("storeWarehouse.rayonName")}</AppText>
                        </View>
                        <View style={{ backgroundColor: '#ff7f00', width: '50%', padding: 10 }}>
                            <AppText style={styles.headerText}>{translate("storeWarehouse.description")}</AppText>
                        </View>
                    </View>
                    {data?.map((item, index) => (
                        <TouchableOpacity
                            onPress={() => selectedCode(item)}
                            key={index}
                            style={styles.itemContainer}
                        >
                            <View style={[styles.itemWrapper, { borderRightWidth: 0 }]}>
                                <Text style={styles.itemP}>{item.code}</Text>
                            </View>
                            <View style={styles.itemWrapper}>
                                <Text numberOfLines={3} style={styles.itemP}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '50%' }}>
                    <Text style={{ color: '#dedede', fontWeight: 'bold', fontSize: 50 }}>{translate("storeWarehouse.noRayonFound")}</Text>
                </View>
            )}
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
                                    {translate("storeWarehouse.rayonName")}
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
                                            onPress={() => onDelete(selectedId)}
                                            style={styles.deleteButton}
                                        >
                                            <Text style={styles.deleteText}>{translate("storeWarehouse.delete")}</Text>
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
                            {isEdit && (
                                <>
                                    <TouchableOpacity
                                        onPress={closeModal}
                                        style={styles.editCancelButton}
                                    >
                                        <Text style={styles.cancelText}>{translate("storeWarehouse.cancel")}</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default StoreRayonIdentification;
const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        marginTop: 20,
    },
    headerText: {
        fontSize: PerfectFontSize(18),
        fontWeight: "bold",
        color: '#fff'
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        left: 0,
        right: 0
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    itemWrapper: {
        width: "50%",
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
    modalContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
    modalWrapper: {
        width: "95%",
        backgroundColor: "#fff",

    },
    modalInput: { width: "100%", borderWidth: 1, padding: 10, marginTop: 10 },
    addInactiveButton: {
        backgroundColor: "#EEEEEEEE",
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

    addedUserText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    userAddedButton: {
        backgroundColor: "#ff7f00",
        padding: 10,
        marginTop: 10,
        borderRadius: 21,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    fullAddButtonContainer: {
        position: 'absolute',
        bottom: 0,
        right: width * 0.01,
        top: height * 0.02
    },
});

