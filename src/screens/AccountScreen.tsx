/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView} from 'react-native';
import {Appbar, Text, Avatar, IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDrawerStatus} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

function AccountScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const _handleDrawer = () => {
    if (!isDrawerOpen) {
      navigation.dispatch(DrawerActions.openDrawer());
    }
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
        <Appbar.Action icon="format-list-bulleted" onPress={_handleDrawer} />
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
        <View
          style={{
            paddingLeft: 20,
            paddingTop: 20,
            paddingRight: 20,
            paddingBottom: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 0.5,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            GÓI TRẢ PHÍ <Text>1 tháng:</Text>
          </Text>
          <View
            style={{
              backgroundColor: '#6497b1',
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 5,
            }}>
            <Text style={{fontWeight: 'bold', color: 'white'}}>
              35,000đ/1 tháng
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingLeft: 20,
            paddingTop: 20,
            paddingRight: 20,
            paddingBottom: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 0.5,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            GÓI TRẢ PHÍ <Text>3 tháng:</Text>
          </Text>
          <View
            style={{
              backgroundColor: '#6497b1',
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 5,
            }}>
            <Text style={{fontWeight: 'bold', color: 'white'}}>
              33,500đ/1 tháng
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingLeft: 20,
            paddingTop: 20,
            paddingRight: 20,
            paddingBottom: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 0.5,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            GÓI TRẢ PHÍ <Text>6 tháng:</Text>
          </Text>
          <View
            style={{
              backgroundColor: '#6497b1',
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 5,
            }}>
            <Text style={{fontWeight: 'bold', color: 'white'}}>
              32,000đ/1 tháng
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingLeft: 20,
            paddingTop: 20,
            paddingRight: 20,
            paddingBottom: 20,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 0.5,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            GÓI TRẢ PHÍ <Text>1 năm:</Text>
          </Text>
          <View
            style={{
              backgroundColor: '#6497b1',
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 5,
            }}>
            <Text style={{fontWeight: 'bold', color: 'white'}}>
              30,000đ/1 tháng
            </Text>
          </View>
        </View>
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
              borderBottomWidth: 0.5,
            }}>
            <Text style={{fontSize: 16}}>Đổi mật khẩu</Text>
            <IconButton icon="arrow-right" size={24} />
          </View>
        </TouchableOpacity>
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
