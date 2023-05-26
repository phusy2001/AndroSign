/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, KeyboardAvoidingView, Dimensions, StyleSheet} from 'react-native';
import {Text, Button, TextInput, Snackbar} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, Controller} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import {signinWithEmail} from '../services/auth';
import {navigate} from '../navigation/RootNavigation';
import axiosClient from '../services/clients/axios';

const SignInSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be a valid email address')
    .required('Email is a required field'),
  password: yup.string().required('Password is a required field'),
});

function LoginScreen({navigation, route}: any) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const [hide, setHide] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');

  const onToggleSnackBar = (mssgError: string) => {
    setSnackbarContent(mssgError);
    setVisible(!visible);
  };

  const onDismissSnackBar = () => setVisible(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(SignInSchema),
  });
  const onSubmit = async (data: any) => {
    try {
      await signinWithEmail(data.email, data.password);

      if (auth().currentUser) {
        navigation.navigate('Onboarding');
      }
    } catch (error: any) {
      onToggleSnackBar(error.code);
    }
  };

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      console.log('User', user);
      if (user) {
        user.getIdToken().then(async token => {
          console.log('token', token);
          axiosClient.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          });
        });
      }
    });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="height"
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
            onPress={() => navigation.navigate('SignUp')}>
            Đăng ký ngay
          </Text>
        </View>
      </View>
      <View>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          icon="login"
          contentStyle={{flexDirection: 'row-reverse'}}>
          Đăng nhập
        </Button>
        <Snackbar
          style={{position: 'absolute', bottom: 0}}
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: '',
            icon: 'close',
            onPress: () => {
              onDismissSnackBar();
            },
          }}>
          {snackbarContent}
        </Snackbar>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default LoginScreen;
