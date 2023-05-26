import React from 'react';
import {View} from 'react-native';
import {TextInput} from 'react-native-paper';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, Controller} from 'react-hook-form';
import UserAPI from '../services/user';
import Toast from 'react-native-toast-message';

const DocUserSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be a valid email address')
    .required('Email is a required field'),
});

function DocumentUserItem({item, data, setData}: any) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(DocUserSchema),
  });

  const onSubmit = async (data: any) => {
    // item._id = '123456';
    // item.name = 'TrongLe';
    const result = await UserAPI.findUserByEmail(data.email);
    if (result.data.status === 'true') {
      item._id = result.data.data.uid;
      item.name = result.data.data.display_name;
    } else {
      const filteredData = data.filter((i: any) => i.temp !== item.temp);
      setData(filteredData);
    }
    Toast.show({
      text1: result!.data.message,
      type: result!.data.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
  };

  return (
    <View style={{marginBottom: 15}}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            outlineStyle={{borderRadius: 6}}
            mode="outlined"
            onBlur={handleSubmit(onSubmit)}
            onChangeText={onChange}
            value={value}
            inputMode="email"
            textContentType="emailAddress"
            placeholder="Nhập địa chỉ Email"
            outlineColor={errors.email && 'red'}
            activeOutlineColor={errors.email && 'red'}
            right={
              <TextInput.Icon
                onPress={() => {
                  const filteredData = data.filter(
                    (i: any) => i.temp !== item.temp,
                  );
                  setData(filteredData);
                }}
                icon="close"
              />
            }
          />
        )}
        name="email"
      />
    </View>
  );
}

export default DocumentUserItem;
