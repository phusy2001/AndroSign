import React from 'react';
import {View, Dimensions} from 'react-native';
import {Text, IconButton, ActivityIndicator} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlashList} from '@shopify/flash-list';
import DocumentAPI from '../services/document';
import Toast from 'react-native-toast-message';
import FileItem from '../components/FileItem';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import FileEditModal from '../components/Modal/FileEditModal';
import {useIsFocused} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function FolderDetailScreen({navigation, route}: any) {
  const {id, name} = route.params;
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const screenHeight = Dimensions.get('window').height;
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [end, setEnd] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const [item, setItem] = React.useState({});
  const editModal = React.useRef<BottomSheetModal>(null);

  const loadData = async () => {
    if (end === false) {
      setIsLoading(true);
      const result = await DocumentAPI.getFilesInFolder(id, pageNumber);
      if (result.data.data.data.length < 10) setEnd(true);
      const newData = await result.data.data.data;
      setData(data.concat(newData));
      setPageNumber(pageNumber + 1);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (refresh > 0) loadData();
  }, [refresh]);

  React.useEffect(() => {
    if (isFocused) {
      editModal.current?.dismiss();
      setData([]);
      setPageNumber(1);
      setEnd(false);
      setRefresh(refresh + 1);
    }
  }, [isFocused]);

  const handlePressMoreFunction = React.useCallback((data: any) => {
    editModal.current?.present(data);
    setItem(data);
  }, []);

  const deleteDocument = async (id: string) => {
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

  const removeFromFolder = async (fileId: string) => {
    const result = await DocumentAPI.updateFileInFolder(fileId, id);
    if (result.data.status === 'true') {
      const filteredData = data.filter((item: any) => item._id !== fileId);
      setData(filteredData);
      editModal.current?.dismiss();
    }
    Toast.show({
      text1: result.data.message,
      type: result.data.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
  };

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

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        paddingTop: insets.top,
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          marginTop: 30,
          height: screenHeight - 100,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconButton
            icon="close"
            size={26}
            onPress={() => navigation.goBack()}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              paddingRight: 30,
            }}>
            Thư mục
            <Text
              numberOfLines={1}
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: 'green',
              }}>
              {` ${name}`}
            </Text>
          </Text>
        </View>
        <View
          style={{
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
            flex: 1,
          }}>
          <FlashList
            data={data}
            renderItem={({item}) => (
              <FileItem
                item={item}
                navigation={navigation}
                onPressMoreFunction={handlePressMoreFunction}
              />
            )}
            keyExtractor={(item: any) => item?._id}
            onEndReached={loadData}
            onEndReachedThreshold={0.001}
            estimatedItemSize={100}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <BottomSheetModalProvider>
        <FileEditModal
          editModalRef={editModal}
          navigation={navigation}
          handleDeleteFunction={deleteDocument}
          handleDelFolderFunction={removeFromFolder}
          typeEdit={'mixed'}
          item={item}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default FolderDetailScreen;
