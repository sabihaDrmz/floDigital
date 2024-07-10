import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Pressable
} from "react-native";
import React, { useEffect, useState } from "react";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import Modal from "react-native-modal";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { useStoreWarehouseService } from "../../contexts/StoreWarehoseService";
import FloTextBoxNew from "../../components/FloTextBoxNew";
import { StoreWarehouseResModel } from "../../contexts/model/StoreWarehouseModal";
import FloLoading from "../../components/FloLoading";
import { useAccountService } from "../../contexts/AccountService";
import { AppButton, ColorType } from "@flomagazacilik/flo-digital-components";
//TODO: EXPO AV
// import { Audio } from 'expo-av';
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { translate } from "../../helper/localization/locaizationMain";
export interface StoreWarehouseModel {
    id: string;
    code: string;
    name: string;
    storeCode: string;
    whType: number;
    order: number;
    createDate: Date;
    isDeleted: boolean;
    isActive: boolean;
    modifiedDate: Date;
}

const StoreWarehouseReqListWeb = ({ }: any) => {
    const { isLoading, isEdit, setStatusForStoreWarehouseReq, storeWarehouseReqList, getListForStoreWarehouseReq, changeEditVisible, deleteStoreWarehouseRequest, changeModalVisible, createStoreWarehouseRequest, updateStoreWarehouseRequest } = useStoreWarehouseService();
    const navigation = useNavigation();
    const { getUserStoreWarehouseId, employeeInfo } = useAccountService();
    const whId = getUserStoreWarehouseId();

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [inputValues, setInputValues] = useState({
        code: "",
        name: "",
    });
    const [selectedId, setSelectedId] = useState<string>("");
    const [data, setData] = useState<StoreWarehouseResModel[] | undefined>()
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [hover, setHover] = useState(-1);
    const [lastMessage, setLastMessage] = useState()
    const [allData, setAllData] = useState<StoreWarehouseResModel[] | undefined>()
    const [currentIndex, setCurrentIndex] = useState<number | undefined>();
    const playNotificationSound = async () => {
      /*
        const { sound } = await Audio.Sound.createAsync(

            require('../../../assets/newReqSound.mp3')
        );
        await sound.playAsync();

       */
    };

    const checkStatusAndPlaySound = () => {
        if (allData) {
            const hasStatusZero = allData.some(item => item.status === 0);
            if (hasStatusZero) {
                playNotificationSound();
            }
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            checkStatusAndPlaySound();
        }, 2 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [allData]);

    useEffect(() => {
        setAllData(storeWarehouseReqList)
        setData(storeWarehouseReqList)
    }, [storeWarehouseReqList])

    useEffect(() => {
        getListForStoreWarehouseReq();
    }, []);

    const handleOnchange = (text: string, input: string) => {
        setInputValues((prevState) => ({ ...prevState, [input]: text }));
    };

    const selectedCode = (item: StoreWarehouseModel) => {
        setSelectedId(item?.id)
        setInputValues({ code: item.code, name: item.name });
        changeEditVisible()
        changeModalVisible();
    };

    const closeModal = () => {
        changeModalVisible();
        setInputValues({ code: "", name: "" });
        changeEditVisible()
    };

    const create = () => {
        createStoreWarehouseRequest(
            inputValues.code,
            inputValues.name
        );
    };

    const update = () => {
        updateStoreWarehouseRequest(
            inputValues.code,
            inputValues.name,
            selectedId
        )
    }

    const onDelete = (id: string) => {
        deleteStoreWarehouseRequest(
            id
        )
        setInputValues({ code: "", name: "" });
        changeEditVisible();
        setSelectedId("")
    }

    const listHeader = [
        { key: 'qr', title: `${translate("storeWarehouse.addressInformation")}` },
        { key: 'req_user', title: `${translate("storeWarehouse.requestingUser")}` },
        { key: 'barcode', title: `${translate("storeWarehouse.barcode")}` },
        { key: 'tanim', title: `${translate("storeWarehouse.definition")}` },
        { key: 'size', title: `${translate("storeWarehouse.size")}` },
        { key: 'req_date', title: `${translate("storeWarehouse.requestTime")}` },
        { key: 'requestNote', title: `${translate("storeWarehouse.requestNote")}` },
        { key: 'status', title: `${translate("storeWarehouse.status")}` },
        { key: 'oper', title: `${translate("storeWarehouse.process")}` }]

    const tabHeader = [
        { key: 0, title: `${translate("storeWarehouse.workOrders")}` },
        { key: 2, title: `${translate("storeWarehouse.completedTransactions")}` },
    ]
    const statusLabel = (status) => {
        switch (status) {
            case 0:
                return `${translate("storeWarehouse.new")}`
                break;
            case 1:
                return `${translate("storeWarehouse.inProcess")}`
                break;
            case 2:
                return `${translate("storeWarehouse.ok")}`
                break;
            case 3:
                return `${translate("storeWarehouse.requestUnrealized")}`
                break;
            default:
                return `${translate("storeWarehouse.new")}`
        }
    }

    const changeStatus = (item, status) => {
        const model = {
            id: item.id,
            productState: item.productState,
            status: status,
            completeNote: "",
            cancelReason: "",
            completePerson: employeeInfo.EfficiencyRecord,
            completePersonName: `${employeeInfo.FirstName} ${employeeInfo.LastName}`
        }
        setStatusForStoreWarehouseReq(model)
        getListForStoreWarehouseReq();
    }


    const changeTab = (tabStatus) => {
        setSelectedStatus(tabStatus);
        if (allData) {
            if (tabStatus === 2) {
                const newData = allData?.filter(x => x?.status === 2 || x?.status === 3);
                setData(newData);
            } else {
                const newData = allData?.filter(x => x?.status === 0 || x?.status === 1);
                setData(newData);
            }
        }
    };

    useEffect(() => {
        if (data) {
            if (selectedStatus === 2) {
                const newData = allData?.filter(x => x?.status === 2 || x?.status === 3);
                setData(newData);
            } else {
                const newData = allData?.filter(x => x?.status === 0 || x?.status === 1);
                setData(newData);
            }
        }
    }, [allData])

    const getRefreshList = () => {
        getListForStoreWarehouseReq();
    }

    const checkItem = (item) => {
        if (item) {
            return item
        } else {
            return '-'
        }
    }
    return (
        <ScrollView style={styles.container}>
            {isLoading ? <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: Dimensions.get("window").height - 100,
                }}
            >
                <FloLoading />
            </View> : <>
                <FloHeaderNew
                    headerType="standart"
                    enableButtons={["back"]}
                    headerTitle={translate("storeWarehouse.warehouseProductRequests")}
                />
                <View style={{ position: 'absolute', top: 15, width: '5%', right: 10, }}>
                    <AppButton onPress={getRefreshList} title='Yenile' buttonColorType={ColorType.Success} />
                </View>
                {
                    <>
                        <View style={{ marginHorizontal: 10 }}>
                            <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                {tabHeader.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => changeTab(item.key)} style={[{ alignItems: 'center', justifyContent: 'center', width: screenWidth / 2.1, padding: 10, borderRadius: 10 }, selectedStatus === item?.key ? { backgroundColor: '#6f9e72' } : { backgroundColor: '#565656', borderWidth: 1, borderColor: '#fff' }]}>
                                            <Text style={styles.headerText}>{item.title}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>

                        <View style={{ marginHorizontal: 10 }}>
                            <View style={styles.headerContainer}>
                                {listHeader.map((item, index) => {
                                    return (
                                        <View style={{ width: item.key === 'status' ? screenWidth / 15.1 : item?.key === 'oper' ? screenWidth / 6.1 : screenWidth / 9.5, backgroundColor: '#ef8b00', alignItems: 'center', padding: 10, borderWidth: 1, borderRightWidth: index !== 0 ? 0 : 1, borderColor: '#cecece' }}>
                                            <Text numberOfLines={1} style={styles.headerText}>{item?.title}</Text>
                                        </View>
                                    )
                                })}

                            </View>
                            {data && data?.length > 0 ? data?.map((item, index) => {
                                return (
                                    <Pressable style={styles.itemContainer} onHoverIn={() => setHover(index)} onHoverOut={() => setHover(-1)}>
                                        <>
                                            <View style={{ width: screenWidth / 9.5, backgroundColor: hover === index ? '#f4ffd3' : '#fff', alignItems: 'center', padding: 10, borderWidth: 1, borderTopWidth: 0, borderColor: '#cecece' }}>
                                                <Text numberOfLines={1} style={styles.itemText}>{checkItem(item?.unitQr)}</Text>
                                            </View>
                                            <View style={{ width: screenWidth / 9.5, backgroundColor: hover === index ? '#f4ffd3' : '#fff', alignItems: 'center', padding: 10, borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderColor: '#cecece', borderLeftWidth: 0 }}>
                                                <Text numberOfLines={1} style={styles.itemText}>{checkItem(item?.requestPersonName)}</Text>
                                            </View>
                                            <View style={{ width: screenWidth / 9.5, backgroundColor: hover === index ? '#f4ffd3' : '#fff', alignItems: 'center', padding: 10, borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderColor: '#cecece', borderLeftWidth: 0 }}>
                                                <Text numberOfLines={1} style={styles.itemText}>{checkItem(item?.barcode)}</Text>
                                            </View>
                                            <View style={{ width: screenWidth / 9.5, backgroundColor: hover === index ? '#f4ffd3' : '#fff', alignItems: 'center', padding: 10, borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderColor: '#cecece', borderLeftWidth: 0 }}>
                                                <Text numberOfLines={2} style={styles.itemText}>{checkItem(item?.model)}</Text>
                                            </View>
                                            <View style={{ width: screenWidth / 9.5, backgroundColor: hover === index ? '#f4ffd3' : '#fff', alignItems: 'center', padding: 10, borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderColor: '#cecece', borderLeftWidth: 0 }}>
                                                <Text numberOfLines={1} style={styles.itemText}>{checkItem(item?.size)}</Text>
                                            </View>
                                            <View style={{ width: screenWidth / 9.5, backgroundColor: hover === index ? '#f4ffd3' : '#fff', alignItems: 'center', padding: 10, borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderColor: '#cecece', borderLeftWidth: 0 }}>
                                                <Text numberOfLines={1} style={styles.itemText}>{item?.createDate ? moment(item?.createDate).format("DD.MM.YYYY HH:mm") : ""}</Text>
                                            </View>
                                            <View style={{ width: screenWidth / 9.5, backgroundColor: hover === index ? '#f4ffd3' : '#fff', alignItems: 'center', padding: 10, borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderColor: '#cecece', borderLeftWidth: 0 }}>
                                                <Text numberOfLines={1} style={styles.itemText}>{checkItem(item?.requestNote)}</Text>
                                            </View>
                                            <View style={{ width: screenWidth / 15.1, backgroundColor: hover === index ? '#f4ffd3' : '#fff', alignItems: 'center', padding: 10, borderWidth: 1, borderTopWidth: 0, borderRightWidth: 0, borderColor: '#cecece', borderLeftWidth: 0 }}>
                                                <Text numberOfLines={1} style={styles.itemText}>{statusLabel(item?.status)}</Text>
                                            </View>
                                            <View style={{ width: screenWidth / 6.1, backgroundColor: hover === index ? '#f4ffd3' : '#fff', alignItems: 'center', justifyContent: 'center', padding: 10, borderWidth: 1, borderRightWidth: 0, borderTopWidth: 0, borderColor: '#cecece', borderLeftWidth: 0 }}>
                                                {item?.status === 0 &&
                                                    (
                                                        <TouchableOpacity onPress={() => changeStatus(item, 1)} style={{ backgroundColor: '#2c6a9e', borderRadius: 10, width: '80%', height: 30, alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text numberOfLines={1} style={[styles.itemText, { color: '#fff' }]}>{translate("storeWarehouse.putIntoProcess")}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                                {item?.status === 1 &&
                                                    (
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                                            <TouchableOpacity onPress={() => changeStatus(item, 2)} style={{ backgroundColor: '#00c2ff', borderRadius: 10, width: '35%', height: 30, alignItems: 'center', justifyContent: 'center' }}>
                                                                <Text numberOfLines={1} style={[styles.itemText, { color: '#fff' }]}>{translate("storeWarehouse.confirm")}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => changeStatus(item, 3)} style={{ backgroundColor: '#ff0000', borderRadius: 10, width: '60%', height: 30, alignItems: 'center', justifyContent: 'center' }}>
                                                                <Text numberOfLines={1} style={[styles.itemText, { color: '#fff' }]}>{translate("storeWarehouse.productNotFound")}</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                }
                                                {item?.status === 2 &&
                                                    (
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                                            <TouchableOpacity disabled style={{ backgroundColor: '#dedede', borderRadius: 10, width: '100%', height: 30, alignItems: 'center', justifyContent: 'center' }}>
                                                                <Text numberOfLines={1} style={[styles.itemText, { color: '#fff' }]}>{translate("storeWarehouse.completed")}</Text>
                                                            </TouchableOpacity>

                                                        </View>
                                                    )
                                                }
                                                {item?.status === 3 &&
                                                    (
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                                            <TouchableOpacity disabled style={{ backgroundColor: '#dedede', borderRadius: 10, width: '100%', height: 30, alignItems: 'center', justifyContent: 'center' }}>
                                                                <Text numberOfLines={1} style={[styles.itemText, { color: '#fff' }]}>{translate("storeWarehouse.requestUnrealized")}</Text>
                                                            </TouchableOpacity>

                                                        </View>
                                                    )
                                                }
                                            </View>
                                        </>

                                    </Pressable>)
                            }) :
                                (
                                    <View style={{ alignItems: 'center', justifyContent: 'center', height: screenHeight / 2, }}>
                                        <Text style={{ color: '#dedede', fontWeight: 'bold', fontSize: 50 }}>{selectedStatus === 0 ? `${translate("storeWarehouse.noPendingWorkOrders")}` : `${translate("storeWarehouse.noWorkCompleted")}`}</Text>
                                    </View>
                                )}
                        </View>
                    </>
                }

                <Modal
                    onBackdropPress={closeModal}
                    isVisible={isModalVisible}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalWrapper}>
                            <Text
                                style={{
                                    fontFamily: "Poppins_400Regular",
                                    fontSize: PerfectFontSize(20),
                                    fontWeight: "700",
                                    fontStyle: "normal",
                                    letterSpacing: 0.6,
                                }}
                            >
                                {isEdit ? `${translate("storeWarehouse.edit")}` : `${translate("storeWarehouse.add")}`}
                            </Text>
                            <View>
                                <Text
                                    style={{
                                        fontFamily: "Poppins_400Regular",
                                        fontSize: PerfectFontSize(20),
                                        fontWeight: "700",
                                        fontStyle: "normal",
                                        letterSpacing: 0.6,
                                        marginTop: 10,
                                    }}
                                >
                                    {translate("storeWarehouse.code")}
                                </Text>
                                <FloTextBoxNew
                                    value={inputValues.code}
                                    onChangeText={(text) => handleOnchange(text, "code")}
                                />
                            </View>
                            <View>
                                <Text
                                    style={{
                                        fontFamily: "Poppins_400Regular",
                                        fontSize: PerfectFontSize(20),
                                        fontWeight: "700",
                                        fontStyle: "normal",
                                        letterSpacing: 0.6,
                                        marginTop: 10,
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
                                <TouchableOpacity
                                    onPress={closeModal}
                                    style={styles.editCancelButton}
                                >
                                    <Text style={styles.cancelText}>{translate("storeWarehouse.cancel")}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </Modal></>}
        </ScrollView>
    );
};

export default StoreWarehouseReqListWeb;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 30
    },
    headerContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        marginTop: 20,
    },
    itemContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
    },
    headerText: {
        fontSize: PerfectFontSize(12),
        fontWeight: "bold",
        color: '#fff',
        textAlign: 'center'
    },
    itemText: {
        fontSize: PerfectFontSize(12),
        fontWeight: "bold",
        color: '#000',
        textAlign: 'center'
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    itemWrapper: {
        width: "50%",
        borderWidth: 1,
        marginTop: 10,
        backgroundColor: "#fff",
    },
    inactiveItemWrapper: {
        width: "50%",
        borderWidth: 1,
        backgroundColor: "#EEE",
    },
    itemP: {
        padding: 10,
    },
    modalContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
    modalWrapper: {
        width: "80%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 21,
    },
    modalInput: { width: "100%", borderWidth: 1, padding: 10, marginTop: 10 },
    addInactiveButton: {
        backgroundColor: "#EEEEEEEE",
        padding: 10,
        borderRadius: 7,
        width: "40%",
        alignItems: "center",
        justifyContent: "center",
    },
    addInactiveText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    cancelButton: {
        backgroundColor: "#000",
        padding: 10,
        borderRadius: 7,
        width: "40%",
        alignItems: "center",
        justifyContent: "center",
    },
    cancelText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    deleteButton: {
        backgroundColor: "#F90000",
        padding: 10,
        borderRadius: 7,
        width: "40%",
        alignItems: "center",
        justifyContent: "center",
    },
    deleteText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    editCancelButton: {
        backgroundColor: "#000",
        padding: 10,
        marginTop: 10,
        borderRadius: 7,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    addButton: {
        backgroundColor: "#38C14E",
        padding: 10,
        borderRadius: 7,
        width: "40%",
        alignItems: "center",
        justifyContent: "center",
    },
});
