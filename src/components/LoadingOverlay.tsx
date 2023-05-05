import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

function LoadingOverlay() {
  return (
    <View style={style.loading}>
      <ActivityIndicator animating size="large" />
    </View>
  );
}

const style = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B7B7B7',
    opacity: 0.4,
  },
});

export default LoadingOverlay;
