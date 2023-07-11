import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text, IconButton} from 'react-native-paper';

const PasswordCaScreen = ({navigation, route}: any) => {
  const {email, password, username} = route.params;
  const [disabled, setDisabled] = useState(true);
  const inputRef = useRef<any>();
  const pin = useRef('');

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current.focusField(0);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    navigation.navigate('VerifyPasswordCa', {
      caPassword: pin.current,
      email,
      password,
      username,
    });
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
          Thiết lập mật khẩu bảo vệ tài liệu
        </Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title}>Nhập mã bảo vệ</Text>
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

export default PasswordCaScreen;
