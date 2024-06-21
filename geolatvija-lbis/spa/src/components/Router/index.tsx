import { Navigate, Route, Routes } from 'react-router-dom';

import React from 'react';
import LayoutPage from 'pages/LayoutPage';
import TableTemplatePage from 'pages/Templates/TableTemplatePage';
import UiMenuListPage from 'pages/UiMenu/UiMenuListPage';
import UiMenuEditPage from 'pages/UiMenu/UiMenuEditPage';
import PredefinedPage from 'pages/UiMenu/PredefinedPage';
import UiMenuCreatePage from 'pages/UiMenu/UiMenuCreatePage';
import ClassifiersPage from 'pages/Classifiers/ClassifiersListPage';
import ClassifierEditPage from 'pages/Classifiers/ClassifiersEditPage';
import ClassifierCreatePage from 'pages/Classifiers/ClassifierCreatePage';
import NotificationListPage from 'pages/Notifications/NotificationListPage';
import NotificationCreatePage from 'pages/Notifications/NotificationCreatePage';
import NotificationEditPage from 'pages/Notifications/NotificationEditPage';
import MetaDataPage from 'pages/MetaDataPage';
import GeoProductListPage from 'pages/GeoProducts/GeoProductListPage';
import GeoProductCreateEditPage from 'pages/GeoProducts/GeoProductCreateEditPage';
import OrdersPage from 'pages/Orders';
import AccountPage from 'pages/Users/AccountPage';
import UserManagementPage from 'pages/UserManagement';
import { pages } from 'constants/pages';
import RoleCreateEditPage from 'pages/UserManagement/Roles/RoleCreateEditPage';
import UserCreateEditPage from 'pages/UserManagement/Users/UserCreateEditPage';
import SystemSettingListPage from '../../pages/SystemSettings/SystemSettingListPage';
import SystemSettingEditPage from '../../pages/SystemSettings/SystemSettingEditPage';
import SystemSettingFileCreateEditPage from '../../pages/SystemSettingFiles/SystemSettingFileCreateEditPage';
import SystemSettingFileListPage from '../../pages/SystemSettingFiles/SystemSettingFileListPage';
import ProcessingTypeListPage from '../../pages/ProcessingTypes/ProcessingTypeListPage';
import ProcessingTypeCreateEditPage from '../../pages/ProcessingTypes/ProcessingTypeCreateEditPage';
import BackgroundTaskListPage from '../../pages/BackgroundTask/BackgroundTaskListPage';
import BackgroundTaskEditPage from '../../pages/BackgroundTask/BackgroundTaskEditPage';
import GeoProductReportListPage from '../../pages/Reports/GeoProductReportListPage';
import InstitutionClassifierListPage from '../../pages/Classifiers/InstitutionClassifierListPage';
import LicenceManagementListPage from '../../pages/LicenceManagement/LicenceManagementListPage';
import LicenceTemplateCreateEditPage from '../../pages/LicenceManagement/LicenceTemplateCreateEditPage';
import LicenceInstitutionCreateEditPage from '../../pages/LicenceManagement/LicenceInstitutionCreateEditPage';
import ThematicUserGroupListPage from '../../pages/ThematicUserGroup/ThematicUserGroupListPage';
import ThematicUserGroupCreateEditPage from '../../pages/ThematicUserGroup/ThematicUserGroupCreateEditPage';
import OrderedLicenceListPage from '../../pages/OrderedLicences/OrderedLicenceListPage';
import OrderDataHolderListPage from '../../pages/OrdersDataHolder/OrderDataHolderListPage';
import UserNotifications from '../../pages/Notifications/UserNotifications';
import OrderDataHolderEditPage from '../../pages/OrdersDataHolder/OrderDataHolderEditPage';
import TooltipListPage from '../../pages/Tooltips/TooltipListPage';
import TooltipCreateEditPage from '../../pages/Tooltips/TooltipCreateEditPage';
import UserEmbedListPage from '../../pages/UserEmbeds/UserEmbedListPage';
import PluginsPage from '../../pages/Plugins';
import ProposalListPage from '../../pages/Proposals/ProposalListPage';
import ProposalEditPage from '../../pages/Proposals/ProposalEditPage';
import useJwt from '../../utils/useJwt';

