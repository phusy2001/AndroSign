import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Dimensions, Image} from 'react-native';
import {Text, Button, TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, Controller} from 'react-hook-form';
import Toast from 'react-native-toast-message';
import {signinWithEmail} from '../services/auth';
import {storeData} from '../utils/asyncStore';

const SignInSchema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc'),
});

function LoginScreen({navigation}: any) {
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
    try {
      const user = await signinWithEmail(data.email, data.password);

      if (user.user.emailVerified) {
        // const resUser = await UserAPI.findUserByUid(user.user.uid);

        // let fcmTokenList = resUser.data.fcm_tokens;

        // if (!fcmTokenList?.includes(fcmToken)) {
        //   fcmTokenList = [...fcmTokenList, fcmToken];
        // }

        // await UserAPI.updateUserByUid(user.user.uid, {
        //   fcm_tokens: fcmTokenList,
        // });

        navigation.navigate('Onboarding');

        user.user.getIdToken().then(async token => {
          console.log('token when auth state change =>', token);
          try {
            await storeData('userToken', token);
          } catch (e) {
            console.log(e);
          }
        });
      } else {
        Toast.show({
          text1: 'Vui lòng kiểm tra Email để kích hoạt tài khoản',
          type: 'info',
          position: 'bottom',
        });
      }
    } catch (error: any) {
      switch (error.code) {
        case 'auth/wrong-password':
          Toast.show({
            text1: 'Mật khẩu của bạn không đúng. Vui lòng thử lại',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        case 'auth/invalid-email':
          Toast.show({
            text1: 'Email của bạn không hợp lệ',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        case 'auth/user-disabled':
          Toast.show({
            text1: 'Tài khoản của bạn đã bị vô hiệu',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        case 'auth/user-not-found':
          Toast.show({
            text1: 'Tài khoản này không tồn tại',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        default:
          console.error(error);
      }
    }
  };

  // useEffect(() => {
  //   auth().onAuthStateChanged(user => {
  //     console.log('On Auth State Change');
  //     console.log('User', user);

  //     if (user) {
  //       navigation.navigate('Onboarding');
  //       user.getIdToken().then(async token => {
  //         console.log('token when auth state change =>', token);
  //         try {
  //           await storeData('userToken', token);
  //         } catch (e) {
  //           console.log(e);
  //         }
  //       });
  //     }
  //   });
  // }, []);

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
      <KeyboardAvoidingView behavior="position">
        <View>
          <View style={{alignItems: 'center', marginBottom: 10}}>
            {/* <LoginSVG width={170} height={120} /> */}
            <Image
              source={require('../assets/images/login.png')}
              style={{width: 250, height: 130}}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 24}}>
              Đăng Nhập Ngay
            </Text>
            <Text style={{fontSize: 14, marginTop: 10}}>
              Vui lòng đăng nhập để sử dụng ứng dụng AndroSign
            </Text>
          </View>
        </View>
        <View style={{marginTop: 40}}>
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
                outlineColor={errors.password && 'red'}
                activeOutlineColor={errors.password && 'red'}
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
        </View>
        <Text
          style={{
            textAlign: 'right',
            fontSize: 16,
            color: 'blue',
          }}
          onPress={() => navigation.navigate('ForgotPassword')}>
          Quên mật khẩu?
        </Text>
      </KeyboardAvoidingView>
      <Button
        style={{marginTop: 20}}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        icon="login"
        contentStyle={{flexDirection: 'row-reverse'}}>
        <Text style={{fontSize: 16, color: 'white'}}>Đăng nhập</Text>
      </Button>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 16}}>Bạn chưa có tài khoản?</Text>
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
  );
}

export default LoginScreen;
