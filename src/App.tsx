import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './navigation/AppNavigator';
import SplashScreen from './screens/SplashScreen';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import auth from '@react-native-firebase/auth';
import {navigationRef} from './navigation/RootNavigation';
import {storeData} from './utils/asyncStore';
import './i18n/i18n';
import notifee, {EventType} from '@notifee/react-native';
import {ErrorToast, InfoToast, SuccessToast} from 'react-native-toast-message';

export default function App() {
  const [loading, setLoading] = React.useState(true);

  const toastConfig = {
    success: (props: any) => (
      <SuccessToast
        {...props}
        text1NumberOfLines={2}
        text2NumberOfLines={2}
        style={{borderLeftWidth: 10, borderLeftColor: '#59CE8F'}}
        text1Style={{
          fontSize: 14,
          fontWeight: '500',
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        text1NumberOfLines={2}
        text2NumberOfLines={2}
        style={{borderLeftWidth: 10, borderLeftColor: 'red'}}
        text1Style={{
          fontSize: 14,
          fontWeight: '500',
        }}
      />
    ),
    info: (props: any) => (
      <InfoToast
        {...props}
        text1NumberOfLines={2}
        text2NumberOfLines={2}
        style={{borderLeftWidth: 10, borderLeftColor: '#068FFF'}}
        text1Style={{
          fontSize: 14,
          fontWeight: '500',
        }}
      />
    ),
  };

  const onMessageReceived = async (message: any) => {
    const channelId = await notifee.createChannel({
      id: 'Chanel1',
      name: 'Chanel1',
    });

    const {title, body} = message.data;
    notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
      },
    });
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(onMessageReceived);

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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // useEffect(() => {
  //   auth().onIdTokenChanged(user => {
  //     console.log('Token refresh');
  //     if (user) {
  //       user.getIdToken().then(async token => {
  //         console.log('token when token change =>', token);
  //         try {
  //           await storeData('userToken', token);
  //         } catch (e) {
  //           console.log(e);
  //         }
  //       });
  //     }
  //   });
  // }, []);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        await messaging().requestPermission();
      } catch (error) {
        console.log('Permission rejected');
      }
    };
    requestPermission();
  }, []);

  useEffect(() => {
    const getFCMToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM token:', token);
      } catch (error) {
        console.log('Failed to get FCM token:', error);
      }
    };
    getFCMToken();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        {loading ? <SplashScreen /> : <AppNavigator />}
      </NavigationContainer>
      <Toast config={toastConfig}></Toast>
    </SafeAreaProvider>
  );
}
