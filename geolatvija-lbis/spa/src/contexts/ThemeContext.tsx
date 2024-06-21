import React, { createContext, useState } from 'react';
import { SettingsColorSchemes } from 'constants/enums';

export interface ThemeContextProps {
  theme: SettingsColorSchemes;
  changeTheme: Function;
}

export const ThemeContext = createContext({} as ThemeContextProps);

export interface ThemeContextProviderProps {
  children: React.ReactNode;
}

const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const [theme, setTheme] = useState(
    (window.localStorage.getItem('selected-theme') as SettingsColorSchemes) ||
      SettingsColorSchemes.default
  );

  const changeTheme = (theme: SettingsColorSchemes) => {
    window.localStorage.setItem('selected-theme', theme);
    setTheme(theme);
  };

  return <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>;
};

export default ThemeContextProvider;
