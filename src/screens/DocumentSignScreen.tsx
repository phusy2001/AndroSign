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
import DocumentStepItem from '../components/DocumentStepItem';

function DocumentSignScreen({route, navigation}: any) {
  const {id, name, path, file, action, handleFileCreated, handleEditFunction} =
    route.params;
  const screenHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const confirmSnapPoints = React.useMemo(() => ['30%'], []);
  const confirmModal = React.useRef<BottomSheetModal>(null);
  const documentView = React.useRef(null);
  const stepCount = React.useRef(1);
  const totalStep = React.useRef(0);
  const currentStep = React.useRef<any>({});
  const stepNow = React.useRef(0);
  const stepUser = React.useRef('null');
  const savedXfdf = React.useRef('');
  const currentAnnotation = React.useRef({id: '', pageNumber: 0});
  const [progress, setProgress] = React.useState('user');
  const [saveDlgVisible, setSaveDlgVisible] = React.useState(false);
  const [fileName, setFileName] = React.useState(name.replace('.pdf', ''));
  const [stepItem, setStepItem] = React.useState<any[]>([]);
  const [userItem, setUserItem] = React.useState<any[]>([
    {
      _id: auth().currentUser?.uid,
      name: 'Tôi',
      email: '',
      index: '',
    },
  ]);

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
    const params = {
      signed: 0,
      total: 0,
      count: 0,
      step: 0,
      user: 'null',
      changed: false,
      totalStep: [],
    };
    const pageCount = await documentView.current!.getPageCount();
    for (let i = 1; i <= pageCount; i++) {
      const annotations = await documentView.current!.getAnnotationsOnPage(i);
      for (const annotation of annotations) {
        params.total += 1;
        const value = await documentView.current!.getCustomDataForAnnotation(
          annotation.id,
          annotation.pageNumber,
          'progress',
        );
        if (value === 'done') params.signed += 1;
        if (action === 'upload') {
          const annotStep =
            await documentView.current!.getCustomDataForAnnotation(
              annotation.id,
              annotation.pageNumber,
              'step',
            );
          if (params.totalStep.indexOf(annotStep) === -1)
            params.totalStep.push(annotStep);
          if (annotStep < params.step || params.count === 0) {
            params.step = annotStep;
            params.user =
              await documentView.current!.getCustomDataForAnnotation(
                annotation.id,
                annotation.pageNumber,
                'user',
              );
            params.count = 1;
          }
        } else if (
          action === 'edit' &&
          stepUser.current === auth().currentUser?.uid
        ) {
          const annotStep =
            await documentView.current!.getCustomDataForAnnotation(
              annotation.id,
              annotation.pageNumber,
              'step',
            );
          if (annotStep > stepNow.current) {
            const diff = annotStep - stepNow.current;
            if (params.count > diff || params.count === 0) {
              params.count = diff;
              params.step = annotStep;
              params.user =
                await documentView.current!.getCustomDataForAnnotation(
                  annotation.id,
                  annotation.pageNumber,
                  'user',
                );
            }
          } else if (annotStep == stepNow.current)
            documentView.current!.setFlagsForAnnotations([
              {
                id: annotation.id,
                pageNumber: annotation.pageNumber,
                flag: Config.AnnotationFlags.locked,
                flagValue: true,
              },
            ]);
          params.changed = true;
        }
      }
    }
    const xfdf = await documentView.current!.exportAnnotations();
    let isEdited = false;
    const userIdArr = userItem
      .filter((item: any) => item._id !== auth().currentUser?.uid)
      .map((item: any) => item._id);
    if (action === 'upload') {
      const formData = new FormData();
      formData.append('user', auth().currentUser?.uid);
      formData.append('name', fileName);
      formData.append('signed', params.signed);
      formData.append('total', params.total);
      formData.append('stepIndex', 0);
      formData.append('stepTotal', params.totalStep.length);
      if (userIdArr.length > 0) formData.append('sharedTo', userIdArr);
      formData.append('stepNow', params.step);
      formData.append('stepUser', params.user);
      formData.append('xfdf', xfdf);
      formData.append('file', file);
      const result = await DocumentAPI.uploadDocument(formData);
      Toast.show({
        text1: result.message,
        type: result.status === 'true' ? 'success' : 'error',
        position: 'bottom',
      });
    } else if (action === 'edit' && params.changed) {
      const result = await DocumentAPI.editDocument(
        id,
        xfdf,
        params.signed,
        params.step,
        params.user,
      );
      Toast.show({
        text1: result.message,
        type: result.status === 'true' ? 'success' : 'error',
        position: 'bottom',
      });
      isEdited = true;
    }
    if (action !== 'upload') navigation.goBack();
    else navigation.navigate('Home', {reload: true});
    if (handleFileCreated) handleFileCreated();
    else if (handleEditFunction && isEdited) handleEditFunction();
  };

  if (progress === 'user' && action === 'upload')
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
            {userItem.map((value: any, index: number) => {
              if (index > 0)
                return (
                  <DocumentUserItem
                    key={value.index}
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
                    index: Math.random().toString(36).slice(2, 7),
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
              setUserItem(filteredData);
              setProgress('step');
            }}
            contentStyle={{flexDirection: 'row-reverse'}}>
            Tiếp tục
          </Button>
        </View>
      </View>
    );

  if (progress === 'step' && action === 'upload')
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
              onPress={() => setProgress('user')}
            />
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
              }}>
              Thiết lập quy trình
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
            {stepItem.map((value: any) => {
              return (
                <DocumentStepItem
                  key={value.step}
                  item={value}
                  setData={setStepItem}
                  data={stepItem}
                  userData={userItem}
                />
              );
            })}
            <TouchableOpacity
              onPress={() => {
                setStepItem(
                  stepItem.concat({
                    step: stepCount.current,
                  }),
                );
                stepCount.current += 1;
              }}
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
                Thêm quy trình
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
              const filteredData = stepItem.filter((item: any) =>
                userItem.some((item2: any) => item2._id === item._id),
              );
              totalStep.current = filteredData.length;
              if (filteredData.length > 0)
                currentStep.current = filteredData[0];
              setStepItem(filteredData);
              setProgress('document');
            }}
            contentStyle={{flexDirection: 'row-reverse'}}>
            Xác nhận
          </Button>
        </View>
      </View>
    );

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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '65%',
            alignItems: 'center',
          }}>
          <IconButton
            icon="arrow-left"
            size={26}
            onPress={async () => {
              if (action === 'upload') {
                setProgress('step');
                savedXfdf.current =
                  await documentView.current!.exportAnnotations();
              } else navigation.goBack();
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            {name}
          </Text>
        </View>
        <View>
          <Button style={{paddingTop: 2}} onPress={handleConfirm}>
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
      {action === 'upload' && totalStep.current > 0 && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingLeft: 20,
            alignItems: 'center',
            marginTop: 6,
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 16}}>Quy trình: </Text>
          <SelectDropdown
            data={stepItem}
            defaultValueByIndex={0}
            onSelect={(selectedItem: any) => {
              currentStep.current = selectedItem;
            }}
            buttonTextAfterSelection={(selectedItem: any, index: number) =>
              `${index + 1}. ${selectedItem.name}`
            }
            rowTextForSelection={(item: any, index: number) =>
              `${index + 1}. ${item.name}`
            }
            buttonStyle={{
              height: 35,
              backgroundColor: '#FFF',
              borderWidth: 1,
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
        </View>
      )}
      <DocumentView
        ref={documentView}
        document={path}
        showLeadingNavButton={false}
        bottomToolbarEnabled={false}
        hideTopAppNavBar={true}
        hideToolbarsOnTap={false}
        longPressMenuEnabled={false}
        autoSaveEnabled={false}
        flattenAnnotations={true}
        rememberLastUsedTool={false}
        showSavedSignatures={false}
        saveStateEnabled={false}
        annotationPermissionCheckEnabled={true}
        annotationToolbars={
          action === 'edit' || totalStep.current === 0
            ? [toolbarEdit]
            : [toolbarUpload]
        }
        onDocumentLoaded={async () => {
          if (action === 'edit') {
            const result = await DocumentAPI.getAnnotations(id);
            stepNow.current = result.data.data.stepNow;
            stepUser.current = result.data.data.stepUser;
            let base64 = '';
            for (let i = 0; i < result.data.data.xfdf.data.length; ++i)
              base64 += String.fromCharCode(result.data.data.xfdf.data[i]);
            documentView
              .current!.importAnnotations(base64)
              .then((importedAnnotations: any) => {
                importedAnnotations.forEach(async (annotation: any) => {
                  const step =
                    await documentView.current!.getCustomDataForAnnotation(
                      annotation.id,
                      annotation.pageNumber,
                      'step',
                    );
                  const user =
                    await documentView.current!.getCustomDataForAnnotation(
                      annotation.id,
                      annotation.pageNumber,
                      'user',
                    );
                  if (
                    user === auth().currentUser?.uid &&
                    step == stepNow.current
                  ) {
                    documentView.current!.setFlagsForAnnotations([
                      {
                        id: annotation.id,
                        pageNumber: annotation.pageNumber,
                        flag: Config.AnnotationFlags.hidden,
                        flagValue: false,
                      },
                    ]);
                  } else if (step >= stepNow.current && stepNow.current > 0) {
                    documentView.current!.setFlagsForAnnotations([
                      {
                        id: annotation.id,
                        pageNumber: annotation.pageNumber,
                        flag: Config.AnnotationFlags.hidden,
                        flagValue: true,
                      },
                    ]);
                  } else {
                    documentView.current!.setFlagsForAnnotations([
                      {
                        id: annotation.id,
                        pageNumber: annotation.pageNumber,
                        flag: Config.AnnotationFlags.locked,
                        flagValue: true,
                      },
                    ]);
                  }
                });
              });
          } else if (action === 'upload' && savedXfdf.current) {
            documentView
              .current!.importAnnotations(savedXfdf.current)
              .then((importedAnnotations: any) => {
                importedAnnotations.forEach(async (annotation: any) => {
                  const step =
                    await documentView.current!.getCustomDataForAnnotation(
                      annotation.id,
                      annotation.pageNumber,
                      'step',
                    );
                  const isExist = stepItem.some(item => item.step == step);
                  if (!isExist)
                    documentView.current!.deleteAnnotations([
                      {
                        id: annotation.id,
                        pageNumber: annotation.pageNumber,
                      },
                    ]);
                });
              });
          }
        }}
        onAnnotationChanged={({action, annotations}: any) => {
          if (action === 'add')
            annotations.forEach((annotation: any) => {
              documentView.current!.setPropertiesForAnnotation(
                annotation.id,
                annotation.pageNumber,
                {
                  customData: {
                    user: currentStep.current._id,
                    step: `${currentStep.current.step}`,
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
