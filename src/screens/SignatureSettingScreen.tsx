/* eslint-disable react-native/no-inline-styles */
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import React from 'react';
import {View, Dimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Text, IconButton, Button, Divider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function SignatureSettingScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const editModalRef = React.useRef<BottomSheetModal>(null);
  const editSnapPoints = React.useMemo(() => ['30%'], []);
  const handlePressMore = React.useCallback((data: any) => {
    editModalRef.current?.present(data);
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
            icon="arrow-left"
            size={26}
            onPress={() => navigation.goBack()}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            Chữ ký của tôi
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            marginTop: 15,
          }}>
          {/* Field chữ ký */}
          <View
            style={{
              height: 150,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 20,
              marginBottom: 20,
              borderWidth: 0.2,
            }}>
            <View
              style={{
                backgroundColor: '#d9e8c3',
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 3,
                paddingTop: 3,
                height: 28,
                borderRadius: 5,
                marginTop: 10,
              }}>
              <Text style={{fontWeight: 'bold'}}>Mặc định</Text>
            </View>
            <IconButton
              onPress={handlePressMore}
              icon="dots-horizontal"
              size={24}
            />
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'flex-end',
          paddingLeft: 20,
          paddingRight: 20,
          marginTop: -10,
          width: '100%',
        }}>
        <Button
          style={{backgroundColor: '#005b96'}}
          mode="contained"
          onPress={() => navigation.navigate('SignatureAdd')}
          contentStyle={{flexDirection: 'row-reverse'}}>
          Thêm chữ ký
        </Button>
      </View>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={editModalRef}
          index={0}
          snapPoints={editSnapPoints}
          enablePanDownToClose={true}>
          {() => {
            //const {data} = props;
            return (
              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    paddingTop: 15,
                    paddingLeft: 30,
                    paddingRight: 30,
                  }}>
                  Chọn hành động
                </Text>
                <Divider
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
                <TouchableOpacity
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    alignItems: 'center',
                  }}>
                  <IconButton
                    icon="checkbox-multiple-outline"
                    size={22}
                    iconColor="blue"
                  />
                  <Text style={{fontSize: 16}}>Đặt chữ ký mặc định</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    alignItems: 'center',
                  }}>
                  <IconButton
                    icon="trash-can-outline"
                    size={22}
                    iconColor="red"
                  />
                  <Text style={{fontSize: 16, color: 'red'}}>Xóa</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
}

export default SignatureSettingScreen;
