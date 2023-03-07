/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Card,
  Divider,
  FAB,
  IconButton,
  List,
  MD3Colors,
  RadioButton,
  Searchbar,
  Text,
} from 'react-native-paper';
import {FlashList} from '@shopify/flash-list';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDrawerStatus} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import PdfSVG from '../assets/images/pdf.svg';

function CustomListView({item, onPressMoreFunction}: any) {
  const _clickMoreFunction = () => {
    onPressMoreFunction(item);
  };
  return (
    <Card style={{marginBottom: 10}}>
      <Card.Title
        title="Card Title"
        subtitle="Card Subtitle"
        left={() => <PdfSVG width={43} height={52} />}
      />
      <Card.Content style={{position: 'absolute', top: 10, right: 0}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Trạng thái: </Text>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#42FF00',
            }}></View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <IconButton
            style={{borderWidth: 0}}
            mode="outlined"
            icon="dots-horizontal"
            size={24}
            onPress={_clickMoreFunction}
          />
        </View>
      </Card.Content>
      {/* <Card.Content style={{position: 'absolute', top: 10, right: 0}}>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <IconButton
            style={{borderWidth: 0}}
            mode="outlined"
            icon="history"
            size={24}
            onPress={() => console.log('Pressed')}
          />
        </View>
      </Card.Content> */}
    </Card>
  );
}

function HomeScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query: string) => setSearchQuery(query);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const isDrawerOpen = useDrawerStatus() === 'open';

  const [data, setData] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);

  const _handleDrawer = () => {
    if (!isDrawerOpen) {
      navigation.dispatch(DrawerActions.openDrawer());
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    const response = await fetch(
      'https://64037282302b5d671c4fb4c0.mockapi.io/file',
    );
    // const response = await fetch(
    //   `https://example.com/data?page=${pageNumber}&pageSize=${PAGE_SIZE}`,
    // );
    const newData = await response.json();
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

  //modal ref
  const uploadModalRef = React.useRef<BottomSheetModal>(null);
  const filterModalRef = React.useRef<BottomSheetModal>(null);
  const editModalRef = React.useRef<BottomSheetModal>(null);

  // variables
  const uploadSnapPoints = React.useMemo(() => ['25%'], []);
  const filterSnapPoints = React.useMemo(() => ['50%'], []);
  const editSnapPoints = React.useMemo(() => ['50%'], []);

  // callbacks
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
  }, []);

  const handleSheetChanges = React.useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleDismiss = () => {
    //handle dismiss
    console.log('handle dismiss');
  };

  const [status, setStatus] = React.useState<string>('1');
  const [sorting, setSortting] = React.useState<string>('1');

  return (
    <View style={styles.container}>
      <Appbar.Header style={{justifyContent: 'space-between'}}>
        <Appbar.Action icon="format-list-bulleted" onPress={_handleDrawer} />
        <Appbar.Action icon="tune" onPress={handlePresentFilterModalPress} />
      </Appbar.Header>
      <View style={{marginLeft: 20, marginRight: 20}}>
        <Text style={{fontSize: 20, fontWeight: '700'}}>Tài liệu</Text>
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
          keyExtractor={(item: any) => item?.id}
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
          snapPoints={uploadSnapPoints}
          enablePanDownToClose={true}
          onDismiss={handleDismiss}
          onChange={handleSheetChanges}>
          <View style={{padding: 20}}>
            <List.Section>
              <List.Item
                onPress={() => {
                  console.log('add folder');
                }}
                title="Tạo thư mục"
                left={() => <List.Icon icon="folder-plus" />}
              />
              <List.Item
                onPress={() => {
                  console.log('file upload');
                }}
                title="Tải lên file"
                left={() => (
                  <List.Icon color={MD3Colors.tertiary70} icon="file-upload" />
                )}
              />
            </List.Section>
          </View>
        </BottomSheetModal>
        <BottomSheetModal
          ref={filterModalRef}
          index={0}
          snapPoints={filterSnapPoints}
          enablePanDownToClose={true}
          onDismiss={handleDismiss}
          onChange={handleSheetChanges}>
          <View style={{padding: 20}}>
            <View style={{marginBottom: 10}}>
              <Text variant="labelLarge">Trạng thái</Text>
              <RadioButton.Group
                onValueChange={newStatus => setStatus(newStatus)}
                value={status}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="1" />
                  <View style={{marginLeft: 20}}>
                    <Text>Tất cả</Text>
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
                    <Text>Đang xử lý</Text>
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
                    <Text>Đã ký</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            <View style={{marginBottom: 10}}>
              <Text variant="labelLarge">Sắp xếp</Text>
              <RadioButton.Group
                onValueChange={sortValue => setSortting(sortValue)}
                value={sorting}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="1" />
                  <View style={{marginLeft: 20}}>
                    <Text>Cập nhật gần đây</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="2" />
                  <View style={{marginLeft: 20}}>
                    <Text>Tên tài liệu</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value="3" />
                  <View style={{marginLeft: 20}}>
                    <Text>Ngày tạo</Text>
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
                    paddingLeft: 10,
                  }}>
                  <PdfSVG width={43} height={52} />
                  <View style={{justifyContent: 'center', paddingLeft: 20}}>
                    <Text variant="titleMedium">file-example.pdf</Text>
                    <Text variant="bodyMedium">03/02/2023 at 5:40</Text>
                  </View>
                </View>
                <List.Section>
                  <List.Item
                    title="Mở tài liệu"
                    left={props => (
                      <List.Icon {...props} icon="file-document" />
                    )}
                  />
                  <List.Item
                    title="Chia sẻ"
                    left={props => <List.Icon {...props} icon="share" />}
                  />
                  <List.Item
                    title="In tài liệu"
                    left={props => <List.Icon {...props} icon="printer" />}
                  />
                  <List.Item
                    title="Thêm vào thử mục"
                    left={props => <List.Icon {...props} icon="folder" />}
                  />
                  <List.Item
                    title="Đánh dấu sao"
                    left={props => <List.Icon {...props} icon="star" />}
                  />
                </List.Section>
                <Divider />
                <List.Section>
                  <List.Item
                    title="Xoá"
                    left={props => <List.Icon {...props} icon="trash-can" />}
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

export default HomeScreen;
