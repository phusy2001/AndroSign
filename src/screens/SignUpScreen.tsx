/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Dimensions} from 'react-native';
import {Text, TextInput, Button, IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, Controller} from 'react-hook-form';
import Toast from 'react-native-toast-message';
import SignUpSVG from '../assets/images/signup.svg';

const SignUpSchema = yup.object().shape({
  username: yup.string().required('Tên người dùng là bắt buộc'),
  email: yup
    .string()
    .email('Vui lòng nhập Email hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Mật khẩu phải có 8 kí tự, bao gồm chữ số, chữ hoa, chữ thường và có ít nhất một ký tự đặc biệt',
    ),
  password2: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([yup.ref('password'), null], 'Mật khẩu không trùng nhau'),
});

function SignUpScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const [hide, setHide] = useState(true);
  const [hide2, setHide2] = useState(true);

  const handleSignUpError = (mssgError: string) => {
    Toast.show({
      text1: mssgError,
      type: 'error',
      position: 'top',
      visibilityTime: 1500,
    });
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(SignUpSchema),
  });
  const onSubmit = async (data: any) => {
    try {
      navigation.navigate('PasswordCa', {
        email: data.email,
        password: data.password,
        username: data.username,
      });
    } catch (error: any) {
      handleSignUpError(error.code);
    }
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
            <SignUpSVG width={200} height={120} />
          </View>
          <View style={{alignItems: 'center', marginTop: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 24}}>Đăng Ký Ngay</Text>
            <Text style={{fontSize: 14, marginTop: 10}}>
              Vui lòng nhập các thông tin dưới đây và tạo tài khoản
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
                mode="outlined"
                label="Tên người dùng"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                outlineColor={errors.username && 'red'}
                activeOutlineColor={errors.username && 'red'}
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
                placeholder="Nhập email của bạn"
                inputMode="email"
                outlineColor={errors.email && 'red'}
                activeOutlineColor={errors.email && 'red'}
                textContentType="emailAddress"
              />
            )}
            name="email"
          />
          <Text style={{color: 'red'}}>
            {errors.email && `${errors.email.message}`}
          </Text>
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
                label="Mật khẩu"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nhập mật khẩu của bạn"
                textContentType="password"
                outlineColor={errors.password && 'red'}
                activeOutlineColor={errors.password && 'red'}
                secureTextEntry={hide}
                right={
                  <TextInput.Icon
                    onPress={() => setHide(!hide)}
                    icon={hide ? 'eye' : 'eye-off'}
                  />
                }
              />
            )}
            name="password"
          />
          <Text style={{color: 'red'}}>
            {errors.password && `${errors.password.message}`}
          </Text>
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
                label="Xác nhận mật khẩu"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nhập lại mật khẩu"
                textContentType="password"
                outlineColor={errors.password2 && 'red'}
                activeOutlineColor={errors.password2 && 'red'}
                secureTextEntry={hide2}
                right={
                  <TextInput.Icon
                    onPress={() => setHide2(!hide2)}
                    icon={hide2 ? 'eye' : 'eye-off'}
                  />
                }
              />
            )}
            name="password2"
          />
          <Text style={{color: 'red'}}>
            {errors.password2 && `${errors.password2.message}`}
          </Text>
        </View>
      </KeyboardAvoidingView>
      <Button
        style={{marginTop: -30}}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        icon="arrow-right"
        contentStyle={{flexDirection: 'row-reverse'}}>
        <Text style={{fontSize: 16, color: 'white'}}>Tiếp tục</Text>
      </Button>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: -30,
        }}>
        <Text style={{fontSize: 16}}>Bạn đã có tài khoản? </Text>
        <Text
          style={{
            fontSize: 16,
            color: 'blue',
          }}
          onPress={() => navigation.navigate('Login')}>
          Đăng nhập tại đây
        </Text>
      </View>
    </View>
  );
}

export default SignUpScreen;
