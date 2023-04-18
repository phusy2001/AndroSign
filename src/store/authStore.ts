import {create} from 'zustand';
import {signinWithEmail, signout} from '../services/auth';
import auth from '@react-native-firebase/auth';

interface User {
  idToken: string;
  email: string;
  displayName: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User;
}

type State = {
  auth: AuthState;
};

type Actions = {
  signup: (auth: AuthState) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const authStore = create<State & Actions>(set => ({
  auth: {
    isLoggedIn: true,
    user: {
      idToken: '',
      email: '',
      displayName: '',
      refreshToken: '',
      expiresIn: '',
      localId: '',
      registered: false,
    },
  },

  signup: (auth: AuthState) =>
    set(() => ({
      auth: {
        isLoggedIn: false,
        user: {
          idToken: auth.user.idToken,
          email: auth.user.email,
          displayName: auth.user.displayName,
          refreshToken: auth.user.refreshToken,
          expiresIn: auth.user.expiresIn,
          localId: '',
        },
      },
    })),

  login: async (email: string, password: string) => {
    console.log('Before Login Current user', auth().currentUser);
    const response = await signinWithEmail(email, password);
    console.log('Login data', response.user);
    console.log('After Login Current user', auth().currentUser);
    // set(() => ({
    //   auth: {
    //     isLoggedIn: true,
    //     user: {
    //       idToken: auth.user.idToken,
    //       email: auth.user.email,
    //       displayName: auth.user.displayName,
    //       refreshToken: auth.user.refreshToken,
    //       expiresIn: auth.user.expiresIn,
    //       localId: auth.user.localId,
    //       registered: auth.user.registered,
    //     },
    //   },
    // })),
  },

  logout: async () => {
    console.log('Before Signout Current user', auth().currentUser);
    await signout();
    console.log('After Signout Current user', auth().currentUser);
    // set(() => ({
    //   auth: {
    //     isLoggedIn: false,
    //     user: {
    //       idToken: '',
    //       email: '',
    //       displayName: '',
    //       refreshToken: '',
    //       expiresIn: '',
    //       localId: '',
    //     },
    //   },
    // })),
  },
}));

export default authStore;
