/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Appbar, Button, Card, Divider, Text} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import UserAPI from '../services/user';
import AxiosClient from '../services/clients/api';

function CheckoutScreen({navigation}: any) {
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const curUser = await UserAPI.findUserByUid(auth().currentUser?.uid);

        setUser(curUser);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUser();
  }, []);

  const pay = async () => {
    const client = new AxiosClient('http://10.0.2.2:3004');
    try {
      const order = await client.post('/orders');
      navigation.navigate('Payment', {order_url: order.order_url});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.navigate('AccountNavigator');
          }}
        />
        <Appbar.Content title="Checkout" />
      </Appbar.Header>
      <View>
        <Card
          style={{
            backgroundColor: '#f0f0f0',
            margin: 10,
            paddingBottom: 50,
          }}>
          <Card.Content>
            <Text
              variant="headlineSmall"
              style={{margin: 10, fontWeight: 'bold'}}>
              Thông tin khách hàng
            </Text>
            <Card>
              <Card.Title
                title={user?.display_name}
                titleVariant="titleMedium"
              />
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text variant="bodyMedium" style={{fontWeight: 'bold'}}>
                    Số điện thoại:
                  </Text>
                  <Text variant="bodyMedium" style={{marginLeft: 20}}>
                    {user?.phone_number || 'Không có'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text variant="bodyMedium" style={{fontWeight: 'bold'}}>
                    Email:
                  </Text>
                  <Text variant="bodyMedium" style={{marginLeft: 20}}>
                    {auth().currentUser?.email}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text variant="bodyMedium" style={{fontWeight: 'bold'}}>
                    Địa chỉ:
                  </Text>
                  <Text variant="bodyMedium" style={{marginLeft: 20}}>
                    {user?.address || 'Không có'}
                  </Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button mode="contained" style={{flex: 1}}>
                  Chỉnh sửa địa chỉ
                </Button>
              </Card.Actions>
            </Card>
            <Text
              variant="headlineSmall"
              style={{margin: 10, fontWeight: 'bold'}}>
              Tóm tắt đơn hàng
            </Text>
            <Card>
              <Card.Title title="Gói trả phí" titleVariant="titleMedium" />
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text variant="bodyMedium" style={{fontWeight: 'bold'}}>
                    Thời hạn:
                  </Text>
                  <Text variant="bodyMedium" style={{marginLeft: 20}}>
                    1 tháng
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text variant="bodyMedium" style={{fontWeight: 'bold'}}>
                    Tự động gia hạn:
                  </Text>
                  <Text variant="bodyMedium" style={{marginLeft: 20}}>
                    Có
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text variant="bodyMedium" style={{fontWeight: 'bold'}}>
                    Giá:
                  </Text>
                  <Text variant="bodyMedium" style={{marginLeft: 20}}>
                    35.000đ
                  </Text>
                </View>
              </Card.Content>
            </Card>
            <Text
              variant="headlineSmall"
              style={{margin: 10, fontWeight: 'bold'}}>
              Chi tiết giá
            </Text>
            <Card>
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text>Giá</Text>
                  <Text>35.000đ</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text>Thuế</Text>
                  <Text>0đ</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text>Giảm giá</Text>
                  <Text>0đ</Text>
                </View>
                <Divider
                  style={{
                    marginVertical: 10,
                    borderStyle: 'dashed',
                    borderWidth: 1,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontWeight: 'bold'}}>Tổng cộng</Text>
                  <Text style={{fontWeight: 'bold'}}>35.000đ</Text>
                </View>
              </Card.Content>
            </Card>
          </Card.Content>
        </Card>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text variant="bodyLarge" style={{fontWeight: 'bold'}}>
                Thanh toán:
              </Text>
              <Text
                variant="bodyLarge"
                style={{fontWeight: 'bold', marginLeft: 10}}>
                35.000đ
              </Text>
            </View>
            <Button mode="contained" onPress={pay}>
              Tiếp tục
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

export default CheckoutScreen;
