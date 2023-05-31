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

function FileUploadModal({
  uploadModalRef,
  navigation,
  handleCreateFolder,
  handleCreateFile,
}: any) {
  const uploadSnapPoints = React.useMemo(() => ['25%'], []);
  const [saveDlgVisible, setSaveDlgVisible] = React.useState(false);
  const [folderName, setFolderName] = React.useState('');

  const createFolder = async () => {
    const result = await DocumentAPI.createFolder(
      folderName,
      auth().currentUser!.uid,
    );
    Toast.show({
      text1: result.data.message,
      type: result.data.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
    if (result.data.status === 'true') {
      setFolderName('');
      setSaveDlgVisible(false);
      uploadModalRef.current?.dismiss();
      if (handleCreateFolder) handleCreateFolder();
    }
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
      <View style={{padding: 20}}>
        <List.Section>
          <List.Item
            onPress={() => {
              setSaveDlgVisible(true);
            }}
            title={<Text style={{fontSize: 16}}>Tạo thư mục</Text>}
            left={() => <List.Icon icon="folder-plus" />}
          />
          <List.Item
            onPress={uploadFileFunc}
            title={<Text style={{fontSize: 16}}>Tải lên file</Text>}
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
            <TextInput
              theme={{roundness: 10}}
              mode="outlined"
              placeholder="Tên thư mục"
              onChangeText={text => setFolderName(text)}
              value={folderName}
              right={
                <TextInput.Icon
                  onPress={() => setFolderName('')}
                  icon="close"
                />
              }
            />
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
            <Button onPress={createFolder}>
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
