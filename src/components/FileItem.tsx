import moment from 'moment';
import React from 'react';
import {Card, IconButton} from 'react-native-paper';
import PdfSVG from '../assets/images/pdf.svg';

function FileItem({
  item,
  navigation,
  onPressMoreFunction,
  onPressRestoreFunction,
}: any) {
  return (
    <Card
      style={{marginBottom: 10}}
      id={item._id}
      onPress={() => {
        navigation.navigate('DocumentSign', {
          id: item._id,
          name: item.name + '.pdf',
          path: item.path,
          action: 'edit',
        });
      }}>
      <Card.Title
        title={item.name + '.pdf'}
        subtitle={
          'Cập nhật lần cuối: ' +
          moment(item.updated_at).format('DD/MM/YY HH:mm')
        }
        left={() => <PdfSVG width={40} height={50} />}
      />
      <Card.Content
        style={{
          position: 'absolute',
          top: '20%',
          right: 0,
        }}>
        {onPressMoreFunction ? (
          <IconButton
            onPress={() => onPressMoreFunction(item)}
            icon="dots-horizontal"
            size={24}
          />
        ) : (
          <IconButton
            onPress={() => onPressRestoreFunction(item._id)}
            icon="restore"
            size={24}
          />
        )}
      </Card.Content>
    </Card>
  );
}

export default FileItem;
