/* eslint-disable react-native/no-inline-styles */
import {yupResolver} from '@hookform/resolvers/yup';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Dimensions, KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {resetPassword} from '../services/auth';

const ForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be a valid email address')
    .required('Email is a required field'),
});

function ForgotPasswordScreen({navigation, route}: any) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
  });
  const onSubmit = async (data: any) => {
    const {email} = data;
    try {
      await resetPassword(email);
      setEmailMessage(true);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        //alert('User not found, try again!');
        setEmail('');
      }
    }
  };

  return (
    <View
      style={{
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
        paddingLeft: 30,
        paddingRight: 30,
        display: 'flex',
        justifyContent: 'space-evenly',
        height: screenHeight,
      }}>
      <View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 22,
          }}>
          Quên mật khẩu
        </Text>
        <KeyboardAvoidingView
          behavior="position"
          style={{
            marginTop: 70,
          }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                mode="outlined"
                label="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
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
        </KeyboardAvoidingView>
      </View>
      <View>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          icon="login"
          contentStyle={{flexDirection: 'row-reverse'}}>
          Reset Your Password
        </Button>
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
