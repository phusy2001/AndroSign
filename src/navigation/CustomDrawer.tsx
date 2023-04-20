/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import React from 'react';
import {View} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Dimensions} from 'react-native';
import {signout} from '../services/auth';
import {navigate} from './RootNavigation';
const windowHeight = Dimensions.get('window').height;

function CustomDrawer(props: any) {
  const logout = async () => {
    try {
      await signout();
      console.log('Logout successfully!');
      navigate('Login', {});
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          height: windowHeight - 40,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            paddingVertical: 100,
          }}>
          <DrawerItem
            icon={() => <Icon name="file-document" size={24} color="#000" />}
            label="Tài liệu"
            onPress={() => props.navigation.navigate('Home')}
          />
          <DrawerItem
            icon={() => <Icon name="folder" size={24} color="#000" />}
            label="Thư mục"
            onPress={() => props.navigation.navigate('Folders')}
          />
          <DrawerItem
            icon={() => <Icon name="star" size={24} color="#000" />}
            label="Được gắn sao"
            onPress={() => props.navigation.navigate('Starred')}
          />
          <DrawerItem
            icon={() => <Icon name="trash-can" size={24} color="#000" />}
            label="Thùng rác"
            onPress={() => props.navigation.navigate('Trash')}
          />
          <Divider bold={true} style={{marginTop: 62, marginBottom: 44}} />
          <DrawerItem
            icon={() => <Icon name="account" size={24} color="#000" />}
            label="Tài khoản"
            onPress={() => props.navigation.navigate('Account')}
          />
          <DrawerItem
            icon={() => <Icon name="cog" size={24} color="#000" />}
            label="Cài đặt"
            onPress={() => props.navigation.navigate('Settings')}
          />
        </View>
        <View style={{paddingHorizontal: 20}}>
          <Button
            icon={() => <Icon name="logout" size={24} color="#FF0D0D" />}
            mode="contained"
            buttonColor="#EBD6D6"
            textColor="#6B2B2B"
            onPress={logout}>
            Đăng xuất
          </Button>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default CustomDrawer;
