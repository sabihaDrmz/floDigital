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
import AppDatePicker from "../../components/AppDatePicker";
import {
    AppButton,
    ColorType,
} from "@flomagazacilik/flo-digital-components";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import moment from 'moment';
import { useMessageBoxService } from '../../contexts/MessageBoxService';
import { useAccountService } from '../../contexts/AccountService'
import { useReportService } from '../../contexts/ReportService'
import { translate } from "../../helper/localization/locaizationMain";

const screenWidth = Dimensions.get('window').width;


const FloDigitalUsageReport = () => {
    const { show } = useMessageBoxService();

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [data, setData] = useState<any>()
    const { getUserStoreId } = useAccountService();
    const { getFloDigitalUsageReport, floDigitalUsageReportData } = useReportService();

    useEffect(() => {
        setData(floDigitalUsageReportData)
    }, [floDigitalUsageReportData])

    useEffect(() => {
        !floDigitalUsageReportData && getReports();
    }, [])

    const getReports = () => {
        if (moment(startDate).isAfter(endDate)) {
            show(translate("report.startDateError"));
        } else if (moment(endDate).isBefore(startDate)) {
            show(translate("report.endDateError"));
        } else {
            const request = {
                employeeIds: [],
                storeCode: getUserStoreId(),
                startDate,
                endDate
            }
            getFloDigitalUsageReport(request)
        }
    }

    const itemWidth = screenWidth * 0.6

    const renderGroupDetail = (item) => {
        return (
            <View style={{ marginHorizontal: 20 }}>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: '#656565', fontSize: 16, fontWeight: 'bold' }}>{item.groupName}</Text>
                </View>
                {item.values.map((value) => <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.9 }}>
                        <Text style={styles.countItemText}>{value.caption}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{value?.value}</Text>
                </View>)}
            </View>
        )
    }

    const RenderItem = ({ item }) => {
        return (
            <View style={{ marginTop: 20, marginHorizontal: 15, marginBottom: 20 }}>
                <Text style={{ color: item.totalCount === 0 ? '#656565' : '#ff8600', fontSize: 16, fontWeight: 'bold' }}>{item.wareHouseName}</Text>
                {item.totalCount === 0 ? <Text style={{ fontWeight: 'bold', marginTop: 10, color: '#656565', fontSize: 16 }}>Flo Digital kullanım bilgisi bulunanamamıştır.</Text> : <>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: '#ff8600', fontSize: 18, fontWeight: 'bold' }}>{item.employeeName ? item.employeeName : (item.employeeId || "")}</Text>
                    </View>
                    {item.groups.map(group => renderGroupDetail(group))}
                </>}
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back"]}
                headerTitle={translate('report.floDigitalUsageReport')}
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
                            onPress={getReports}
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
            {data?.employees && data?.employees.length > 0 ?
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
                        <Text style={{ fontSize: 15, fontFamily: 'bold', color: '#fff' }}>
                            {translate('report.floDigitalUsageTitle', {
                                startDate: moment(data?.startDate).format('DD-MM-YYYY'),
                                endDate: moment(data?.endDate).format('DD-MM-YYYY'),
                            })}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <FlatList
                            showsVerticalScrollIndicator
                            data={data?.employees}
                            renderItem={({ item }) => <RenderItem item={item} />}
                        />
                    </View>

                </View>
                :
                <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        {translate('report.reportNotFound')}
                    </Text>
                </View>
            }
        </ScrollView>
    )
}

export default FloDigitalUsageReport

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    countItemText: {
        color: '#656565', fontSize: 15, fontWeight: '600',
    }
})
