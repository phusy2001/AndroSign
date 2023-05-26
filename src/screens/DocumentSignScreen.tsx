import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
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
import DocumentUserItem from '../components/DocumentUserItem';
import SelectDropdown from 'react-native-select-dropdown';
import auth from '@react-native-firebase/auth';

function DocumentSignScreen({route, navigation}: any) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const confirmSnapPoints = React.useMemo(() => ['30%'], []);
  const confirmModal = React.useRef<BottomSheetModal>(null);
  const documentView = React.useRef(null);
  const currentUser = React.useRef(auth().currentUser?.uid);
  const annotNum = React.useRef(0);
  const stepNow = React.useRef(1);
  const prevUser = React.useRef('');
  const prevStep = React.useRef(0);
  const currentAnnotation = React.useRef({id: '', pageNumber: 0});
  const [initial, setInitial] = React.useState(true);
  const {id, name, path, file, action, createFileFunction} = route.params;
  const [saveDlgVisible, setSaveDlgVisible] = React.useState(false);
  const [fileName, setFileName] = React.useState(name.replace('.pdf', ''));
  const [userItem, setUserItem] = React.useState<object[]>([]);

  React.useEffect(() => {
    RNPdftron.initialize('');
    RNPdftron.enableJavaScript(true);
    RNPdftron.clearSavedViewerState();
  }, []);

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

  const cancelDocument = React.useCallback(() => {
    navigation.goBack();
  }, []);

  const toolbarUpload = {
    [Config.CustomToolbarKey.Id]: 'AndroSign',
    [Config.CustomToolbarKey.Name]: 'AndroSign',
    [Config.CustomToolbarKey.Icon]: Config.ToolbarIcons.FillAndSign,
    [Config.CustomToolbarKey.Items]: [
      Config.Tools.annotationCreateFreeText,
      Config.Tools.formCreateSignatureField,
      // Config.Buttons.undo,
      // Config.Buttons.redo,
    ],
  };

  const toolbarEdit = {
    [Config.CustomToolbarKey.Id]: 'AndroSign',
    [Config.CustomToolbarKey.Name]: 'AndroSign',
    [Config.CustomToolbarKey.Icon]: Config.ToolbarIcons.FillAndSign,
    [Config.CustomToolbarKey.Items]: [
      Config.Tools.pan,
      // Config.Buttons.undo,
      // Config.Buttons.redo,
    ],
  };

  const saveDocument = async () => {
    let signed = 0;
    let total = 0;
    let count = 0;
    let step = 0;
    let user = 'null';
    const pageCount = await documentView.current!.getPageCount();
    for (let i = 1; i <= pageCount; i++) {
      const annotations = await documentView.current!.getAnnotationsOnPage(i);
      for (const annotation of annotations) {
        total += 1;
        const value = await documentView.current!.getCustomDataForAnnotation(
          annotation.id,
          annotation.pageNumber,
          'progress',
        );
        if (value === 'done') {
          signed += 1;
          await documentView.current!.setFlagsForAnnotations([
            {
              id: annotation.id,
              pageNumber: annotation.pageNumber,
              flag: Config.AnnotationFlags.locked,
              flagValue: true,
            },
          ]);
        }
        if (action === 'upload' && value !== 'done' && count === 0) {
          step = await documentView.current!.getCustomDataForAnnotation(
            annotation.id,
            annotation.pageNumber,
            'step',
          );
          user = await documentView.current!.getCustomDataForAnnotation(
            annotation.id,
            annotation.pageNumber,
            'user',
          );
          count = 1;
        } else if (action === 'edit') {
          const annotStep =
            await documentView.current!.getCustomDataForAnnotation(
              annotation.id,
              annotation.pageNumber,
              'step',
            );
          if (annotStep == prevStep.current && value !== 'done') count = 1;
          if (count === 1 && step === undefined) {
            step = annotStep;
            user = await documentView.current!.getCustomDataForAnnotation(
              annotation.id,
              annotation.pageNumber,
              'user',
            );
          } else if (count === 0 && annotStep > prevStep.current) {
            step = annotStep;
            user = await documentView.current!.getCustomDataForAnnotation(
              annotation.id,
              annotation.pageNumber,
              'user',
            );
            count = -1;
          }
        }
      }
    }
    const xfdf = await documentView.current!.exportAnnotations();
    const completed = signed === total;
    const userIdArr = userItem
      .filter((item: any) => item._id !== auth().currentUser?.uid)
      .map((item: any) => item._id);
    let result = null;
    if (action === 'upload') {
      const formData = new FormData();
      formData.append('user', auth().currentUser?.uid);
      formData.append('name', fileName);
      formData.append('signed', signed);
      formData.append('total', total);
      formData.append('completed', completed);
      if (userIdArr.length > 0) formData.append('sharedTo', userIdArr);
      formData.append('stepNow', step);
      formData.append('stepUser', user);
      formData.append('xfdf', xfdf);
      formData.append('file', file);
      result = await DocumentAPI.uploadDocument(formData);
    } else if (action === 'edit')
      result = await DocumentAPI.editDocument(
        id,
        xfdf,
        signed,
        completed,
        step,
        user,
      );
    Toast.show({
      text1: result!.data.message,
      type: result!.data.status === 'true' ? 'success' : 'error',
      position: 'bottom',
    });
    navigation.goBack();
    if (createFileFunction) createFileFunction();
  };

  if (initial && action === 'upload') {
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
              Thiết lập người nhận
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 15,
              marginBottom: 25,
            }}>
            {userItem.map((value: any) => {
              return (
                <DocumentUserItem
                  key={value.temp}
                  item={value}
                  setData={setUserItem}
                  data={userItem}
                />
              );
            })}
            <TouchableOpacity
              onPress={() =>
                setUserItem(
                  userItem.concat({
                    temp: Math.random().toString(36).slice(2, 7),
                  }),
                )
              }
              style={{
                borderWidth: 1,
                borderRadius: 6,
                borderStyle: 'dashed',
                paddingTop: 10,
                paddingBottom: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Thêm người ký
              </Text>
            </TouchableOpacity>
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
            onPress={() => {
              const filteredData = userItem.filter(
                (item: any) => '_id' in item,
              );
              filteredData.unshift({_id: auth().currentUser?.uid, name: 'Tôi'});
              setUserItem(filteredData);
              setInitial(false);
            }}
            contentStyle={{flexDirection: 'row-reverse'}}>
            Xác nhận
          </Button>
        </View>
      </View>
    );
  }

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
      {action === 'upload' && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingLeft: 20,
            alignItems: 'center',
            marginTop: 6,
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 16}}>Người ký: </Text>
          <SelectDropdown
            data={userItem}
            defaultValueByIndex={0}
            onSelect={selectedItem => {
              if (annotNum.current > 0) {
                stepNow.current += 1;
                prevUser.current = currentUser.current;
              }
              if (prevUser.current === selectedItem._id) stepNow.current -= 1;
              currentUser.current = selectedItem._id;
              annotNum.current = 0;
            }}
            buttonTextAfterSelection={selectedItem => selectedItem.name}
            rowTextForSelection={item => item.name}
            buttonStyle={{
              height: 35,
              backgroundColor: '#FFF',
              borderWidth: 0.3,
            }}
            dropdownIconPosition={'right'}
            buttonTextStyle={{
              textAlign: 'left',
            }}
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
        </View>
      )}
      <DocumentView
        ref={documentView}
        document={path}
        showLeadingNavButton={false}
        bottomToolbarEnabled={false}
        hideTopAppNavBar={true}
        hideToolbarsOnTap={false}
        annotationToolbars={
          action === 'upload' ? [toolbarUpload] : [toolbarEdit]
        }
        longPressMenuEnabled={false}
        autoSaveEnabled={false}
        flattenAnnotations={true}
        rememberLastUsedTool={false}
        showSavedSignatures={false}
        saveStateEnabled={false}
        annotationPermissionCheckEnabled={true}
        onDocumentLoaded={async () => {
          if (action === 'edit') {
            let base64 = '';
            let isContinous = true;
            const result = await DocumentAPI.getAnnotations(id);
            prevStep.current = result.data.data.data.stepNow;
            for (let i = 0; i < result.data.data.data.xfdf.data.length; ++i)
              base64 += String.fromCharCode(result.data.data.data.xfdf.data[i]);
            documentView
              .current!.importAnnotations(base64)
              .then((importedAnnotations: any) => {
                importedAnnotations.forEach(async (annotation: any) => {
                  const value =
                    await documentView.current!.getCustomDataForAnnotation(
                      annotation.id,
                      annotation.pageNumber,
                      'user',
                    );
                  const progress =
                    await documentView.current!.getCustomDataForAnnotation(
                      annotation.id,
                      annotation.pageNumber,
                      'progress',
                    );
                  if (progress === 'done') {
                    documentView.current!.setFlagsForAnnotations([
                      {
                        id: annotation.id,
                        pageNumber: annotation.pageNumber,
                        flag: Config.AnnotationFlags.hidden,
                        flagValue: false,
                      },
                    ]);
                  } else {
                    if (value !== auth().currentUser?.uid)
                      documentView.current!.setFlagsForAnnotations([
                        {
                          id: annotation.id,
                          pageNumber: annotation.pageNumber,
                          flag: Config.AnnotationFlags.hidden,
                          flagValue: true,
                        },
                      ]);
                    else {
                      const step =
                        await documentView.current!.getCustomDataForAnnotation(
                          annotation.id,
                          annotation.pageNumber,
                          'step',
                        );
                      if (isContinous) {
                        const user =
                          await documentView.current!.getCustomDataForAnnotation(
                            annotation.id,
                            annotation.pageNumber,
                            'user',
                          );
                        if (
                          step > prevStep.current &&
                          user === auth().currentUser?.uid
                        )
                          prevStep.current = step;
                        else isContinous = false;
                      }
                      if (step == prevStep.current) {
                        documentView.current!.setFlagsForAnnotations([
                          {
                            id: annotation.id,
                            pageNumber: annotation.pageNumber,
                            flag: Config.AnnotationFlags.hidden,
                            flagValue: false,
                          },
                        ]);
                      } else {
                        documentView.current!.setFlagsForAnnotations([
                          {
                            id: annotation.id,
                            pageNumber: annotation.pageNumber,
                            flag: Config.AnnotationFlags.hidden,
                            flagValue: true,
                          },
                        ]);
                      }
                    }
                  }
                });
              });
          }
        }}
        onAnnotationChanged={({action, annotations}: any) => {
          if (action === 'add') {
            annotNum.current += 1;
            annotations.forEach((annotation: any) => {
              documentView.current!.setPropertiesForAnnotation(
                annotation.id,
                annotation.pageNumber,
                {
                  customData: {
                    user: currentUser.current,
                    step: `${stepNow.current}`,
                  },
                },
              );
              documentView.current!.setFlagsForAnnotations([
                {
                  id: annotation.id,
                  pageNumber: annotation.pageNumber,
                  flag: Config.AnnotationFlags.locked,
                  flagValue: false,
                },
              ]);
            });
          } else if (action === 'delete') {
            annotNum.current -= 1;
          }
        }}
        onFormFieldValueChanged={({fields}: any) => {
          fields.forEach(async (field: any) => {
            if (currentAnnotation.current.id) {
              if (field.fieldHasAppearance) {
                const user =
                  await documentView.current!.getCustomDataForAnnotation(
                    currentAnnotation.current.id,
                    currentAnnotation.current.pageNumber,
                    'user',
                  );
                if (
                  action === 'edit' ||
                  (action === 'upload' && user === auth().currentUser?.uid)
                ) {
                  documentView.current!.setPropertiesForAnnotation(
                    currentAnnotation.current.id,
                    currentAnnotation.current.pageNumber,
                    {customData: {progress: 'done'}},
                  );
                } else {
                  documentView.current!.deleteAnnotations([
                    {
                      id: currentAnnotation.current.id,
                      pageNumber: currentAnnotation.current.pageNumber,
                    },
                  ]);
                }
              } else {
                documentView.current!.setPropertiesForAnnotation(
                  currentAnnotation.current.id,
                  currentAnnotation.current.pageNumber,
                  {customData: {progress: 'none'}},
                );
              }
              currentAnnotation.current.id = '';
            }
          });
        }}
        onAnnotationsSelected={({annotations}: any) => {
          annotations.forEach((annotation: any) => {
            currentAnnotation.current = {
              id: annotation.id,
              pageNumber: annotation.pageNumber,
            };
          });
        }}
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
