import React from 'react';
import moment from 'moment';
import {Card, IconButton} from 'react-native-paper';
import FolderSVG from '../assets/images/folder.svg';

function FolderItem({item, onPressMoreFunction}: any) {
  const clickMoreFunction = () => {
    onPressMoreFunction(item);
  };

  return (
    <Card style={{marginBottom: 10}} id={item._id}>
      <Card.Title
        title={item.name}
        subtitle={
          'Cập nhật lần cuối: ' +
          moment(item.updated_at).format('DD/MM/YY HH:mm')
        }
        left={() => <FolderSVG width={43} height={52} />}
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
        />
      </Card.Content>
    </Card>
  );
}

export default FolderItem;
