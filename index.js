import messaging from '@react-native-firebase/messaging';
import React, {useEffect} from 'react';
import {AppRegistry} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import App from './src/App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {EventType} from '@notifee/react-native';

const theme = {
  dark: true,
  mode: 'adaptive',
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
  },
};

const onMessageReceived = async message => {
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

messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    // Update external API
    await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
      method: 'POST',
    });

    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

export default function Main() {
  const onAppBootstrap = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    console.log('FCMToken', token);

    try {
      await AsyncStorage.setItem('fcmToken', token);
    } catch (e) {
      console.log('Async Storage Error', e);
    }

    // Save the token
    //await postToApi('/users/1234/tokens', {token});
    //api.post('', token);
  };

  useEffect(() => {
    onAppBootstrap();
  });

  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
