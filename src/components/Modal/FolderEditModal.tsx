import React from 'react';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {View} from 'react-native';
import {Divider, List, Text, Portal} from 'react-native-paper';
import FolderSVG from '../../assets/images/folder.svg';
import moment from 'moment';
import DeleteConfirmDialog from '../Dialog/DeleteConfirmDialog';
import RenameDialog from '../Dialog/RenameDialog';

function FolderEditModal({
  editModalRef,
  navigation,
  handleDeleteFunction,
  handleRenameFunction,
  item,
}: any) {
  const [delDlgVisible, setDelDlgVisible] = React.useState(false);
  const [renDlgVisible, setRenDlgVisible] = React.useState(false);
  const editSnapPoints = React.useMemo(() => ['43%'], []);

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
      ref={editModalRef}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={editSnapPoints}
      enablePanDownToClose={true}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: 30,
            paddingTop: 15,
          }}>
          <FolderSVG width={43} height={52} />
          <View style={{justifyContent: 'center', paddingLeft: 20}}>
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={{fontSize: 18}}>
              {item.name}
            </Text>
            <Text variant="bodyMedium">
              {moment(item.updated_at).format('DD/MM/YYYY HH:mm')}
            </Text>
          </View>
        </View>
        <Divider
          bold={true}
          style={{
            marginTop: 15,
          }}
        />
        <List.Section>
          <List.Item
            title={<Text style={{fontSize: 16}}>Mở thư mục</Text>}
            left={props => <List.Icon {...props} icon="folder-open" />}
            onPress={() => {
              navigation.navigate('FolderDetail', {
                id: item._id,
                name: item.name,
              });
            }}
          />
          <List.Item
            onPress={() => setRenDlgVisible(true)}
            title={<Text style={{fontSize: 16}}>Đổi tên tài liệu</Text>}
            left={props => <List.Icon {...props} icon="folder-edit" />}
          />
          <List.Item
            onPress={() => setDelDlgVisible(true)}
            title={<Text style={{fontSize: 16, color: 'red'}}>Xoá</Text>}
            left={props => (
              <List.Icon {...props} color="red" icon="trash-can" />
            )}
          />
        </List.Section>
        {/* <View style={{paddingLeft: 20, paddingRight: 20}}>
          <Divider bold={true} />
        </View>
        <List.Section>
          <List.Item
            onPress={() => setDelDlgVisible(true)}
            title={<Text style={{fontSize: 16, color: 'red'}}>Xoá</Text>}
            left={props => (
              <List.Icon {...props} color="red" icon="trash-can" />
            )}
          />
        </List.Section> */}
      </View>
      <Portal>
        <DeleteConfirmDialog
          dlgVisible={delDlgVisible}
          setDlgVisible={setDelDlgVisible}
          handleDeleteFunction={handleDeleteFunction}
          type={'thư mục'}
          item={item}
        />
        <RenameDialog
          dlgVisible={renDlgVisible}
          setDlgVisible={setRenDlgVisible}
          handleRenameFunction={handleRenameFunction}
          item={item}
        />
      </Portal>
    </BottomSheetModal>
  );
}

export default FolderEditModal;
