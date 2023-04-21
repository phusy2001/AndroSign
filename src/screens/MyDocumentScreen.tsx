/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import axios from 'axios';
import {StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Card,
  Divider,
  FAB,
  List,
  RadioButton,
  Searchbar,
  Text,
  IconButton,
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

function CustomListView({item, onPressMoreFunction}: any) {
  const clickMoreFunction = () => {
    onPressMoreFunction(item);
  };
  return (
    <Card style={{marginBottom: 10}} id={item._id}>
      <Card.Title
        title={item.name + '.pdf'}
        subtitle={
          'Cập nhật lần cuối: ' +
          moment(item.updated_at).format('DD/MM/YY HH:mm')
        }
        left={() => <PdfSVG width={43} height={52} />}
      />
      <Card.Content
        style={{
          position: 'absolute',
          top: '20%',
          right: 0,
        }}>
        <IconButton
          onPress={clickMoreFunction}
          icon="dots-horizontal"
          size={24}
          // color="#FFD600"
        />
      </Card.Content>
    </Card>
  );
}

function MyDocumentScreen({navigation, route}: any) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const isFocused = useIsFocused();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [data, setData] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [item, setItem] = React.useState<any>();
  const handleDrawer = () => {
    if (!isDrawerOpen) {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    const client = axios.create({
      baseURL: 'http://10.0.2.2:3333/document',
    });
    const result = await client.get('/get');
    const newData = await result.data.data.data;
    setData([...data, ...newData]);
    setPageNumber(pageNumber + 1);
    setIsLoading(false);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  React.useEffect(() => {
    const currentRef = uploadModalRef.current;
    if (!isFocused) {
      // do something when the screen loses focus
      currentRef?.dismiss();
    }
    return () => {
      currentRef?.dismiss();
    };
  }, [isFocused]);

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

  // Modal ref
  const uploadModalRef = React.useRef<BottomSheetModal>(null);
  const filterModalRef = React.useRef<BottomSheetModal>(null);
  const editModalRef = React.useRef<BottomSheetModal>(null);

  // Variables
  const uploadSnapPoints = React.useMemo(() => ['25%'], []);
  const filterSnapPoints = React.useMemo(() => ['60%'], []);
  const editSnapPoints = React.useMemo(() => ['70%'], []);

  // Callbacks
  const handlePresentUploadModalPress = React.useCallback(() => {
    if (filterModalRef || editModalRef) {
      filterModalRef.current?.dismiss();
      editModalRef.current?.dismiss();
    }
    uploadModalRef.current?.present();
  }, []);

  const handlePresentFilterModalPress = React.useCallback(() => {
    if (uploadModalRef || editModalRef) {
      uploadModalRef.current?.dismiss();
      editModalRef.current?.dismiss();
    }
    filterModalRef.current?.present();
  }, []);

  const handlePressMoreFunction = React.useCallback((data: any) => {
    if (uploadModalRef || filterModalRef) {
      uploadModalRef.current?.dismiss();
      filterModalRef.current?.dismiss();
    }
    editModalRef.current?.present(data);
    setItem(data);
  }, []);

  const handleSheetChanges = React.useCallback((index: number) => {}, []);

  const handleDismiss = () => {};

  const [status, setStatus] = React.useState<string>('1');
  const [sorting, setSortting] = React.useState<string>('1');

  //Func
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
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
      </View>

      <View style={styles.content}>
        <FlashList
          data={data}
          renderItem={({item}) => (
            <CustomListView
              item={item}
              onPressMoreFunction={handlePressMoreFunction}
            />
          )}
          keyExtractor={(item: any) => item?._id}
          onEndReached={loadData}
          onEndReachedThreshold={0.5}
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
          ref={uploadModalRef}
          index={0}
          backdropComponent={renderBackdrop}
          snapPoints={uploadSnapPoints}
          enablePanDownToClose={true}
          onDismiss={handleDismiss}
          onChange={handleSheetChanges}>
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
          ref={filterModalRef}
          index={0}
          backdropComponent={renderBackdrop}
          snapPoints={filterSnapPoints}
          enablePanDownToClose={true}
          onDismiss={handleDismiss}
          onChange={handleSheetChanges}>
          <View style={{padding: 20}}>
            <View style={{marginBottom: 10}}>
              <Text
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
              </RadioButton.Group>
            </View>
            <View style={{marginBottom: 10}}>
              <Text
                variant="labelLarge"
                style={{fontSize: 20, marginBottom: 10}}>
                Sắp xếp
              </Text>
              <RadioButton.Group
                onValueChange={sortValue => setSortting(sortValue)}
                value={sorting}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="1" />
                  <View style={{marginLeft: 20}}>
                    <Text style={{fontSize: 16}}>Cập nhật gần đây</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="2" />
                  <View style={{marginLeft: 20}}>
                    <Text style={{fontSize: 16}}>Tên tài liệu</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="3" />
                  <View style={{marginLeft: 20}}>
                    <Text style={{fontSize: 16}}>Ngày tạo</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            <Button
              mode="contained"
              onPress={() => {
                filterModalRef.current?.dismiss();
              }}>
              Xác nhận{' '}
            </Button>
          </View>
        </BottomSheetModal>
        <BottomSheetModal
          ref={editModalRef}
          index={0}
          backdropComponent={renderBackdrop}
          snapPoints={editSnapPoints}
          enablePanDownToClose={true}
          onDismiss={handleDismiss}
          onChange={handleSheetChanges}>
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
