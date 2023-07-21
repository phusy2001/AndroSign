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
import UserAPI from '../services/user';
import SplashScreen from './SplashScreen';
import {checkQuota, createOrder, getPlans} from '../services/payment';
import moment from 'moment';

function formatPrice(price: number) {
  let [wholeNumber, decimal] = price.toString().split('.');
  wholeNumber = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (decimal) {
    decimal = decimal.slice(0, 2).padEnd(2, '0');
    return wholeNumber + '.' + decimal;
  } else {
    return wholeNumber;
  }
}

function AccountScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [userPlan, setUserPlan] = useState<any>({});

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
      };
      refreshUser();
    }, []),
  );

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userPlan = await checkQuota();
        setUserPlan(userPlan.data);
        if (userPlan.data.type === 'free') {
          const plansData = await getPlans();
          setPlans(plansData);
        }
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUser();
  }, []);

  const renderGroupHeader = ({item}: any) => {
    return (
      <TouchableOpacity
        onPress={() => createOrderLink(item.plan_id)}
        style={{
          paddingLeft: 20,
          paddingTop: 15,
          paddingRight: 20,
          paddingBottom: 15,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          {item.plan_name}
          <Text style={{fontSize: 14, color: '#808080'}}>
            {` ${item.plan_description}`}
          </Text>
        </Text>
        <View style={styles.button}>
          <Text style={styles.text}>
            {formatPrice(item.plan_price_view)}đ/tháng
          </Text>
        </View>
      </TouchableOpacity>
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
          <Text style={{fontSize: 20, fontWeight: '700'}}>Tài khoản</Text>
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
              alignItems: 'center',
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
              {userPlan.type === 'free' ? 'MIỄN PHÍ' : userPlan.name}
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
              alignItems: 'center',
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
          {userPlan.type !== 'free' ? (
            <View
              style={{
                paddingLeft: 20,
                paddingTop: 15,
                paddingRight: 20,
                paddingBottom: 15,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                }}>
                Ngày hết hạn:
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                {moment(userPlan.expired_on).format('DD/MM/YYYY')}
              </Text>
            </View>
          ) : (
            <></>
          )}
          <View style={{minHeight: 2}}>
            <FlashList
              renderItem={renderGroupHeader}
              estimatedItemSize={90}
              data={plans}
            />
          </View>
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
          {/* <Text
            style={{
              color: 'red',
              fontSize: 16,
            }}>
            Xoá tài khoản
          </Text> */}
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
    fontSize: 14,
  },
  disabledText: {
    color: 'lightgray',
    textAlign: 'center',
  },
});

export default AccountScreen;
