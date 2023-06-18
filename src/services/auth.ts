import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosClient from './clients/api';

const client = new AxiosClient('http://10.0.2.2:3005');

const service = 'users';

//expired_time = 20*60

//Sign in
export async function signinWithEmail(email: string, password: string) {
  return auth()
    .signInWithEmailAndPassword(email, password)
    .then(async user => {
      const resUser = await client.get(`/${service}/${user.user.uid}`);

      let fcmTokenList = resUser.data.fcm_tokens;

      const fcmToken = await AsyncStorage.getItem('fcmToken');

      if (!fcmTokenList?.includes(fcmToken)) {
        fcmTokenList = [...fcmTokenList, fcmToken];
      }

      console.log(fcmTokenList);

      await client.put(`/${service}/${user.user.uid}`, {
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
        await client.post(`/${service}`, {
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
      await client.post(`/${service}/remove-fcm-token`, {
        uid,
        fcmToken,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return auth().signOut();
}
