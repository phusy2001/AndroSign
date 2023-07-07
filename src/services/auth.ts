import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAPI from './user';

//Sign in
export function signinWithEmail(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}

//Sign up
export function signupWithEmail(email: string, password: string) {
  return auth().createUserWithEmailAndPassword(email, password);
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

//Reset password
export function resetPassword(email: string) {
  return auth().sendPasswordResetEmail(email);
}

export function confirmThePasswordReset(oobCode: string, newPassword: string) {
  if (!oobCode && !newPassword) {
    return;
  }

  return auth().confirmPasswordReset(oobCode, newPassword);
}
