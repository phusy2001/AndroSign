import React from 'react';
import {ImageBackground, RefreshControl, StyleSheet, View} from 'react-native';
import {Appbar, FAB, Searchbar, Text} from 'react-native-paper';
import {FlashList} from '@shopify/flash-list';
import {useIsFocused} from '@react-navigation/native';
import {useDrawerStatus} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import FileItem from '../components/FileItem';
import DocumentAPI from '../services/document';
import Toast from 'react-native-toast-message';
import FileUploadModal from '../components/Modal/FileUploadModal';
import FilesFilterModal from '../components/Modal/FilesFilterModal';
import ListFooter from '../components/ListFooter';
import TrashSVG from '../assets/images/trash_empty.svg';
import RsEmptySVG from '../assets/images/result_empty.svg';
import FileDeletedModal from '../components/Modal/FileDeletedModal';

function TrashScreen({navigation}: any) {
  const initial = React.useRef(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const isFocused = useIsFocused();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [data, setData] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [item, setItem] = React.useState({});
  const [end, setEnd] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const [sorting, setSorting] = React.useState<string>('updated');
  const [order, setOrder] = React.useState<string>('desc');
  const [refreshing, setRefreshing] = React.useState(true);
  const uploadModal = React.useRef<BottomSheetModal>(null);
  const filterModal = React.useRef<BottomSheetModal>(null);
  const editModal = React.useRef<BottomSheetModal>(null);

  const loadData = async () => {
    if (end === false) {
      setIsLoading(true);
      const result = await DocumentAPI.getDeletedFiles(
        pageNumber,
        searchQuery,
        sorting,
        order,
      );
      if (result.data.data.length < 10) {
        setEnd(true);
      }
      const newData = result.data.data;
      setData(data.concat(newData));
      setPageNumber(pageNumber + 1);
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleDrawer = React.useCallback(() => {
    if (!isDrawerOpen) {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  }, []);

  const refreshData = () => {
    setData([]);
    setPageNumber(1);
    setEnd(false);
    setRefresh(refresh + 1);
  };

  React.useEffect(() => {
    if (isFocused) {
      uploadModal.current?.dismiss();
    }
  }, [isFocused]);

  React.useEffect(() => {
    if (refresh > 0) {
      loadData();
    }
  }, [refresh]);

  React.useEffect(() => {
    if (!initial.current) {
      const timeOut = setTimeout(() => refreshData(), 1000);
      return () => clearTimeout(timeOut);
    } else {
      initial.current = false;
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

  const handlePressMoreFunction = async (data: any) => {
    if (uploadModal || filterModal) {
      uploadModal.current?.dismiss();
      filterModal.current?.dismiss();
    }
    editModal.current?.present(data);
    setItem(data);
  };

  const handleDeleteFunction = async (id: string) => {
    const result = await DocumentAPI.deletePermanently(id);
    if (result.status === 'true') {
      const filteredData = data.filter((item: any) => item._id !== id);
      setData(filteredData);
      editModal.current?.dismiss();
    }
    Toast.show({
      text1: result.message,
      type: result.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
  };

  const handleRestoreFunction = async (id: string) => {
    const result = await DocumentAPI.restoreFile(id);
    if (result.status === 'true') {
      const filteredData = data.filter((item: any) => item._id !== id);
      setData(filteredData);
      editModal.current?.dismiss();
    }
    Toast.show({
      text1: result.message,
      type: result.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
  };

  return (
    <ImageBackground
      style={styles.container}
      resizeMode="cover"
      source={require('../assets/images/app.png')}>
      <Appbar.Header
        style={{
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
        }}>
        <Appbar.Action icon="format-list-bulleted" onPress={handleDrawer} />
        <Appbar.Action icon="tune" onPress={handlePresentFilterModalPress} />
      </Appbar.Header>
      <View style={{marginLeft: 20, marginRight: 20}}>
        <Text style={{fontSize: 20, fontWeight: '700'}}>Thùng rác</Text>
        <Searchbar
          style={{marginTop: 20, opacity: 0.8, borderRadius: 8}}
          placeholder="Tìm kiếm..."
          onChangeText={(query: string) => setSearchQuery(query)}
          value={searchQuery}
        />
      </View>
      <View style={styles.content}>
        {data.length !== 0 || initial.current === true ? (
          <FlashList
            data={data}
            renderItem={({item}) => (
              <FileItem
                item={item}
                navigation={navigation}
                onPressMoreFunction={handlePressMoreFunction}
                itemDeleted={true}
              />
            )}
            keyExtractor={(item, index): any => index}
            onEndReached={loadData}
            onEndReachedThreshold={0.001}
            estimatedItemSize={100}
            ListFooterComponent={<ListFooter isLoading={isLoading} />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => refreshData()}
              />
            }
          />
        ) : searchQuery !== '' ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -100,
            }}>
            <RsEmptySVG width={170} height={180} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                paddingHorizontal: 60,
                textAlign: 'center',
              }}>
              Không tìm thấy kết quả
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -100,
            }}>
            <TrashSVG width={170} height={180} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                paddingHorizontal: 60,
                textAlign: 'center',
              }}>
              Thùng rác trống
            </Text>
            <Text
              style={{
                fontSize: 16,
                paddingHorizontal: 60,
                textAlign: 'center',
              }}>
              Những tài liệu bị xóa sẽ được hiển thị tại đây và có thể phục hồi
              bất kì lúc nào
            </Text>
          </View>
        )}
      </View>
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={handlePresentUploadModalPress}
      />
      <BottomSheetModalProvider>
        <FileUploadModal uploadModalRef={uploadModal} navigation={navigation} />
        <FilesFilterModal
          filterModalRef={filterModal}
          order={order}
          setOrder={setOrder}
          sorting={sorting}
          setSorting={setSorting}
        />
        <FileDeletedModal
          editModalRef={editModal}
          navigation={navigation}
          item={item}
          handleDeleteFunction={handleDeleteFunction}
          handleRestoreFunction={handleRestoreFunction}
        />
      </BottomSheetModalProvider>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 0.95,
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 30,
  },
});

export default TrashScreen;
