import React from 'react';
import {View, Dimensions, Keyboard} from 'react-native';
import {Text, IconButton, TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import UserSharedItem from '../components/UserSharedItem';
import {FlashList} from '@shopify/flash-list';
import DocumentAPI from '../services/document';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm, Controller} from 'react-hook-form';
import ListFooter from '../components/ListFooter';

const DocShareSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be a valid email address')
    .required('Email is a required field'),
});

function DocumentShareScreen({navigation, route}: any) {
  const {id} = route.params;
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [end, setEnd] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(DocShareSchema),
  });
  const onSubmit = async (data: any) => {
    handlePressAddFunction(data.email);
    reset({email: ''});
  };

  const loadData = async () => {
    if (end === false) {
      setIsLoading(true);
      const result = await DocumentAPI.getUserShared(id, pageNumber);
      // console.log(result.data.data.sharedTo);
      if (result.data.data.sharedTo.length < 10) setEnd(true);
      const newData = await result.data.data.sharedTo;
      setData(data.concat(newData));
      setPageNumber(pageNumber + 1);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [refresh]);

  const handlePressAddFunction = async (email: string) => {
    const result = await DocumentAPI.addUserShared(email, id);
    Toast.show({
      text1: result.data.message,
      type: result.data.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
    if (result.data.status === 'true') {
      email = '';
      Keyboard.dismiss();
      setData([]);
      setPageNumber(1);
      setEnd(false);
      setRefresh(refresh + 1);
    }
  };

  const handlePressRemoveFunction = async (userId: string) => {
    const result = await DocumentAPI.deleteUserShared(id, userId);
    if (result.data.status === 'true') {
      const filteredData = data.filter((item: any) => item !== userId);
      setData(filteredData);
    }
    Toast.show({
      text1: result.data.message,
      type: result.data.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
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
            Chia sẻ tài liệu
          </Text>
        </View>
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
          }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={{
                  marginTop: 5,
                }}
                mode="outlined"
                placeholder="Thêm người chia sẻ"
                activeOutlineColor={errors.email && 'red'}
                right={
                  <TextInput.Icon
                    onPress={handleSubmit(onSubmit)}
                    icon="account-plus"
                  />
                }
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                inputMode="email"
                textContentType="emailAddress"
              />
            )}
            name="email"
          />
          <Text style={{color: 'red'}}>
            {errors.email && `${errors.email.message}`}
          </Text>
        </View>
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 30,
            flex: 1,
          }}>
          <FlashList
            data={data}
            renderItem={({item}) => (
              <UserSharedItem
                item={item}
                onPressRemoveFunction={handlePressRemoveFunction}
              />
            )}
            keyExtractor={(item: any) => item}
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

export default DocumentShareScreen;
