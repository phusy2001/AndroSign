/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Dimensions} from 'react-native';
import {Text, TextInput, Button, IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, Controller} from 'react-hook-form';
import Toast from 'react-native-toast-message';

const SignUpSchema = yup.object().shape({
  username: yup.string().required('Tên người dùng là bắt buộc'),
  email: yup
    .string()
    .email('Vui lòng nhập Email hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 kí tự')
    .required('Mật khẩu là bắt buộc'),
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
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: -30,
          }}>
          <IconButton
            icon="arrow-left"
            size={26}
            onPress={() => navigation.goBack()}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 22,
            }}>
            Đăng ký
          </Text>
        </View>
        <View
          style={{
            marginTop: 50,
          }}>
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
      <View>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          icon="arrow-right"
          contentStyle={{flexDirection: 'row-reverse'}}>
          <Text style={{fontSize: 16, color: 'white'}}>Tiếp tục</Text>
        </Button>
      </View>
    </View>
  );
}

export default SignUpScreen;
