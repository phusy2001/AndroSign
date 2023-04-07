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

  return isSignedIn ? (
    <Drawer.Navigator
      initialRouteName="initialRoute"
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Test"
        component={TestScreen}
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
