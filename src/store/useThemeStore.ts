import {Appearance} from 'react-native';
import {create} from 'zustand';

const colorScheme = Appearance.getColorScheme();

const useThemeStore = create(set => ({
  theme: colorScheme,
  setTheme: (theme: string) => set({theme}),
}));

export default useThemeStore;
