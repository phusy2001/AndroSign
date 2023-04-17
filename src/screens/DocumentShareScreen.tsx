import React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import {Text, IconButton, Button, TextInput, Avatar} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function DocumentShareScreen({navigation, route}: any) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;

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
          <TextInput
            style={{
              marginTop: 5,
            }}
            mode="outlined"
            placeholder="Thêm người chia sẻ"
            right={<TextInput.Icon onPress={() => {}} icon="account-plus" />}
            // onChangeText={onChange}
            // value={value}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            marginTop: 30,
            marginBottom: 30,
          }}>
          {/* List chia sẻ */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#F8F8F8',
              paddingLeft: 10,
              paddingRight: 10,
              // paddingTop: 3,
              // paddingBottom: 3,
              marginBottom: 10,
              borderRadius: 6,
            }}>
            <View
              style={{
                width: '20%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* <Avatar.Image size={48} source={''} /> */}
              <IconButton icon="account-circle" size={48} />
            </View>
            <View style={{width: '70%', justifyContent: 'center'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Trong Le</Text>
              <Text style={{fontSize: 15}}>trongle@gmail.com</Text>
            </View>
            <View
              style={{
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconButton
                onPress={() => {}}
                iconColor="red"
                icon="close-box"
                size={28}
              />
            </View>
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
          mode="contained"
          onPress={() => {}}
          contentStyle={{flexDirection: 'row-reverse'}}>
          Xác nhận
        </Button>
      </View>
    </View>
  );
}

export default DocumentShareScreen;
