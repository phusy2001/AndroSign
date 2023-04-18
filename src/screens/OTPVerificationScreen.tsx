/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {View, KeyboardAvoidingView, Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, Text, IconButton} from 'react-native-paper';
import OTPTextView from '../components/OTPTextView';
import {useNavigation} from '@react-navigation/native';

function OTPVerificationScreen() {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const navigation = useNavigation();
  const otp = useRef(null);

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
      <View style={{height: screenHeight - 150}}>
        <IconButton
          style={{marginTop: 70, marginLeft: -10}}
          icon="arrow-left"
          size={30}
          onPress={() => navigation.goBack()}
        />
        <KeyboardAvoidingView
          behavior="position"
          style={{
            marginTop: 100,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 22,
            }}>
            Xác thực tài khoản
          </Text>
          <Text
            style={{
              fontSize: 18,
              marginTop: 5,
              marginBottom: 20,
            }}>
            Chúng tôi đã gửi mã OTP xác nhận qua email của bạn
          </Text>
          <OTPTextView
            handleTextChange={e => console.log(e)}
            inputCount={4}
            inputCellLength={1}
            textInputStyle={{
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 6,
              borderBottomWidth: 1,
            }}
            offTintColor={'black'}
          />
        </KeyboardAvoidingView>
      </View>
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'flex-end',
          marginBottom: 10,
          width: '100%',
        }}>
        <Button mode="outlined" onPress={() => {}}>
          Gửi lại
        </Button>
        <Button
          style={{marginTop: 15}}
          mode="contained"
          onPress={() => {
            // console.log(otpInput);
            // navigation.navigate('LoginScreen');
            console.log(otp.current);
          }}>
          Xác nhận
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

export default OTPVerificationScreen;