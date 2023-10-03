import React from 'react';
import {Button, Dialog, Text} from 'react-native-paper';

function DeleteConfirmDialog({
  item,
  type,
  description,
  dlgVisible,
  setDlgVisible,
  handleDeleteFunction,
}: any) {
  return (
    <Dialog
      visible={dlgVisible}
      style={{backgroundColor: '#fff'}}
      onDismiss={() => setDlgVisible(false)}>
      <Dialog.Title style={{textAlign: 'center'}}>
        <Text style={{fontSize: 20}}>Xóa {type}</Text>
      </Dialog.Title>
      <Dialog.Content>
        <Text style={{fontSize: 16, textAlign: 'center'}}>
          Bạn có chắc chắn xóa {type} này? {description}
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
        <Button
          onPress={() => {
            handleDeleteFunction(item._id);
            setDlgVisible(false);
          }}>
          <Text
            style={{
              fontSize: 18,
              color: 'red',
            }}>
            Xóa
          </Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

export default DeleteConfirmDialog;