const Router = () => {
  const { isTokenActive } = useJwt();
  const renderRoutes = () => {
    return (
      <>
        <Route path="/main" element={<LayoutPage />} />
        <Route path="/geo/tapis" element={<LayoutPage />} />
        <Route path="/geo/tapis:id" element={<LayoutPage />} />
        {/*<Route path="/layout-table" element={<TableTemplatePage />} />*/}
        <Route path="/predefined-page/:key" element={<PredefinedPage />} />

        {/*only authorised routes*/}
        {isTokenActive() && (
          <>
            <Route path="/ui-menu" element={<UiMenuListPage />} />
            <Route path="/ui-menu/:id" element={<UiMenuEditPage />} />
            <Route path="/ui-menu/create" element={<UiMenuCreatePage />} />
            <Route path="/classifiers" element={<ClassifiersPage />} />
            <Route path="/classifiers/:id" element={<ClassifierEditPage />} />
            <Route path="/classifiers/create" element={<ClassifierCreatePage />} />

            <Route path="/notifications" element={<NotificationListPage />} />
            <Route path="/notifications/create" element={<NotificationCreatePage />} />
            <Route path="/notifications/:id" element={<NotificationEditPage />} />
            <Route path="/user-notifications" element={<UserNotifications />} />

            <Route path="/geoproducts" element={<GeoProductListPage />} />
            <Route path="/geoproducts/:id" element={<GeoProductCreateEditPage />} />
            <Route path="/geoproducts/create" element={<GeoProductCreateEditPage />} />
            <Route path="/metadata" element={<MetaDataPage />} />

            <Route path={pages.userManagement.url} element={<UserManagementPage />} />
            <Route path={pages.userManagement.create.url} element={<UserCreateEditPage />} />
            <Route path={pages.userManagement.edit.url} element={<UserCreateEditPage />} />
            <Route path={pages.roles.create.url} element={<RoleCreateEditPage />} />
            <Route path={pages.roles.edit.url} element={<RoleCreateEditPage />} />

            <Route path={pages.userEmbeds.url} element={<UserEmbedListPage />} />
            <Route path={pages.proposals.url} element={<ProposalListPage />} />
            <Route path={pages.proposals.edit.url} element={<ProposalEditPage />} />

            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/account" element={<AccountPage />} />

            <Route path="/system-settings" element={<SystemSettingListPage />} />
            <Route path="/system-settings/:id" element={<SystemSettingEditPage />} />
            <Route path="/system-files" element={<SystemSettingFileListPage />} />
            <Route path="/system-files/create" element={<SystemSettingFileCreateEditPage />} />
            <Route path="/system-files/:id" element={<SystemSettingFileCreateEditPage />} />

            <Route path={pages.processingTypes.url} element={<ProcessingTypeListPage />} />
            <Route path={pages.processingTypes.create.url} element={<ProcessingTypeCreateEditPage />} />
            <Route path={pages.processingTypes.edit.url} element={<ProcessingTypeCreateEditPage />} />

            <Route path={pages.backgroundTasks.url} element={<BackgroundTaskListPage />} />
            <Route path={pages.backgroundTasks.edit.url} element={<BackgroundTaskEditPage />} />

            <Route path={pages.geoproductReports.url} element={<GeoProductReportListPage />} />

            <Route path={pages.institutionClassifiers.url} element={<InstitutionClassifierListPage />} />

            <Route path={pages.licenceManagement.url} element={<LicenceManagementListPage />} />
            <Route
              path={pages.licenceManagement.institution.create.url}
              element={<LicenceInstitutionCreateEditPage />}
            />
            <Route path={pages.licenceManagement.institution.edit.url} element={<LicenceInstitutionCreateEditPage />} />

            <Route path={pages.licenceManagement.template.create.url} element={<LicenceTemplateCreateEditPage />} />
            <Route path={pages.licenceManagement.template.edit.url} element={<LicenceTemplateCreateEditPage />} />

            <Route path={pages.thematicUserGroups.url} element={<ThematicUserGroupListPage />} />
            <Route path={pages.thematicUserGroups.create.url} element={<ThematicUserGroupCreateEditPage />} />
            <Route path={pages.thematicUserGroups.edit.url} element={<ThematicUserGroupCreateEditPage />} />

            <Route path={pages.orderedLicences.url} element={<OrderedLicenceListPage />} />

            <Route path={pages.ordersDataHolder.url} element={<OrderDataHolderListPage />} />
            <Route path={pages.ordersDataHolder.edit.url} element={<OrderDataHolderEditPage />} />

            <Route path={pages.tooltips.url} element={<TooltipListPage />} />
            <Route path={pages.tooltips.create.url} element={<TooltipCreateEditPage />} />
            <Route path={pages.tooltips.edit.url} element={<TooltipCreateEditPage />} />
            <Route path="/plugins" element={<PluginsPage />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/main" replace />} />
      </>
    );
  };

  return <Routes>{renderRoutes()}</Routes>;
};

export default Router;
