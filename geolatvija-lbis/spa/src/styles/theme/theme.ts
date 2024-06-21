import { darkThemeColors } from './darkTheme';
import { defaultThemeColors } from './defaultTheme';
import { yellowThemeColors } from './yellowTheme';

export type ThemeType = {
  [key: string]: string;
};

export const defaultTheme = {
  ...defaultThemeColors,
};

export const dark = {
  ...darkThemeColors,
};

export const yellow = {
  ...yellowThemeColors,
};
