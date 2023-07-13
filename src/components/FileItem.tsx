import moment from 'moment';
import React from 'react';
import {View} from 'react-native';
import {Card, IconButton, Text} from 'react-native-paper';
import PdfSVG from '../assets/images/pdf.svg';
import auth from '@react-native-firebase/auth';
import {debounce} from 'lodash';

function FileItem({
  item,
  navigation,
  onPressMoreFunction,
  handleEditFunction,
  itemDeleted,
}: any) {
  return (
    <Card
      style={{marginBottom: 10, paddingVertical: 5}}
      id={item._id}
      onPress={debounce(
        () => {
          if (!itemDeleted) {
            console.log('dsadsad');
            navigation.navigate('DocumentSign', {
              id: item._id,
              name: item.name + '.pdf',
              path: item.path,
              action: 'edit',
              handleEditFunction: () => {
                handleEditFunction();
              },
            });
          }
        },
        3000,
        {leading: true, trailing: false},
      )}>
      <Card.Title
        title={
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: 150}}>
              <Text style={{fontSize: 16}} numberOfLines={1}>
                {item.name + '.pdf'}
              </Text>
            </View>
            {item.total === 0 || itemDeleted ? (
              <></>
            ) : item.completed ? (
              <View
                style={{
                  marginLeft: 10,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 6,
                  borderWidth: 0.5,
                  backgroundColor: '#98FB98',
                }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#3CB371',
                    marginRight: 8,
                  }}
                />
                <Text style={{fontSize: 14}}>Hoàn thành</Text>
              </View>
            ) : item.stepUser === auth().currentUser?.uid ? (
              <View
                style={{
                  marginLeft: 10,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 6,
                  borderWidth: 0.5,
                  backgroundColor: '#B6EAFA',
                }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#146C94',
                    marginRight: 8,
                  }}
                />
                <Text style={{fontSize: 14}}>Lượt của bạn</Text>
              </View>
            ) : (
              <View
                style={{
                  marginLeft: 10,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 6,
                  borderWidth: 0.5,
                  backgroundColor: '#C4DFDF',
                }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#394867',
                    marginRight: 8,
                  }}
                />
                <Text style={{fontSize: 14}}>Đang chờ ký</Text>
              </View>
            )}
          </View>
        }
        subtitle={
          'Cập nhật lần cuối: ' +
          moment(item.updated_at).format('DD/MM/YY HH:mm')
        }
        left={() => <PdfSVG width={40} height={50} />}
      />
      <Card.Content
        style={{
          position: 'absolute',
          top: item.total === 0 || itemDeleted ? '20%' : '35%',
          right: 0,
        }}>
        <IconButton
          onPress={() => onPressMoreFunction(item)}
          icon="dots-horizontal"
          size={24}
        />
      </Card.Content>
    </Card>
  );
}

export default FileItem;
