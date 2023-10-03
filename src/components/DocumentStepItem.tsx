import React from 'react';
import {View} from 'react-native';
import {IconButton} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';

function DocumentStepItem({item, data, setData, userData}: any) {
  return (
    <View
      style={{
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <SelectDropdown
        data={userData}
        defaultButtonText="Chọn người ký"
        defaultValue={{
          _id: item._id,
          name: item.name,
          email: item.email,
          index: item.index,
        }}
        onSelect={(selectedItem: any) => {
          item._id = selectedItem._id;
          item.name = selectedItem.name;
          item.email = selectedItem.email;
          item.index = selectedItem.index;
        }}
        buttonTextAfterSelection={(selectedItem: any) => selectedItem.name}
        rowTextForSelection={(item: any) => item.name}
        buttonStyle={{
          backgroundColor: '#FFF',
          borderWidth: 1,
          borderRadius: 6,
          flex: 1,
        }}
        dropdownIconPosition={'right'}
        renderDropdownIcon={() => {
          return (
            <IconButton
              style={{marginRight: -10}}
              icon="chevron-down"
              size={30}
            />
          );
        }}
      />
      <IconButton
        icon="delete"
        size={28}
        onPress={() => {
          const filteredData = data.filter((i: any) => i.step !== item.step);
          setData(filteredData);
        }}
      />
    </View>
  );
}

export default DocumentStepItem;
