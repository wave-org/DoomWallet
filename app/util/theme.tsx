// import React from 'react';
import {useColorScheme} from 'react-native';
import {Theme as NavigationTheme} from '@react-navigation/native';

// https://m2.material.io/design/color/the-color-system.html#color-theme-creation
export interface Color {
  primary: string;
  //   primaryVariant: string;
  secondary: string;
  //   secondaryVariant: string;

  background: string;
  surface: string;
  error: string;

  // text
  //   onPrimary: string;
  //   onSecondary: string;
  //   onSurface: string;
  //   onError: string;
  //   onBackground: string;

  // onPrimary, onSecondary, onError
  inverse: string;
  // onSurface, onBackground
  // important text
  title: string;
  text: string;
  // secondaryText: string;
  placeholder: string;
  //   link: string; link use primary

  border: string;
}

export interface Theme {
  colors: Color;
  darkMode: boolean;
}

const darkTheme: Theme = {
  colors: {
    primary: '#1098FC',
    secondary: '#018786',
    background: '#24272A',
    surface: '#36383B',
    error: '#D73847',
    inverse: '#FCFCFC',
    title: '#FCFCFC',
    text: '#D6D9DC',
    placeholder: '#9FA6AE',
    border: '#848C94',
  },
  darkMode: true,
};

const lightTheme: Theme = {
  colors: {
    primary: '#0376C9',
    secondary: '#03DAC6',
    background: '#F2F4F6',
    surface: '#DFE0E2',
    error: '#D73847',
    inverse: '#FCFCFC',
    title: '#202328',
    text: '#333333',
    placeholder: '#BBC0C5',
    border: '#BBC0C5',
  },
  darkMode: false,
};

export const useTheme = (): Theme => {
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme;
  return theme;
};

export const useNavigationTheme = (): NavigationTheme => {
  const theme = useTheme();
  const navigationTheme: NavigationTheme = {
    dark: theme.darkMode,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.title,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };
  return navigationTheme;
};
