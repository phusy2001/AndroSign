import React, {useState, useRef} from 'react';
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

const VerifyPasswordCaScreen = ({route, navigation}: any) => {
  const {caPassword, email, password, username} = route.params;
  const inputRefs = useRef<NativeTextInput[]>([]);
  const [pin, setPin] = useState<string>('');

  const handlePinChange = (value: string, index: number) => {
    if (value.length <= 1) {
      setPin(prevPin => {
        const newPin = prevPin.split('');
        newPin[index] = value;
        return newPin.join('');
      });

      if (value.length > 0 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0) {
      setPin(prevPin => {
        const newPin = prevPin.split('');
        newPin[index] = '';
        return newPin.join('');
      });

      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    if (pin !== caPassword) {
      Toast.show({
        text1: 'Mật khẩu bạn nhập không đúng. Vui lòng thử lại.',
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
          text1: 'Một đường dẫn đã được gửi đến Email của bạn',
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
          {Array.from({length: 6}).map((_, index) => (
            <TextInput
              key={index}
              value={pin[index] ?? ''}
              onChangeText={value => handlePinChange(value, index)}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace(index);
                }
              }}
              keyboardType="numeric"
              maxLength={1}
              secureTextEntry
              style={styles.textInput}
              ref={(ref: any) => (inputRefs.current[index] = ref)}
              // onSubmitEditing={() => {
              //   if (index === 5) {
              //     handleSubmit();
              //   }
              // }}
            />
          ))}
        </View>
      </View>
      <Button
        style={{
          marginLeft: 30,
          marginRight: 30,
        }}
        mode="contained"
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
});

export default VerifyPasswordCaScreen;
