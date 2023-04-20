import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AppNavigator} from './navigation';
import SplashScreen from './screens/SplashScreen';

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

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {loading ? <SplashScreen /> : <AppNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
