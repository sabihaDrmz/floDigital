import React from 'react';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchFiche from './SearchFiche';
import FindFiche from './FindFiche';
import FicheResult from './FicheResult';
import FindFicheListScreen from './FindFicheListScreen';
import ListAuiDocScreen from './ListAuiDocScreen';
import FicheProductList from './FicheProductList';
import CancelListComplete from './CancelListComplete';
import CancelList from './CancelList';
import CancellationScreen from './CancellationScreen';
import BrokenProductResult from './BrokenProductResult';
import BrokenProductFicheListWithPhone from './BrokenProductFicheListWithPhone';
import BrokenFichePaymentResult from './BrokenFichePaymentResult';
import BrokenComplete from './BrokenComplete';
import BackCargoScreen from './BackCargoScreen';
import ReturnProductFichePaymentResult from './ReturnProductFichePaymentResult';
import ReturnProductFindFiche from './ReturnProductFindFiche';
import ReturnFicheProductList from './ReturnFicheProductList';

export type NavigationType = NativeStackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    IdesFindFiche: undefined;
    FindFicheListScreen: undefined;
    IdesSearchFiche: undefined;
    ListAuiDocScreen: undefined;
    FindFicheScreen: undefined;
    IdesFicheResult: undefined;
    FicheProductList: undefined;
    CancelListComplete: undefined;
    CancelList: undefined;
    CancellationScreen: undefined;
    BrokenProductResult: undefined;
    BrokenProductFicheListWithPhone: undefined;
    BrokenFichePaymentResult: undefined;
    BrokenComplete: undefined;
    BackCargoScreen: undefined;
    ReturnProductFichePaymentResult: undefined;
    ReturnProductFindFiche: undefined;
    ReturnFicheProductList: undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();

const IdesNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }}>
            <Stack.Screen name="IdesFindFiche" component={FindFiche} />
            <Stack.Screen name="FindFicheListScreen" component={FindFicheListScreen} />
            <Stack.Screen name="IdesSearchFiche" component={SearchFiche} />
            <Stack.Screen name="ListAuiDocScreen" component={ListAuiDocScreen} />
            <Stack.Screen name="FindFicheScreen" component={FindFicheListScreen} />
            <Stack.Screen name="IdesFicheResult" component={FicheResult} />
            <Stack.Screen name="FicheProductList" component={FicheProductList} />
            <Stack.Screen name="CancelListComplete" component={CancelListComplete} />
            <Stack.Screen name="CancelList" component={CancelList} />
            <Stack.Screen name="CancellationScreen" component={CancellationScreen} />
            <Stack.Screen name="BrokenProductResult" component={BrokenProductResult} />
            <Stack.Screen name="BrokenProductFicheListWithPhone" component={BrokenProductFicheListWithPhone} />
            <Stack.Screen name="BrokenFichePaymentResult" component={BrokenFichePaymentResult} />
            <Stack.Screen name="BrokenComplete" component={BrokenComplete} />
            <Stack.Screen name="BackCargoScreen" component={BackCargoScreen} />
            <Stack.Screen name="ReturnProductFichePaymentResult" component={ReturnProductFichePaymentResult} />
            <Stack.Screen name="ReturnProductFindFiche" component={ReturnProductFindFiche} />
            <Stack.Screen name="ReturnFicheProductList" component={ReturnFicheProductList} />
        </Stack.Navigator>
    )
}

export default IdesNavigation