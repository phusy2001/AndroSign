import React, {useState, useRef} from 'react';
import {TextInput, Button, Text} from 'react-native-paper';
import {
  View,
  TextInput as NativeTextInput,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {signupWithEmail} from '../services/auth';

const VerifyPasswordCaScreen = ({route, navigation}) => {
  const [pin, setPin] = useState<string>('');
  const inputRefs = useRef<NativeTextInput[]>([]);

  const {caPassword, email, password, username} = route.params;

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
      await signupWithEmail(email, password, username, pin);

      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập lại mật khẩu bảo vệ file của bạn</Text>
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
            theme={{roundness: 50}}
            style={styles.textInput}
            ref={ref => (inputRefs.current[index] = ref)}
            onSubmitEditing={() => {
              if (index === 5) {
                handleSubmit();
              }
            }}
          />
        ))}
      </View>
      <Button mode="contained" onPress={handleSubmit}>
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},

  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 30},

  textInputGroup: {flexDirection: 'row'},

  textInput: {
    marginHorizontal: 8,
    marginBottom: 30,
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#000',
    fontSize: 24,
    textAlign: 'center',
  },
});

export default VerifyPasswordCaScreen;
