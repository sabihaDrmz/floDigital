import React from 'react';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import QueryScreen from './QueryScreen';
import SelfCheckOutScreen from './SelfCheckOutScreen';

export type NavigationType = NativeStackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    QueryScreen: undefined;
    SelfCheckOutScreen: undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();


const SelfCheckoutNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }} initialRouteName="QueryScreen">
            <Stack.Screen name="QueryScreen" component={QueryScreen} />
            <Stack.Screen name="SelfCheckOutScreen" component={SelfCheckOutScreen} />
        </Stack.Navigator>
    )
}

export default SelfCheckoutNavigation