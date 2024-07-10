import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import LoginScreen from "./screen/login/LoginScreen";
import CompletionOfSalesShortageNavigation from "./screen/completionofsalesshortage/CompletionOfSalesShortageNavigation";
import CrmNavigation from "./screen/crm/Navigation";
import IdesNavigation from "./screen/ides/Navigation";
import IsoNavigation from "./screen/iso/Navigation";
import LinkNavigation from "./screen/link/Navigation";
import NotificationNavigation from "./screen/notification/Navigation";
import OmsNavigation from "./screen/oms/Navigation";
import PowerBiNavigation from "./screen/powerBi/Navigation";
import PrinterNavigation from "./screen/printer/Navigation";
import SelfCheckoutNavigation from "./screen/selfcheckout/Navigation";
import StoreWarehouseNavigation from "./screen/storeWarehouse/Navigation";
import WarehouseNavigation from "./screen/warehouse/Navigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Home from "./screen/home";
import Intro from "./screen/intro";
import DrawerNavigatior from "./DrawerNavigatior";
import React from "react";

export type NavigationType = StackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    Login: undefined;
    Main: undefined;
    Completionofsalesshortage: undefined;
    Crm: undefined;
    Ides: undefined;
    Iso: undefined;
    Link: undefined;
    Notification: undefined;
    Oms: undefined;
    PowerBi: undefined;
    Printer: undefined;
    SelfCheckout: undefined;
    StoreWarehouse: undefined;
    Warehouse: undefined;
    Intro: undefined;
    Profile: undefined;
};
const Stack = createNativeStackNavigator<AppStackParamList>();
const StackNavigator = () => {
    return (
        <SafeAreaProvider>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name='Main' component={DrawerNavigatior} />
                <Stack.Screen name='Completionofsalesshortage' component={CompletionOfSalesShortageNavigation} />
                <Stack.Screen name='Crm' component={CrmNavigation} />
                <Stack.Screen name='Ides' component={IdesNavigation} />
                <Stack.Screen name='Iso' component={IsoNavigation} />
                <Stack.Screen name='Link' component={LinkNavigation} />
                <Stack.Screen name='Notification' component={NotificationNavigation} />
                <Stack.Screen name='Oms' component={OmsNavigation} />
                <Stack.Screen name='PowerBi' component={PowerBiNavigation} />
                <Stack.Screen name='Printer' component={PrinterNavigation} />
                <Stack.Screen name='SelfCheckout' component={SelfCheckoutNavigation} />
                <Stack.Screen name='StoreWarehouse' component={StoreWarehouseNavigation} />
                <Stack.Screen name='Warehouse' component={WarehouseNavigation} />
                <Stack.Screen name='Intro' component={Intro} />
            </Stack.Navigator>
        </SafeAreaProvider>
    )
}

export default StackNavigator
