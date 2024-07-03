import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FloHeader } from '../../components/Header'
import DaysOfWeek from '../../components/CompletionOfSalesShortage/DaysOfWeek'
import { PerfectFontSize } from '../../helper/PerfectPixel'
import { Path, Svg } from 'react-native-svg'
import { AppColor, AppText } from '@flomagazacilik/flo-digital-components'
import TimePicker from '../../components/CompletionOfSalesShortage/TimePicker'
import { translate } from '../../helper/localization/locaizationMain'
import { useMessageBoxService } from '../../contexts/MessageBoxService';
import { useAccountService } from '../../contexts/AccountService';
import { useCompletionOfSalesShortageService } from "../../contexts/CompletionOfSalesShortageService";

const CreateNewAlarm = ({ navigation, route }: any) => {
    const [selectedDay, setSelectedDay] = useState<number>();
    const [selectedTime, setSelectedTime] = useState<string>();
    const { createStoreWorkingPlan, getStoreWorkingPlans } = useCompletionOfSalesShortageService();
    const { getUserStoreId } = useAccountService();
    const { selectedAlarmDay } = route?.params;
    const { show } = useMessageBoxService();

    useEffect(() => {
        setSelectedDay(selectedAlarmDay ? +selectedAlarmDay : undefined);
    }, [selectedAlarmDay])

    const onSelectDay = (day: number) => {
        setSelectedDay(day)
    }

    const handleCreateNewAlarm = async () => {
        if (selectedDay !== undefined && selectedDay > -1) {
            const createResponse = await createStoreWorkingPlan([
                {
                    storeCode: getUserStoreId(),
                    dayOfWeek: selectedDay + 1,
                    workHour: selectedTime + ':00'
                }
            ])
            if (createResponse) {
                const getResponse: any = await getStoreWorkingPlans(getUserStoreId())
                getResponse && navigation.push('Completionofsalesshortage',{
                    screen: "AlarmList",
                    params: {
                        isRefresh: '1'
                    }
                })
            }
        } else {
            show(translate("completionOfSalesShortageAlarmScreen.dateNotSelectError"))
        }
    }

    return (
        <View style={{ height: "100%" }}>
            <FloHeader
                headerType="standart"
                enableButtons={["back"]}
                headerTitle={translate("completionOfSalesShortageAlarmScreen.menuButtonText")}
            />
            <DaysOfWeek onSelect={onSelectDay} initialDay={0} selectedDay={selectedDay} />
            <View style={styles.container}>
                <TimePicker onSelectChange={(data: string) => setSelectedTime(data)} />
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCreateNewAlarm}
                >
                    <AppText style={styles.buttonText}>
                        {translate("completionOfSalesShortageAlarmScreen.save")}
                    </AppText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CreateNewAlarm

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColor.OMS.Background.Light,
    },
    repeatDropdown: {
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 24
    },
    repeatDropdownLabel: {
        color: AppColor.OMS.Background.Dark,
        fontFamily: "Poppins_500Medium",
        fontSize: PerfectFontSize(16),
    },
    repeatDropdownValue: {
        color: "#7B7878",
        fontFamily: "Poppins_500Medium",
        fontSize: PerfectFontSize(16),
        marginRight: 12
    },
    button: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        height: 44,
        width: 205,
        backgroundColor: AppColor.OMS.Background.Fundamental,
        borderRadius: 20,
        marginBottom: 10,
    },
    buttonText: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: PerfectFontSize(14),
        color: AppColor.OMS.Background.Light,
    },
    buttonView: {
        width: "100%",
        position: 'absolute',
        bottom: 65,
        justifyContent: 'center',
    }
})


const ArrowIcon = () => {
    return (
        <Svg width="11" height="19" viewBox="0 0 11 19" fill="#7B7878">
            <Path d="M0.738007 1.02103L0.738055 1.02108C0.920589 0.84707 1.1631 0.75 1.41528 0.75C1.66746 0.75 1.90997 0.84707 2.09251 1.02108L10.2456 8.7894C10.2456 8.7894 10.2456 8.78941 10.2456 8.78941C10.3418 8.88107 10.4184 8.99132 10.4707 9.11346C10.5231 9.23561 10.55 9.36711 10.55 9.5C10.55 9.63289 10.5231 9.76439 10.4707 9.88654C10.4184 10.0087 10.3418 10.1189 10.2456 10.2106L10.2456 10.2106M0.738007 1.02103L10.2456 10.2106M0.738007 1.02103L0.733786 1.02525L0.727089 1.03194C0.637501 1.11769 0.566101 1.22063 0.51717 1.3346C0.467785 1.44964 0.442316 1.57352 0.442316 1.69871C0.442316 1.8239 0.467785 1.94778 0.51717 2.06281C0.566556 2.17785 0.638828 2.28163 0.729589 2.36786L8.21698 9.50143M0.738007 1.02103L8.21698 9.50143M10.2456 10.2106L2.0925 17.9789M10.2456 10.2106L2.0925 17.9789M2.0925 17.9789C2.09249 17.9789 2.09247 17.979 2.09246 17.979C1.90993 18.1529 1.66744 18.25 1.41528 18.25C1.16309 18.25 0.920587 18.1529 0.738055 17.9789L0.733738 17.9748L0.733788 17.9748L0.727084 17.9681C0.637498 17.8823 0.5661 17.7794 0.517168 17.6654C0.467784 17.5504 0.442315 17.4265 0.442315 17.3013C0.442315 17.1761 0.467784 17.0522 0.517168 16.9372C0.566514 16.8222 0.638708 16.7185 0.729365 16.6324L2.0925 17.9789ZM8.21698 9.50143L0.729589 16.6321L8.21698 9.50143Z" fill="#7B7878" stroke="#7B7878" stroke-width="0.5" />
        </Svg>

    )
};