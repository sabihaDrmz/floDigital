import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Profile from './screen/profile';
import TabNavigation from './TabNavigation';

const Drawer = createDrawerNavigator();

const DrawerNavigatior = () => {
    return (
        <Drawer.Navigator options={{animationEnabled: true}} drawerContent={() => <Profile />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen options={{animationEnabled: true}}  name="MainTab" component={TabNavigation} />
            <Drawer.Screen options={{animationEnabled: true}}  name="ProfileScreen" component={Profile} />
        </Drawer.Navigator>
    )
}

export default DrawerNavigatior
