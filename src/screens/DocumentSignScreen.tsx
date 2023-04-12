import React from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {Text, IconButton, Divider, Button} from 'react-native-paper';
import {DocumentView, RNPdftron, Config} from '@pdftron/react-native-pdf';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function DocumentSignScreen({route, navigation}: any) {
  const {name, path} = route.params;
  const insets = useSafeAreaInsets();
  const [permissionGranted, setPermissionGranted] = React.useState<boolean>(
    Platform.OS === 'ios' ? true : false,
  );
  const confirmModalRef = React.useRef<BottomSheetModal>(null);
  const confirmSnapPoints = React.useMemo(() => ['30%'], []);
  const handleConfirm = React.useCallback((data: any) => {
    confirmModalRef.current?.present(data);
  }, []);
  const documentView = React.useRef(null);

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

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true);
        console.log('Storage permission granted');
      } else {
        setPermissionGranted(false);
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  React.useEffect(() => {
    RNPdftron.initialize('Insert commercial license key here after purchase');
    RNPdftron.enableJavaScript(true);

    if (Platform.OS === 'android') {
      requestStoragePermission();
    }
  });

  if (!permissionGranted) {
    // return (
    //   <View style={styles.container}>
    //     <Text>Storage permission required.</Text>
    //   </View>
    // );
  }

  const saveDocument = React.useCallback(() => {
    documentView.current.saveDocument().then(filePath => {
      console.log('saveDocument:', filePath);
      navigation.goBack();
    });
  }, []);

  const cancelDocument = React.useCallback(() => {
    navigation.goBack();
  }, []);

  const myToolbar = {
    [Config.CustomToolbarKey.Id]: 'AndroSign',
    [Config.CustomToolbarKey.Name]: 'AndroSign',
    [Config.CustomToolbarKey.Icon]: Config.ToolbarIcons.FillAndSign,
    [Config.CustomToolbarKey.Items]: [
      Config.Tools.annotationCreateFreeText,
      Config.Tools.annotationCreateSignature,
      Config.Tools.formCreateSignatureField,
      Config.Buttons.undo,
      Config.Buttons.redo,
    ],
  };

  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        {paddingBottom: insets.bottom, paddingTop: insets.top},
      ]}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          paddingRight: 12,
          paddingLeft: 20,
          justifyContent: 'space-between',
        }}>
        <View style={{display: 'flex', flexDirection: 'row', width: '65%'}}>
          <Text
            numberOfLines={1}
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              paddingTop: 13,
            }}>
            {name}
          </Text>
        </View>
        <View>
          <Button style={{paddingTop: 7}} onPress={handleConfirm}>
            <Text
              style={{
                fontSize: 16,
                color: '#2E2EFF',
              }}>
              Xác nhận
            </Text>
          </Button>
        </View>
      </View>
      <DocumentView
        ref={documentView}
        document={path}
        showLeadingNavButton={false}
        bottomToolbarEnabled={false}
        hideTopAppNavBar={true}
        hideToolbarsOnTap={false}
        annotationToolbars={[myToolbar]}
        longPressMenuEnabled={false}
        autoSaveEnabled={false}
      />
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={confirmModalRef}
          index={0}
          snapPoints={confirmSnapPoints}
          backdropComponent={renderBackdrop}
          enablePanDownToClose={true}>
          {(props: any) => {
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
                  }}></Divider>
                <TouchableOpacity
                  onPress={saveDocument}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    alignItems: 'center',
                  }}>
                  <IconButton
                    icon="content-save-outline"
                    size={22}
                    iconColor="blue"
                  />
                  <Text style={{fontSize: 16}}>Lưu tài liệu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={cancelDocument}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    alignItems: 'center',
                  }}>
                  <IconButton icon="close" size={22} iconColor="red" />
                  <Text style={{fontSize: 16, color: 'red'}}>Đóng và Hủy</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default DocumentSignScreen;
