import auth from '@react-native-firebase/auth';
import axiosClient from './clients/axios';

const service = 'users';

//expired_time = 20*60

//Sign in
export function signinWithEmail(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}

//Sign up
export async function signupWithEmail(
  email: string,
  password: string,
  displayName: string,
) {
  return auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async () => {
      console.log('User account created');

      await axiosClient.post(`/${service}`, {
        displayName,
        email,
      });
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      console.error(error);
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
