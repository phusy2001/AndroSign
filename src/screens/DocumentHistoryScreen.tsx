import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {Dimensions, View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListFooter from '../components/ListFooter';
import DocumentAPI from '../services/document';
import FileHistoryItem from '../components/FileHistoryItem';

function DocumentHistoryScreen({navigation, route}: any) {
  const {id} = route.params;
  const screenHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const [data, setData] = React.useState([]);
  const [end, setEnd] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadData = async () => {
    if (end === false) {
      setIsLoading(true);
      const result = await DocumentAPI.getFileHistory(id, pageNumber);
      if (result.data.data.data.length < 10) setEnd(true);
      const newData = await result.data.data.data;
      setData(data.concat(newData));
      setPageNumber(pageNumber + 1);
      setIsLoading(false);
    }
  };

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
            Lịch sử thay đổi
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
            renderItem={({item}) => <FileHistoryItem item={item} />}
            keyExtractor={(item, index): any => index}
            onEndReached={loadData}
            onEndReachedThreshold={0.001}
            estimatedItemSize={100}
            ListFooterComponent={<ListFooter isLoading={isLoading} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
}

export default DocumentHistoryScreen;
