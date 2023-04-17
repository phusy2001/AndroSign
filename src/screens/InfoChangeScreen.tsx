/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, KeyboardAvoidingView, Dimensions} from 'react-native';
import {Text, Button, TextInput, IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, Controller} from 'react-hook-form';

const phoneRegExp = /^((\+)33|0)[1-9](\d{2}){4}$/;

const InfoSchema = yup.object().shape({
  username: yup.string().required('Tên người dùng là bắt buộc'),
  phone: yup.string().matches(phoneRegExp, {
    message: 'Số điện thoại không hợp lệ',
    excludeEmptyString: true,
  }),
  address: yup.string(),
});

function InfoChangeScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(InfoSchema),
  });
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          marginTop: 30,
          height: screenHeight - 100,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconButton
            icon="arrow-left"
            size={26}
            onPress={() => navigation.goBack()}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            Chỉnh sửa thông tin cá nhân
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior="position"
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 20,
            backgroundColor: '#fff',
          }}>
          <TextInput
            mode="flat"
            label="Email"
            placeholder="Nhập email của bạn"
            inputMode="email"
            textContentType="emailAddress"
            value="trongle@gmail.com"
            editable={false}
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={{marginTop: 25}}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                label="Tên người dùng"
                placeholder="Nhập tên của bạn"
                inputMode="text"
                textContentType="name"
              />
            )}
            name="username"
          />
          <Text style={{color: 'red'}}>
            {errors.username && `${errors.username.message}`}
          </Text>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={{marginTop: 5}}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại của bạn"
                inputMode="tel"
                textContentType="telephoneNumber"
              />
            )}
            name="phone"
          />
          <Text style={{color: 'red'}}>
            {errors.phone && `${errors.phone.message}`}
          </Text>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={{marginTop: 5}}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                label="Địa chỉ"
                placeholder="Nhập địa chỉ của bạn"
                inputMode="text"
                textContentType="fullStreetAddress"
              />
            )}
            name="address"
          />
          <Text style={{color: 'red'}}>
            {errors.address && `${errors.address.message}`}
          </Text>
        </KeyboardAvoidingView>
      </View>
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'flex-end',
          paddingLeft: 20,
          paddingRight: 20,
          marginTop: -10,
          width: '100%',
        }}>
        <Button
          style={{backgroundColor: '#005b96'}}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          contentStyle={{flexDirection: 'row-reverse'}}>
          Lưu thay đổi
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

export default InfoChangeScreen;
