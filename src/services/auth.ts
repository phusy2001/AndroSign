import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://10.0.2.2:3005',
});

const service = 'users';

//expired_time = 20*60

//Sign in
export async function signinWithEmail(email: string, password: string) {
  return auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('Logged in');
    })
    .catch(error => {
      switch (error.code) {
        case 'auth/user-not-found':
          console.error('User not available');
          break;
        case 'auth/wrong-password':
          console.error('Wrong password');
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
        await axiosClient.post(`/${service}`, {
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
export function signout() {
  return auth().signOut();
}
