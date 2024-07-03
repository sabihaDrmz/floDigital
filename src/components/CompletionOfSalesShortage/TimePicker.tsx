import { Platform, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppColor } from '@flomagazacilik/flo-digital-components'
import { PerfectFontSize } from 'helper/PerfectPixel'
import ComboboxSales from './ComboboxSales';
import { translate } from 'helper/localization/locaizationMain';

interface Props{
    onSelectChange(data:string):void;
}

const TimePicker = ({onSelectChange}:Props) => {
    
    const [selectedHour, setSelectedHour] = useState<string>('00')
    const [selectedMinute, setSelectedMinute] = useState<string>('00')
    const [selectedTime, setSelectedTime] = useState<string>(`${selectedHour}:${selectedMinute}`)

    const onSelectHour= (item:any) => {
        setSelectedHour(item?.value)
        setSelectedTime(`${item?.value}:${selectedMinute}`)
    }

    const onSelectMinute= (item:any) => {
        setSelectedMinute(item?.value)
        setSelectedTime(`${selectedHour}:${item?.value}`)
    }
    useEffect(() => {
        selectedTime && onSelectChange(selectedTime)
    }, [selectedTime])
    
    return (
        <View style={styles.timeContainer} >
            <ComboboxSales
                hideIcon
                showClearButton
                placeholder={translate("completionOfSalesShortageAlarmScreen.hour") }
                data={Array.from(Array(24).keys()).map((item) =>({id:item, value: item < 10 ? `0${item}` : `${item}`}))}
                keyProp="id"
                valueProp="value"
                textColor={AppColor.OMS.Background.Dark}
                containerStyle={[styles.comboBoxes, { height: 36, width: 70}]}
                fontSize={PerfectFontSize(30)}
                onSelectItem={onSelectHour}
                swipeClose={false}
                selectedItem={selectedHour} />
            <View style={styles.hourMinuteDivider} />
            <ComboboxSales
                hideIcon
                showClearButton
                placeholder={translate("completionOfSalesShortageAlarmScreen.minute") }
                data={Array.from(Array(60).keys()).map((item) =>({id:item, value: item < 10 ? `0${item}` : `${item}`}))}
                keyProp="id"
                valueProp="value"
                textColor={AppColor.OMS.Background.Dark}
                containerStyle={[styles.comboBoxes, { height: 36, width: 70 }]}
                fontSize={PerfectFontSize(30)}
                onSelectItem={onSelectMinute}
                selectedItem={selectedMinute} />
        </View>
    )
}

export default TimePicker

const styles = StyleSheet.create({
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 58,
        paddingHorizontal: 80,
        height: 'auto',
    },
    hourMinuteDivider: {
        width: 1,
        height: 160,
        backgroundColor: '#D7D7D7',
        marginHorizontal: 62
    },
    comboBoxes: {
      height: 31,
      backgroundColor: Platform.OS === "web" ? undefined : AppColor.OMS.Background.Light,
     
      borderRadius: Platform.OS === "web" ? 12 : 10,
      alignItems: "center",
      justifyContent: Platform.OS === "web" ? "space-between" : "center",
      paddingHorizontal: 8,
      marginBottom: Platform.OS === "web" ? 10 : 0,
      flexDirection: "row",
      marginRight :Platform.OS === "web" ? 20 : 0,
    },
})