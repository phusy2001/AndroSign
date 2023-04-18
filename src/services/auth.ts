import auth from '@react-native-firebase/auth';

//expired_time = 20*60

//Sign in
export function signinWithEmail(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}

//Sign up
export function signupWithEmail(email: string, password: string) {
  return auth().createUserWithEmailAndPassword(email, password);
}

//Sign out
export function signout() {
  return auth().signOut();
}
