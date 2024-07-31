import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompletionOfSalesShortage from './CompletionOfSalesShortage';
import CompletionOfSalesShortageExecutive from './CompletionOfSalesShortageExecutive';
import AlarmList from './AlarmList';
import CreateNewAlarm from './CreateNewAlarm';
import CompletionOfSalesShortageReport from './CompletionOfSalesShortageReport';

const Stack = createNativeStackNavigator();


const CompletionOfSalesShortageNavigation = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }}>
            <Stack.Screen name="CompletionOfSalesShortage" component={CompletionOfSalesShortage} />
            <Stack.Screen name="CompletionOfSalesShortageExecutive" component={CompletionOfSalesShortageExecutive} />
            <Stack.Screen name="AlarmList" component={AlarmList} />
            <Stack.Screen name="CreateNewAlarm" component={CreateNewAlarm} />
            <Stack.Screen name="CompletionOfSalesShortageReport" component={CompletionOfSalesShortageReport} />
        </Stack.Navigator>
    )
}

export default CompletionOfSalesShortageNavigation
