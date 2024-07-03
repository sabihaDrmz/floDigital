import React from 'react';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import PrinterScreen from './PrinterScreen';

export type NavigationType = NativeStackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    PrinterScreen: undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();


const PrinterNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }} initialRouteName={'PrinterScreen'}>
            <Stack.Screen name="PrinterScreen" component={PrinterScreen} />
        </Stack.Navigator>
    )
}

export default PrinterNavigation