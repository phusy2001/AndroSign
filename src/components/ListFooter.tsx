import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

function ListFooter({isLoading}: any) {
  if (isLoading) {
    return (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  } else {
    return null;
  }
}

export default ListFooter;
