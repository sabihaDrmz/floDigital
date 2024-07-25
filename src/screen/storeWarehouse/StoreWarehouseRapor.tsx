import React, { useEffect, useState } from 'react';
import {
    View, Text,
    StyleSheet,
    FlatList,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { useStoreWarehouseService } from '../../contexts/StoreWarehoseService';
import AppDatePicker from "../../components/AppDatePicker";
import { translate } from "../../helper/localization/locaizationMain";
import {
    AppButton,
    AppText,
    ColorType,
} from "@flomagazacilik/flo-digital-components";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import moment from 'moment';
import { useMessageBoxService } from '../../contexts/MessageBoxService';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const StoreWarehouseRapor = ({ }: any) => {
    const navigation = useNavigation();
    const { getWarehouseRapor, warehouseRaporList } = useStoreWarehouseService();
    const { show } = useMessageBoxService();

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [data, setData] = useState()

    const getRapor = () => {
        if (moment(startDate).isAfter(endDate)) {
            show(`${translate("storeWarehouse.theStartDateCannotGreaterEndDate")}`);
        } else if (moment(endDate).isBefore(startDate)) {
            show(`${translate("storeWarehouse.theEndDateCannotBeforeStartDate")}`);
        } else {
            getWarehouseRapor(startDate, endDate);
        }
    }

    const itemWidth = screenWidth * 0.6

    const renderCountDetail = (item) => {
        return (
            <>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: '#656565', fontSize: 16, fontWeight: 'bold' }}>Sayılar</Text>
                </View>
                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.9 }}>
                        <Text style={styles.countItemText}>{translate("storeWarehouse.totalNumberRequests")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalCount}</Text>
                </View>
                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.9 }}>
                        <Text style={styles.countItemText}>{translate("storeWarehouse.realized")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.successCount}</Text>
                </View>
                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.9 }}>
                        <Text style={styles.countItemText}>{translate("storeWarehouse.unrealized")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.failCount}</Text>
                </View>
                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.9 }}>
                        <Text style={styles.countItemText}>{translate("storeWarehouse.numberValidRequests")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.validCount}</Text>
                </View>
            </>
        )
    }

    const renderTimeDetail = (item) => {
        return (
            <>
                <View style={{ marginTop: 40, }}>
                    <Text style={{ color: '#656565', fontSize: 16, fontWeight: 'bold' }}>{translate("storeWarehouse.timesMinutes")}</Text>
                </View>
                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.9 }}>
                        <Text style={styles.countItemText}>{translate("storeWarehouse.average")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{timeFloat(item?.avarage)}</Text>
                </View>
                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.9 }}>
                        <Text style={styles.countItemText}>{translate("storeWarehouse.shortest")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{timeFloat(item?.min)}</Text>
                </View>
                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.9 }}>
                        <Text style={styles.countItemText}>{translate("storeWarehouse.longest")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{timeFloat(item?.max)}</Text>
                </View>
                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.9 }}>
                        <Text style={styles.countItemText}>{translate("storeWarehouse.median")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{timeFloat(item?.medyan)}</Text>
                </View>
            </>
        )
    }

    const timeFloat = (item) => {
        return item.toFixed(2)
    }

    const RenderItem = ({ item }) => {
        return (
            <View style={{ marginTop: 20, marginHorizontal: 15, marginBottom: 20 }}>
                <Text style={{ color: item.totalCount === 0 ? '#656565' : '#ff8600', fontSize: 16, fontWeight: 'bold' }}>{item.wareHouseName}</Text>
                {item.totalCount === 0 ? <Text style={{ fontWeight: 'bold', marginTop: 10, color: '#656565', fontSize: 16 }}>{translate("storeWarehouse.noRequestsWarehouse")}</Text> : <>
                    {renderCountDetail(item)}
                    {renderTimeDetail(item)}
                </>}

            </View>
        )
    }
    useEffect(() => {
        setData(warehouseRaporList)
    }, [warehouseRaporList])

    return (
        <ScrollView style={styles.container}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back"]}
                headerTitle={translate("storeWarehouse.warehouseReports")}
            />
            <AppDatePicker
                canStartAndFinish
                onStartDateConfirm={(date) => {
                    setStartDate(date);
                }}
                onEndDateConfirm={(date) => {
                    setEndDate(date);
                }}
                actionButton={
                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: Platform.OS === 'web' ? 26 : 20 }}>
                        <AppButton
                            buttonColorType={ColorType.Brand}
                            style={{ width: 40, height: 40 }}
                            onPress={getRapor}
                        >
                            <FontAwesomeIcon icon={"search1"} color={"#fff"} size={23} />
                        </AppButton>
                    </View>
                }
                containerStyle={{
                    margin: 0,
                    marginBottom: 20,
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,
                    elevation: 7,
                    alignItems: 'center',
                }}
                defaultDate={startDate}
                defaultDate2={endDate}
            />
            {data?.items && data?.items.length > 0 ?

                <View style={{
                    backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 10, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,
                    elevation: 7,
                    marginBottom: 20
                }}>
                    <View style={{ backgroundColor: '#ff8600', borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10 }}>
                        <Text style={{ fontSize: 15, fontFamily: 'bold', color: '#fff' }}>{translate('storeWarehouse.warehouseReports', {
                            startDate: moment(data?.startDate).format('DD-MM-YYYY'),
                            endDate: moment(data?.endDate).format('DD-MM-YYYY'),
                        })}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            showsVerticalScrollIndicator
                            data={data?.items}
                            renderItem={({ item }) => <RenderItem item={item} />}
                        />
                    </View>
                </View>
                :
                <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{translate("storeWarehouse.noSuitableReportsSpecifiedDates")}</Text>
                </View>
            }
        </ScrollView>
    )
}

export default StoreWarehouseRapor

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    countItemText: {
        color: '#656565', fontSize: 15, fontWeight: '600'
    }
})
