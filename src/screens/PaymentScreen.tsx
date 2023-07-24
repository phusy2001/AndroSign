import React, {useEffect} from 'react';
import WebView from 'react-native-webview';
import {checkStatus, updateStatus} from '../services/payment';

function PaymentScreen({route, navigation}: any) {
  useEffect(() => {
    const myTimeout = setTimeout(() => {
      navigation.navigate('Account');
    }, 1000 * 60 * 15);
    const myInterval = setInterval(async () => {
      const status = await checkStatus(route.params.app_trans_id);
      if (status.return_code === 1 || status.return_code === 2) {
        await updateStatus(route.params.app_trans_id);
        clearInterval(myInterval);
        clearTimeout(myTimeout);
        navigation.navigate('Account');
      }
    }, 5000);
  }, []);

  return (
    <WebView
      source={{
        uri: route.params.order_url,
      }}
      style={{flex: 1}}
    />
  );
}

export default PaymentScreen;
