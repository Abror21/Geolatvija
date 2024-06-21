import { ThemeProvider } from "styled-components";
import { fontSize1, fontSize2, fontSize3, FontType } from "styles/theme/fonts";
import { dark, defaultTheme, ThemeType, yellow } from "styles/theme/theme";
import DictionaryContextProvider from "contexts/DictionaryContext";
import FontSizeContextProvider from "contexts/FontSizeContext";
import LanguageContextProvider from "contexts/LanguageContext";
import ThemeContextProvider from "contexts/ThemeContext";
import IntlProviderWrapper from "utils/intlProviderWrapper";

const BREAKPOINTS_INT = {
  xs: 375,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

const customViewports = Object.fromEntries(
  Object.entries(BREAKPOINTS_INT).map(([key, val], idx) => {
    return [
      key,
      {
        name: key,
        styles: {
          width: `${val}px`,
          height: `${(idx + 5) * 10}vh`,
        },
      },
    ];
  })
);

export const decorators = [
  (Story) => (
    <ThemeContextProvider>
      <FontSizeContextProvider>
        <LanguageContextProvider>
          <IntlProviderWrapper>
            <ThemeProvider theme={{ ...defaultTheme, ...fontSize1 }}>
              <Story />
            </ThemeProvider>
          </IntlProviderWrapper>
        </LanguageContextProvider>
      </FontSizeContextProvider>
    </ThemeContextProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: { viewports: customViewports },
};
