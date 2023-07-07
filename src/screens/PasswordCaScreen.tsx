import React, {useState, useRef} from 'react';
import {View, TextInput as NativeTextInput, StyleSheet} from 'react-native';
import {TextInput, Button, Text, IconButton} from 'react-native-paper';

const PasswordCaScreen = ({navigation, route}: any) => {
  const {email, password, username} = route.params;
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

  const handleSubmit = () => {
    navigation.navigate('VerifyPasswordCa', {
      caPassword: pin,
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
        <Text style={styles.title}>Nhập mật khẩu bảo vệ</Text>
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
              onSubmitEditing={() => {
                if (index === 5) {
                  handleSubmit();
                }
              }}
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

export default PasswordCaScreen;
