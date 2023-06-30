import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAPI from './user';

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

      console.log(fcmTokenList);

      await UserAPI.updateUserByUid(user.user.uid, {
        fcm_tokens: fcmTokenList,
      });
    })
    .catch(e => console.log(e));
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
          console.error('That email address is already in use!');
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
