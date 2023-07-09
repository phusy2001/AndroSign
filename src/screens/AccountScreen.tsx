/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Appbar, Text, Avatar, IconButton, Divider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDrawerStatus} from '@react-navigation/drawer';
import {DrawerActions, useFocusEffect} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import {FlashList} from '@shopify/flash-list';
import TransText from '../components/TransText';
import UserAPI from '../services/user';
import SplashScreen from './SplashScreen';
import {createOrder, getPlans} from '../services/payment';

// const plans = [
//   {id: 1, name: 'GÓI TRẢ PHÍ', plan_type: 'Monthly', price: '35000'},
//   {id: 2, name: 'GÓI TRẢ PHÍ', plan_type: 'Monthly', price: '33500'},
//   {id: 3, name: 'GÓI TRẢ PHÍ', plan_type: 'Monthly', price: '32000'},
//   {id: 4, name: 'GÓI TRẢ PHÍ', plan_type: 'Annually', price: '30000'},
// ];

function AccountScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([]);

  const handleDrawer = () => {
    if (!isDrawerOpen) {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  const createOrderLink = async (plan_id: string) => {
    try {
      const user_id = (await auth().currentUser?.uid) ?? '';
      const orderInfo = await createOrder(user_id, plan_id);
      navigation.navigate('Payment', {
        order_url: orderInfo.data.order_url,
        app_trans_id: orderInfo.data.app_trans_id,
      });
    } catch (error) {
      console.log('Tạo đơn hàng thất bai');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const refreshUser = async () => {
        const curUser = await UserAPI.findUserByUid(auth().currentUser?.uid);

        setUser(curUser.data);

        setIsLoading(false);
      };
      refreshUser();
    }, []),
  );

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);

      try {
        const plansData = await getPlans();

        setPlans(plansData);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUser();
  }, []);

  const renderGroupHeader = ({item}: any) => {
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
            paddingTop: 15,
            paddingRight: 20,
            paddingBottom: 15,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {item.plan_name}
            <Text style={{fontSize: 14, color: '#808080'}}>
              {' '}
              {'Hàng tháng'}:
            </Text>
          </Text>
          <TouchableOpacity
            onPress={() => createOrderLink(item.plan_id)}
            style={{}}>
            <View style={styles.button}>
              <Text style={styles.text}>{item.plan_price}đ / tháng</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return <SplashScreen />;
  } else {
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
            navigation.navigate('InfoChange', {user});
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
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {user.display_name}
              </Text>
              <Text style={{fontSize: 15}}>{auth().currentUser?.email}</Text>
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
            marginTop: 20,
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 10,
            marginBottom: 20,
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
              paddingTop: 15,
              paddingRight: 20,
              paddingBottom: 15,
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
              paddingTop: 15,
              paddingRight: 20,
              paddingBottom: 15,
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
            marginTop: 20,
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 10,
            marginBottom: 20,
          }}>
          Thiết lập chung
        </Text>
        <View
          style={{
            height: 110,
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
              navigation.navigate('PasswordCaChange');
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                display: 'flex',
              }}>
              <Text style={{fontSize: 16}}>Đổi mật khẩu bảo vệ tài liệu</Text>
              <IconButton icon="arrow-right" size={24} />
            </View>
          </TouchableOpacity>
          {/* <Divider bold={true}></Divider>
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
          </TouchableOpacity> */}
        </View>
        <View style={{paddingVertical: 20, paddingHorizontal: 20}}>
          <Text
            style={{
              color: 'red',
              fontSize: 16,
            }}>
            Xoá tài khoản
          </Text>
        </View>
      </ScrollView>
    );
  }
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
