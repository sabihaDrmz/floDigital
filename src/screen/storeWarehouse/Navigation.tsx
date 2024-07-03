import React from 'react';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import StoreWarehouseNavigationList from './StoreWarehouseNavigationList';
import StoreWarehouseIdentification from './StoreWarehouseIdentification';
import StoreWarehouseUnitIdentification from './StoreWarehouseUnitIdentification';
import StoreWarehoseProductIdentification from './StoreWarehoseProductIdentification';
import StoreWarehouseReqList from './StoreWarehouseReqList';
import StoreWarehouseUserList from './StoreWarehouseUserList';
import StoreRayonIdentification from './StoreRayonIdentification';
import StoreWarehouseDeleteProduct from './StoreWarehouseDeleteProduct';
import StoreWarehouseRapor from './StoreWarehouseRapor';
import StoreWarehoseProductFind from './StoreWarehoseProductFind';
import StoreWarehouseInventoryReport from './StoreWarehouseInventoryReport';
import StoreWarehouseRayonDevice from './StoreWarehouseRayonDevice';
import DigitalStore from './DigitalStore';
import SalesRepresentativeScreen from "./SalesRepresentativeScreen";
import StoreWarehouseUserAdded from './StoreWarehouseUserAdded';
import { Platform } from 'react-native';
import StoreWarehouseReqListWeb from './StoreWarehouseReqListWeb';

export type NavigationType = NativeStackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    DigitalStore: undefined;
    SalesRepresentativeScreen: undefined;
    StoreWarehouseNavigationList: undefined;
    StoreWarehouseIdentification: undefined;
    StoreWarehouseUnitIdentification: undefined;
    StoreWarehoseProductIdentification: undefined;
    StoreWarehouseReqList: undefined;
    StoreWarehouseUserList: undefined;
    StoreRayonIdentification: undefined;
    StoreWarehouseDeleteProduct: undefined;
    StoreWarehouseRapor: undefined;
    StoreWarehoseProductFind: undefined;
    StoreWarehouseInventoryReport: undefined;
    StoreWarehouseRayonDevice: undefined;
    StoreWarehouseUserAdded: { tabActiveIndex: number }
    StoreWarehouseReqListWeb: undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();

const StoreWarehouseNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }}>
            <Stack.Screen name="DigitalStore" component={DigitalStore} />
            <Stack.Screen name="SalesRepresentativeScreen" component={SalesRepresentativeScreen} />
            <Stack.Screen name="StoreWarehouseNavigationList" component={StoreWarehouseNavigationList} />
            <Stack.Screen name="StoreWarehouseIdentification" component={StoreWarehouseIdentification} />
            <Stack.Screen name="StoreWarehouseUnitIdentification" component={StoreWarehouseUnitIdentification} />
            <Stack.Screen name="StoreWarehoseProductIdentification" component={StoreWarehoseProductIdentification} />
            <Stack.Screen name="StoreWarehouseReqList" component={StoreWarehouseReqList} />
            <Stack.Screen name="StoreWarehouseReqListWeb" component={StoreWarehouseReqListWeb} />
            <Stack.Screen name="StoreWarehouseUserList" component={StoreWarehouseUserList} />
            <Stack.Screen name="StoreRayonIdentification" component={StoreRayonIdentification} />
            <Stack.Screen name="StoreWarehouseDeleteProduct" component={StoreWarehouseDeleteProduct} />
            <Stack.Screen name="StoreWarehouseRapor" component={StoreWarehouseRapor} />
            <Stack.Screen name="StoreWarehoseProductFind" component={StoreWarehoseProductFind} />
            <Stack.Screen name="StoreWarehouseInventoryReport" component={StoreWarehouseInventoryReport} />
            <Stack.Screen name="StoreWarehouseRayonDevice" component={StoreWarehouseRayonDevice} />
            <Stack.Screen name="StoreWarehouseUserAdded" component={StoreWarehouseUserAdded} />
        </Stack.Navigator>
    )
}

export default StoreWarehouseNavigation