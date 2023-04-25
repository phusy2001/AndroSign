import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Dialog,
  Divider,
  FAB,
  List,
  Portal,
  RadioButton,
  Searchbar,
  Text,
} from 'react-native-paper';
import {FlashList} from '@shopify/flash-list';
import {useIsFocused} from '@react-navigation/native';
import {useDrawerStatus} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import PdfSVG from '../assets/images/pdf.svg';
import DocumentPicker, {types} from 'react-native-document-picker';
import moment from 'moment';
import OwnFileItem from '../components/OwnFileItem';
import DocumentAPI from '../services/document';
import Toast from 'react-native-toast-message';

function MyDocumentScreen({navigation, route}: any) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const isFocused = useIsFocused();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [data, setData] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [item, setItem] = React.useState<any>();
  const [end, setEnd] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const [dlgVisible, setDlgVisible] = React.useState(false);
  const [status, setStatus] = React.useState<string>('1');
  const [sorting, setSortting] = React.useState<string>('updated');
  const [order, setOrder] = React.useState<string>('desc');
  const uploadModal = React.useRef<BottomSheetModal>(null);
  const filterModal = React.useRef<BottomSheetModal>(null);
  const editModal = React.useRef<BottomSheetModal>(null);
  const uploadSnapPoints = React.useMemo(() => ['25%'], []);
  const filterSnapPoints = React.useMemo(() => ['50%'], []);
  const editSnapPoints = React.useMemo(() => ['70%'], []);

  const handleDrawer = () => {
    if (!isDrawerOpen) navigation.dispatch(DrawerActions.openDrawer());
  };

  const loadData = async () => {
    if (end === false) {
      setIsLoading(true);
      const result = await DocumentAPI.getOwnFile(
        pageNumber,
        searchQuery,
        sorting,
        order,
      );
      if (result.data.data.data.length < 10) setEnd(true);
      const newData = await result.data.data.data;
      setData(data.concat(newData));
      setPageNumber(pageNumber + 1);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isFocused) {
      uploadModal.current?.dismiss();
      filterModal.current?.dismiss();
      editModal.current?.dismiss();
      setData([]);
      setPageNumber(1);
      setEnd(false);
      setRefresh(refresh + 1);
    }
  }, [isFocused]);

  React.useEffect(() => {
    if (refresh > 0) loadData();
  }, [refresh]);

  React.useEffect(() => {
    if (refresh > 0) {
      const timeOut = setTimeout(() => {
        setData([]);
        setPageNumber(1);
        setEnd(false);
        setRefresh(refresh + 1);
      }, 500);
      return () => clearTimeout(timeOut);
    }
  }, [searchQuery, sorting, order]);

  const handlePresentUploadModalPress = React.useCallback(() => {
    if (filterModal || editModal) {
      filterModal.current?.dismiss();
      editModal.current?.dismiss();
    }
    uploadModal.current?.present();
  }, []);

  const handlePresentFilterModalPress = React.useCallback(() => {
    if (uploadModal || editModal) {
      uploadModal.current?.dismiss();
      editModal.current?.dismiss();
    }
    filterModal.current?.present();
  }, []);

  const handlePressMoreFunction = React.useCallback((data: any) => {
    if (uploadModal || filterModal) {
      uploadModal.current?.dismiss();
      filterModal.current?.dismiss();
    }
    editModal.current?.present(data);
    setItem(data);
  }, []);

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

  const renderFooter = () => {
    if (isLoading) {
      return (
        <View style={{paddingVertical: 20}}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    } else {
      return null;
    }
  };

  const deleteDocument = async (id: any) => {
    const result = await DocumentAPI.deleteDocument(id);
    const filteredData = data.filter((item: any) => item._id !== id);
    setData(filteredData);
    editModal.current?.dismiss();
    Toast.show({
      text1: 'Deleted File Successfully',
      type: 'info',
      position: 'bottom',
    });
  };

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
    <View style={styles.container}>
      <Appbar.Header style={{justifyContent: 'space-between'}}>
        <Appbar.Action icon="format-list-bulleted" onPress={handleDrawer} />
        <Appbar.Action icon="tune" onPress={handlePresentFilterModalPress} />
      </Appbar.Header>
      <View style={{marginLeft: 20, marginRight: 20}}>
        <Text style={{fontSize: 20, fontWeight: '700'}}>Tài liệu của tôi</Text>
        <Searchbar
          style={{marginTop: 20}}
          placeholder="Search"
          onChangeText={(query: string) => setSearchQuery(query)}
          value={searchQuery}
        />
      </View>

      <View style={styles.content}>
        <FlashList
          data={data}
          renderItem={({item}) => (
            <OwnFileItem
              item={item}
              onPressMoreFunction={handlePressMoreFunction}
            />
          )}
          keyExtractor={(item: any) => item?._id}
          onEndReached={loadData}
          onEndReachedThreshold={0.001}
          estimatedItemSize={100}
          ListFooterComponent={renderFooter}
        />
      </View>
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={handlePresentUploadModalPress}
      />
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={uploadModal}
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
        <BottomSheetModal
          ref={filterModal}
          index={0}
          backdropComponent={renderBackdrop}
          snapPoints={filterSnapPoints}
          enablePanDownToClose={true}>
          <View style={{padding: 20}}>
            <View style={{marginBottom: 15}}>
              {/* <Text
                variant="labelLarge"
                style={{fontSize: 20, marginBottom: 10}}>
                Trạng thái
              </Text>
              <RadioButton.Group
                onValueChange={newStatus => setStatus(newStatus)}
                value={status}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="1" />
                  <View style={{marginLeft: 20}}>
                    <Text style={{fontSize: 16}}>Tất cả</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="2" />
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#FF7A00',
                        marginLeft: 20,
                        marginRight: 8,
                      }}></View>
                    <Text style={{fontSize: 16}}>Đang xử lý</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="3" />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: 20,
                    }}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#42FF00',
                        marginRight: 8,
                      }}></View>
                    <Text style={{fontSize: 16}}>Đã ký</Text>
                  </View>
                </View>
              </RadioButton.Group> */}
              <Text
                variant="labelLarge"
                style={{fontSize: 20, marginBottom: 10}}>
                Thứ tự
              </Text>
              <RadioButton.Group
                onValueChange={orderValue => setOrder(orderValue)}
                value={order}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="desc" />
                  <View style={{marginLeft: 20}}>
                    <Text style={{fontSize: 16}}>Giảm dần</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="asc" />
                  <View style={{marginLeft: 20}}>
                    <Text style={{fontSize: 16}}>Tăng dần</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            <View style={{marginBottom: 15}}>
              <Text
                variant="labelLarge"
                style={{fontSize: 20, marginBottom: 10}}>
                Sắp xếp
              </Text>
              <RadioButton.Group
                onValueChange={sortValue => setSortting(sortValue)}
                value={sorting}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="updated" />
                  <View style={{marginLeft: 20}}>
                    <Text style={{fontSize: 16}}>Cập nhật gần đây</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="name" />
                  <View style={{marginLeft: 20}}>
                    <Text style={{fontSize: 16}}>Tên tài liệu</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="created" />
                  <View style={{marginLeft: 20}}>
                    <Text style={{fontSize: 16}}>Ngày tạo</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            {/* <Button
              mode="contained"
              onPress={() => {
                filterModal.current?.dismiss();
              }}>
              Xác nhận{' '}
            </Button> */}
          </View>
        </BottomSheetModal>
        <BottomSheetModal
          ref={editModal}
          index={0}
          backdropComponent={renderBackdrop}
          snapPoints={editSnapPoints}
          enablePanDownToClose={true}>
          {(props: any) => {
            //const {data} = props;
            return (
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
                  }}></Divider>
                <List.Section>
                  <List.Item
                    title={<Text style={{fontSize: 16}}>Mở tài liệu</Text>}
                    left={props => (
                      <List.Icon {...props} icon="file-document" />
                    )}
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
                      navigation.navigate('DocumentShare');
                    }}
                    title={<Text style={{fontSize: 16}}>Chia sẻ</Text>}
                    left={props => <List.Icon {...props} icon="share" />}
                  />
                  <List.Item
                    title={<Text style={{fontSize: 16}}>In tài liệu</Text>}
                    left={props => <List.Icon {...props} icon="printer" />}
                  />
                  <List.Item
                    title={<Text style={{fontSize: 16}}>Thêm vào thư mục</Text>}
                    left={props => <List.Icon {...props} icon="folder" />}
                  />
                  <List.Item
                    title={<Text style={{fontSize: 16}}>Đánh dấu sao</Text>}
                    left={props => <List.Icon {...props} icon="star" />}
                  />
                </List.Section>
                <View style={{paddingLeft: 20, paddingRight: 20}}>
                  <Divider bold={true}></Divider>
                </View>
                <List.Section>
                  <List.Item
                    onPress={() => setDlgVisible(true)}
                    title={
                      <Text style={{fontSize: 16, color: 'red'}}>Xoá</Text>
                    }
                    left={props => (
                      <List.Icon {...props} color="red" icon="trash-can" />
                    )}
                  />
                </List.Section>
              </View>
            );
          }}
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <Portal>
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
                deleteDocument(item._id);
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
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 20,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default MyDocumentScreen;
