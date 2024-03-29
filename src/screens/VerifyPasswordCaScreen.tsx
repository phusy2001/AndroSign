import React, {useState, useRef, useEffect} from 'react';
import {Button, Text, IconButton} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import auth from '@react-native-firebase/auth';
import UserAPI from '../services/user';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Spinner from 'react-native-loading-spinner-overlay';

const VerifyPasswordCaScreen = ({route, navigation}: any) => {
  const {caPassword, email, password, username} = route.params;
  const [disabled, setDisabled] = useState(true);
  const inputRef = useRef<any>();
  const pin = useRef('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current.focusField(0);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    if (pin.current !== caPassword) {
      Toast.show({
        text1: 'Mật khẩu của bạn nhập không khớp',
        type: 'error',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } else {
      setLoading(true);
      try {
        const {user} = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );

        const createdUser = await UserAPI.createUser({
          display_name: username,
          uid: user.uid,
          email,
        });

        if (createdUser.status === 'true') {
          const createdCa = await UserAPI.createCaPassword(user.uid, {
            email,
            passwordCa: pin.current,
          });

          if (createdCa.status === 'true') {
            user.sendEmailVerification();
            await auth().signOut();
            navigation.navigate('Login');

            Toast.show({
              text1: 'Đường dẫn kích hoạt đã được gửi đến Email của bạn',
              type: 'info',
              position: 'bottom',
            });
          } else {
            user.delete();
            await UserAPI.deleteUserByUid(user.uid);
            await auth().signOut();
            // navigation.navigate('Login');
            setLoading(false);

            Toast.show({
              text1:
                'Gặp lỗi trong quá trình tạo tài khoản! Vui lòng xác nhận lại',
              type: 'error',
              position: 'bottom',
            });
          }
        } else {
          user.delete();
          await UserAPI.deleteUserByUid(user.uid);
          await auth().signOut();
          // navigation.navigate('Login');
          setLoading(false);

          Toast.show({
            text1: 'Tạo người dùng thất bại',
            type: 'error',
            position: 'bottom',
          });
        }

        // const {user} = await signupWithEmail(email, password);

        // await auth().currentUser?.updateProfile({
        //   displayName: username,
        // });
      } catch (error: any) {
        setLoading(false);
        switch (error.code) {
          case 'auth/email-already-in-use':
            Toast.show({
              text1:
                'Tài khoản này đã tồn tại. Vui lòng kiểm tra Email nếu tài khoản chưa kích hoạt!',
              type: 'error',
              position: 'bottom',
              visibilityTime: 2000,
            });
            break;
          case 'auth/invalid-email':
            Toast.show({
              text1: 'Email này không hợp lệ',
              type: 'error',
              position: 'bottom',
              visibilityTime: 2000,
            });
            break;
          case 'auth/operation-not-allowed':
            Toast.show({
              text1: 'Tài khoản email/mật khẩu của bạn chưa được kích hoạt',
              type: 'error',
              position: 'bottom',
              visibilityTime: 2000,
            });
            break;
          case 'auth/weak-password':
            Toast.show({
              text1: 'Mật khẩu của bạn yếu',
              type: 'error',
              position: 'bottom',
              visibilityTime: 2000,
            });
            break;
          default:
            console.error(error);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        animation="fade"
        textContent={'Đang xử lý...'}
        textStyle={{color: '#FFF', fontWeight: 'bold'}}
      />
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
            fontSize: 22,
          }}>
          Xác nhận mật khẩu bảo vệ tài liệu
        </Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title}>Nhập lại mã bảo vệ</Text>
        <View style={styles.textInputGroup}>
          <OTPInputView
            ref={e => (inputRef.current = e)}
            style={{width: '90%', height: 50}}
            pinCount={6}
            onCodeChanged={code => {
              if (code.length === 6) {
                pin.current = code;
                setDisabled(false);
              } else {
                setDisabled(true);
              }
            }}
            autoFocusOnLoad={false}
            secureTextEntry
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
          />
        </View>
      </View>
      <Button
        style={{
          marginLeft: 30,
          marginRight: 30,
        }}
        mode="contained"
        disabled={disabled}
        onPress={handleSubmit}>
        <Text style={{fontSize: 16, color: 'white'}}>Xác nhận</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },

  title: {
    fontSize: 20,
    marginBottom: 30,
  },

  textInputGroup: {
    flexDirection: 'row',
  },

  textInput: {
    marginHorizontal: 8,
    marginBottom: 30,
    width: 50,
    height: 50,
    borderWidth: 1,
    fontSize: 22,
    textAlign: 'center',
  },

  underlineStyleBase: {
    borderColor: 'black',
    borderWidth: 0,
    borderBottomWidth: 1,
    fontWeight: 'bold',
    fontSize: 22,
    color: 'black',
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});

export default VerifyPasswordCaScreen;
