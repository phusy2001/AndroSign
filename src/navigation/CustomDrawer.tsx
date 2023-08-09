/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import React from 'react';
import {Dimensions, View} from 'react-native';
import {Button, Divider, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {signout} from '../services/auth';
import {navigate} from './RootNavigation';
import AxiosClient from '../services/clients/api';

function CustomDrawer(props: any) {
  const screenHeight = Dimensions.get('window').height;
  const client = new AxiosClient('http://10.0.2.2:3001');

  const logout = async () => {
    try {
      await signout();
      props.navigation.closeDrawer();
      navigate('Login', {});
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          height: screenHeight - 30,
        }}>
        <View>
          <DrawerItem
            style={{marginBottom: 10}}
            icon={() => <Icon name="file-document" size={24} color="#000" />}
            label="Tài liệu"
            labelStyle={{fontSize: 16}}
            onPress={() => props.navigation.navigate('Home')}
          />
          <DrawerItem
            style={{marginBottom: 10}}
            icon={() => (
              <Icon name="file-document-edit" size={24} color="#000" />
            )}
            label="Tài liệu được chia sẻ"
            labelStyle={{fontSize: 16}}
            onPress={() => props.navigation.navigate('Shared')}
          />
          <DrawerItem
            style={{marginBottom: 10}}
            icon={() => <Icon name="folder" size={24} color="#000" />}
            label="Thư mục"
            labelStyle={{fontSize: 16}}
            onPress={() => props.navigation.navigate('Folders')}
          />
          <DrawerItem
            style={{marginBottom: 10}}
            icon={() => <Icon name="star" size={24} color="#000" />}
            label="Được gắn sao"
            labelStyle={{fontSize: 16}}
            onPress={() => props.navigation.navigate('Starred')}
          />
          <DrawerItem
            style={{marginBottom: 10}}
            icon={() => <Icon name="trash-can" size={24} color="#000" />}
            label="Thùng rác"
            labelStyle={{fontSize: 16}}
            onPress={() => props.navigation.navigate('Trash')}
          />
          <View style={{paddingHorizontal: 20}}>
            <Divider bold={false} style={{marginVertical: 30}} />
          </View>
          <DrawerItem
            icon={() => <Icon name="account" size={24} color="#000" />}
            label="Tài khoản"
            labelStyle={{fontSize: 16}}
            onPress={() => props.navigation.navigate('AccountNavigator')}
          />
          <DrawerItem
            icon={() => <Icon name="help-circle" size={24} color="#000" />}
            label="Trợ giúp"
            labelStyle={{fontSize: 16}}
            onPress={() => props.navigation.navigate('Help')}
          />
        </View>
        <View style={{paddingHorizontal: 20}}>
          <Button
            icon={() => <Icon name="logout" size={24} color="#FF0D0D" />}
            mode="contained"
            buttonColor="#EBD6D6"
            textColor="#6B2B2B"
            onPress={logout}>
            <Text style={{fontSize: 16}}>Đăng xuất</Text>
          </Button>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default CustomDrawer;
