import React from 'react';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import OmsMain from './OmsMain';
import Pick from './Pick';
import OmsPackage from './Package';

export type NavigationType = NativeStackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    OmsMain: undefined;
    Package: undefined;
    Pick: undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();


const OmsNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }} initialRouteName={"OmsMain"}>
            <Stack.Screen name="OmsMain" component={OmsMain} />
            <Stack.Screen name="Package" component={OmsPackage} />
            <Stack.Screen name="Pick" component={Pick} />
        </Stack.Navigator>
    )
}

export default OmsNavigation