import React from 'react';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import IsoBarcodeCheck from './BarcodeCheck';
import BasketList from './BasketList';
import Basket from './Basket';
import AddressList from './AddressList';
import NewAddress from './NewAddress';
import ProductQrPreview from './ProductQrPreview';
import Product from './Product';
import IsoReturn from './IsoReturn';
import RussiaQr from './RussiaQr';
import RussiaBarcodeCheck from './RussiaBarcodeCheck'
import RussiaQrList from './RussiaQrList'


export type NavigationType = NativeStackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    BarcodeCheck: undefined;
    BasketList: undefined;
    Basket: undefined;
    AddressList: undefined;
    NewAddress: undefined;
    ProductQrPreview: undefined;
    Product: undefined;
    IsoReturn: undefined;
    RussiaQr: undefined;
    RussiaBarcodeCheck: undefined;
    RussiaQrList: undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();


const IsoNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }} initialRouteName={'BarcodeCheck'}>
            <Stack.Screen name="BarcodeCheck" component={IsoBarcodeCheck} />
            <Stack.Screen name="BasketList" component={BasketList} />
            <Stack.Screen name="Basket" component={Basket} />
            <Stack.Screen name="AddressList" component={AddressList} />
            <Stack.Screen name="NewAddress" component={NewAddress} />
            <Stack.Screen name="ProductQrPreview" component={ProductQrPreview} />
            <Stack.Screen name="Product" component={Product} />
            <Stack.Screen name="IsoReturn" component={IsoReturn} />
            <Stack.Screen name="RussiaQr" component={RussiaQr} />
            <Stack.Screen name="RussiaBarcodeCheck" component={RussiaBarcodeCheck} />
            <Stack.Screen name="RussiaQrList" component={RussiaQrList} />

        </Stack.Navigator>
    )
}

export default IsoNavigation
