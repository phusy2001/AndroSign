import React from 'react';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {View} from 'react-native';
import {
  Dialog,
  List,
  Portal,
  Text,
  Button,
  TextInput,
} from 'react-native-paper';
import DocumentPicker, {types} from 'react-native-document-picker';
import DocumentAPI from '../../services/document';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import Spinner from 'react-native-loading-spinner-overlay';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import {checkQuota} from '../../services/payment';

const CreateFolderSchema = yup.object().shape({
  folderName: yup.string().trim().required('Tên thư mục là bắt buộc'),
});

function FileUploadModal({
  uploadModalRef,
  navigation,
  handleCreateFolder,
  handleCreateFile,
}: any) {
  const uploadSnapPoints = React.useMemo(() => ['25%'], []);
  const [saveDlgVisible, setSaveDlgVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(CreateFolderSchema),
  });

  const onSubmit = async (data: any) => {
    createFolder(data.folderName);
  };

  const getUserQuotas = async () => {
    const userQuotas = await checkQuota();
    return userQuotas.data;
  };

  const createFolder = async (folderName: string) => {
    setLoading(true);
    const result = await DocumentAPI.createFolder(
      folderName,
      auth().currentUser!.uid,
    );
    Toast.show({
      text1: result.message,
      type: result.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
    if (result.status === 'true') {
      reset({folderName: ''});
      setSaveDlgVisible(false);
      uploadModalRef.current?.dismiss();
      if (handleCreateFolder) {
        handleCreateFolder();
      } else {
        navigation.navigate('Folders');
      }
    }
    setLoading(false);
  };

  const uploadFileFunc = React.useCallback(async () => {
    const response = await DocumentPicker.pick({
      presentationStyle: 'fullScreen',
      type: [types.pdf],
    });
    navigation.navigate('DocumentSign', {
      name: response[0].name,
      path: response[0].uri,
      file: response[0],
      action: 'upload',
      handleFileCreated: () => {
        handleCreateFile();
      },
    });
  }, []);

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        animatedIndex={{
          value: 1,
        }}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={uploadModalRef}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={uploadSnapPoints}
      enablePanDownToClose={true}>
      <Spinner
        visible={loading}
        animation="fade"
        textContent={'Đang xử lý...'}
        textStyle={{color: '#FFF', fontWeight: 'bold'}}
      />
      <View style={{padding: 20}}>
        <List.Section>
          <List.Item
            onPress={async () => {
              const result = await getUserQuotas();
              if (result.type === 'free' && result.usage.folders > 10)
                Toast.show({
                  text1:
                    'Thư mục đã đầy cho bản dùng thử. Vui lòng nâng cấp tài khoản để tiếp tục sử dụng',
                  type: 'info',
                  position: 'bottom',
                });
              else setSaveDlgVisible(true);
            }}
            title={<Text style={{fontSize: 16}}>Tạo thư mục</Text>}
            left={() => <List.Icon icon="folder-plus" />}
          />
          <List.Item
            onPress={async () => {
              const result = await getUserQuotas();
              if (result.type === 'free' && result.usage.files > 50)
                Toast.show({
                  text1:
                    'Tài liệu đã đầy cho bản dùng thử. Vui lòng nâng cấp tài khoản để tiếp tục sử dụng',
                  type: 'info',
                  position: 'bottom',
                });
              else uploadFileFunc();
            }}
            title={<Text style={{fontSize: 16}}>Tải lên tài liệu</Text>}
            left={() => <List.Icon icon="file-upload" />}
          />
        </List.Section>
      </View>
      <Portal>
        <Dialog
          visible={saveDlgVisible}
          style={{backgroundColor: '#fff'}}
          onDismiss={() => setSaveDlgVisible(false)}>
          <Dialog.Title style={{textAlign: 'center'}}>
            <Text style={{fontSize: 18}}>Tạo mới thư mục</Text>
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
                  placeholder="Tên thư mục"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  outlineColor={errors.folderName && 'red'}
                  activeOutlineColor={errors.folderName && 'red'}
                  right={
                    <TextInput.Icon
                      onPress={() => reset({folderName: ''})}
                      icon="close"
                    />
                  }
                />
              )}
              name="folderName"
            />
            <Text style={{color: 'red'}}>
              {errors.folderName && `${errors.folderName.message}`}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSaveDlgVisible(false)}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Hủy
              </Text>
            </Button>
            <Button onPress={handleSubmit(onSubmit)}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'blue',
                }}>
                Xác nhận
              </Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </BottomSheetModal>
  );
}

export default FileUploadModal;
