import React from 'react';
import {View} from 'react-native';
import {Checkbox, Text} from 'react-native-paper';
import DocumentAPI from '../services/document';
import Toast from 'react-native-toast-message';

function FolderChooseItem({item, fileId}: any) {
  const [checked, setChecked] = React.useState(item.isStored);
  const [disabled, setDisabled] = React.useState(false);

  const updateFileInFolder = async () => {
    const result = await DocumentAPI.updateFileInFolder(fileId, item._id);
    Toast.show({
      text1: result.message,
      type: result.status === 'true' ? 'success' : 'error',
      position: 'bottom',
      visibilityTime: 1000,
    });
    if (result.status === 'true') setChecked(!checked);
  };

  React.useEffect(() => {
    if (disabled === true) {
      updateFileInFolder();
      setDisabled(false);
    }
  }, [disabled]);

  return (
    <View
      style={{
        backgroundColor: '#F8F8F8',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        marginBottom: 10,
        padding: 15,
      }}>
      <Text style={{fontSize: 16}} numberOfLines={1}>
        {item.name}
      </Text>
      <Checkbox
        disabled={disabled}
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          setDisabled(true);
        }}
      />
    </View>
  );
}

export default FolderChooseItem;
