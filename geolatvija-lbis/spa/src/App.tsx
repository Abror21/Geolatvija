import React, { useContext } from 'react';
import { FontSizeContext } from 'contexts/FontSizeContext';
import { ThemeContext } from 'contexts/ThemeContext';
import { ThemeProvider } from 'styled-components';
import { SettingsColorSchemes, SettingsFontSizes } from 'constants/enums';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { fontSize1, fontSize2, fontSize3, FontType } from 'styles/theme/fonts';
import { dark, defaultTheme, ThemeType, yellow } from 'styles/theme/theme';
import DefaultLayout from './components/DefaultLayout';
import { ConfigProvider, Empty } from 'antd';
import { GlobalStyles } from './styles';
import AuthPage from './pages/AuthPage';
import { useIntl } from 'react-intl';
import EmbedPage from './pages/EmbedPage';

type Theme = {
  [key in SettingsColorSchemes]: ThemeType;
};

const themes: Theme = {
  [SettingsColorSchemes.default]: defaultTheme,
  [SettingsColorSchemes.whiteOnBlack]: dark,
  [SettingsColorSchemes.blackOnYellow]: yellow,
};

type Fonts = {
  [key in SettingsFontSizes]: FontType;
};

const fonts: Fonts = {
  [SettingsFontSizes.fontSize1]: fontSize1,
  [SettingsFontSizes.fontSize2]: fontSize2,
  [SettingsFontSizes.fontSize3]: fontSize3,
};

function App() {
  const { theme } = useContext(ThemeContext);
  const { fontSize } = useContext(FontSizeContext);
  const intl = useIntl();

  return (
    <ThemeProvider theme={{ ...themes[theme], ...fonts[fontSize] }}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Ubuntu',
          },
        }}
        renderEmpty={() => (
          <Empty
            description={
              <div className="ant-empty-description">{intl.formatMessage({ id: 'general.found_no_data' })}</div>
            }
            image={null}
            imageStyle={{ height: 0 }}
          />
        )}
      >
        <div className="App">
          <GlobalStyles />
          <BrowserRouter>
            <Routes>
              <Route
                path="/auth-token/:token/:tokenExpire/:refreshToken/:refreshExpire/:refreshTokenExpiresSetAt/:roleId"
                element={<AuthPage />}
              />
              <Route path="/map" element={<EmbedPage />} />
              <Route path="*" element={<DefaultLayout />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
