import { pages } from './pages';

interface UrlNavigationProps {
  [key: string]: string;
}

/*
  Dynamic UI menu navigation
  unique key is from DB
 */
export const urlNavigation: UrlNavigationProps = {
  classifier: pages.classifier.url,
  ui_menu: pages.uiMenu.url,
  notification: pages.notification.url,
  geoproduct: pages.geoproduct.url,
  user_management: pages.userManagement.url,
  system_setting: pages.systemSettings.url,
  system_settings_file: pages.systemSettingsFiles.url,
  processing_type: pages.processingTypes.url,
  background_task: pages.backgroundTasks.url,
  geoproduct_report: pages.geoproductReports.url,
  institution_classifier: pages.institutionClassifiers.url,
  licence_management: pages.licenceManagement.url,
  thematic_user_group: pages.thematicUserGroups.url,
  ordered_licence: pages.orderedLicences.url,
  orders_data_holder: pages.ordersDataHolder.url,
  tooltip: pages.tooltips.url,
  plugins: pages.plugins.url,
  tapis: pages.tapis.url,
  geoproducts_public: pages.geoProductsPublic.url
};
