import React from 'react';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import CaseDetailScreen from './CaseDetailScreen';
import CrmCreateCustomerComplatint from './CreateCustomerComplaint';
import CustomerComplaintList from './CustomerComplaintList';
import FindOrder from './FindOrder';
import MainScreen from './MainScreen';
import NavScreen from './NavScreen';
import OrderDetail from './OrderDetail';
import SearchFiche from './SearchFiche';
import FindFiche from './FindFiche';
import FicheResult from './FicheResult';
import { CRMCaseModel } from 'core/models/CrmCaseModel';

export type NavigationType = NativeStackNavigationProp<AppStackParamList>;
export type AppStackParamList = {
    CaseDetailScreen: { item: CRMCaseModel };
    CreateCustomerComplaint: undefined;
    CustomerComplaintList: undefined;
    FindOrder: undefined;
    MainScreen: undefined;
    NavScreen: undefined;
    OrderDetail: undefined;
    CrmSearchFiche: undefined;
    CrmFindFiche: undefined;
    CrmFicheResult: undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();

const CrmNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, title: 'FloDigital' }} initialRouteName={"NavScreen"}>
            <Stack.Screen name="CaseDetailScreen" component={CaseDetailScreen} />
            <Stack.Screen name="CreateCustomerComplaint" component={CrmCreateCustomerComplatint} />
            <Stack.Screen name="CustomerComplaintList" component={CustomerComplaintList} />
            <Stack.Screen name="FindOrder" component={FindOrder} />
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="NavScreen" component={NavScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetail} />
            <Stack.Screen name="CrmSearchFiche" component={SearchFiche} />
            <Stack.Screen name="CrmFindFiche" component={FindFiche} />
            <Stack.Screen name="CrmFicheResult" component={FicheResult} />

        </Stack.Navigator>
    )
}

export default CrmNavigation
