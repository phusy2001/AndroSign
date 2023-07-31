import React from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import moment from 'moment';
import {View} from 'react-native';
import {Divider, List, Portal, Text} from 'react-native-paper';
import DeleteConfirmDialog from '../Dialog/DeleteConfirmDialog';
import PdfSVG from '../../assets/images/pdf.svg';

function FileDeletedModal({
  editModalRef,
  item,
  handleDeleteFunction,
  handleRestoreFunction,
}: any) {
  const [delDlgVisible, setDelDlgVisible] = React.useState(false);

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
          <List.Item
            title={<Text style={{fontSize: 16}}>Khôi phục</Text>}
            left={props => <List.Icon {...props} icon="restore" />}
            onPress={() => handleRestoreFunction(item._id)}
          />
          <List.Item
            onPress={() => setDelDlgVisible(true)}
            title={
              <Text style={{fontSize: 16, color: 'red'}}>Xoá vĩnh viễn</Text>
            }
            left={props => (
              <List.Icon {...props} color="red" icon="trash-can" />
            )}
          />
        </List.Section>
      </View>
      <Portal>
        <DeleteConfirmDialog
          dlgVisible={delDlgVisible}
          setDlgVisible={setDelDlgVisible}
          handleDeleteFunction={handleDeleteFunction}
          type={'vĩnh viễn tài liệu'}
          description={'Bạn sẽ không thể khôi phục lại nó'}
          item={item}
        />
      </Portal>
    </BottomSheetModal>
  );
}

export default FileDeletedModal;
