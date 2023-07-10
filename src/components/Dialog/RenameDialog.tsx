import React from 'react';
import {Text, Button, Dialog, TextInput} from 'react-native-paper';

function RenameDialog({
  item,
  dlgVisible,
  setDlgVisible,
  handleRenameFunction,
}: any) {
  const [name, setName] = React.useState(item.name);

  return (
    <Dialog
      visible={dlgVisible}
      style={{backgroundColor: '#fff'}}
      onDismiss={() => setDlgVisible(false)}>
      <Dialog.Title style={{textAlign: 'center'}}>
        <Text style={{fontSize: 20}}>Đổi tên thành...</Text>
      </Dialog.Title>
      <Dialog.Content>
        <TextInput
          theme={{roundness: 10}}
          mode="outlined"
          placeholder="Tên tài liệu"
          onChangeText={text => setName(text)}
          value={name}
          right={<TextInput.Icon onPress={() => setName('')} icon="close" />}
        />
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
            if (name !== '' && name !== item.name) {
              handleRenameFunction(item._id, name).then((result: any) => {
                if (result.status === 'true') {
                  item.name = name;
                  setDlgVisible(false);
                }
              });
            }
          }}>
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
