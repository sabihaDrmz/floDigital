import React, { useState, useEffect, useRef, useDebugValue } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
    InteractionManager,
} from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
const { width, height } = Dimensions.get("window");
const PADDING_TOTAL = Platform.OS === "android" ? 50 : 50;
import { useStoreWarehouseService } from "../../contexts/StoreWarehoseService";
import { Feather } from '@expo/vector-icons';
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import { MessageBoxType } from "../../contexts/model/MessageBoxOptions";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { useNavigation, useRoute } from "@react-navigation/native";
import { translate } from "../../helper/localization/locaizationMain";

const StoreWarehouseUserList = ({ }: any) => {
    const [data, setData] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const scrollRef = useRef<any>();

    const navigation = useNavigation();
    const route = useRoute();
    const { getUserExtensionList, getStorePersonal, userExtensionList, personalData, deleteUserExtension } = useStoreWarehouseService();

    const { show } = useMessageBoxService();

    useEffect(() => {
        getUserExtensionList();
        getStorePersonal();
    }, [])

    useEffect(() => {
        if (route.params) {
            //@ts-ignore
            const { tabActiveIndex } = route.params;
            if (tabActiveIndex) {
                setActiveIndex(parseInt(tabActiveIndex))
                changeTab(parseInt(tabActiveIndex))
            }
        }
    }, [route.params])

    useEffect(() => {
        const _data = userExtensionList.filter(x => x.storeReyonUser === Boolean(activeIndex));
        setData(_data);
        getStorePersonal();
    }, [userExtensionList])


    console.log('userExtensionList:', userExtensionList)
    const deleteUser = (id: number) => {
        show(`${translate("storeWarehouse.sureWantDeleteDefinedUser")}`, {
            type: MessageBoxType.YesNo,
            yesButtonTitle: `${translate("storeWarehouse.delete")}`,
            noButtonTitle: `${translate("storeWarehouse.cancel")}`,
            yesButtonEvent: () => {
                deleteUserExtension(id);
                getUserExtensionList();
                getStorePersonal();
            }
        })
    }

    const tabBarHeader = [
        {
            title: `${translate("storeWarehouse.warehouse")}`,
            key: 0
        }, {
            title: `${translate("storeWarehouse.rayon")}`,
            key: 1
        }
    ]

    const changeTab = (targetIndex: number) => {
        setActiveIndex(targetIndex);
        const _data = userExtensionList.filter(x => x.storeReyonUser === Boolean(targetIndex));
        setData(_data);
        return scrollRef.current?.scrollTo({ x: width * targetIndex })
    }

    const onMomentumScrollEnd = (e: any) => {
        const { nativeEvent } = e;
        const index = Math.round(nativeEvent.contentOffset.x / width);
        if (index !== activeIndex) {
            const _data = userExtensionList.filter(x => x.storeReyonUser === Boolean(index));
            setData(_data);
            setActiveIndex(index)
        }
    }

    return (
        <View style={styles.hardContainer}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back", "customLeftButton"]}
                headerTitle={translate("storeWarehouse.warehouseUserList")}
                customLeftButton={() => (
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('StoreWarehouse', {
                            screen: 'StoreWarehouseUserAdded',
                            params: { tabActiveIndex: activeIndex },
                        });
                    }} style={{ backgroundColor: '#fff', height: 45, width: 45, borderRadius: 45, alignItems: 'center', justifyContent: 'center', right: 10 }}>
                        <Text style={{ color: '#ff7f00', fontWeight: 'bold', fontSize: 20 }}>+</Text>
                    </TouchableOpacity>
                )
                }
            />
            <View style={styles.headerContainer}>
                {tabBarHeader.map((item, index) => {
                    return (
                        <TouchableOpacity onPress={() => changeTab(index)} key={index} style={[styles.headerWrapper, activeIndex === index ? { backgroundColor: '#6f9e72' } : { backgroundColor: '#565656' }]}>
                            <Text style={styles.headerText}>{item.title}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
            <ScrollView
                horizontal
                pagingEnabled
                nestedScrollEnabled
                onMomentumScrollEnd={onMomentumScrollEnd}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ref={scrollRef}
            >
                <View style={{ flex: 1, width, alignItems: 'center' }}>
                    {data && data?.length > 0 ? (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} style={{ marginHorizontal: 10, marginTop: 10 }}>
                            <View style={styles.headerContainer}>
                                <View style={{ backgroundColor: '#ff7f00', width: width * 0.4, padding: 10, borderRightColor: '#fff', borderRightWidth: 0.5 }}>
                                    <Text style={styles.headerText}>{translate("storeWarehouse.user")}</Text>
                                </View>
                                <View style={{ backgroundColor: '#ff7f00', width: width * 0.4, padding: 10, borderRightColor: '#fff', borderRightWidth: 0.5 }}>
                                    <Text style={styles.headerText}>{activeIndex === 0 ? `${translate("storeWarehouse.warehouse")}` : `${translate("storeWarehouse.rayon")}`}</Text>
                                </View>
                                <View style={{ backgroundColor: '#ff7f00', width: width * 0.1, padding: 10 }} />
                            </View>
                            {data?.map((item, index) => {
                                const user = personalData.filter(
                                    (x) => x.employeeId === item?.employeeId.toString()
                                ) || []
                                return (
                                    <View
                                        key={index}
                                        style={styles.itemContainer}
                                    >
                                        <View style={styles.itemWrapper}>
                                            <Text numberOfLines={3} style={styles.itemP}>{user[0]?.employeeName}</Text>
                                        </View>
                                        <View style={[styles.itemWrapper, { borderRightWidth: 0 }]}>
                                            <Text numberOfLines={3} style={styles.itemP}>{item.name}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => deleteUser(item.employeeId)} style={[styles.itemWrapper, { width: width * 0.1, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Feather name="trash-2" size={24} color="#ff0000" />
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </ScrollView>) :
                        (<View style={{ alignItems: 'center', justifyContent: 'center', height: '50%' }}>
                            <Text style={{ color: '#dedede', fontWeight: 'bold', fontSize: 50 }}>{translate("storeWarehouse.noDefinedWarehouseUserFound")}</Text>
                        </View>)}
                </View>
                <View style={{ flex: 1, width, alignItems: 'center' }}>
                    {data && data?.length > 0 ? (<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} style={{ marginHorizontal: 10, marginTop: 10 }}>
                        <View style={styles.headerContainer}>
                            <View style={{ backgroundColor: '#ff7f00', width: width * 0.4, padding: 10, borderRightColor: '#fff', borderRightWidth: 0.5 }}>
                                <Text style={styles.headerText}>{translate("storeWarehouse.user")}</Text>
                            </View>
                            <View style={{ backgroundColor: '#ff7f00', width: width * 0.4, padding: 10, borderRightColor: '#fff', borderRightWidth: 0.5 }}>
                                <Text style={styles.headerText}>{activeIndex === 0 ? `${translate("storeWarehouse.warehouse")}` : `${translate("storeWarehouse.rayon")}`}</Text>
                            </View>
                            <View style={{ backgroundColor: '#ff7f00', width: width * 0.1, padding: 10 }} />
                        </View>
                        {data?.map((item, index) => {
                            const user = personalData.filter(
                                (x) => x.employeeId === item?.employeeId.toString()
                            ) || []
                            return (
                                <View
                                    key={index}
                                    style={styles.itemContainer}
                                >
                                    <View style={[styles.itemWrapper, { borderRightWidth: 0 }]}>
                                        <Text numberOfLines={3} style={styles.itemP}>{user[0]?.employeeName}</Text>
                                    </View>
                                    <View style={styles.itemWrapper}>
                                        <Text numberOfLines={3} style={styles.itemP}>{item.name}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => deleteUser(item.employeeId)} style={[styles.itemWrapper, { width: width * 0.1, alignItems: 'center', justifyContent: 'center' }]}>
                                        <Feather name="trash-2" size={24} color="#ff0000" />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </ScrollView>) :
                        (<View style={{ alignItems: 'center', justifyContent: 'center', height: '50%' }}>
                            <Text style={{ color: '#dedede', fontWeight: 'bold', fontSize: 50 }}>{translate("storeWarehouse.definedAisleUserNotFound")}</Text>
                        </View>)}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    hardContainer: {
        flex: 1,
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
        width: width * 0.4,
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
    fullAddButtonContainer: {
        position: 'absolute',
        bottom: 0,
        right: width * 0.01,
        top: height * 0.02
    },
});

export default StoreWarehouseUserList