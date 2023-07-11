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
import FileEditModal from '../components/Modal/FileEditModal';
import ListFooter from '../components/ListFooter';
import DocumentSVG from '../assets/images/document_empty.svg';
import RsEmptySVG from '../assets/images/result_empty.svg';

function MyDocumentScreen({navigation, route}: any) {
  const initial = React.useRef(true);
  const {reload} = route.params;
  const [searchQuery, setSearchQuery] = React.useState('');
  const isFocused = useIsFocused();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [data, setData] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [item, setItem] = React.useState({});
  const [end, setEnd] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const [status, setStatus] = React.useState<string>('all');
  const [sorting, setSorting] = React.useState<string>('updated');
  const [order, setOrder] = React.useState<string>('desc');
  const [refreshing, setRefreshing] = React.useState(true);
  const uploadModal = React.useRef<BottomSheetModal>(null);
  const filterModal = React.useRef<BottomSheetModal>(null);
  const editModal = React.useRef<BottomSheetModal>(null);

  const handleDrawer = React.useCallback(() => {
    if (!isDrawerOpen) {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  }, []);

  const loadData = async () => {
    if (end === false) {
      setIsLoading(true);
      try {
        const result = await DocumentAPI.getOwnFiles(
          pageNumber,
          searchQuery,
          sorting,
          order,
          status,
        );
        if (result.data.data.length < 10) {
          setEnd(true);
        }
        const newData = result.data.data;
        setData(data.concat(newData));
        setPageNumber(pageNumber + 1);
        setIsLoading(false);
        setRefreshing(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const refreshData = () => {
    setPageNumber(1);
    setEnd(false);
    setData([]);
    setRefresh(prevRefresh => prevRefresh + 1);
  };

  React.useEffect(() => {
    if (isFocused) {
      uploadModal.current?.dismiss();
    }
    if (reload) {
      setSearchQuery('');
      refreshData();
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
  }, [searchQuery, sorting, order, status]);

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

  const deleteDocument = async (id: string) => {
    try {
      const result = await DocumentAPI.deleteDocument(id);
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
    } catch (error) {
      console.log(error);
    }
  };

  const unmarkDocument = async (id: string) => {
    try {
      const result = await DocumentAPI.unmarkFile(id);
      Toast.show({
        text1: result.message,
        type: result.status === 'true' ? 'success' : 'error',
        position: 'bottom',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renameDocument = async (id: string, name: string) => {
    try {
      const result = await DocumentAPI.renameDocument(id, name);
      if (result.status === 'true') {
        refreshData();
      }
      Toast.show({
        text1: result.message,
        type: result.status === 'true' ? 'success' : 'error',
        position: result.status === 'true' ? 'bottom' : 'top',
      });
      return result;
    } catch (error) {
      console.log(error);
    }
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
        <Text style={{fontSize: 20, fontWeight: '700'}}>Tài liệu của tôi</Text>
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
                handleEditFunction={() => {
                  refreshData();
                }}
              />
            )}
            keyExtractor={(item, index): any => index}
            onEndReached={loadData}
            onEndReachedThreshold={0.00000001}
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
            <DocumentSVG width={170} height={180} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                paddingHorizontal: 60,
                textAlign: 'center',
              }}>
              Tài liệu trống
            </Text>
            <Text
              style={{
                fontSize: 16,
                paddingHorizontal: 60,
                textAlign: 'center',
              }}>
              Bạn chưa có tài liệu nào! Hãy thêm vào và tài liệu của bạn sẽ được
              hiển thị tại đây
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
        <FileUploadModal
          uploadModalRef={uploadModal}
          navigation={navigation}
          handleCreateFile={() => {
            refreshData();
          }}
        />
        <FilesFilterModal
          filterModalRef={filterModal}
          order={order}
          setOrder={setOrder}
          sorting={sorting}
          setSorting={setSorting}
          status={status}
          setStatus={setStatus}
        />
        <FileEditModal
          editModalRef={editModal}
          navigation={navigation}
          handleDeleteFunction={deleteDocument}
          handleUnmarkFunction={unmarkDocument}
          handleRenameFunction={renameDocument}
          typeEdit={'owned'}
          item={item}
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

export default MyDocumentScreen;
