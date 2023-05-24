import React from 'react';
import {View} from 'react-native';
import moment from 'moment';
import PdfSVG from '../../assets/images/pdf.svg';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {Divider, List, Text, Portal} from 'react-native-paper';
import DeleteConfirmDialog from '../Dialog/DeleteConfirmDialog';
import DocumentAPI from '../../services/document';
import Toast from 'react-native-toast-message';

function FileEditModal({
  editModalRef,
  navigation,
  handleDeleteFunction,
  handleUnmarkFunction,
  handleDelFolderFunction,
  typeEdit,
  item,
}: any) {
  const [refresh, setRefresh] = React.useState(false);
  const [delDlgVisible, setDelDlgVisible] = React.useState(false);

  const editSnapPoints =
    typeEdit === 'owned' || item.fileOwner ? ['70%'] : ['50%'];

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

  const markFile = async () => {
    const result = await DocumentAPI.markFile(item._id);
    Toast.show({
      text1: result.data.message,
      type: result.data.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
    if (result.data.status === 'true') {
      item.fileStarred = !item.fileStarred;
      setRefresh(!refresh);
    }
  };

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
          <PdfSVG width={40} height={50} />
          <View style={{justifyContent: 'center', paddingLeft: 20}}>
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={{fontSize: 18}}>
              {item.name + '.pdf'}
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
            title={<Text style={{fontSize: 16}}>Mở tài liệu</Text>}
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => {
              navigation.navigate('DocumentSign', {
                id: item._id,
                name: item.name + '.pdf',
                path: item.path,
                action: 'edit',
              });
            }}
          />
          {(item.fileOwner || typeEdit === 'owned') && (
            <List.Item
              onPress={() => {
                navigation.navigate('DocumentShare', {id: item._id});
              }}
              title={<Text style={{fontSize: 16}}>Chia sẻ</Text>}
              left={props => <List.Icon {...props} icon="share" />}
            />
          )}
          <List.Item
            title={<Text style={{fontSize: 16}}>In tài liệu</Text>}
            left={props => <List.Icon {...props} icon="printer" />}
          />
          {typeEdit !== 'mixed' ? (
            <List.Item
              onPress={() => {
                navigation.navigate('FolderChoose', {id: item._id});
              }}
              title={<Text style={{fontSize: 16}}>Thêm vào thư mục</Text>}
              left={props => <List.Icon {...props} icon="folder" />}
            />
          ) : (
            <List.Item
              onPress={() => handleDelFolderFunction(item._id)}
              title={<Text style={{fontSize: 16}}>Xóa khỏi thư mục</Text>}
              left={props => <List.Icon {...props} icon="folder" />}
            />
          )}
          {typeEdit === 'starred' || item.fileStarred ? (
            <List.Item
              onPress={() => {
                handleUnmarkFunction(item._id);
                item.fileStarred = !item.fileStarred;
                setRefresh(!refresh);
              }}
              title={<Text style={{fontSize: 16}}>Bỏ dấu sao</Text>}
              left={props => <List.Icon {...props} icon="star" />}
            />
          ) : (
            <List.Item
              onPress={markFile}
              title={<Text style={{fontSize: 16}}>Đánh dấu sao</Text>}
              left={props => <List.Icon {...props} icon="star" />}
            />
          )}
        </List.Section>
        {(item.fileOwner || typeEdit === 'owned') && (
          <>
            <View style={{paddingLeft: 20, paddingRight: 20}}>
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
            </List.Section>
          </>
        )}
      </View>
      <Portal>
        <DeleteConfirmDialog
          dlgVisible={delDlgVisible}
          setDlgVisible={setDelDlgVisible}
          handleDeleteFunction={handleDeleteFunction}
          type={'tài liệu'}
          item={item}
        />
      </Portal>
    </BottomSheetModal>
  );
}

export default FileEditModal;
