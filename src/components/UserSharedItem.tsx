import React from 'react';
import {View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';

function UserSharedItem({item, onPressRemoveFunction}: any) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#F8F8F8',
        paddingLeft: 10,
        paddingRight: 10,
        // paddingTop: 3,
        // paddingBottom: 3,
        marginBottom: 10,
        borderRadius: 6,
      }}>
      <View
        style={{
          width: '20%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* <Avatar.Image size={48} source={''} /> */}
        <IconButton icon="account-circle" size={48} />
      </View>
      <View style={{width: '70%', justifyContent: 'center'}}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item}</Text>
        <Text style={{fontSize: 15}}>trongle@gmail.com</Text>
      </View>
      <View
        style={{
          width: '10%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton
          onPress={() => onPressRemoveFunction(item)}
          iconColor="red"
          icon="close-box"
          size={28}
        />
      </View>
    </View>
  );
}

export default UserSharedItem;
