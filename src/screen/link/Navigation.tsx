import React from 'react';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import LinkView from './Link';

export type NavigationType = NativeStackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    Link: undefined;

}

const Stack = createNativeStackNavigator<AppStackParamList>();


const LinkNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }} initialRouteName={"Link"}>
            <Stack.Screen name="Link" component={LinkView} />

        </Stack.Navigator>
    )
}

export default LinkNavigation