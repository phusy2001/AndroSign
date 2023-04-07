import {create} from 'zustand';

type State = {
  theme: string;
  isDarkMode: boolean;
};

type Actions = {
  setTheme: (theme: string) => void;
  toggleDarkMode: () => void;
};

const themeStore = create<State & Actions>(set => ({
  theme: 'default',
  isDarkMode: false,
  setTheme: (theme: string) => set({theme: theme}),
  toggleDarkMode: () => set(state => ({isDarkMode: !state.isDarkMode})),
}));

export default themeStore;
