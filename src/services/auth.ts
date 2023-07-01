import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAPI from './user';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

//Sign in
export async function signinWithEmail(email: string, password: string) {
  return auth()
    .signInWithEmailAndPassword(email, password)
    .then(async user => {
      const resUser = await UserAPI.findUserByUid(user.user.uid);

      let fcmTokenList = resUser.data.fcm_tokens;

      const fcmToken = await AsyncStorage.getItem('fcmToken');

      if (!fcmTokenList?.includes(fcmToken)) {
        fcmTokenList = [...fcmTokenList, fcmToken];
      }

      await UserAPI.updateUserByUid(user.user.uid, {
        fcm_tokens: fcmTokenList,
      });
    })
    .catch(error => {
      switch (error.code) {
        case 'auth/wrong-password':
          Toast.show({
            text1: 'Your password is wrong. Please try again.',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        case 'auth/invalid-email':
          Toast.show({
            text1: 'Your email is invalid.',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        case 'auth/user-disabled':
          Toast.show({
            text1: 'Your account has been disabled.',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        case 'auth/user-not-found':
          Toast.show({
            text1: 'Your account is not found.',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        default:
          console.error(error);
      }
    });
}

//Sign up
export async function signupWithEmail(
  email: string,
  password: string,
  display_name: string,
) {
  return auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async ({user}) => {
      console.log('User account created');

      try {
        await auth().currentUser?.updateProfile({displayName: display_name});
      } catch (e) {
        console.log(e);
      }

      const fcmToken = await AsyncStorage.getItem('fcmToken');

      if (fcmToken) {
        await UserAPI.createUser({
          display_name,
          uid: user.uid,
          email,
          fcm_tokens: [fcmToken],
        });
      }
    })
    .catch(error => {
      switch (error.code) {
        case 'auth/email-already-in-use':
          Toast.show({
            text1: 'This account has been existed.',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        case 'auth/invalid-email':
          Toast.show({
            text1: 'This email is invalid.',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        case 'auth/operation-not-allowed':
          Toast.show({
            text1: 'Your email/password accounts are not enabled.',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        case 'auth/weak-password':
          Toast.show({
            text1: 'Your password is weak.',
            type: 'error',
            position: 'bottom',
            visibilityTime: 2000,
          });
          break;
        default:
          console.error(error);
      }
    });
}

//Change password
export function changePassword(password: string) {
  const user = auth().currentUser;
  return user?.updatePassword(password);
}

//Sign out
export async function signout() {
  const uid = auth().currentUser?.uid;

  const fcmToken = await AsyncStorage.getItem('fcmToken');

  if (fcmToken) {
    try {
      await UserAPI.removeFcmToken({
        uid,
        fcmToken,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return auth().signOut();
}
