/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SignatureView, {SignatureViewRef} from 'react-native-signature-canvas';

function SignatureAddScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const signatureRef = React.useRef<SignatureViewRef>(null);
  const handleConfirm = signature => {};

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: 'white',
        flex: 1,
      }}>
      <IconButton
        icon="arrow-left"
        size={26}
        onPress={() => navigation.goBack()}
      />
      <SignatureView
        ref={signatureRef}
        onOK={handleConfirm}
        clearText="Xóa"
        confirmText="Lưu"
        descriptionText={'Vẽ chữ ký ở trên'}
        webStyle={webStyle}
        minWidth={2}
        maxWidth={2}
      />
    </View>
  );
}

const webStyle = `.m-signature-pad--footer
.clear {
  background-color: red;
  color: #FFF;
  font-size: 16px;
  font-weight: bold;
}
.save {
  font-size: 16px;
  font-weight: bold;
}
.m-signature-pad--footer {
  font-size: 14px;
  font-weight: bold;
}
.m-signature-pad {
  height: 180%;
}`;

export default SignatureAddScreen;
