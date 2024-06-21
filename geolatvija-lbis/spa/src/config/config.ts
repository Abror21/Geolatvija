declare global {
  interface Window {
    runConfig: {
      frontendUrl: string;
      backendUrl: string;
      geoserverUrl: string;
      tapisWMTSUrl: string;
      dapUrl: string;
      nodeEnv: string;
      captchaSiteKey: string;
      enableInspireValidationOnPublish: boolean;
      disableAuthentication?: boolean;
      municipalProjectSelectedYear: string;
      paginationPageSize: number;
    };
  }
}

export const routes = {
  api: {
    frontendUrl: window?.runConfig?.frontendUrl,
    baseUrl: window?.runConfig?.backendUrl,
  },
  geo: {
    geoserverUrl: window?.runConfig?.geoserverUrl,
    tapisWMTSUrl: window?.runConfig?.tapisWMTSUrl,
    dapUrl: window?.runConfig?.dapUrl,
    municipalProjectSelectedYear: window?.runConfig.municipalProjectSelectedYear,
    paginationPageSize: window?.runConfig?.paginationPageSize,
  },
};

export const siteKey = window?.runConfig?.captchaSiteKey;

export const listStatuses = [
  {
    treeJsonTitle: 'Apspriešanā',
    searchStatus: 'pending_approval',
    title: 'Apspriešanā',
    color: 'red',
    identify: true,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Publicēts pirms apspriešanas',
    searchStatus: 'before_public_discussion',
    title: 'Publicēts pirms apspriešanas',
    color: 'red',
    identify: true,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Apspriešana beigusies',
    searchStatus: 'completed_public_discussion',
    title: 'Apspriešana beigusies',
    color: 'red',
    identify: true,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Izstrāde',
    searchStatus: 'draft',
    title: 'Izstrāde',
    color: 'orange',
    identify: true,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Jaunas redakcijas izstrāde',
    searchStatus: 'draft_new',
    title: 'Jaunas redakcijas izstrāde',
    color: 'orange',
    identify: true,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Redakcionālu kļūdu labošana',
    searchStatus: 'small_changes',
    title: 'Redakcionālu kļūdu labošana',
    color: 'orange',
    identify: true,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Atcelšana daļā',
    searchStatus: 'cancellation_in_part',
    title: 'Atcelšana daļā',
    color: 'green',
    identify: true,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Apstiprināts',
    searchStatus: 'approved',
    title: 'Apstiprināts',
    color: 'green',
    identify: true,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Spēkā (nav piemērojams)',
    searchStatus: 'active_not_applicable',
    title: 'Spēkā (nav piemērojams)',
    color: 'green',
    identify: true,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Spēkā',
    searchStatus: 'active',
    title: 'Spēkā',
    color: 'green',
    identify: false,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Spēkā (izstrādāts uz teritorijas plānojuma, kurš zaudējis spēku)',
    searchStatus: 'active_historical',
    title: 'Spēkā',
    color: 'green',
    identify: true,
    useInSearch: false,
  },
  {
    treeJsonTitle: 'Zaudējis spēku',
    searchStatus: 'inactive',
    title: 'Zaudējis spēku',
    color: 'gray',
    identify: true,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Izstrāde apturēta',
    searchStatus: 'suspended',
    title: 'Izstrāde apturēta',
    color: 'gray',
    identify: true,
    useInSearch: true,
  },
  {
    treeJsonTitle: 'Darba redakcija',
    searchStatus: 'working_version',
    title: 'Darba redakcija',
    color: 'gray',
    identify: true,
    useInSearch: false,
  },
  {
    treeJsonTitle: 'Anulēts',
    searchStatus: 'closed',
    title: 'Anulēts',
    color: 'red',
    identify: false,
    useInSearch: false,
  },
  {
    treeJsonTitle: 'Atcelts',
    searchStatus: 'cancelled',
    title: 'Atcelts',
    color: 'gray',
    identify: true,
    useInSearch: true,
  },
];

export const cookieTypes = [
  {
    cookie: 'cookie',
    group: 'Nepieciešams',
    description: 'Reģistrē, kādas sīkdatnes lietotājs ir apstiprinājis.',
    deadline: '1 gads',
  },
  {
    cookie: 'laravel_session',
    group: 'Nepieciešams',
    description: 'Sesijas uzturēšanai un drošībai',
    deadline: 'Sesija',
  },
  {
    cookie: 'NOTIFICATION',
    group: 'Nepieciešams',
    description: 'Neradīt notifikācijas, ko lietotājs ir redzējis un aizvēris',
    deadline: '1 gads',
  },
  {
    cookie: '_ga',
    group: 'Statistikas sīkdatnes (nepieciešamas,lai uzlabotu vietnes darbību un pakalpojumus)',
    description: 'Google Analytics (analytics.js) unikālo apmeklējumu uzskaite',
    deadline: '2 gadi',
  },
  {
    cookie: '_gat',
    group: 'Statistikas sīkdatnes (nepieciešamas,lai uzlabotu vietnes darbību un pakalpojumus)',
    description: 'Google Analytics (analytics.js) pieprasījumu biežuma regulēšana',
    deadline: '10 minūtes',
  },
  {
    cookie: '__utma',
    group: 'Statistikas sīkdatnes (nepieciešamas,lai uzlabotu vietnes darbību un pakalpojumus)',
    description: 'Google analytics (ga.js) unikālo apmeklējumu uzskaite',
    deadline: '2 gadi',
  },
  {
    cookie: '__utmt',
    group: 'Statistikas sīkdatnes (nepieciešamas,lai uzlabotu vietnes darbību un pakalpojumus)',
    description: 'Google analytics (ga.js) pieprasījumu biežuma regulēšana',
    deadline: '10 minūtes',
  },
  {
    cookie: '__utmb',
    group: 'Statistikas sīkdatnes (nepieciešamas,lai uzlabotu vietnes darbību un pakalpojumus)',
    description: 'Google analytics (ga.js) pirmā apmeklējuma identificēšana',
    deadline: '30 minūtes',
  },
  {
    cookie: '__utmz',
    group: 'Statistikas sīkdatnes (nepieciešamas,lai uzlabotu vietnes darbību un pakalpojumus)',
    description: 'Google analytics (ga.js) apmeklējuma izcelsmes identificēšana.',
    deadline: '6 mēneši',
  },
];
