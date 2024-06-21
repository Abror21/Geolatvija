import React, { createContext, useState } from 'react';
import { SettingsFontSizes } from 'constants/enums';

export interface FontSizeContextProps {
  fontSize: SettingsFontSizes;
  changeFontSize: Function;
}

export interface FontSizeContextProviderProps {
  children: React.ReactNode;
}

export const FontSizeContext = createContext({} as FontSizeContextProps);

const FontSizeContextProvider = ({
  children,
}: FontSizeContextProviderProps) => {
  const [fontSize, setFontSize] = useState(SettingsFontSizes.fontSize1);
  const changeFontSize = (fontSize: SettingsFontSizes) => {
    setFontSize(fontSize);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, changeFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export default FontSizeContextProvider;
