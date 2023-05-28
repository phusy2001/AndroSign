/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Appbar, Text, Avatar, IconButton, Divider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDrawerStatus} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FlashList} from '@shopify/flash-list';
import TransText from '../components/TransText';

const plans = [
  {id: 1, name: 'GÓI TRẢ PHÍ', plan_type: 'Monthly', price: '35000'},
  {id: 2, name: 'GÓI TRẢ PHÍ', plan_type: 'Monthly', price: '33500'},
  {id: 3, name: 'GÓI TRẢ PHÍ', plan_type: 'Monthly', price: '32000'},
  {id: 4, name: 'GÓI TRẢ PHÍ', plan_type: 'Annually', price: '30000'},
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
              fontWeight: 'bold',
            }}>
            {item.name}{' '}
            <Text style={{fontSize: 14, color: '#808080'}}>
              {item.plan_type}:
            </Text>
          </Text>
          <TouchableOpacity
            disabled
            onPress={() => navigation.navigate('Checkout', {plan_id: item.id})}
            style={{}}>
            <View style={styles.button}>
              <Text style={styles.text}>{item.price}đ / tháng</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
        <TransText
          i18nKey="account"
          style={{fontSize: 20, fontWeight: '700'}}
        />
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
            <Avatar.Text size={48} label="TL" />
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
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#808080',
            }}>
            Tình trạng:
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Đang kích hoạt
          </Text>
        </View>
      </View>
      <View style={{minHeight: 2}}>
        <FlashList
          renderItem={renderGroupHeader}
          estimatedItemSize={90}
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
      <View style={{paddingVertical: 20, paddingHorizontal: 40}}>
        <Text
          style={{textDecorationLine: 'underline', color: 'red', fontSize: 16}}>
          Xoá tài khoản
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6497b1',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#6497b1',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    opacity: 0.7,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  disabledText: {
    color: 'lightgray',
    textAlign: 'center',
  },
});

export default AccountScreen;
