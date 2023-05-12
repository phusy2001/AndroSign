import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {
  Text,
  IconButton,
  Divider,
  Button,
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import {DocumentView, RNPdftron, Config} from '@pdftron/react-native-pdf';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DocumentAPI from '../services/document';
import Toast from 'react-native-toast-message';

function DocumentSignScreen({route, navigation}: any) {
  const insets = useSafeAreaInsets();
  const {id, name, path, file, action, createFileFunction} = route.params;
  const confirmModal = React.useRef<BottomSheetModal>(null);
  const confirmSnapPoints = React.useMemo(() => ['30%'], []);
  const documentView = React.useRef(null);
  const [saveDlgVisible, setSaveDlgVisible] = React.useState(false);
  const [fileName, setFileName] = React.useState(name.replace('.pdf', ''));

  const handleConfirm = React.useCallback((data: any) => {
    confirmModal.current?.present(data);
  }, []);

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

  React.useEffect(() => {
    RNPdftron.initialize('');
    RNPdftron.enableJavaScript(true);
  }, []);

  const saveDocument = async () => {
    const xfdf = await documentView.current!.exportAnnotations();
    let result = null;
    if (action === 'upload') {
      const formData = new FormData();
      formData.append('name', fileName);
      formData.append('xfdf', xfdf);
      formData.append('file', file);
      result = await DocumentAPI.uploadDocument(formData);
    } else if (action === 'edit')
      result = await DocumentAPI.editDocument(id, xfdf);
    Toast.show({
      text1: result!.data.message,
      type: result!.data.status ? 'success' : 'error',
      position: 'bottom',
    });
    navigation.goBack();
    createFileFunction();
    // axios.post('/upload');
    // console.log(documentView.current.rotateClockwise());
    // documentView.current.importAnnotations(xfdf);
    // documentView.current.saveDocument().then(filePath => {
    //   console.log('saveDocument:', filePath);
    //   navigation.goBack();
    // });
    // documentView.current.exportAnnotations().then(xfdf => {
    //   console.log(xfdf);
    // });
    // let page = 0;
    // documentView.current.getPageCount().then(pageCount => {
    //   console.log('pageCount', pageCount);
    //   page = pageCount;
    //   for (let i = 1; i <= page; i++) {
    //     documentView.current.getAnnotationsOnPage(i).then(annotations => {
    //       for (const annotation of annotations) {
    //         //console.log(`Annotation found on page ${i} has id:`, annotation);
    //         documentView.current
    //           .getPropertiesForAnnotation(annotation.id, i)
    //           .then(properties => {
    //             if (properties) {
    //               console.log('Properties for annotation: ', properties);
    //             }
    //           });
    //       }
    //     });
    //   }
    // });
    // documentView.current.getAnnotationsOnPage(1).then(annotations => {
    //   for (const annotation of annotations) {
    //     console.log(`Annotation found on page 1 has id:`, annotation);
    //   }
    // });
    // console.log(documentView.current.annotations);
    // documentView.current
    //   .exportAsImage(1, 92, Config.ExportFormat.BMP)
    //   .then(path => {
    //     console.log('export', path);
    //   });
  };

  const cancelDocument = React.useCallback(() => {
    navigation.goBack();
  }, []);

  const myToolbar = {
    [Config.CustomToolbarKey.Id]: 'AndroSign',
    [Config.CustomToolbarKey.Name]: 'AndroSign',
    [Config.CustomToolbarKey.Icon]: Config.ToolbarIcons.FillAndSign,
    [Config.CustomToolbarKey.Items]: [
      Config.Tools.annotationCreateFreeText,
      // Config.Tools.annotationCreateSignature,
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
        flattenAnnotations={true}
        onDocumentLoaded={async () => {
          if (action === 'edit' && id) {
            const result = await DocumentAPI.getAnnotations(id);
            let base64 = '';
            for (let i = 0; i < result.data.data.xfdf.data.length; ++i) {
              base64 += String.fromCharCode(result.data.data.xfdf.data[i]);
            }
            documentView.current!.importAnnotations(base64);
          }
        }}
        rememberLastUsedTool={false}
      />
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={confirmModal}
          index={0}
          snapPoints={confirmSnapPoints}
          backdropComponent={renderBackdrop}
          enablePanDownToClose={true}>
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
              bold={true}
              style={{
                marginTop: 15,
                marginBottom: 10,
              }}></Divider>
            <TouchableOpacity
              onPress={() => {
                if (action === 'upload') setSaveDlgVisible(true);
                else saveDocument();
              }}
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
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <Portal>
        <Dialog
          visible={saveDlgVisible}
          style={{backgroundColor: '#fff'}}
          onDismiss={() => setSaveDlgVisible(false)}>
          <Dialog.Title style={{textAlign: 'center'}}>
            <Text style={{fontSize: 18}}>Lưu tài liệu thành...</Text>
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              theme={{roundness: 10}}
              mode="outlined"
              placeholder="Tên tài liệu"
              onChangeText={text => setFileName(text)}
              value={fileName}
              right={
                <TextInput.Icon onPress={() => setFileName('')} icon="close" />
              }
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSaveDlgVisible(false)}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Hủy
              </Text>
            </Button>
            <Button onPress={saveDocument}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'blue',
                }}>
                Xác nhận
              </Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
