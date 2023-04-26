import React from 'react';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {View} from 'react-native';
import {List, Text} from 'react-native-paper';
import DocumentPicker, {types} from 'react-native-document-picker';

function FileUploadModal({uploadModalRef, navigation}: any) {
  const uploadSnapPoints = React.useMemo(() => ['25%'], []);

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
            onPress={() => {}}
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
    </BottomSheetModal>
  );
}

export default FileUploadModal;
