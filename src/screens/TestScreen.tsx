/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {FileService} from '../services/file';

function TestScreen() {
  const fileService = new FileService('asd');

  const [files, setFiles] = React.useState<DocumentPickerResponse[]>([]);

  const pickDocuments = () => {
    const files = fileService.pickDocuments();
    files.then(res => {
      if (res) {
        setFiles(res);
      }
    });
  };

  const upload = () => {
    fileService.upload(files);
  };

  return (
    <View style={styles.mainBody}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 30, textAlign: 'center'}}>
          React Native File Upload Example
        </Text>
        <Text
          style={{
            fontSize: 25,
            marginTop: 20,
            marginBottom: 30,
            textAlign: 'center',
          }}>
          www.aboutreact.com
        </Text>
      </View>
      {files.map((res, index: number) => {
        if (res) {
          return (
            <Text style={styles.textStyle} key={index}>
              File Name: {res.name ? res.name : ''}
              {'\n'}
              Type: {res.type ? res.type : ''}
              {'\n'}
              File Size: {res.size ? res.size : ''}
              {'\n'}
              URI: {res.uri ? res.uri : ''}
              {'\n'}
            </Text>
          );
        }
      })}
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={pickDocuments}>
        <Text style={styles.buttonTextStyle}>Select File</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={upload}>
        <Text style={styles.buttonTextStyle}>Upload File</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textStyle: {
    backgroundColor: '#000',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  },
});

export default TestScreen;
