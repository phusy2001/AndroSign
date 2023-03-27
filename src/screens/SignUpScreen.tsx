/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Dimensions} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, Controller} from 'react-hook-form';

const SignUpSchema = yup.object().shape({
  username: yup.string().required('Username is a required field'),
  email: yup
    .string()
    .email('Email must be a valid email address')
    .required('Email is a required field'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is a required field'),
  password2: yup
    .string()
    .required('Re-enter your password')
    .oneOf([yup.ref('password'), null], 'Your password does not match'),
});

function SignUpScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const [hide, setHide] = useState(true);
  const [hide2, setHide2] = useState(true);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(SignUpSchema),
  });
  const onSubmit = (data: any) => {
    console.log(data);
    navigation.navigate('OTPVerificationScreen');
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        marginLeft: 30,
        marginRight: 30,
        flex: 1,
      }}>
      <KeyboardAvoidingView
        behavior="position"
        style={{height: screenHeight - 150}}>
        <Text
          style={{
            marginTop: 70,
            fontWeight: 'bold',
            fontSize: 22,
          }}>
          Đăng ký
        </Text>
        <View
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
                label="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nhập tên của bạn"
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
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'flex-end',
          width: '100%',
        }}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          icon="arrow-right"
          contentStyle={{flexDirection: 'row-reverse'}}>
          Tiếp tục
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

export default SignUpScreen;
