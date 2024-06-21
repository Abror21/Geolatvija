import React from 'react';
import Router from 'components/Router';
import { Layout } from 'antd';

import { StyledPage } from './style';
import DefaultHeader from './DefaultHeader';
import PageContent from './PageContent';
import PageLayout from './PageLayout';
import PageFooter from './PageFooter';
import PageHeader from './PageHeader';
import MapContext from 'contexts/MapContext';
import { getEmptyOlMap, addHighlightLayerToMap } from 'utils/mapUtils';
import useQueryApiClient from 'utils/useQueryApiClient';
import { useUserDispatch, useUserState } from 'contexts/UserContext';
import { useSystemSettingDispatch } from 'contexts/SystemSettingContext';
import SelectRole from './SelectRole';
import { useTooltipDispatch } from 'contexts/TooltipContext';
import {
  AuthWebStorageEnums,
  SessionControlBroadcastType,
  SessionControlProvider,
} from '../../contexts/SessionControlContext';
import GeoProductOrderProcessContextProvider from '../../contexts/GeoProductOrderProcessContext';
import PlannedDocumentProposalContextProvider from '../../contexts/PlannedDocumentProposalContext';
import ApplyForNotificationsContextProvider from '../../contexts/ApplyForNotificationsContext';
import InformativeStatementContextProvider from '../../contexts/InformativeStatementContext';
import NotificationHeaderPopup from '../Notifications';
import useJwt from '../../utils/useJwt';
import sessionControlBroadcastChannel from '../../utils/sessionControlBroadcastChannel';
import { routes } from '../../config/config';
import { Spinner } from '../../ui';
import NotificationHeaderContextProvider from '../../contexts/NotificationHeaderContext';
import UserEmailVerificationContextProvider from '../../contexts/UserEmailVerificationContext';
import UserEmailVerificationModal from '../Modals/EmailVerificationModal';
import ModalCookies from '../Modals/Cookies';
import PlannedDocumentsFilterContextProvider from 'contexts/PlannedDocumentsFilterContext';

const { Header, Content } = Layout;

const olMap = getEmptyOlMap();
addHighlightLayerToMap(olMap);

const DefaultLayout = () => {
  const dispatch = useUserDispatch();
  const dispatchTooltip = useTooltipDispatch();
  const dispatchSettings = useSystemSettingDispatch();
  const user = useUserState();
  const { isTokenActive, remove: removeJwt } = useJwt();

  const { refetch: logout } = useQueryApiClient({
    request: {
      url: 'api/v1/logout',
      disableOnMount: true,
      method: 'POST',
    },
    onSuccess: () => {
      sessionControlBroadcastChannel.postMessage({ type: SessionControlBroadcastType.LOG_OUT });
      dispatch({ type: 'SELECT_ROLE', payload: { selectedRole: undefined, loggingOut: true } });
      removeJwt();
      localStorage.removeItem(AuthWebStorageEnums.INITIAL_ROLE_IS_SET);

      /*
      This is to make sure it executes window.location.replace()
      as last after the current code block completes its execution
      */
      setTimeout(() => {
        window.location.replace(routes.api.baseUrl + '/vpm/logout');
      }, 0);
    },
  });

  const { refetch, isLoading } = useQueryApiClient({
    request: {
      url: 'api/v1/me',
      disableOnMount: !isTokenActive(),
    },
    onSuccess: (response) => dispatch({ type: 'SAVE_PAYLOAD', payload: { ...response, refetch: refetch, logout } }),
  });

  const { refetch: tooltipRefetch } = useQueryApiClient({
    request: {
      url: 'api/v1/tooltips/values',
      disableOnMount: !isTokenActive() || !user.selectedRole,
    },
    onSuccess: (response) =>
      dispatchTooltip({ type: 'SAVE_PAYLOAD', payload: { tooltips: response, refetch: tooltipRefetch } }),
  });

  const { refetch: refetchSettings } = useQueryApiClient({
    request: {
      url: 'api/v1/system-settings/frontend',
    },
    onSuccess: (response) =>
      dispatchSettings({ type: 'SAVE_PAYLOAD', payload: { ...response, refetch: refetchSettings } }),
  });

  return (
    <SessionControlProvider>
      <PlannedDocumentProposalContextProvider>
        <ApplyForNotificationsContextProvider>
          <InformativeStatementContextProvider>
            <GeoProductOrderProcessContextProvider>
              <NotificationHeaderContextProvider>
                <UserEmailVerificationContextProvider>
                  <PlannedDocumentsFilterContextProvider>
                    <MapContext.Provider value={olMap}>
                      <StyledPage>
                        <Layout className="layout">
                          <Header className="site-header">
                            <DefaultHeader showHeaderOptions />
                          </Header>
                          <NotificationHeaderPopup />
                          <UserEmailVerificationModal />

                          <Content>
                            <Spinner spinning={isLoading} dontRender>
                              {/* <ErrorBoundary> */}
                              <Router />
                              {/* </ErrorBoundary> */}
                            </Spinner>
                          </Content>

                          <PageFooter />
                        </Layout>
                      </StyledPage>
                      <SelectRole />
                      <ModalCookies />
                    </MapContext.Provider>
                  </PlannedDocumentsFilterContextProvider>
                </UserEmailVerificationContextProvider>
              </NotificationHeaderContextProvider>
            </GeoProductOrderProcessContextProvider>
          </InformativeStatementContextProvider>
        </ApplyForNotificationsContextProvider>
      </PlannedDocumentProposalContextProvider>
    </SessionControlProvider>
  );
};

DefaultLayout.PageLayout = PageLayout;
DefaultLayout.PageContent = PageContent;
DefaultLayout.PageHeader = PageHeader;

export default DefaultLayout;
