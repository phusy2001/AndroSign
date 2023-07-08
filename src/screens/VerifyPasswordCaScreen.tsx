import React, {useState, useRef, useEffect} from 'react';
import {TextInput, Button, Text, IconButton} from 'react-native-paper';
import {
  View,
  TextInput as NativeTextInput,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {signupWithEmail} from '../services/auth';
import UserAPI from '../services/user';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const VerifyPasswordCaScreen = ({route, navigation}: any) => {
  const {caPassword, email, password, username} = route.params;
  const [disabled, setDisabled] = useState(true);
  const inputRef = useRef<any>();
  const pin = useRef('');

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

      Keyboard.dismiss();
    } else {
      try {
        const {user} = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        user.sendEmailVerification();
        await auth().signOut();
        navigation.navigate('Login');
        // const {user} = await signupWithEmail(email, password);

        Toast.show({
          text1: 'Đường dẫn kích hoạt đã được gửi đến Email của bạn',
          type: 'info',
          position: 'bottom',
        });

        UserAPI.createUser({
          display_name: username,
          uid: user.uid,
          email,
        });

        // await auth().currentUser?.updateProfile({
        //   displayName: username,
        // });

        UserAPI.createCaPassword(user.uid, {email, passwordCa: pin});
      } catch (error: any) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            Toast.show({
              text1: 'Tài khoản này đã tồn tại',
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
              } else setDisabled(true);
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
