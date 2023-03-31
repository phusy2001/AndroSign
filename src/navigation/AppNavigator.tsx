/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import CustomDrawer from './CustomDrawer';
import StarredScreen from '../screens/StarredScreen';
import TrashScreen from '../screens/TrashScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import SignScreen from '../screens/SignScreen';

const AuthStack = createNativeStackNavigator();

export const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
    <AuthStack.Screen name="SignUpScreen" component={SignUpScreen} />
    <AuthStack.Screen
      name="OTPVerificationScreen"
      component={OTPVerificationScreen}
    />
  </AuthStack.Navigator>
);

const Drawer = createDrawerNavigator();

export function AppNavigator() {
  const [isSignedIn, setIsSignedIn] = React.useState<boolean>(true);
  return isSignedIn ? (
    <Drawer.Navigator
      initialRouteName="OTPVerification"
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Starred"
        component={StarredScreen}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Trash"
        component={TrashScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  ) : (
    <AuthStackScreen />
  );
}
