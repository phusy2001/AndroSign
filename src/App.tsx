import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './navigation/AppNavigator';
import SplashScreen from './screens/SplashScreen';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import auth from '@react-native-firebase/auth';
import axiosClient from './services/clients/axios';
import {navigationRef} from './navigation/RootNavigation';

export default function App() {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      notifee.createChannel({
        id: '1',
        name: 'Chanel1',
      });

      notifee.displayNotification({
        title: remoteMessage.data?.title,
        body: remoteMessage.data?.body,
        android: {
          channelId: '1',
          timestamp: Date.now(),
          showTimestamp: true,
        },
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    auth().onIdTokenChanged(user => {
      console.log('Token refresh');
      if (user) {
        user.getIdToken().then(async token => {
          console.log('token', token);
          axiosClient.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          });
        });
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        {loading ? <SplashScreen /> : <AppNavigator />}
      </NavigationContainer>
      <Toast></Toast>
    </SafeAreaProvider>
  );
}
