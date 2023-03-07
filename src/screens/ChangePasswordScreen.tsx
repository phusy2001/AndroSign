/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text>This is Change password Screen</Text>
    </View>
  );
}

export default ChangePasswordScreen;
