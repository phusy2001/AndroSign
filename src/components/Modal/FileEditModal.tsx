import React from 'react';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {View} from 'react-native';
import {Divider, List, Text, Portal} from 'react-native-paper';
import PdfSVG from '../../assets/images/pdf.svg';
import moment from 'moment';
import DeleteConfirmDialog from '../Dialog/DeleteConfirmDialog';

function FileEditModal({
  editModalRef,
  navigation,
  handleDeleteFunction,
  handleDelFolderFunction,
  typeEdit,
  item,
}: any) {
  const [delDlgVisible, setDelDlgVisible] = React.useState(false);
  const editSnapPoints = React.useMemo(() => ['70%'], []);

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
          <PdfSVG width={43} height={52} />
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
          <List.Item
            onPress={() => {
              navigation.navigate('DocumentShare', {id: item._id});
            }}
            title={<Text style={{fontSize: 16}}>Chia sẻ</Text>}
            left={props => <List.Icon {...props} icon="share" />}
          />
          <List.Item
            title={<Text style={{fontSize: 16}}>In tài liệu</Text>}
            left={props => <List.Icon {...props} icon="printer" />}
          />
          {typeEdit !== 'mixed' && (
            <List.Item
              onPress={() => {
                navigation.navigate('FolderChoose', {id: item._id});
              }}
              title={<Text style={{fontSize: 16}}>Thêm vào thư mục</Text>}
              left={props => <List.Icon {...props} icon="folder" />}
            />
          )}
          <List.Item
            title={<Text style={{fontSize: 16}}>Đánh dấu sao</Text>}
            left={props => <List.Icon {...props} icon="star" />}
          />
        </List.Section>
        {(item.fileOwner || typeEdit === 'owned') && (
          <>
            <View style={{paddingLeft: 20, paddingRight: 20}}>
              <Divider bold={true} />
            </View>
            <List.Section>
              {typeEdit === 'mixed' && (
                <List.Item
                  onPress={() => handleDelFolderFunction(item._id)}
                  title={
                    <Text style={{fontSize: 16, color: 'red'}}>
                      Xóa khỏi thư mục
                    </Text>
                  }
                  left={props => (
                    <List.Icon {...props} color="red" icon="file-document" />
                  )}
                />
              )}
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
