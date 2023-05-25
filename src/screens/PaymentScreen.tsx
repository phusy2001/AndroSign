import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';

function PaymentScreen({route, navigation}: any) {
  const [orderUrl, setOrderUrl] = useState('');

  useEffect(() => {
    setOrderUrl(route.params.order_url);
  }, [route.params.order_url]);

  return orderUrl ? (
    <WebView
      source={{
        uri: orderUrl,
      }}
      style={{flex: 1}}
    />
  ) : (
    <View></View>
  );
}

export default PaymentScreen;
