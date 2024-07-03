import React from 'react';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import ReportList from './ReportList';
import ReportScreen from './ReportScreen';
import FloDigitalUsageReport from './FloDigitalUsageReport';

export type NavigationType = NativeStackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    ReportList: undefined;
    ReportScreen: undefined;
    SalesLossReport: undefined;
    FloDigitalUsageReport: undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();


const PowerBiNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }}>
            <Stack.Screen name="ReportList" component={ReportList} />
            <Stack.Screen name="ReportScreen" component={ReportScreen} />
            <Stack.Screen name="FloDigitalUsageReport" component={FloDigitalUsageReport} />
        </Stack.Navigator>
    )
}

export default PowerBiNavigation