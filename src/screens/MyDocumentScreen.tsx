import React from 'react';
import {StyleSheet, View} from 'react-native';
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

function MyDocumentScreen({navigation, route}: any) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const isFocused = useIsFocused();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [data, setData] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [item, setItem] = React.useState({});
  const [end, setEnd] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  // const [status, setStatus] = React.useState<string>('');
  const [sorting, setSorting] = React.useState<string>('updated');
  const [order, setOrder] = React.useState<string>('desc');
  const uploadModal = React.useRef<BottomSheetModal>(null);
  const filterModal = React.useRef<BottomSheetModal>(null);
  const editModal = React.useRef<BottomSheetModal>(null);

  const loadData = async () => {
    if (end === false) {
      setIsLoading(true);
      const result = await DocumentAPI.getOwnFiles(
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

  const handleDrawer = React.useCallback(() => {
    if (!isDrawerOpen) navigation.dispatch(DrawerActions.openDrawer());
  }, []);

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

  const deleteDocument = async (id: any) => {
    const result = await DocumentAPI.deleteDocument(id);
    if (result.data.status === 'true') {
      const filteredData = data.filter((item: any) => item._id !== id);
      setData(filteredData);
      editModal.current?.dismiss();
    }
    Toast.show({
      text1: result.data.message,
      type: result.data.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
  };

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
            <FileItem
              item={item}
              onPressMoreFunction={handlePressMoreFunction}
            />
          )}
          keyExtractor={(item: any) => item?._id}
          onEndReached={loadData}
          onEndReachedThreshold={0.001}
          estimatedItemSize={100}
          ListFooterComponent={<ListFooter isLoading={isLoading} />}
          showsVerticalScrollIndicator={false}
        />
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
        <FileEditModal
          editModalRef={editModal}
          navigation={navigation}
          handleDeleteFunction={deleteDocument}
          typeEdit={'owned'}
          item={item}
        />
      </BottomSheetModalProvider>
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
