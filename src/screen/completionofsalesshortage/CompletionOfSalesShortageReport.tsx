import React, { useEffect, useState } from 'react';
import {
    View, Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    Platform,
    FlatList,
} from 'react-native';
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import DateTimePicker from "../../components/CompletionOfSalesShortage/DateTimePicker";
import { AntDesign } from "@expo/vector-icons";
import moment from 'moment';
import { useMessageBoxService } from '../../contexts/MessageBoxService';
import { useCompletionOfSalesShortageService } from '../../../src/contexts/CompletionOfSalesShortageService'
import { translate } from '../../helper/localization/locaizationMain'
import { isEqualDates } from "../../helper/";
import FloLoading from "components/FloLoading";
import { PerfectFontSize } from 'helper/PerfectPixel';
import { AppButton, AppColor, ColorType } from '@flomagazacilik/flo-digital-components';
import { useAccountService } from '../../contexts/AccountService'
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const CompletionOfSalesShortageReport = () => {
    const MessageBox = useMessageBoxService();
    const navigation = useNavigation();
    const [startDate, setStartDate] = useState<string>(moment().format('DD.MM.YYYY'));
    const [endDate, setEndDate] = useState<string>(moment().format('DD.MM.YYYY'));
    const [startTime, setStartTime] = useState<string>("00:00");
    const [endTime, setEndTime] = useState<string>("23:59");
    const [data, setData] = useState<any>()
    const { isLoading, reportData, getReport, getStoreWorkingPlans, storeWorkingPlansData } = useCompletionOfSalesShortageService();
    const { getUserStoreId } = useAccountService();
    const [dayPlans, setDayPlans] = useState<any>()

    useEffect(() => {
        setData(reportData)
    }, [reportData])

    useEffect(() => {
        !reportData && getReports();
    }, [])

    useEffect(() => {
        if (!moment(startDate).isAfter(endDate) && !moment(endDate).isBefore(startDate)) {
            const data = storeWorkingPlansData?.filter((r: any) => {
                if (r.dayOfWeek === (moment(startDate, "DD.MM.YYYY").toDate().getDay() === 0 ? 7 : moment(startDate, "DD.MM.YYYY").toDate().getDay())) {
                    return r
                }
            })
            setDayPlans(data)
        } else {
            setDayPlans([])
        }
    }, [startDate, endDate])

    const getReports = () => {
        const startDateTime = moment(`${startDate} ${startTime}`, 'DD.MM.YYYY HH:mm').toDate();
        const endDateTime = moment(`${endDate} ${endTime}`, 'DD.MM.YYYY HH:mm').toDate();
        const startDateTimezoneless = new Date(startDateTime.getTime() - startDateTime.getTimezoneOffset() * 60000)
        const endDateTimezoneless = new Date(endDateTime.getTime() - endDateTime.getTimezoneOffset() * 60000)

        if (moment(startDate).isAfter(endDate)) {
            MessageBox.show(translate("report.startDateError"));
        } else if (moment(endDate).isBefore(startDate)) {
            MessageBox.show(translate("report.endDateError"));
        } else {
            const request = {
                storeId: getUserStoreId(),
                startDate: startDateTimezoneless,
                endDate: endDateTimezoneless,
            }
            getReport(request).then((response) => {
                if (isEqualDates(moment(startDate, "DD.MM.YYYY").toDate(), moment(endDate, "DD.MM.YYYY").toDate())) {
                    if (!storeWorkingPlansData) {
                        getStoreWorkingPlans(getUserStoreId()).then((res: any) => {
                            const data = res.filter((r: any) => {
                                if (r.dayOfWeek === (moment(startDate, "DD.MM.YYYY").toDate().getDay() === 0 ? 7 : moment(startDate, "DD.MM.YYYY").toDate().getDay())) {
                                    return r
                                }
                            })
                            setDayPlans(data)
                        })
                    } else {
                        const data = storeWorkingPlansData.filter((r: any) => {
                            if (r.dayOfWeek === (moment(startDate, "DD.MM.YYYY").toDate().getDay() === 0 ? 7 : moment(startDate, "DD.MM.YYYY").toDate().getDay())) {
                                return r
                            }
                        })
                        setDayPlans(data)
                    }
                }
            })
        }
    }
    const itemWidth = screenWidth * 0.6

    const renderCountDetail = (item: any) => {
        return (
            <>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: '#656565', fontSize: 16, fontWeight: 'bold' }}>{translate("report.counts")}</Text>
                </View>
                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.totalSalesCount")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalSalesCount}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.totalOrderCount")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalOrderCount}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.completedOrderCount")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalCompletedOrderCount}</Text>
                </View>


                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.totalPerformance")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalPerformance}%</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.depositedToShelf")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalDepositedToShelf}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.productOnShelf")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalProductOnShelf}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.productNotFound")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalProductNotFound}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.productSingle")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalProductSingle}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.defective")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalProductDefective}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.notProcessed")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalNotProcessed}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.totalDepositedShelfPercentage")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalDepositedShelfPercentage}%</Text>
                </View>
            </>
        )
    }

    const renderTimeDetail = (item: any) => {
        return (
            <>
                <View style={{ marginTop: 40, }}>
                    <Text style={{ color: '#656565', fontSize: 16, fontWeight: 'bold' }}>{translate("report.times")}</Text>
                </View>

                {/* <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.averageCompletedCreationTime")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.averageCompletedCreationTime ? moment(item?.averageCompletedCreationTime).format('DD.MM.YYYY HH:mm') : translate('report.dateNotFound')}</Text>
                </View> */}

                {/* <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.averageCompletedTime")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.averageCompletedTime ? moment(item?.averageCompletedTime).format('DD.MM.YYYY HH:mm') : translate('report.dateNotFound')}</Text>
                </View> */}

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.performance")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalDuration ? moment(item?.totalDuration, 'HH:mm:ss').format('HH:mm') : translate('report.dateNotFound')}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.performancePercentage")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.totalDurationPerProduct ? moment(item?.totalDurationPerProduct, 'HH:mm:ss').format('HH:mm') : translate('report.dateNotFound')}</Text>
                </View>
                <View style={{
                    marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth,
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.firstCompletedRecordDate")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.firstCompletedRecordDate ? moment(item?.firstCompletedRecordDate).format('DD.MM.YYYY HH:mm') : translate('report.dateNotFound')}</Text>
                </View>
                <View style={{
                    marginHorizontal: 20, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth,
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: itemWidth * 0.8 }}>
                        <Text style={styles.countItemText}>{translate("report.lastCompletedRecordDate")}</Text>
                        <Text style={styles.countItemText}>:</Text>
                    </View>
                    <Text style={styles.countItemText}>{item?.lastCompletedRecordDate ? moment(item?.lastCompletedRecordDate).format('DD.MM.YYYY HH:mm') : translate('report.dateNotFound')}</Text>
                </View>
            </>
        )
    }

    if (isLoading) return <FloLoading />
    return (
        <ScrollView style={styles.container}>
            <FloHeaderNew
                headerType="standart"
                enableButtons={["back"]}
                headerTitle={translate("report.completionOfSalesShortageReport")}
                customButtonActions={[
                    {
                        buttonType: "back", customAction: () => { navigation.navigate('PowerBi', { screen: 'ReportList' }) },
                    }
                ]}
            />
            <View style={{
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: Platform.OS === 'web' ? 42 : 12,
                paddingVertical: Platform.OS === 'web' ? 30 : 16,
                marginBottom: 30,
                width: '100%',
                backgroundColor: AppColor.OMS.Background.Light,
                alignItems: 'center'
            }}
            >
                <View style={{
                    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
                    width: Platform.OS === 'web' ? 'auto' : 220,
                    justifyContent: "flex-end"
                }}>
                    <DateTimePicker
                        canSelectTime
                        onDateConfirm={(date) => {
                            setStartDate(date)
                        }}
                        onTimeConfirm={(date) => {
                            setStartTime(date)
                        }}
                        dateTitle={translate("OmsWaybillStatus.startDate")}
                        timeTitle={translate("OmsWaybillStatus.startTime")}
                        defaultDate={startDate}
                        defaultTime={startTime}
                    />
                    <DateTimePicker
                        canSelectTime
                        onDateConfirm={(date) => {
                            setEndDate(date)
                        }}
                        onTimeConfirm={(date) => {
                            setEndTime(date)
                        }}
                        dateTitle={translate("OmsWaybillStatus.endDate")}
                        timeTitle={translate("OmsWaybillStatus.endTime")}
                        defaultDate={endDate}
                        defaultTime={endTime}
                    />
                </View>
                <View style={{
                    alignItems: "flex-end",
                    height: "100%",
                    justifyContent: "flex-end",
                    paddingVertical: Platform.OS === 'web' ? 4 : 0,
                }}>
                    <AppButton
                        buttonColorType={ColorType.Brand}
                        style={{ width: 40, height: 40 }}
                        onPress={getReports}
                    >
                        <AntDesign name={"search1"} color={"#fff"} size={23} />
                    </AppButton>
                </View>
            </View>
            {
                isEqualDates(moment(startDate, "DD.MM.YYYY").toDate(), moment(endDate, "DD.MM.YYYY").toDate()) && dayPlans?.length !== 0 && (
                    <View style={styles.reportContainer}>
                        <View style={{ backgroundColor: '#ff8600', borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10 }}>
                            <Text style={styles.infoText}>
                                {translate("report.automaticWorkOrderHours", {
                                    startDate: startDate,
                                })}
                            </Text>
                        </View>
                        <View style={{ marginTop: 20, marginHorizontal: 15, marginBottom: 20 }}>
                            <FlatList
                                data={dayPlans}
                                keyExtractor={(item) => item.ficheKey}
                                numColumns={(screenWidth - 70) / 75}
                                renderItem={({ item }) =>
                                    <View style={{
                                        width: 65,
                                        borderRadius: 20,
                                        backgroundColor: "#ff7f00",
                                        paddingVertical: 5,
                                        marginHorizontal: 5,
                                        alignItems: "center",
                                    }}>
                                        <Text style={{
                                            textAlign: "center",
                                            fontFamily: "Poppins_400Regular",
                                            fontWeight: "normal",
                                            fontStyle: "normal",
                                            letterSpacing: 0,
                                            color: "#ffffff",
                                            fontSize: PerfectFontSize(16)
                                        }}>
                                            {moment(item.workHour, 'HH:mm:ss').format('HH:mm')}
                                        </Text>
                                    </View>
                                }
                            />
                        </View>
                    </View>
                )
            }
            {data ?
                <View style={styles.reportContainer}>
                    <View style={{ backgroundColor: '#ff8600', borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 10 }}>
                        <Text style={styles.infoText}>
                            {translate("report.completionOfSalesShortageTitle", {
                                startDate: moment(startDate, "DD.MM.YYYY").format('DD-MM-YYYY'),
                                endDate: moment(endDate, "DD.MM.YYYY").format('DD-MM-YYYY'),
                                storeName: data.storeName || '',
                            })}
                        </Text>
                    </View>
                    <View style={{ marginTop: 20, marginHorizontal: 15, marginBottom: 20 }}>
                        <Text style={{ color: data.totalCount === 0 ? '#656565' : '#ff8600', fontSize: 16, fontWeight: 'bold' }}>{data.storeName}</Text>
                        {data.totalCount === 0 ? <Text style={styles.requestNotFound}>{translate("report.completionOfSalesShortageRequestNotFound")}</Text> : <>
                            {renderCountDetail(data)}
                            {renderTimeDetail(data)}
                        </>}

                    </View>
                </View>
                :
                <View style={styles.reportNotFoundContainer}>
                    <Text style={styles.reportNotFound}>
                        {translate("report.reportNotFound")}
                    </Text>
                </View>
            }
        </ScrollView>
    )
}

export default CompletionOfSalesShortageReport

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    countItemText: {
        color: '#656565',
        fontSize: 15,
        fontWeight: '600',
    },
    reportNotFoundContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    reportNotFound: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    requestNotFound: {
        fontWeight: 'bold',
        marginTop: 10,
        color: '#656565',
        fontSize: 16
    },
    infoText: {
        fontSize: 15,
        color: '#fff',
        fontFamily: "Poppins_700Bold",
    },
    reportContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginBottom: 20
    },
    datePickerContainer: {
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
    }
})