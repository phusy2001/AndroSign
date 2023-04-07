/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';

function TestScreen() {
  useEffect(() => {
    // firestore()
    //   .collection('TrackLogs')
    //   .where('tracklog_id', '==', '123')
    //   .limit(1)
    //   .get()
    //   .then(querySnapshot => {
    //     querySnapshot.forEach(documentSnapshot => {
    //       console.log(
    //         'TrackLogs: ',
    //         documentSnapshot.id,
    //         documentSnapshot.data(),
    //       );
    //     });
    //   });
    // firestore()
    //   .collection('Users')
    //   .add({
    //     name: 'Ada Lovelace',
    //     age: 30,
    //   })
    //   .then(() => {
    //     console.log('User added!');
    //   });
  }, []);
  return <Text>OK</Text>;
}

const styles = StyleSheet.create({});

export default TestScreen;
