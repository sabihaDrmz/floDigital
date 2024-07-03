import React from 'react';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import NotificationMain from './NotificationMain';

export type NavigationType = NativeStackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    NotificationMain: undefined;

}

const Stack = createNativeStackNavigator<AppStackParamList>();


const NotificationNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }} initialRouteName="NotificationMain">
            <Stack.Screen name="NotificationMain" component={NotificationMain} />
        </Stack.Navigator>
    )
}

export default NotificationNavigation