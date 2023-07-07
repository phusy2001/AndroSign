/* eslint-disable react-native/no-inline-styles */
import {yupResolver} from '@hookform/resolvers/yup';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Dimensions, KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {resetPassword} from '../services/auth';
import SignUpSVG from '../assets/images/signup.svg';
import Toast from 'react-native-toast-message';

const ForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be a valid email address')
    .required('Email is a required field'),
});

function ForgotPasswordScreen({navigation, route}: any) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
  });
  const onSubmit = async (data: any) => {
    try {
      await resetPassword(data.email);
      Toast.show({
        text1: 'Đường dẫn đặt lại mật khẩu đã được gửi đến Email của bạn',
        type: 'info',
        position: 'bottom',
      });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        Toast.show({
          text1: 'Không tìm thấy Email',
          type: 'error',
          position: 'bottom',
        });
      }
    }
    reset({email: ''});
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        marginLeft: 30,
        marginRight: 30,
        display: 'flex',
        justifyContent: 'space-evenly',
        height: screenHeight,
      }}>
      <KeyboardAvoidingView behavior="position">
        <View>
          <View style={{alignItems: 'center'}}>
            <SignUpSVG width={170} height={120} />
          </View>
          <View style={{alignItems: 'center', marginTop: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 24}}>
              Quên mật khẩu
            </Text>
            <Text style={{fontSize: 14, marginTop: 10}}>
              Vui lòng nhập Email và nhận đường dẫn đặt lại mật khẩu
            </Text>
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={{
                  marginTop: 5,
                }}
                mode="outlined"
                label="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                outlineColor={errors.email && 'red'}
                activeOutlineColor={errors.email && 'red'}
                placeholder="Nhập email của bạn"
                inputMode="email"
                textContentType="emailAddress"
              />
            )}
            name="email"
          />
          <Text style={{color: 'red'}}>
            {errors.email && `${errors.email.message}`}
          </Text>
        </View>
      </KeyboardAvoidingView>
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        contentStyle={{flexDirection: 'row-reverse'}}>
        <Text style={{fontSize: 16, color: 'white'}}>Xác nhận</Text>
      </Button>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: 'blue',
          }}
          onPress={() => navigation.navigate('Login')}>
          Quay về màn hình đăng nhập
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default ForgotPasswordScreen;
