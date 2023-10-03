import React from 'react';
import {Text, Button, Dialog, TextInput} from 'react-native-paper';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import Toast from 'react-native-toast-message';

function RenameDialog({
  item,
  dlgVisible,
  setDlgVisible,
  handleRenameFunction,
  type = 'document',
}: any) {
  const RenameSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(
        `Tên ${type === 'document' ? 'tài liệu' : 'thư mục'} là bắt buộc`,
      ),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(RenameSchema),
    defaultValues: {
      name: item.name,
    },
  });

  const onSubmit = async (data: any) => {
    if (data.name !== item.name) {
      handleRenameFunction(item._id, data.name).then((result: any) => {
        if (result.status === 'true') {
          item.name = data.name;
          setDlgVisible(false);
        }
      });
    } else
      Toast.show({
        text1: `Tên ${
          type === 'document' ? 'tài liệu' : 'thư mục'
        } mới trùng với tên cũ`,
        type: 'info',
        position: 'top',
      });
  };

  return (
    <Dialog
      visible={dlgVisible}
      style={{backgroundColor: '#fff'}}
      onDismiss={() => setDlgVisible(false)}>
      <Dialog.Title style={{textAlign: 'center'}}>
        <Text style={{fontSize: 20}}>Đổi tên thành...</Text>
      </Dialog.Title>
      <Dialog.Content>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              theme={{roundness: 10}}
              mode="outlined"
              placeholder={type === 'document' ? 'Tên tài liệu' : 'Tên thư mục'}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              outlineColor={errors.name && 'red'}
              activeOutlineColor={errors.name && 'red'}
              right={
                <TextInput.Icon
                  onPress={() => reset({name: ''})}
                  icon="close"
                />
              }
            />
          )}
          name="name"
        />
        <Text style={{color: 'red'}}>
          {errors.name && `${errors.name.message}`}
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={() => {
            setDlgVisible(false);
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'blue',
            }}>
            Hủy
          </Text>
        </Button>
        <Button onPress={handleSubmit(onSubmit)}>
          <Text
            style={{
              fontSize: 18,
              color: 'blue',
            }}>
            Xác nhận
          </Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

export default RenameDialog;
