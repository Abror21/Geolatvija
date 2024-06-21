import React, { useContext } from 'react';
import { LanguageContext } from 'contexts/LanguageContext';
import { IntlProvider } from 'react-intl';
import lv from 'translations/lv.json';

interface IntlProviderWrapperProps {
  children: React.ReactNode;
}

const IntlProviderWrapper = ({ children }: IntlProviderWrapperProps) => {
  const { language } = useContext(LanguageContext);

  return (
    <IntlProvider locale={language} messages={lv}>
      {children}
    </IntlProvider>
  );
};

export default IntlProviderWrapper;
