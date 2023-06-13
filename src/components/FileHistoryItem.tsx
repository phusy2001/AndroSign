import React from 'react';
import moment from 'moment';
import {View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';

function FileHistoryItem({item}: any) {
  return (
    <View
      style={{
        display: 'flex',
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: '#f7f3f9',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 6,
      }}>
      <View
        style={{
          width: '20%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Avatar.Text size={48} label="" />
      </View>
      <View style={{width: '70%', justifyContent: 'center'}}>
        {item.action === 'open' ? (
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.text}</Text>
        ) : item.action === 'create' ? (
          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#009FBD'}}>
            {item.text}
          </Text>
        ) : (
          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#3CB371'}}>
            {item.text}
          </Text>
        )}
        <Text style={{fontSize: 14}}>
          Lúc {moment(item.date).format('DD/MM/YYYY HH:mm:ss')}
        </Text>
      </View>
    </View>
  );
}

export default FileHistoryItem;
