import React from 'react';
import {PermissionsAndroid, Platform, View} from 'react-native';
import moment from 'moment';
import PdfSVG from '../../assets/images/pdf.svg';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {Divider, List, Text, Portal} from 'react-native-paper';
import DeleteConfirmDialog from '../Dialog/DeleteConfirmDialog';
import DocumentAPI from '../../services/document';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob';
import RenameDialog from '../Dialog/RenameDialog';

function FileEditModal({
  editModalRef,
  navigation,
  handleDeleteFunction,
  handleUnmarkFunction,
  handleDelFolderFunction,
  handleRenameFunction,
  typeEdit,
  item,
}: any) {
  const [refresh, setRefresh] = React.useState(false);

  const [delDlgVisible, setDelDlgVisible] = React.useState(false);
  const [renDlgVisible, setRenDlgVisible] = React.useState(false);

  const snapPoints = React.useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

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
      text1: result.message,
      type: result.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
    if (result.status === 'true') {
      item.fileStarred = !item.fileStarred;
      setRefresh(!refresh);
    }
  };

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Yêu cầu quyền truy cập bộ nhớ',
            message:
              'AndroSign cần quyền truy cập vào bộ nhớ máy của bạn để tải tài liệu',
            buttonNeutral: 'Hỏi tôi sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Đồng ý',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadFile();
        } else {
          console.log('Storage Permission Not Granted');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const downloadFile = () => {
    const date = new Date();
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: RootDir + '/' + item.name + '_' + date.getTime() + '.pdf',
        description: 'Đang tải tài liệu...',
        notification: true,
        useDownloadManager: true,
        mime: 'application/pdf',
      },
    };
    config(options)
      .fetch('GET', item.path)
      .then(res => {});
  };

  return (
    <BottomSheetModal
      ref={editModalRef}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enablePanDownToClose={true}>
      <View onLayout={handleContentLayout}>
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
          {(item.fileOwner || typeEdit === 'owned') && (
            <>
              <List.Item
                onPress={() => setRenDlgVisible(true)}
                title={<Text style={{fontSize: 16}}>Đổi tên tài liệu</Text>}
                left={props => (
                  <List.Icon {...props} icon="file-document-edit" />
                )}
              />
              <List.Item
                onPress={() => {
                  navigation.navigate('DocumentShare', {id: item._id});
                }}
                title={<Text style={{fontSize: 16}}>Chia sẻ</Text>}
                left={props => <List.Icon {...props} icon="share" />}
              />
              <List.Item
                onPress={() => {
                  navigation.navigate('DocumentHistory', {id: item._id});
                }}
                title={
                  <Text style={{fontSize: 16}}>Lịch sử thay đổi tài liệu</Text>
                }
                left={props => <List.Icon {...props} icon="history" />}
              />
            </>
          )}
          <List.Item
            title={<Text style={{fontSize: 16}}>Tải về tài liệu</Text>}
            left={props => <List.Icon {...props} icon="file-download" />}
            onPress={checkPermission}
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

export default FileEditModal;
