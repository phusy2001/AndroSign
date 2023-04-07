import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect} from 'react';
import {AppRegistry} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import App from './src/App';
import AxiosClient from './src/services/clients/api';

const theme = {
  dark: true,
  mode: 'adaptive',
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
  },
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
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
  const api = new AxiosClient();

  const onAppBootstrap = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    console.log('FCMToken', token);

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
