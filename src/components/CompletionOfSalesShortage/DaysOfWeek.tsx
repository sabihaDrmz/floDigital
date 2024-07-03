import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { PerfectFontSize } from 'helper/PerfectPixel'
import { translate } from 'helper/localization/locaizationMain';

interface Props{
    onSelect(day:number):any;
    initialDay?: number;
    selectedDay:number;
}
const DaysOfWeek = ({onSelect, initialDay, selectedDay}:Props) => {
    useEffect(() => {
       if(initialDay){
        onSelect(initialDay)
       }
    }, [initialDay])
    
    const Days = [
        translate("completionOfSalesShortageAlarmScreen.mondayShort"),
        translate("completionOfSalesShortageAlarmScreen.tuesdayShort"),
        translate("completionOfSalesShortageAlarmScreen.wednesdayShort"),
        translate("completionOfSalesShortageAlarmScreen.thursdayShort"),
        translate("completionOfSalesShortageAlarmScreen.fridayShort"),
        translate("completionOfSalesShortageAlarmScreen.saturdayShort"),
        translate("completionOfSalesShortageAlarmScreen.sundayShort")
    ]
    return (
        <View style={styles.container}>
            {Days.map((item, index) => (
                <TouchableOpacity key={index} style={index ===selectedDay  ? styles.selectedDayContainer : styles.dayContainer} onPress={()=>onSelect(index)}>
                    <Text style={index === selectedDay ? styles.selectedDay : styles.day}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default DaysOfWeek

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        shadowColor: "rgba(0, 0, 0, 0.16)",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 1,
        borderStyle: "solid",
        borderWidth: 0.5,
        borderColor: "#D7D7D7",
        paddingHorizontal: 14,
        paddingVertical: 18
    },
    selectedDay: {
        color: '#FFFFFF',
        fontSize: PerfectFontSize(13),
        fontWeight: "600",
        fontStyle: "normal",
        fontFamily: "Poppins_600SemiBold",
    },
    selectedDayContainer: {
        width: 31,
        height: 31,
        borderRadius: 16,
        backgroundColor: '#FF7F00',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dayContainer: {
        width: 31,
        height: 31,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    day: {
        color: '#FF7F00',
        fontSize: PerfectFontSize(13),
        fontWeight: "600",
        fontStyle: "normal",
        fontFamily: "Poppins_600SemiBold",
    }
})