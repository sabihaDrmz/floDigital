import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Platform,
    InteractionManager,
} from "react-native";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import FloComboBox from "../../components/FloComobox";
import FloTextBoxNew from "../../components/FloTextBoxNew";

const { width, height } = Dimensions.get("window");
const PADDING_TOTAL = Platform.OS === "android" ? 50 : 50;
import { useStoreWarehouseService } from "../../contexts/StoreWarehoseService";
import { FloButton } from "../../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { translate } from "../../helper/localization/locaizationMain";

const StoreWarehouseUserAdded = ({ }: any) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const scrollRef = useRef<any>();
    const [selectedWarehose, setSelectedWarehouse] = useState<string>('');
    const [selectedPersonal, setSelectedPersonal] = useState<string>('')
    const [selectedRayon, setSelectedRayon] = useState<string>('');

    const navigation = useNavigation();
    const route = useRoute();
    const { storeWarehouseList, rayonData, personalData, createUserExtension, getListForStoreWarehouse, getStorePersonal, getStoreRayonList, getUserExtensionList } = useStoreWarehouseService();


    useEffect(() => {
        const getData = async () => {
            await getListForStoreWarehouse();
            await getStoreRayonList();
            await getStorePersonal()
        }
        getData();
    }, [])

    useEffect(() => {
        console.log('route:', route)
        if (route.params) {
            //@ts-ignore
            const { tabActiveIndex } = route.params;
            if (tabActiveIndex) {
                setActiveIndex(parseInt(tabActiveIndex))
                changeTab(parseInt(tabActiveIndex))
            }
        }
    }, [route.params])

    const onMomentumScrollEnd = (e: any) => {
        const { nativeEvent } = e;
        const index = Math.round(nativeEvent.contentOffset.x / width);
        if (index !== activeIndex) {
            setSelectedWarehouse('');
            setSelectedPersonal('');
            setSelectedRayon('')
            setActiveIndex(index)
        }
    }

    const changeTab = (targetIndex: number) => {
        setActiveIndex(targetIndex);
        setSelectedWarehouse('');
        setSelectedPersonal('');
        setSelectedRayon('')
        if (Platform.OS === "ios") {
            setTimeout(() => {
                return scrollRef.current?.scrollTo({ x: width * targetIndex });
            }, 100);
        }
        else {
            return scrollRef.current?.scrollTo({ x: width * targetIndex });
        }
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

    const onSave = () => {
        const _selectedWarehose = storeWarehouseList.find(
            (x) => x.id === selectedWarehose
        );

        const _selectedRayon = rayonData.find(
            (x) => x.id === selectedRayon
        )
        const data = {
            userId: selectedPersonal,
            storeReyonUser: selectedRayon ? true : false,
            storeWarehouseId: selectedWarehose ? selectedWarehose : 0,
            name: _selectedWarehose?.code ? _selectedWarehose?.code : _selectedRayon?.code
        }
        if (selectedRayon) {
            data.storeReyonId = selectedRayon
            createUserExtension(data)
            customButtonAction()
            getUserExtensionList();
            getStorePersonal();
        } else {
            createUserExtension(data)
            customButtonAction()
            getUserExtensionList();
            getStorePersonal();
        }
    }

    const customButtonAction = () => {
        navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseUserList', params: { tabActiveIndex: activeIndex } });
    };

    return (
        <View style={styles.hardContainer}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back"]}
                headerTitle={translate("storeWarehouse.addUserWarehouse")}
                customButtonActions={[
                    {
                        customAction: customButtonAction,
                        buttonType: "back",
                    },
                ]}
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
                    <View style={{ backgroundColor: '#fff', padding: 10, width: width * 0.9, marginTop: 20 }}>
                        <FloComboBox
                            data={storeWarehouseList}
                            keyProp="id"
                            valueProp="code"
                            selectedItem={storeWarehouseList.find(
                                (x) => x.id === selectedWarehose
                            ) || ''}
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
                        <FloComboBox
                            data={personalData}
                            keyProp="employeeId"
                            valueProp="employeeName"
                            selectedItem={personalData.find(
                                (x) => x.employeeId === selectedPersonal
                            )}
                            onSelectItem={(item) => {
                                setSelectedPersonal(item.employeeId)
                            }}
                            placeholder={translate("storeWarehouse.selectStaff")}
                            containerStyle={{
                                borderColor: "rgb(206,202,202)",
                                backgroundColor: "#fff",
                                marginTop: 10,
                            }}
                            textColor={"#7c7c7c"}
                            fontSize="14"
                        />
                        <FloButton
                            onPress={onSave}
                            title={translate("storeWarehouse.add")}
                            containerStyle={{
                                marginBottom: 40,
                                marginTop: 40,
                                backgroundColor: '#00b2ff',
                                borderRadius: 20.5
                            }}
                            disabled={!selectedPersonal || !selectedWarehose}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, width, alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', padding: 10, width: width * 0.9, marginTop: 20 }}>
                        <FloComboBox
                            data={rayonData}
                            keyProp="id"
                            valueProp="code"
                            selectedItem={rayonData.find(
                                (x) => x.id === selectedRayon
                            )}
                            onSelectItem={(item) => {
                                setSelectedRayon(item.id)
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

                        <FloComboBox
                            data={personalData}
                            keyProp="employeeId"
                            valueProp="employeeName"
                            selectedItem={personalData.find(
                                (x) => x.employeeId === selectedPersonal
                            )}
                            onSelectItem={(item) => {
                                setSelectedPersonal(item.employeeId)
                            }}
                            placeholder={translate("storeWarehouse.selectStaff")}
                            containerStyle={{
                                borderColor: "rgb(206,202,202)",
                                backgroundColor: "#fff",
                                marginTop: 10,
                            }}
                            textColor={"#7c7c7c"}
                            fontSize="14"
                        />
                        <FloButton
                            onPress={onSave}
                            title={translate("storeWarehouse.add")}
                            containerStyle={{
                                marginBottom: 40,
                                marginTop: 40,
                                backgroundColor: '#00b2ff',
                                borderRadius: 20.5
                            }}
                            disabled={!selectedPersonal || !selectedRayon}
                        />
                    </View>
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
        fontSize: 16
    }
});

export default StoreWarehouseUserAdded