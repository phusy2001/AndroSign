/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Dimensions} from 'react-native';
import {Text, Button, TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, Controller} from 'react-hook-form';

const SignInSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be a valid email address')
    .required('Email is a required field'),
  password: yup.string().required('Password is a required field'),
});

function LoginScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const [hide, setHide] = useState(true);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(SignInSchema),
  });
  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
        paddingLeft: 30,
        paddingRight: 30,
        flex: 1,
      }}>
      <View style={{height: screenHeight - 100}}>
        <Text
          style={{
            marginTop: 70,
            fontWeight: 'bold',
            fontSize: 22,
          }}>
          Đăng nhập
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
        </KeyboardAvoidingView>
        <Text
          style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 16,
          }}>
          Quên mật khẩu?
        </Text>
        <View
          style={{
            marginTop: 80,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
            }}>
            Chưa có tài khoản?
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: 'blue',
            }}
            onPress={() => navigation.navigate('SignUpScreen')}>
            Đăng ký ngay
          </Text>
        </View>
      </View>
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'flex-end',
          marginBottom: 10,
          width: '100%',
        }}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          icon="login"
          contentStyle={{flexDirection: 'row-reverse'}}>
          Đăng nhập
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
