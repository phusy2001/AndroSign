/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView} from 'react-native';
import {Appbar, Text, Avatar, IconButton, Divider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDrawerStatus} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FlashList} from '@shopify/flash-list';

const plans = [
  {id: 1, name: 'GÓI TRẢ PHÍ', plan_type: '1 tháng', price: '35000'},
  {id: 2, name: 'GÓI TRẢ PHÍ', plan_type: '3 tháng', price: '33500'},
  {id: 3, name: 'GÓI TRẢ PHÍ', plan_type: '6 tháng', price: '32000'},
  {id: 4, name: 'GÓI TRẢ PHÍ', plan_type: '1 năm', price: '30000'},
];

function AccountScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const handleDrawer = () => {
    if (!isDrawerOpen) {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  const renderGroupHeader = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Checkout', {plan_id: item.id})}>
        <View
          style={{
            paddingLeft: 20,
            paddingTop: 20,
            paddingRight: 20,
            paddingBottom: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {item.name} <Text>{item.plan_type}:</Text>
          </Text>
          <View
            style={{
              backgroundColor: '#6497b1',
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 5,
            }}>
            <Text style={{fontWeight: 'bold', color: 'white'}}>
              {item.price}đ/1 tháng
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
        backgroundColor: '#fff',
      }}>
      <Appbar.Header style={{justifyContent: 'space-between'}}>
        <Appbar.Action icon="format-list-bulleted" onPress={handleDrawer} />
      </Appbar.Header>
      <View style={{marginLeft: 20, marginRight: 20}}>
        <Text style={{fontSize: 20, fontWeight: '700'}}>Tài khoản</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('InfoChange');
        }}>
        <View
          style={{
            display: 'flex',
            marginTop: 20,
            flexDirection: 'row',
            backgroundColor: '#f7f3f9',
            paddingTop: 10,
            paddingBottom: 10,
          }}>
          <View
            style={{
              width: '20%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Avatar.Image size={48} source={''} />
          </View>
          <View style={{width: '70%', justifyContent: 'center'}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Trong Le</Text>
            <Text style={{fontSize: 15}}>trongle@gmail.com</Text>
          </View>
          <View
            style={{
              width: '10%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IconButton icon="arrow-right" size={28} />
          </View>
        </View>
      </TouchableOpacity>
      <Text
        style={{
          marginTop: 10,
          fontWeight: 'bold',
          fontSize: 18,
          marginLeft: 10,
          marginBottom: 10,
        }}>
        Dịch vụ
      </Text>
      <View
        style={{
          display: 'flex',
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: '#f7f3f9',
          borderRadius: 5,
        }}>
        <View
          style={{
            paddingLeft: 20,
            paddingTop: 20,
            paddingRight: 20,
            paddingBottom: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 16,
            }}>
            Gói dịch vụ tài khoản:
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            MIỄN PHÍ
          </Text>
        </View>
      </View>
      <View>
        <FlashList
          renderItem={renderGroupHeader}
          estimatedItemSize={200}
          data={plans}
        />
      </View>
      <Text
        style={{
          marginTop: 10,
          fontWeight: 'bold',
          fontSize: 18,
          marginLeft: 10,
          marginBottom: 10,
        }}>
        Thiết lập chung
      </Text>
      <View
        style={{
          height: 120,
          backgroundColor: '#f7f3f9',
          paddingLeft: 20,
          paddingRight: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PasswordChange');
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'flex',
            }}>
            <Text style={{fontSize: 16}}>Đổi mật khẩu</Text>
            <IconButton icon="arrow-right" size={24} />
          </View>
        </TouchableOpacity>
        <Divider bold={true}></Divider>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignatureSetting');
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'flex',
            }}>
            <Text style={{fontSize: 16}}>Chỉnh sửa chữ ký cá nhân</Text>
            <IconButton icon="arrow-right" size={24} />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default AccountScreen;
