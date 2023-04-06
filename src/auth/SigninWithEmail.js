import auth from '@react-native-firebase/auth';

export function SigninWithEmail(email, password) {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/user-not-found') {
        console.log('User not found!');
      }

      if (error.code === 'auth/wrong-password') {
        console.log('Wrong password!');
      }

      console.error(error);
    });
}
