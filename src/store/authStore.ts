import {create} from 'zustand';

interface User {
  idToken: string;
  email: string;
  displayName: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
  roles: [];
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
  login: (auth: AuthState) => void;
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
      roles: [],
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
          roles: [],
        },
      },
    })),

  login: (auth: AuthState) =>
    set(() => ({
      auth: {
        isLoggedIn: true,
        user: {
          idToken: auth.user.idToken,
          email: auth.user.email,
          displayName: auth.user.displayName,
          refreshToken: auth.user.refreshToken,
          expiresIn: auth.user.expiresIn,
          localId: auth.user.localId,
          registered: auth.user.registered,
          roles: [...auth.user.roles],
        },
      },
    })),

  logout: () =>
    set(() => ({
      auth: {
        isLoggedIn: false,
        user: {
          idToken: '',
          email: '',
          displayName: '',
          refreshToken: '',
          expiresIn: '',
          localId: '',
          roles: [],
        },
      },
    })),
}));

export default authStore;
