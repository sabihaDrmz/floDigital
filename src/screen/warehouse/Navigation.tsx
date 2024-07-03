import React from 'react';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import RequestScreen from './RequestScreen';

export type NavigationType = NativeStackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    RequestScreen: undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();


const WarehouseNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }}>
            <Stack.Screen name="RequestScreen" component={RequestScreen} />
        </Stack.Navigator>
    )
}

export default WarehouseNavigation