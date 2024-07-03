import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FloHeader } from '../../components/Header'
import { Path, Svg, Circle } from 'react-native-svg'
import { PerfectFontSize } from '../../helper/PerfectPixel'
import { AppColor, AppText } from '@flomagazacilik/flo-digital-components'
import DaysOfWeek from '../../components/CompletionOfSalesShortage/DaysOfWeek'
import CheckBoxSales from '../../components/CompletionOfSalesShortage/CheckBoxSales'
import { useCompletionOfSalesShortageService } from '../../../src/contexts/CompletionOfSalesShortageService'
import moment from 'moment'
import { compareTimes } from '../../helper'
import { translate } from '../../helper/localization/locaizationMain'
import { useAccountService } from '../../contexts/AccountService'

const AlarmList = ({ navigation, route }: any) => {
    const { getStoreWorkingPlans, storeWorkingPlansData, updateStoreWorkingPlan, deleteStoreWorkingPlan } = useCompletionOfSalesShortageService();
    const { getUserStoreId } = useAccountService();
    const [isSelectCase, setIsSelectCase] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number>(0);
    const [filteredList, setFilteredList] = useState<any[]>();
    const [deleteList, setDeleteList] = useState<any[]>([]);

    useEffect(() => {
        getStoreWorkingPlans(getUserStoreId()).then(
            (res: any) => {
                setFilteredList(res?.filter((data: any) => data.dayOfWeek === 1)?.sort((a: any, b: any) => compareTimes(a.workHour, b.workHour)))
            }
        );
    }, [])

    useEffect(() => {
        route?.params?.isRefresh !== '0' && setFilteredList(storeWorkingPlansData?.filter((data: any) => data.dayOfWeek === selectedDay + 1)?.sort((a: any, b: any) => compareTimes(a.workHour, b.workHour)))
        navigation.setParams({ isRefresh: '0' });
    }, [route?.params?.isRefresh])

    useEffect(() => {
        setFilteredList(storeWorkingPlansData?.filter((data: any) => data.dayOfWeek === selectedDay + 1)?.sort((a: any, b: any) => compareTimes(a.workHour, b.workHour)))
    }, [selectedDay])

    const emptyState = () => (
        <>
            <View style={styles.emptyStateContainer}>
                <View style={styles.emptyState}>
                    <TimerIcon />
                    <AppText style={styles.emptyStateText}>{translate("completionOfSalesShortageAlarmScreen.emptyStateText")}</AppText>
                </View>
            </View>
        </>)

    const onSelectDay = (day: number) => {
        setIsSelectCase(false)
        setSelectedDay(day)
        setDeleteList([])
    }
    const onHandleLongPress = (item: any) => {
        setIsSelectCase(true)
        setDeleteList([item])

    }

    const onToggle = async (item: any) => {
        if (isSelectCase) {
            if (deleteList.some(e => e.storeWorkingPlanId === item.storeWorkingPlanId)) {
                let deletesList = deleteList.filter((list) => list.storeWorkingPlanId !== item.storeWorkingPlanId)
                if (deleteList.length === 1) {
                    setIsSelectCase(false)
                }
                setDeleteList(deletesList)
            } else {
                setDeleteList([...deleteList, item])
            }
        } else {
            const request = [{
                ...item,
                isActive: !item.isActive
            }]
            const updateResponse = await updateStoreWorkingPlan(request)
            if (updateResponse) {
                const getResponse: any = await getStoreWorkingPlans(getUserStoreId())
                getResponse.length && setFilteredList(getResponse?.filter((data: any) => data.dayOfWeek === selectedDay + 1).sort((a: any, b: any) => compareTimes(a.workHour, b.workHour)))
            }
        }
    }

    const onHandleAddDeleteButtton = async () => {
        if (isSelectCase) {
            const deleteResponse = await deleteStoreWorkingPlan(deleteList.map(items => items.storeWorkingPlanId))
            if (deleteResponse) {
                const getResponse: any = await getStoreWorkingPlans(getUserStoreId())
                getResponse.length && setFilteredList(getResponse?.filter((data: any) => data.dayOfWeek === selectedDay + 1).sort((a: any, b: any) => compareTimes(a.workHour, b.workHour)))
            }

            setIsSelectCase(false)
        } else {
            navigation.push('Completionofsalesshortage', {
                screen: "CreateNewAlarm", params: { selectedAlarmDay: selectedDay }
            })
        }
    }
    const renderScreen = () => (
        <View>
            <DaysOfWeek onSelect={onSelectDay} initialDay={0} selectedDay={selectedDay} />
            <FlatList
                data={filteredList}
                renderItem={({ item, index }) => {
                    return <ListItem key={index} item={item} />
                }}
                keyExtractor={(item, index) => index.toString()}
            />
            {isSelectCase && <AppText style={styles.selectedItems}>
                {translate("completionOfSalesShortageAlarmScreen.deleteItemsCount", {
                    qty: deleteList.length,
                })}
            </AppText>}
        </View>
    )

    const ListItem = ({ item, key }: { item: any, key: number }) => {
        return (
            <TouchableOpacity key={key} style={styles.listItemContainer} onLongPress={() => onHandleLongPress(item)} onPress={() => onToggle(item)}>
                <View>
                    <AppText style={{ ...(item.isActive ? styles.listItemTitle : styles.listItemDisabledTitle), opacity: isSelectCase ? 0.3 : 1 }}>
                        {moment(item.workHour, 'HH:mm:ss').format('HH:mm')}
                    </AppText>
                </View>
                <View
                    style={{
                        alignItems: "center",
                    }}
                >
                    {isSelectCase ? (
                        <CheckBoxSales
                            disabled
                            checked={!!deleteList?.some((list) => item.storeWorkingPlanId === list.storeWorkingPlanId)}
                            style={styles.flatListIconItem}
                            checkboxIconContainerStyle={styles.checkboxContainer}
                            checkedIcon={<CheckedIcon />}
                        />
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => onToggle(item)}
                        >
                            <View
                                style={{
                                    width: 60,
                                    height: 30,
                                    borderRadius: 15,
                                    padding: 3,
                                    justifyContent: "center",
                                    alignItems: item.isActive ? "flex-end" : "flex-start",
                                    backgroundColor: item.isActive ? "#FF7F00" : "#C1C1C1",
                                }}
                            >
                                <View
                                    style={{
                                        width: 23,
                                        height: 23,
                                        borderRadius: 13.5,
                                        backgroundColor: AppColor.OMS.Background.Light,
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <>
            <FloHeader
                headerType="standart"
                enableButtons={["back"]}
                headerTitle={translate("completionOfSalesShortageAlarmScreen.menuButtonText")}
            />
            {!storeWorkingPlansData || storeWorkingPlansData.length === 0 ? emptyState() : renderScreen()}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} disabled={isSelectCase && deleteList.length < 1} onPress={onHandleAddDeleteButtton}>
                    {isSelectCase ? <DeleteIcon /> : <AddIcon />}
                </TouchableOpacity>
            </View>
        </>
    )
}

export default AlarmList

const styles = StyleSheet.create({
    emptyStateContainer: {
        zIndex: -9999,
        marginTop: -100,
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center'
    }, buttonContainer: {
        position: 'absolute',
        bottom: 65,
        width: '100%',
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center'
    },
    emptyState: {
        alignItems: 'center'
    },
    emptyStateText: {
        marginTop: 12,
        fontFamily: "Poppins_500Medium",
        fontSize: PerfectFontSize(17),
        color: AppColor.OMS.Background.Dark
    },
    addButton: {
        justifyContent: 'center',
        shadowColor: AppColor.OMS.Background.Dark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    listItemContainer: {
        zIndex: -9999,
        borderRadius: 12,
        backgroundColor: AppColor.OMS.Background.Light,
        marginHorizontal: 20,
        marginVertical: 16,
        paddingHorizontal: 13,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center"
    },
    listItemTitle: {
        color: AppColor.OMS.Background.Dark,
        fontFamily: "Poppins_400Regular",
        fontSize: PerfectFontSize(30),
        lineHeight: PerfectFontSize(36),
        fontStyle: "normal",
    },
    listItemSubtitle: {
        color: "#7B7878",
        fontFamily: "Poppins_400Regular",
        fontSize: PerfectFontSize(14),
        lineHeight: PerfectFontSize(18),
        fontStyle: "normal",
    },
    listItemDisabledTitle: {
        color: '#C1C1C1',
        fontFamily: "Poppins_400Regular",
        fontSize: PerfectFontSize(30),
        lineHeight: PerfectFontSize(36),
        fontStyle: "normal",
    },
    flatListIconItem: {
        justifyContent: "flex-start",
        alignItems: "flex-end",
        borderRadius: 250,
    },
    checkboxContainer: {
        borderRadius: 250,
        width: 22,
        height: 22,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#C1C1C1",
    },
    selectedItems: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        color: AppColor.OMS.Background.Dark,
        fontFamily: "Poppins_400Regular",
        fontSize: PerfectFontSize(19),
    }
})

const TimerIcon = () => (
    <Svg width="80" height="80" viewBox="0 0 80 80">
        <Path id="Vector" d="M40 0C62.092 0 80 17.908 80 40C80 62.092 62.092 80 40 80C17.908 80 0 62.092 0 40C0 17.908 17.908 0 40 0ZM40 16C38.9391 16 37.9217 16.4214 37.1716 17.1716C36.4214 17.9217 36 18.9391 36 20V40C36.0002 41.0608 36.4218 42.078 37.172 42.828L49.172 54.828C49.9264 55.5566 50.9368 55.9598 51.9856 55.9507C53.0344 55.9416 54.0376 55.5209 54.7793 54.7793C55.5209 54.0376 55.9416 53.0344 55.9507 51.9856C55.9598 50.9368 55.5566 49.9264 54.828 49.172L44 38.344V20C44 18.9391 43.5786 17.9217 42.8284 17.1716C42.0783 16.4214 41.0609 16 40 16Z" fill="#FF7F00" />
    </Svg>
);


const AddIcon = () => (
    <Svg width="69" height="69" viewBox="0 0 69 69">
        <Circle cx="34.5" cy="30.5" r="30.5" fill="white" />
        <Path id="Vector" d="M45.2143 32.2857H36.2857V41.2143C36.2857 41.6879 36.0976 42.1421 35.7627 42.477C35.4278 42.8119 34.9736 43 34.5 43C34.0264 43 33.5722 42.8119 33.2373 42.477C32.9024 42.1421 32.7143 41.6879 32.7143 41.2143V32.2857H23.7857C23.3121 32.2857 22.8579 32.0976 22.523 31.7627C22.1881 31.4278 22 30.9736 22 30.5C22 30.0264 22.1881 29.5722 22.523 29.2373C22.8579 28.9024 23.3121 28.7143 23.7857 28.7143H32.7143V19.7857C32.7143 19.3121 32.9024 18.8579 33.2373 18.523C33.5722 18.1881 34.0264 18 34.5 18C34.9736 18 35.4278 18.1881 35.7627 18.523C36.0976 18.8579 36.2857 19.3121 36.2857 19.7857V28.7143H45.2143C45.6879 28.7143 46.1421 28.9024 46.477 29.2373C46.8119 29.5722 47 30.0264 47 30.5C47 30.9736 46.8119 31.4278 46.477 31.7627C46.1421 32.0976 45.6879 32.2857 45.2143 32.2857Z" fill="#FF7F00" />
    </Svg>
);

const DeleteIcon = () => (
    <Svg width="69" height="69" viewBox="0 0 69 69" >
        <Circle cx="34.5" cy="30.5" r="30.5" fill="white" />
        <Path d="M37.75 29V37.25M32.25 29V37.25M26.75 23.5V40C26.75 40.7293 27.0397 41.4288 27.5555 41.9445C28.0712 42.4603 28.7707 42.75 29.5 42.75H40.5C41.2293 42.75 41.9288 42.4603 42.4445 41.9445C42.9603 41.4288 43.25 40.7293 43.25 40V23.5M24 23.5H46M28.125 23.5L30.875 18H39.125L41.875 23.5" stroke="#FF7F00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
);

const CheckedIcon = () => (
    <Svg width="22" height="22" viewBox="0 0 22 22">
        <Circle cx="10.9969" cy="10.9969" r="10.9969" fill="#0D83FE" />
        <Path d="M16.7429 7.23529C16.4 6.92157 15.8857 6.92157 15.5429 7.23529L9.11429 13.1176L6.45714 10.6863C6.11429 10.3725 5.6 10.3725 5.25714 10.6863C4.91429 11 4.91429 11.4706 5.25714 11.7843L8.51429 14.7647C8.68571 14.9216 8.85714 15 9.11429 15C9.37143 15 9.54286 14.9216 9.71429 14.7647L16.7429 8.33333C17.0857 8.01961 17.0857 7.54902 16.7429 7.23529Z" fill="white" />
    </Svg>

)