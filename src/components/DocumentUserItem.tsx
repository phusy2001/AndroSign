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
    .email('Vui lòng nhập email hợp lệ')
    .required('Email là bắt buộc'),
});

function DocumentUserItem({item, data, setData}: any) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(DocUserSchema),
  });

  const onSubmit = async (form: any) => {
    const result = await UserAPI.findUserByEmail(form.email);
    if (result.status === 'true') {
      item._id = result.data.uid;
      item.name = result.data.display_name;
      item.email = form.email;
    } else {
      const filteredData = data.filter((i: any) => i.index !== item.index);
      setData(filteredData);
    }
    Toast.show({
      text1: result.message,
      type: result.status === 'true' ? 'success' : 'error',
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
        render={({field: {onChange, value}}) => (
          <TextInput
            outlineStyle={{borderRadius: 6}}
            mode="outlined"
            onBlur={handleSubmit(onSubmit)}
            onChangeText={onChange}
            defaultValue={item.email}
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
                    (i: any) => i.index !== item.index,
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
