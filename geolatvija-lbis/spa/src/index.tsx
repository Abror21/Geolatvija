import './index.css';
import './styles/_margins.css';
import 'fonts/FA/css/all.min.css';
import React from 'react';
import FontSizeContextProvider from 'contexts/FontSizeContext';
import LanguageContextProvider from 'contexts/LanguageContext';
import { SystemSettingProvider } from 'contexts/SystemSettingContext';
import ThemeContextProvider from 'contexts/ThemeContext';
import { UserProvider } from 'contexts/UserContext';
import IntlProviderWrapper from 'utils/intlProviderWrapper';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { OpenedTypeProvider } from './contexts/OpenedTypeContext';
import NotificationContextProvider from './contexts/NotificationContext';
import ProposalSubmitProvider from './contexts/ProposalSubmitContext';
import { TooltipProvider } from './contexts/TooltipContext';
import UserEmbedContextProvider from './contexts/UserEmbedContext';
import GeoProductSidebarContextProvider from './contexts/GeoProductSidebarContext';
import MapClickResultsContext from 'contexts/MapClickResultsOpeningContext';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProjectProvider } from './contexts/ProjectContext';
import { ParticipationBudgetProvider } from './contexts/ParticipationBudgetContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <ThemeContextProvider>
    <FontSizeContextProvider>
      <LanguageContextProvider>
        <NotificationContextProvider>
          <UserEmbedContextProvider>
            <ProposalSubmitProvider>
              <UserProvider>
                <SystemSettingProvider>
                  <TooltipProvider>
                    <OpenedTypeProvider>
                      <MapClickResultsContext>
                        <GeoProductSidebarContextProvider>
                          <ProjectProvider>
                            <ParticipationBudgetProvider>
                              <IntlProviderWrapper>
                                <App />
                              </IntlProviderWrapper>
                            </ParticipationBudgetProvider>
                          </ProjectProvider>
                        </GeoProductSidebarContextProvider>
                      </MapClickResultsContext>
                    </OpenedTypeProvider>
                  </TooltipProvider>
                </SystemSettingProvider>
              </UserProvider>
            </ProposalSubmitProvider>
          </UserEmbedContextProvider>
        </NotificationContextProvider>
      </LanguageContextProvider>
    </FontSizeContextProvider>
  </ThemeContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
