/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Dimensions} from 'react-native';
import {Text, Button, TextInput, IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import auth from '@react-native-firebase/auth';
import {useForm, Controller} from 'react-hook-form';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const ChangePasswordSchema = yup.object().shape({
  oPassword: yup.string().required('Mật khẩu cũ là bắt buộc'),
  nPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Mật khẩu phải có 8 kí tự, bao gồm chữ số, chữ hoa, chữ thường và có ít nhất một ký tự đặc biệt',
    ),
  nPassword2: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu mới')
    .oneOf([yup.ref('nPassword'), null], 'Mật khẩu không trùng nhau'),
});

function PasswordChangeScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const [hide0, setHide0] = useState(true);
  const [hide, setHide] = useState(true);
  const [hide2, setHide2] = useState(true);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data: any) => {
    const user = auth().currentUser;

    const email = user.email;

    const credential = auth.EmailAuthProvider.credential(email, data.oPassword);

    await user
      ?.reauthenticateWithCredential(credential)
      .then(async () => {
        await user
          ?.updatePassword(data.nPassword)
          .then(() => {
            Toast.show({
              text1: 'Đổi mật khẩu thành công!',
              type: 'success',
              position: 'bottom',
              visibilityTime: 2000,
            });

            navigation.navigate('Account');
          })
          .catch(error => {
            Toast.show({
              text1: 'Đổi mật khẩu thất bại!',
              type: 'error',
              position: 'bottom',
              visibilityTime: 2000,
            });
            console.log('Error updating password:', error);
          });
      })
      .catch(error => {
        Toast.show({
          text1: 'Mật khẩu cũ không đúng. Vui lòng nhập lại!',
          type: 'error',
          position: 'bottom',
          visibilityTime: 2000,
        });
        console.log(' reauthenticating user:', error);
      });
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
            Thay đổi mật khẩu
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
                label="Mật khẩu cũ"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nhập mật khẩu cũ của bạn"
                textContentType="password"
                secureTextEntry={hide0}
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
                label="Mật khẩu mới"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nhập mật khẩu mới"
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
                label="Xác nhận mật khẩu mới"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nhập lại mật khẩu mới"
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

export default PasswordChangeScreen;
