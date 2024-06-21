import React, { createContext, useState } from 'react';
import { Languages } from 'constants/enums';
export interface LanguageContextProps {
  language: Languages;
  changeLanguage: Function;
}

export interface LanguageContextProviderProps {
  children: React.ReactNode;
}

export const LanguageContext = createContext({} as LanguageContextProps);

const LanguageContextProvider = ({
  children,
}: LanguageContextProviderProps) => {
  const [language, setLanguage] = useState(
    (window.localStorage.getItem('selected-language') as Languages) ||
      Languages.lv
  );

  const changeLanguage = (language: Languages) => {
    window.localStorage.setItem('selected-language', language);
    setLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContextProvider;
