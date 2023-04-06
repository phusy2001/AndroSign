import auth from '@react-native-firebase/auth';

export function SignupWithEmail(email, password) {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account created');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      console.error(error);
    });
}
