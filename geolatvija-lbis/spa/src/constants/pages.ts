export const pages = {
  uiMenu: {
    url: '/ui-menu',
    title: 'navigation.ui_menu',
    editUiMenu: {
      url: '/ui-menu/:id',
      title: 'navigation.edit_ui_menu',
    },
    createUiMenu: {
      url: '/ui-menu/create',
      title: 'navigation.create_ui_menu',
    },
  },
  classifier: {
    url: '/classifiers',
    title: 'navigation.classifiers',
    editClassifier: {
      url: '/classifiers/:id',
      title: 'navigation.edit_classifiers',
    },
    createClassifier: {
      url: '/classifiers/create',
      title: 'navigation.create_classifiers',
    },
  },
  institutionClassifiers: {
    url: '/institution-classifiers',
    title: 'navigation.institution_classifiers',
    editClassifier: {
      url: '/institution-classifiers/:id',
      title: 'navigation.edit_institution_classifiers',
    },
    createClassifier: {
      url: '/institution-classifiers/create',
      title: 'navigation.create_institution_classifiers',
    },
  },
  notification: {
    url: '/notifications',
    title: 'navigation.notifications',
    editNotification: {
      url: '/notifications/:id',
      title: 'navigation.edit_notifications',
    },
    createNotification: {
      url: '/notifications/create',
      title: 'navigation.create_notifications',
    },
  },
  userEmbeds: {
    url: '/user-embeds',
    title: 'navigation.user_embeds',
  },
  geoproduct: {
    url: '/geoproducts',
    title: 'navigation.geoproducts',
    edit: {
      url: '/geoproducts/:id',
      title: 'navigation.edit_geoproducts',
    },
    create: {
      url: '/geoproducts/create',
      title: 'navigation.create_geoproducts',
    },
  },
  userManagement: {
    url: '/user-management',
    create: {
      url: '/users/create',
    },
    edit: {
      url: '/users/:id',
    },
  },
  roles: {
    create: {
      url: '/roles/create',
    },
    edit: {
      url: '/roles/:id',
    },
  },
  systemSettings: {
    url: 'system-settings',
    title: 'navigation.system_settings',
    edit: {
      url: '/system-settings/:id',
      title: 'navigation.edit_system_settings',
    },
  },
  systemSettingsFiles: {
    url: '/system-files',
    title: 'navigation.system_settings_files',
    create: {
      url: '/system-files/create',
      title: 'navigation.create_system_setting_files',
    },
    edit: {
      url: '/system-files/:id',
      title: 'navigation.edit_system_setting_files',
    },
  },
  processingTypes: {
    url: '/processing-types',
    title: 'navigation.processing_types',
    create: {
      url: '/processing-types/create',
      title: 'navigation.create_processing_types',
    },
    edit: {
      url: '/processing-types/:id',
      title: 'navigation.edit_processing_types',
    },
  },
  backgroundTasks: {
    url: '/background-task',
    title: 'navigation.background_tasks',
    edit: {
      url: '/background-task/:id',
      title: 'navigation.edit_background_tasks',
    },
  },
  geoproductReports: {
    url: '/geoproduct-reports',
    title: 'navigation.geoproduct_reports',
    edit: {
      url: '/geoproduct-reports/:id',
      title: 'navigation.edit_geoproduct_reports',
    },
  },
  licenceManagement: {
    url: '/licence-management',
    title: 'navigation.licence_management',
    institution: {
      create: {
        url: '/licence-management/create',
        title: 'navigation.create_licence_management',
      },
      edit: {
        url: '/licence-management/:id',
        title: 'navigation.edit_licence_management',
      },
    },
    template: {
      create: {
        url: '/licence-management-templates/create',
        title: 'navigation.create_licence_template',
      },
      edit: {
        url: '/licence-management-templates/:id',
        title: 'navigation.edit_licence_template',
      },
    },
  },
  thematicUserGroups: {
    url: '/thematic-user-groups',
    title: 'navigation.thematic_user_groups',
    create: {
      url: '/thematic-user-groups/create',
      title: 'navigation.create_thematic_user_groups',
    },
    edit: {
      url: '/thematic-user-groups/:id',
      title: 'navigation.edit_thematic_user_groups',
    },
  },
  tooltips: {
    url: '/tooltips',
    title: 'navigation.tooltips',
    create: {
      url: '/tooltips/create',
      title: 'navigation.create_tooltips',
    },
    edit: {
      url: '/tooltips/:id',
      title: 'navigation.edit_tooltips',
    },
  },

  orderedLicences: {
    url: '/ordered-licences',
    title: 'navigation.ordered_licences',
  },

  proposals: {
    url: '/proposals',
    title: 'navigation.proposals',
    edit: {
      url: '/proposals/:id',
      title: 'navigation.see_proposals',
    },
  },

  ordersDataHolder: {
    url: '/orders-data-holder',
    title: 'navigation.orders_data_holder',
    edit: {
      url: '/orders-data-holder/:id',
      title: 'navigation.edit_orders_data_holder',
    },
  },
  plugins: {
    url: '/plugins',
    title: 'plugins.title',
  },
  tapis: {
    url: '/main?documents=open',
  },
  selectedTapis: {
    url: '/geo/tapis?documents=open',
  },
  geoProductsPublic: {
    url: '/main?geoproduct=open',
  },
};
