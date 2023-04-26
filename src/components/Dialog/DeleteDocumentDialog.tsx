import React from 'react';
import {Button, Dialog, Text} from 'react-native-paper';

function DeleteDocumentDialog({
  dlgVisible,
  setDlgVisible,
  item,
  handleDeleteFunction,
}: any) {
  return (
    <Dialog
      visible={dlgVisible}
      style={{backgroundColor: '#fff'}}
      onDismiss={() => setDlgVisible(false)}>
      <Dialog.Title style={{textAlign: 'center'}}>
        <Text style={{fontSize: 20}}>Xóa tài liệu</Text>
      </Dialog.Title>
      <Dialog.Content>
        <Text style={{fontSize: 18, textAlign: 'center'}}>
          Bạn có chắc chắn xóa tài liệu này?
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={() => {
            setDlgVisible(false);
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'blue',
            }}>
            Hủy
          </Text>
        </Button>
        <Button
          onPress={() => {
            handleDeleteFunction(item._id);
            setDlgVisible(false);
          }}>
          <Text
            style={{
              fontSize: 16,
              color: 'blue',
            }}>
            Xóa
          </Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

export default DeleteDocumentDialog;
