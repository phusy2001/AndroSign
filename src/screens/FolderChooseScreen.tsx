import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {Dimensions, View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListFooter from '../components/ListFooter';
import FolderChooseItem from '../components/FolderChooseItem';
import DocumentAPI from '../services/document';
import FolderSVG from '../assets/images/folder_empty.svg';

function FolderChooseScreen({navigation, route}: any) {
  const {id} = route.params;
  const screenHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const initial = React.useRef(true);
  const [data, setData] = React.useState([]);
  const [end, setEnd] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadData = async () => {
    if (end === false) {
      setIsLoading(true);
      const result = await DocumentAPI.getFolderListOfFile(id, pageNumber);
      if (result.data.data.length < 10) {
        setEnd(true);
      }
      const newData = await result.data.data;
      setData(data.concat(newData));
      setPageNumber(pageNumber + 1);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (initial.current) {
      initial.current = false;
    }
  }, []);

  return (
    <View
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
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            Chọn thư mục
          </Text>
        </View>
        <View
          style={{
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
            flex: 1,
          }}>
          {data.length !== 0 || initial.current ? (
            <FlashList
              data={data}
              renderItem={({item}) => (
                <FolderChooseItem item={item} fileId={id} />
              )}
              keyExtractor={(item: any) => item._id}
              onEndReached={loadData}
              onEndReachedThreshold={0.001}
              estimatedItemSize={100}
              ListFooterComponent={<ListFooter isLoading={isLoading} />}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FolderSVG width={170} height={180} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  paddingHorizontal: 60,
                  textAlign: 'center',
                }}>
                Không có thư mục nào đã được tạo
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default FolderChooseScreen;
