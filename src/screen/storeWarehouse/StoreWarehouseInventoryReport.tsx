import React, { useEffect, useState } from 'react';
import {
    View, Text,
    StyleSheet,
    FlatList,
    ScrollView,
    Dimensions,
} from 'react-native';

import { useStoreWarehouseService } from '../../contexts/StoreWarehoseService';
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import FloComboBox from '../../components/FloComobox';
import RadioButtonList from "../../NewComponents/FormElements/RadioButtonList";
import { FloButton } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { translate } from "../../helper/localization/locaizationMain";

const screenWidth = Dimensions.get('window').width;

export interface IItem {
    isUnit: boolean
    whId: number
    whName: string
    name: string
    items: string[]
    count: number
}
const StoreWarehouseInventoryReport = ({ }: any) => {
    const navigation = useNavigation();
    const { setWharehouseProductAllReport, getListForStoreWarehouse, getProductAllReport, warehouseProductAllReport, storeWarehouseList } = useStoreWarehouseService();
    const [selectedWarehose, setSelectedWarehouse] = useState<string>('');
    const [isUnit, setIsUnit] = useState('');
    const [data, setData] = useState<IItem[]>([]);
    const itemWidth = screenWidth * 0.6

    const customButtonAction = () => {
        setWharehouseProductAllReport([]);
        //@ts-ignore
        navigation.navigate('StoreWarehouse', { screen: 'StoreWarehouseNavigationList' });
    };

    useEffect(() => {
        getListForStoreWarehouse();
    }, [])

    const onSearch = () => {
        getProductAllReport(selectedWarehose, Boolean(parseInt(isUnit)))
    }

    const RenderItem: React.FC<{ item: IItem }> = ({ item }) => {
        return (
            <View style={{ marginTop: 20, marginHorizontal: 15, marginBottom: 20 }}>
                <Text style={{ color: '#ff8600', fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                {item.items.map((_item, index) => {
                    return (
                        <View key={index} style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                            <Text style={styles.countItemText}>{_item}</Text>
                        </View>
                    )
                })}
            </View>
        )
    }

    useEffect(() => {
        setData(warehouseProductAllReport as IItem[]);
    }, [warehouseProductAllReport])

    const selected = storeWarehouseList.find(
        (x) => x.id === selectedWarehose
    )

    return (
        <ScrollView style={styles.container}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back"]}
                headerTitle={translate("storeWarehouse.warehouseInventoryReport")}
                customButtonActions={[
                    {
                        customAction: customButtonAction,
                        buttonType: "back",
                    },
                ]}
            />
            <View style={styles.containerWrapper}>
                <View style={styles.filterCard}>
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
                    <>
                        {selectedWarehose &&
                            <RadioButtonList
                                containerStyle={{ marginBottom: 20, marginTop: 20 }}
                                horizontal
                                selectedValue={isUnit}
                                onSelect={(type) => {
                                    setIsUnit(type);
                                }}
                                values={[
                                    {
                                        value: '1',
                                        text: `${translate("storeWarehouse.unitReport")}`,
                                    },
                                    {
                                        value: '0',
                                        text: `${translate("storeWarehouse.productReport")}`,
                                    },
                                ]}
                            />
                        }
                    </>
                </View>
                <>
                    {isUnit &&
                        <FloButton
                            onPress={onSearch}
                            title={translate("storeWarehouse.search1")}
                            containerStyle={{
                                marginBottom: 40,
                                marginTop: 40,
                                backgroundColor: '#00b2ff',
                                borderRadius: 20.5
                            }}
                        />}
                </>
                <>
                    {data && data?.length > 0 &&
                        <View style={{
                            backgroundColor: '#fff', marginHorizontal: 10, borderRadius: 10, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,
                            elevation: 7,
                            marginBottom: 30
                        }}>
                            <View style={{ backgroundColor: '#ff8600', borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10 }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>{selected?.code} {isUnit === "1" ? `${translate("storeWarehouse.unitReport")}` : `${translate("storeWarehouse.productReport")}`}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    showsVerticalScrollIndicator
                                    data={data}
                                    renderItem={({ item }) => <RenderItem item={item} />}
                                />
                            </View>
                        </View>
                    }
                </>
            </View>
        </ScrollView>
    )
}

export default StoreWarehouseInventoryReport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerWrapper: {
    },
    filterCard: {
        marginHorizontal: 10,
        backgroundColor: '#fff',
        marginTop: 43,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    countItemText: {
        color: '#656565', fontSize: 15, fontWeight: '600'
    }
})