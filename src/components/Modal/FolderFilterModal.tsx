import React from 'react';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {View} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';

function FoldersFilterModal({
  filterModalRef,
  order,
  setOrder,
  sorting,
  setSorting,
}: any) {
  const filterSnapPoints = React.useMemo(() => ['50%'], []);

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        animatedIndex={{
          value: 1,
        }}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={filterModalRef}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={filterSnapPoints}
      enablePanDownToClose={true}>
      <View style={{padding: 20}}>
        <View style={{marginBottom: 15}}>
          <Text variant="labelLarge" style={{fontSize: 20, marginBottom: 10}}>
            Thứ tự
          </Text>
          <RadioButton.Group
            onValueChange={orderValue => setOrder(orderValue)}
            value={order}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton value="desc" />
              <View style={{marginLeft: 20}}>
                <Text style={{fontSize: 16}}>Giảm dần</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton value="asc" />
              <View style={{marginLeft: 20}}>
                <Text style={{fontSize: 16}}>Tăng dần</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>
        <View style={{marginBottom: 15}}>
          <Text variant="labelLarge" style={{fontSize: 20, marginBottom: 10}}>
            Sắp xếp
          </Text>
          <RadioButton.Group
            onValueChange={sortValue => setSorting(sortValue)}
            value={sorting}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton value="updated" />
              <View style={{marginLeft: 20}}>
                <Text style={{fontSize: 16}}>Cập nhật gần đây</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton value="name" />
              <View style={{marginLeft: 20}}>
                <Text style={{fontSize: 16}}>Tên tài liệu</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton value="created" />
              <View style={{marginLeft: 20}}>
                <Text style={{fontSize: 16}}>Ngày tạo</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>
      </View>
    </BottomSheetModal>
  );
}

export default FoldersFilterModal;
