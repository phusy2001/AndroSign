import {DocumentView, RNPdftron} from '@pdftron/react-native-pdf';
import React from 'react';
import {PermissionsAndroid, Platform, StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';

function SignScreen() {
  const [permissionGranted, setPermissionGranted] = React.useState<boolean>(
    Platform.OS === 'ios' ? true : false,
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

  const path =
    'https://pdftron.s3.amazonaws.com/downloads/pl/PDFTRON_mobile_about.pdf';

  if (!permissionGranted) {
    // return (
    //   <View style={styles.container}>
    //     <Text>Storage permission required.</Text>
    //   </View>
    // );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Title" />
      </Appbar.Header>
      <DocumentView document={path} showLeadingNavButton={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SignScreen;
