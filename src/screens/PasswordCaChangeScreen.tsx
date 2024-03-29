/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Dimensions} from 'react-native';
import {Text, Button, TextInput, IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, Controller} from 'react-hook-form';
import UserAPI from '../services/user';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

const ChangePasswordSchema = yup.object().shape({
  oPassword: yup.string().required('Mật khẩu cũ là bắt buộc'),
  nPassword: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 kí tự')
    .required('Mật khẩu mới là bắt buộc'),
  nPassword2: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([yup.ref('nPassword'), null], 'Mật khẩu không trùng nhau'),
});

function PasswordCaChangeScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const [hide0, setHide0] = useState(true);
  const [hide, setHide] = useState(true);
  const [hide2, setHide2] = useState(true);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(ChangePasswordSchema),
  });
  const onSubmit = async (data: any) => {
    const result = await UserAPI.updateCaPassword(auth().currentUser?.uid, {
      email: auth().currentUser?.email,
      nPasswordCa: data.nPassword,
      oPasswordCa: data.oPassword,
    });
    Toast.show({
      text1: result.message,
      type: result.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
    if (result.status === 'true') {
      reset({oPassword: '', nPassword: '', nPassword2: ''});
    }
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
      <View style={{marginTop: 30, height: screenHeight - 100}}>
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
            Thay đổi mật khẩu bảo vệ
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
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={{marginTop: 5}}
                mode="outlined"
                label="Mật khẩu bảo vệ cũ"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nhập mật khẩu bảo vệ cũ của bạn"
                textContentType="password"
                secureTextEntry={hide0}
                maxLength={6}
                keyboardType="numeric"
                right={
                  <TextInput.Icon
                    onPress={() => setHide0(!hide0)}
                    icon={hide0 ? 'eye' : 'eye-off'}
                  />
                }
              />
            )}
            name="oPassword"
          />
          <Text style={{color: 'red'}}>
            {errors.oPassword && `${errors.oPassword.message}`}
          </Text>
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={{marginTop: 5}}
                mode="outlined"
                label="Mật khẩu bảo vệ mới"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nhập mật khẩu bảo vệ mới"
                textContentType="password"
                secureTextEntry={hide}
                maxLength={6}
                keyboardType="numeric"
                right={
                  <TextInput.Icon
                    onPress={() => setHide(!hide)}
                    icon={hide ? 'eye' : 'eye-off'}
                  />
                }
              />
            )}
            name="nPassword"
          />
          <Text style={{color: 'red'}}>
            {errors.nPassword && `${errors.nPassword.message}`}
          </Text>
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={{marginTop: 5}}
                mode="outlined"
                label="Xác nhận mật khẩu bảo vệ mới"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nhập lại mật khẩu bảo vệ mới"
                textContentType="password"
                secureTextEntry={hide2}
                maxLength={6}
                keyboardType="numeric"
                right={
                  <TextInput.Icon
                    onPress={() => setHide2(!hide2)}
                    icon={hide2 ? 'eye' : 'eye-off'}
                  />
                }
              />
            )}
            name="nPassword2"
          />
          <Text style={{color: 'red'}}>
            {errors.nPassword2 && `${errors.nPassword2.message}`}
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
          <Text style={{fontSize: 16, color: 'white'}}>Xác nhận</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

export default PasswordCaChangeScreen;
