/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import CustomDrawer from './CustomDrawer';
import StarredScreen from '../screens/StarredScreen';
import TrashScreen from '../screens/TrashScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import TestScreen from '../screens/TestScreen';
import {useNavigation} from '@react-navigation/native';
import DocumentSignScreen from '../screens/DocumentSignScreen';
import AccountScreen from '../screens/AccountScreen';
import InfoChangeScreen from '../screens/InfoChangeScreen';
import PasswordChangeScreen from '../screens/PasswordChangeScreen';
import SignatureSettingScreen from '../screens/SignatureSettingScreen';
import SignatureAddScreen from '../screens/SignatureAddScreen';

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
export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Account"
      drawerContent={props => <CustomDrawer {...props} />}>
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
        name="Account"
        component={AccountScreen}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Trash"
        component={TrashScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export function AppNavigator() {
  const navigation = useNavigation();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Test');

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate('Settings');
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute('Settings'); // e.g. "Settings"
        }
        setLoading(false);
      });
  }, [navigation]);

  if (loading) {
    return null;
  }

  return (
    <AuthStack.Navigator initialRouteName="LoginScreen">
      <AuthStack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="OTPVerificationScreen"
        component={OTPVerificationScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="InfoChange"
        component={InfoChangeScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="PasswordChange"
        component={PasswordChangeScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="SignatureSetting"
        component={SignatureSettingScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="SignatureAdd"
        component={SignatureAddScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="DocumentSign"
        component={DocumentSignScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  );
}
