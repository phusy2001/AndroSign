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
import USharedEmptySVG from '../assets/images/usershared_empty.svg';

const DocShareSchema = yup.object().shape({
  email: yup
    .string()
    .email('Vui lòng nhập email hợp lệ')
    .required('Email là bắt buộc'),
});

function DocumentShareScreen({navigation, route}: any) {
  const {id} = route.params;
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const initial = React.useRef(true);
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
      if (result.data.length < 10) {
        setEnd(true);
      }
      const newData = await result.data;
      setData(data.concat(newData));
      setPageNumber(pageNumber + 1);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!initial.current) {
      loadData();
    } else {
      initial.current = false;
    }
  }, [refresh]);

  const handlePressAddFunction = async (email: string) => {
    const result = await DocumentAPI.addUserShared(email, id);
    Toast.show({
      text1: result.message,
      type: result.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
    Keyboard.dismiss();
    if (result.status === 'true') {
      email = '';
      setData([]);
      setPageNumber(1);
      setEnd(false);
      setRefresh(refresh + 1);
    }
  };

  const handlePressRemoveFunction = async (userId: string) => {
    const result = await DocumentAPI.deleteUserShared(id, userId);
    if (result.status === 'true') {
      const filteredData = data.filter((item: any) => item.uid !== userId);
      setData(filteredData);
    }
    Toast.show({
      text1: result.message,
      type: result.status === 'true' ? 'success' : 'error',
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
          {data.length !== 0 || initial.current ? (
            <FlashList
              data={data}
              renderItem={({item}) => (
                <UserSharedItem
                  item={item}
                  onPressRemoveFunction={handlePressRemoveFunction}
                />
              )}
              keyExtractor={(item, index): any => index}
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
              <USharedEmptySVG width={170} height={180} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  paddingHorizontal: 60,
                  textAlign: 'center',
                }}>
                Không có người dùng được chia sẻ tài liệu này
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default DocumentShareScreen;
