import React from 'react';
import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {View} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';

function FilesFilterModal({
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
          {/* <Text variant="labelLarge" style={{fontSize: 20, marginBottom: 10}}>
            Trạng thái
          </Text>
          <RadioButton.Group
            onValueChange={newStatus => setStatus(newStatus)}
            value={status}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton value="1" />
              <View style={{marginLeft: 20}}>
                <Text style={{fontSize: 16}}>Tất cả</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton value="2" />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#FF7A00',
                    marginLeft: 20,
                    marginRight: 8,
                  }}></View>
                <Text style={{fontSize: 16}}>Đang xử lý</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton value="3" />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#42FF00',
                    marginRight: 8,
                  }}></View>
                <Text style={{fontSize: 16}}>Đã ký</Text>
              </View>
            </View>
          </RadioButton.Group> */}
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
        {/* <Button
          mode="contained"
          onPress={() => {
            filterModal.current?.dismiss();
          }}>
          Xác nhận{' '}
        </Button> */}
      </View>
    </BottomSheetModal>
  );
}

export default FilesFilterModal;
