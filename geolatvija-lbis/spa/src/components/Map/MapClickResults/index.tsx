import React, { useContext, useEffect, useMemo, useState, Fragment, useRef } from 'react';
import MapContext from 'contexts/MapContext';
import { Coordinate } from 'ol/coordinate';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import {
  getFeatureInfoUrlFromOLSource,
  getTAPISApvienotieGetFeatureInfoUrl,
  getTAPISIndividualieGetFeatureInfoUrl,
  getIADTGetFeatureInfoUrl,
  getParcelGetFeatureInfoUrl,
  getIconStyle,
  highlightFeature,
  infoFormats,
} from 'utils/mapUtils';
import OlMap from 'ol/Map';
import ImageWMS from 'ol/source/ImageWMS';
import { useOpenedTypeDispatch, useOpenedTypeState } from 'contexts/OpenedTypeContext';
import OlFeature from 'ol/Feature';
import axios, { AxiosResponse } from 'axios';
import { IntlShape, useIntl } from 'react-intl';
import WMTS from 'ol/source/WMTS';
import Source from 'ol/source/Source';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlGeometry from 'ol/geom/Geometry';
import OlStyleStyle from 'ol/style/Style';
import Point from 'ol/geom/Point';
import * as proj from 'ol/proj';
import {
  StyledInfoTapisDocsComponent,
  StyledMapClickResultsComponent,
  StyledGeoResponseResultsComponent,
  SmallerTooltipWrapper,
  SmallerTooltipTitleWrapper,
} from './styles';
import { Feature } from 'ol';
import { Button, Icon, Spinner, Tooltip } from '../../../ui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NotificationContext } from '../../../contexts/NotificationContext';
import UnauthenticatedModal from '../../Modals/UnauthenticatedModal';
import { useApplyForNotifications } from '../../../contexts/ApplyForNotificationsContext';
import { useInformativeStatement } from '../../../contexts/InformativeStatementContext';
import useJwt from '../../../utils/useJwt';
import { useUserState } from '../../../contexts/UserContext';
import { listStatuses } from '../../../config/config';
import { usePlannedDocumentsFilterContext } from '../../../contexts/PlannedDocumentsFilterContext';
import dayjs from 'dayjs';

interface MapClickResultsProps {
  setIsOpenMapClickResults: Function;
  isOpenMapClickResults: boolean;
  isOpenPlannedDocuments: boolean;
  isShowCoordinatesWindowOpen: boolean;
}

interface FeatureInfoResponse {
  layerId: String;
  layerTitle: String;
  loading: boolean;
  features: OlFeature[];
  errorMsg: String | null;
  tapis: boolean;
}

const APVIENOTIE = 'tapis_apvienotie';
const INDIVIDUALIE = 'tapis_individualie';
const IADT = 'tapis_iadt';
const PARCELS = 'tapis_parcels';

const PLANOSANAS_DOC_TYPES = ['TP', 'LP', 'DP', 'LP_SUR'];
const ZONEJUMS_DOC_TYPES = ['TP', 'LP'];
const SPEKA_DOC_STATUSES = [10, 12];
const IZSTRADE_DOC_STATUSES = [1, 2, 3, 4, 7, 9];

//if translations has at least one layer's property, show only translated properties
// else show all properties as is (for geoproducts WMSes)
const getTranslatedFeatureProperties = (feat: OlFeature, intl: IntlShape, layerId: String): [string, string][] => {
  const allProps = Object.entries(feat.getProperties());
  const translated = allProps.filter((prop) => !!intl.messages[`map_click_results.${layerId}.${prop[0]}`]);
  const useAll = translated.length === 0;
  const props = useAll ? allProps : translated;
  return props
    .filter((prop) => prop[0] !== 'geometry' && prop[1] != null)
    .map((prop) => [
      useAll ? prop[0] : intl.formatMessage({ id: `map_click_results.${layerId}.${prop[0]}` }),
      prop[1]?.toString(),
    ]);
};

const filterFeatureByTapisLayer = (layerName: String) => (f: OlFeature) =>
  f.getId()?.toString().startsWith(`${layerName}.`);

const formatFeatureTitle = (feature: OlFeature) =>
  `${feature.get('dok_ori_nos') || feature.get('dok_nos')}${
    feature.get('nosaukums') ? '\n' + '"' + feature.get('nosaukums') + '"' : ''
  }`;

export const MapClickResults = ({
  setIsOpenMapClickResults,
  isOpenMapClickResults,
  isOpenPlannedDocuments,
  isShowCoordinatesWindowOpen,
}: MapClickResultsProps) => {
  const [responses, setResponses] = useState<FeatureInfoResponse[]>([]);
  const [iconLayer, setIconLayer] = useState<OlLayerVector<OlSourceVector<OlGeometry>> | null>(null);
  const [showUnauthenticated, setShowUnauthenticated] = useState<boolean>(false);

  const map = useContext(MapContext);
  const openedType = useOpenedTypeState();
  const { openedMapType } = openedType;
  const openedTypeDispatch = useOpenedTypeDispatch();
  const { setFilterParams, resetFilterInputs, filterParams } = usePlannedDocumentsFilterContext();
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen: isNotificationOpen, setCoords: setNotificationCoords } = useContext(NotificationContext);
  const { value: applyForNotificationSessionValue, setSessionValue: setApplyForNotificationsSessionValue } =
    useApplyForNotifications();
  const {
    setShowUnauthenticated: showInformativeStatementUnauthenticated,
    setIsModalOpen,
    setKadastrs,
  } = useInformativeStatement();
  const { isTokenActive } = useJwt();

  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const userCanAccess = activeRole?.code === 'authenticated';
  const [showModal, setShowModal] = useState<boolean>(false);

  const identifyIndividualDoc =
    openedType.selectedTapisDocument?.TAPDStatuss &&
    listStatuses.find((s) => s.treeJsonTitle === openedType.selectedTapisDocument?.TAPDStatuss)?.identify;

  const loadedOnce = useRef(false);
  useEffect(() => {
    if (!loadedOnce.current && applyForNotificationSessionValue?.coordinate && applyForNotificationSessionValue.open) {
      onMapClick(undefined, applyForNotificationSessionValue?.coordinate, true);
      loadedOnce.current = true;
    }
  }, [applyForNotificationSessionValue]);

  const updateResponsesForLayer = (layerId: String, features: OlFeature[], errorMsg: String | null) => {
    setResponses((resp) =>
      resp.map((r) => {
        if (r.layerId === layerId) {
          return {
            ...r,
            loading: false,
            features,
            errorMsg,
          };
        }
        return r;
      })
    );
  };

  const processResponse =
    (
      layerId: String,
      infoFormat: String = 'application/json',
      dataProjection?: proj.ProjectionLike,
      targetProjection?: proj.ProjectionLike
    ) =>
    (response: AxiosResponse) => {
      if (response.status > 299) {
        updateResponsesForLayer(layerId, [], response.statusText);
      }

      if (layerId === 'tapis_parcels') {
        setKadastrs(response?.['data']?.['features']?.[0]?.['properties']?.['code']);
      }

      try {
        const options =
          dataProjection && targetProjection
            ? {
                dataProjection,
                featureProjection: targetProjection,
              }
            : {};
        const features = infoFormats[infoFormat as keyof typeof infoFormats].readFeatures(response.data, options);
        updateResponsesForLayer(layerId, features, null);
      } catch (error) {
        updateResponsesForLayer(
          layerId,
          [],
          'Šajā slānī nevar veikt meklēšanu - nevar apstrādāt servisa atgrieztos datus.'
        );
      }
    };

  const processError = (layerId: String) => (error: any) => {
    updateResponsesForLayer(layerId, [], error.message);
  };

  const onReceiveMoreInfo = () => {
    if (isTokenActive()) {
      navigate(
        `/main?notification=open&long=${applyForNotificationSessionValue?.coordinate?.[0]}&lat=${applyForNotificationSessionValue?.coordinate?.[1]}`
      );
    } else {
      setShowUnauthenticated(true);
    }
  };

  const navigateToDoc = (docId: String) => () => {
    navigate(getDocHref(docId));
  };

  const getDocHref = (docId: String) => `/geo/tapis#document_${docId}#nozoom`;

  // highlighting feature
  useEffect(() => {
    if (map) {
      const iconLayer = new OlLayerVector({
        properties: {
          name: '_icon_click_result',
        },
        source: new OlSourceVector(),
        style: new OlStyleStyle({
          image: getIconStyle('marker_outline', 'rgba(28, 97, 55, 1.0)', '', 0, 1.35),
        }),
        zIndex: 100,
      });
      map.addLayer(iconLayer);
      setIconLayer(iconLayer);

      return () => {
        map.removeLayer(iconLayer);
        setIconLayer(null);
      };
    }
  }, [map]);

  useEffect(() => {
    if (iconLayer) {
      iconLayer?.getSource()?.clear();
      if (isOpenMapClickResults && !!applyForNotificationSessionValue?.coordinate) {
        iconLayer?.getSource()?.addFeature(
          new Feature({
            geometry: new Point([...applyForNotificationSessionValue?.coordinate]),
          })
        );
      }
    }
  }, [applyForNotificationSessionValue?.coordinate, iconLayer, isOpenMapClickResults]);

  const onMapClick = (olEvt?: OlMapBrowserEvent<MouseEvent>, olCoordinate?: Coordinate, open?: boolean) => {
    if (isShowCoordinatesWindowOpen) return;

    const coordinatesToSet = olEvt?.coordinate || olCoordinate;
    if (!!coordinatesToSet) {
      setApplyForNotificationsSessionValue({
        open: open ?? false,
        coordinate: coordinatesToSet,
      });

      if (map) {
        //if TAPIS is active fetch data from TAPIS services by special requirements
        if (openedMapType === 'tapis') {
          /*
            If PlannedDocuments filter params are empty or PlannedDocuments sidebar is not open and
            there's not selected detailed planned document then filter planned documents only by bbox.
          */
          if (!openedType.selectedTapisDocument && isOpenPlannedDocuments) {
            const bboxHalfSize = Math.ceil(5000 / Math.pow((map.getView().getZoom() as number) + 1, 4));
            const longitude = Math.round(coordinatesToSet[0]);
            const latitude = Math.round(coordinatesToSet[1]);
            const bboxFilter = `SRID=3059;POLYGON((${longitude - bboxHalfSize} ${latitude - bboxHalfSize},${
              longitude - bboxHalfSize
            } ${latitude + bboxHalfSize},${longitude + bboxHalfSize} ${latitude + bboxHalfSize},${
              longitude + bboxHalfSize
            } ${latitude - bboxHalfSize},${longitude - bboxHalfSize} ${latitude - bboxHalfSize}))`;
            //example:
            //SRID=3059;POLYGON((318468 263720,318468 263722,318470 263722,318470 263720,318468 263720))
            if (
              ((!filterParams?.status || filterParams?.status?.length === 0) &&
                (!filterParams?.organization || filterParams?.organization?.length === 0) &&
                (!filterParams?.search || filterParams?.search.trim() === '')) ||
              !searchParams.get('documents')
            ) {
              setFilterParams({
                organization: undefined,
                search: undefined,
                status: undefined,
                bbox: bboxFilter,
                page: 1,
              });
              resetFilterInputs();
              openedTypeDispatch({ type: 'OPENED_TAPIS' });
              navigate('/main?documents=open');
            }
          }
          const responses: FeatureInfoResponse[] = [];
          axios
            .get(getTAPISApvienotieGetFeatureInfoUrl(map, coordinatesToSet) as string)
            .then(processResponse(APVIENOTIE))
            .catch(processError(APVIENOTIE));
          responses.push({
            layerId: APVIENOTIE,
            layerTitle: '',
            loading: true,
            features: [],
            errorMsg: null,
            tapis: true,
          });
          let loadingIndiv = false;
          if (identifyIndividualDoc && openedType.selectedTapisDocument) {
            loadingIndiv = true;
            axios
              .get(
                getTAPISIndividualieGetFeatureInfoUrl(
                  map,
                  coordinatesToSet,
                  openedType.selectedTapisDocument.dok_id
                ) as string
              )
              .then(processResponse(INDIVIDUALIE))
              .catch(processError(INDIVIDUALIE));
          }
          responses.push({
            layerId: INDIVIDUALIE,
            layerTitle: '',
            loading: loadingIndiv,
            features: [],
            errorMsg: null,
            tapis: true,
          });

          axios
            .get(getParcelGetFeatureInfoUrl(map, coordinatesToSet) as string)
            .then(processResponse(PARCELS))
            .catch(processError(PARCELS));
          responses.push({
            layerId: PARCELS,
            layerTitle: '',
            loading: true,
            features: [],
            errorMsg: null,
            tapis: true,
          });

          axios
            .get(getIADTGetFeatureInfoUrl(map, coordinatesToSet) as string)
            .then(processResponse(IADT))
            .catch(processError(IADT));
          responses.push({
            layerId: IADT,
            layerTitle: '',
            loading: true,
            features: [],
            errorMsg: null,
            tapis: true,
          });

          setResponses(responses);
        } else {
          //if TAPIS is not active fetch only from currently visible layers
          const queryableLayers = (map as OlMap)
            .getAllLayers()
            .filter(
              (l) =>
                l.getVisible() &&
                l.getSource() &&
                (l.getSource() instanceof ImageWMS || l.getSource() instanceof WMTS) &&
                l.get('queryable') !== false
            );
          setResponses(
            queryableLayers.map((layer) => {
              const infoFormat = layer.get('infoFormat') || 'application/json';
              const infoUrl = getFeatureInfoUrlFromOLSource(
                layer.getSource() as Source,
                map,
                coordinatesToSet,
                20,
                infoFormat
              );
              axios
                .get(infoUrl as string)
                .then(
                  processResponse(
                    layer.get('id'),
                    infoFormat,
                    layer.getSource()?.getProjection() as proj.ProjectionLike,
                    map.getView().getProjection()
                  )
                )
                .catch(processError(layer.get('id')));
              return {
                layerId: layer.get('id'),
                layerTitle: layer.get('title'),
                loading: true,
                features: [],
                errorMsg: null,
                tapis: false,
              };
            })
          );
        }

        if (isNotificationOpen) {
          setNotificationCoords(coordinatesToSet);
        }
        if(openedType.activeHeaderButton !== 'participation-budget'){
          setIsOpenMapClickResults(true);
        }
      }
    }
  };

  useEffect(() => {
    if (map) {
      map.on('click', onMapClick);
      return () => {
        // unsubscription
        map.un('click', onMapClick);
      };
    }
  }, [map, onMapClick]);

  const tapisApvienotie = responses.find((r) => r.tapis === true && r.layerId === APVIENOTIE);
  const tapisIndividualie = responses.find((r) => r.tapis === true && r.layerId === INDIVIDUALIE);
  const tapisIADT = responses.find((r) => r.tapis === true && r.layerId === IADT);
  const tapisParcels = responses.find((r) => r.tapis === true && r.layerId === PARCELS);

  const tapisLoaded =
    tapisApvienotie && tapisApvienotie.loading === false && tapisIndividualie && tapisIndividualie.loading === false;

  const processTapis = openedMapType === 'tapis' && tapisLoaded;

  const allTapisDocs = processTapis
    ? tapisApvienotie.features.filter(filterFeatureByTapisLayer('planojumu_teritorijas'))
    : [];

  // find on the right side opened TAPIS doc:
  const selectedTAPISDoc =
    identifyIndividualDoc && processTapis
      ? tapisIndividualie.features.find(filterFeatureByTapisLayer('planojuma_robeza'))
      : undefined;

  // filter docs with dok_statuss = 10 || 12  and dok_tips = TP, LP, DP, LP_SUR or dok_id == currently opened doc. id
  const infoTapisDocs = allTapisDocs.filter(
    (f) => PLANOSANAS_DOC_TYPES.includes(f.get('dok_tips')) && SPEKA_DOC_STATUSES.includes(f.get('dok_statuss'))
  );

  // warn izstrāde planosana dok_tips = TP, LP, DP, LP_SUR and dok_statuss = 1, 2, 4, 7 un 8
  const izstrTapisDocs = allTapisDocs.filter(
    (f) => PLANOSANAS_DOC_TYPES.includes(f.get('dok_tips')) && IZSTRADE_DOC_STATUSES.includes(f.get('dok_statuss'))
  );

  // 2. Funkcionālās zonas
  // if nothing found don't show title
  // search in funkcionalais_zonejums layer
  // if currently opened doc. = TP, LP then in currentlty opened dok. layers else in apvienotie layers
  const fzs = processTapis
    ? selectedTAPISDoc && ZONEJUMS_DOC_TYPES.includes(selectedTAPISDoc.get('dok_tips'))
      ? tapisIndividualie.features.filter(filterFeatureByTapisLayer('funkcionalais_zonejums'))
      : tapisApvienotie.features.filter(filterFeatureByTapisLayer('funkcionalais_zonejums')).filter((f) => {
          const dok = allTapisDocs.find((d) => d.get('dok_id') === f.get('dok_id'));
          return !dok || ZONEJUMS_DOC_TYPES.includes(dok.get('dok_tips'));
        })
    : [];
  // 3. Teritorijas ar īpašiem noteikumiem
  // search in teritorijas_ar_ipasiem_noteikumiem layer
  // same logic as Funkcionālais zonējums
  const tins = processTapis
    ? selectedTAPISDoc && ZONEJUMS_DOC_TYPES.includes(selectedTAPISDoc.get('dok_tips'))
      ? tapisIndividualie.features.filter(filterFeatureByTapisLayer('teritorijas_ar_ipasiem_noteikumiem'))
      : tapisApvienotie.features.filter(filterFeatureByTapisLayer('teritorijas_ar_ipasiem_noteikumiem'))
    : [];

  // 4. Apgrūtinātās teritorijas un citi objekti
  // if nothing found don't show title
  // Nacionālo interešu objekti nacionalo_interesu_objekti  (apvienotie or in current dok (if NIO dok.))
  const nio = processTapis
    ? tapisApvienotie.features
        .filter(filterFeatureByTapisLayer('nacionalo_interesu_objekti'))
        .concat(
          selectedTAPISDoc && selectedTAPISDoc.get('dok_tips') === 'NIO'
            ? tapisIndividualie.features.filter(filterFeatureByTapisLayer('nacionalo_interesu_objekti'))
            : []
        )
    : [];
  // Nacionālas nozīmes lauksaimniecības teritorijas nacionalas_nozimes_lauksaimniecibas_teritorijas (apvienotie or in current dok (if TP dok.))
  const lauks = processTapis
    ? selectedTAPISDoc && selectedTAPISDoc.get('dok_tips') === 'TP'
      ? tapisIndividualie.features.filter(filterFeatureByTapisLayer('nacionalas_nozimes_lauksaimniecibas_teritorijas'))
      : tapisApvienotie.features.filter(filterFeatureByTapisLayer('nacionalas_nozimes_lauksaimniecibas_teritorijas'))
    : [];
  // Pašvaldības nozīmes ceļi un ielas pasvaldibas_nozimes_celi_vai_ielas (apvienotie or in current dok (if TP, LP, DP, LP_SUR dok.))
  const pasvCeli = processTapis
    ? selectedTAPISDoc && PLANOSANAS_DOC_TYPES.includes(selectedTAPISDoc.get('dok_tips'))
      ? tapisIndividualie.features.filter(filterFeatureByTapisLayer('pasvaldibas_nozimes_celi_vai_ielas'))
      : tapisApvienotie.features.filter(filterFeatureByTapisLayer('pasvaldibas_nozimes_celi_vai_ielas'))
    : [];
  // Apgrūtinātās teritorijas apgrutinatas_teritorijas (apvienotie or in current dok (if TP, LP, DP, LP_SUR dok.))
  const apgr = processTapis
    ? selectedTAPISDoc && PLANOSANAS_DOC_TYPES.includes(selectedTAPISDoc.get('dok_tips'))
      ? tapisIndividualie.features.filter(filterFeatureByTapisLayer('apgrutinatas_teritorijas'))
      : tapisApvienotie.features.filter(filterFeatureByTapisLayer('apgrutinatas_teritorijas'))
    : [];
  // Īpaši aizsargājamās dabas teritorijas from iadt ImageWMS in XML format?
  const visiApgr = lauks.concat(pasvCeli).concat(apgr);

  // 5. Papildus informācija
  // Zemes vienības
  // Ciemu robežas ciemu_robezas (apvienotie or in current dok (if TP dok.))
  const ciemi = processTapis
    ? selectedTAPISDoc && selectedTAPISDoc.get('dok_tips') === 'TP'
      ? tapisIndividualie.features.filter(filterFeatureByTapisLayer('ciemu_robezas'))
      : tapisApvienotie.features.filter(filterFeatureByTapisLayer('ciemu_robezas'))
    : [];
  // Pilsētu robežas planotas_teritorialas_vienibas (apvienotie or in current dok (if TP dok.))
  const pilsetas = processTapis
    ? selectedTAPISDoc && selectedTAPISDoc.get('dok_tips') === 'TP'
      ? tapisIndividualie.features.filter(filterFeatureByTapisLayer('planotas_teritorialas_vienibas'))
      : tapisApvienotie.features.filter(filterFeatureByTapisLayer('planotas_teritorialas_vienibas'))
    : [];
  // Tematiskie dati (apvienotie or in current dok (if TP, LP, DP, LP_SUR dok.)) – 7 layers:
  // riska_teritorijas
  // kulturvesturiskie_un_dabas_objekti
  // inzenierbuvju_objekti
  // riska_objekti
  // inzenierbuvju_linijveida_objekti
  // autoceli
  // inzenierbuvju_laukumveida_objekti
  const tematiskie = processTapis
    ? selectedTAPISDoc && PLANOSANAS_DOC_TYPES.includes(selectedTAPISDoc.get('dok_tips'))
      ? tapisIndividualie.features
          .filter(filterFeatureByTapisLayer('riska_teritorijas'))
          .concat(tapisIndividualie.features.filter(filterFeatureByTapisLayer('kulturvesturiskie_un_dabas_objekti')))
          .concat(tapisIndividualie.features.filter(filterFeatureByTapisLayer('inzenierbuvju_punktveida_objekti')))
          .concat(tapisIndividualie.features.filter(filterFeatureByTapisLayer('riska_objekti')))
          .concat(tapisIndividualie.features.filter(filterFeatureByTapisLayer('inzenierbuvju_linijveida_objekti')))
          .concat(tapisIndividualie.features.filter(filterFeatureByTapisLayer('autoceli')))
          .concat(tapisIndividualie.features.filter(filterFeatureByTapisLayer('inzenierbuvju_laukumveida_objekti')))
      : tapisApvienotie.features
          .filter(filterFeatureByTapisLayer('riska_teritorijas'))
          .concat(tapisApvienotie.features.filter(filterFeatureByTapisLayer('kulturvesturiskie_un_dabas_objekti')))
          .concat(tapisApvienotie.features.filter(filterFeatureByTapisLayer('inzenierbuvju_objekti')))
          .concat(tapisApvienotie.features.filter(filterFeatureByTapisLayer('riska_objekti')))
          .concat(tapisApvienotie.features.filter(filterFeatureByTapisLayer('inzenierbuvju_linijveida_objekti')))
          .concat(tapisApvienotie.features.filter(filterFeatureByTapisLayer('autoceli')))
          .concat(tapisApvienotie.features.filter(filterFeatureByTapisLayer('inzenierbuvju_laukumveida_objekti')))
    : [];

  const renderFeatureLink = (map: OlMap, feat: Feature, ending: string) => (
    <span
      className="feature-link"
      onClick={navigateToDoc((feat.getId() as String).split('.')[1])}
      title={feat.get('dok_nosaukums') || feat.get('nosaukums')}
      onMouseEnter={highlightFeature(map, feat)}
    >
      {getDocTypeName(feat, ending)}
    </span>
  );

  const getDocTypeName = (feat: Feature, ending: string) => {
    const dokTips = feat.get('dok_tips');
    return dokTips === 'LP' || dokTips === 'LP_SUR'
      ? intl.formatMessage({ id: 'planned_documents_type_LP_OR_LP_SUR' }, { ending })
      : dokTips === 'TP'
      ? intl.formatMessage({ id: 'planned_documents_type_TP' }, { ending })
      : intl.formatMessage({ id: 'planned_documents_type_DP' }, { ending });
  };

  const filterUniqueDocs = (features: Feature[]) => {
    if (!features) return Array.of<Feature>();

    const uniqueDocs: Feature[] = [];
    const seenDokTips = new Set<Feature>();

    for (const feat of features) {
      if (!seenDokTips.has(feat.get('dok_tips'))) {
        seenDokTips.add(feat.get('dok_tips'));
        uniqueDocs.push(feat);
      }
    }

    return uniqueDocs;
  };

  const onUnauthenticatedModal = () => {
    setApplyForNotificationsSessionValue({
      open: true,
      coordinate: applyForNotificationSessionValue?.coordinate,
    });
  };

  const infoTapisDocsText = useMemo(() => {
    if (!map || infoTapisDocs.length === 0) return null;

    const tps = infoTapisDocs.filter((d) => d.get('dok_tips') === 'TP');
    const lps = infoTapisDocs.filter((d) => d.get('dok_tips') === 'LP' || d.get('dok_tips') === 'LP_SUR');
    const dps = infoTapisDocs.filter((d) => d.get('dok_tips') === 'DP');

    return (
      <StyledInfoTapisDocsComponent>
        <Icon className="infoIcon" icon="circle-info" faBase="fa-regular" />
        {lps.length === 0 && dps.length === 0 ? (
          <div>
            Atzīmētajā vietā kartē prasības teritorijas izmantošanai noteiktas&nbsp;
            {tps.map((feat, i) => (
              <Fragment key={i}>
                {renderFeatureLink(map, feat, 'ā')}
                {tps.length > 1 && i < tps.length - 1 && ', '}
              </Fragment>
            ))}
          </div>
        ) : (
          <div>
            Atzīmētajā vietā kartē prasības teritorijas izmantošanai katrā funkcionālajā zonā noteiktas&nbsp;
            {dps.map((feat, i) => (
              <Fragment key={i}>
                {renderFeatureLink(map, feat, 'ā')}
                {dps.length > 1 && i < dps.length - 1 && ', '}
              </Fragment>
            ))}
            {lps.length > 0 && dps.length > 0 && ' un '}
            {lps.map((feat, i) => (
              <Fragment key={i}>
                {renderFeatureLink(map, feat, 'ā')}
                {lps.length > 1 && i < lps.length - 1 && ', '}
              </Fragment>
            ))}
            {tps.length > 0 && ', bet vispārīgās prasības '}
            {tps.map((feat, i) => (
              <Fragment key={i}>
                {renderFeatureLink(map, feat, 'ā')}
                {tps.length > 1 && i < tps.length - 1 && ', '}
              </Fragment>
            ))}
          </div>
        )}
      </StyledInfoTapisDocsComponent>
    );
  }, [map, infoTapisDocs]);

  const selectedTapisDocText = useMemo(() => {
    if (!map || !selectedTAPISDoc || !PLANOSANAS_DOC_TYPES.includes(selectedTAPISDoc.get('dok_tips'))) return null;

    return (
      <StyledInfoTapisDocsComponent>
        <Icon className="infoIcon" icon="circle-info" faBase="fa-regular" />
        {selectedTAPISDoc.get('statuss') === 'active_historical' &&
        (selectedTAPISDoc.get('dok_tips') === 'LP' || selectedTAPISDoc.get('dok_tips') === 'LP_SUR') ? (
          <div>
            Zemāk attēlota informācija ir noteikta Jūsu atvērtajā spēkā esošajā&nbsp;
            {renderFeatureLink(map, selectedTAPISDoc, 'ā')}. Bet šī {renderFeatureLink(map, selectedTAPISDoc, 'a')}
            &nbsp; risinājums vairs netiek attēlots kopējā kartē, jo šajā teritorijā ir stājies spēkā jaunāks
            Teritorijas plānojums.
          </div>
        ) : (
          <div>
            Zemāk attēlota informācija nav spēkā esoša, bet noteikta Jūsu atvērtajā&nbsp;
            {renderFeatureLink(map, selectedTAPISDoc, 'a')} redakcijā, kuras statuss ir "
            {listStatuses.find((s) => s.searchStatus === selectedTAPISDoc.get('statuss'))?.title}".
          </div>
        )}
      </StyledInfoTapisDocsComponent>
    );
  }, [map, selectedTAPISDoc]);

  const checkIfUserIsAuth = () => {
    if (!userCanAccess) {
      setShowModal(true);
      return;
    }
    const hasJwt = isTokenActive();
    showInformativeStatementUnauthenticated(!hasJwt);
    setShowUnauthenticated(!hasJwt);
    setIsModalOpen(hasJwt);
  };

  if (!map) {
    return null;
  }

  return (
    <StyledMapClickResultsComponent>
      {openedMapType === 'tapis' ? (
        <Spinner spinning={!tapisLoaded || false}>
          <>
            <div className="sub-content">
              {infoTapisDocsText}
              {selectedTapisDocText}
            </div>
            {fzs.length > 0 || tins.length > 0 ? (
              <div className="sub-content">
                <h3>
                  {fzs.length > 0 ? 'Funkcionālais zonējums' : ''} {fzs.length > 0 && tins.length > 0 ? ' un ' : ''}
                  {tins.length > 0 ? 'Teritorijas ar īpašiem noteikumiem' : ''}
                </h3>
                <ul className="list">
                  {fzs.map((fz, i) => (
                    <li key={i}>
                      <p
                        className="other-p"
                        title={fz.get('dok_ori_nos') || fz.get('dok_nos')}
                        onMouseEnter={highlightFeature(map, fz)}
                        onClick={highlightFeature(map, fz)}
                      >
                        {`${fz.get('veids')}${fz.get('indekseta') ? ' (' + fz.get('indekss') + ')' : ''}`}
                      </p>
                    </li>
                  ))}
                  {tins.map((t, i) => (
                    <li key={i}>
                      <p
                        className="other-p"
                        title={t.get('dok_ori_nos') || t.get('dok_nos')}
                        onMouseEnter={highlightFeature(map, t)}
                        onClick={highlightFeature(map, t)}
                      >
                        {`${t.get('veids')} (${t.get('indekss')})`}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {visiApgr.length > 0 ||
            nio.length > 0 ||
            (tapisIADT && (tapisIADT.loading || tapisIADT.errorMsg || tapisIADT.features.length > 0)) ? (
              <div className="sub-content">
                <h3>Apgrūtinātās teritorijas</h3>
                <ul className="list">
                  {nio.map((ap, i) => (
                    <li key={i}>
                      <p
                        className="feature-link"
                        onClick={navigateToDoc(ap.get('dok_id') as String)}
                        title={`${formatFeatureTitle(ap)}\nAktualizēts : ${dayjs(ap.get('dok_datums_no'))?.format(
                          'DD.MM.YYYY.'
                        )}`}
                        onMouseEnter={highlightFeature(map, ap)}
                      >
                        {ap.get('veids')}
                      </p>
                    </li>
                  ))}
                  {visiApgr.map((ap, i) => (
                    <li key={i}>
                      <p
                        className="other-p"
                        onMouseEnter={highlightFeature(map, ap)}
                        onClick={highlightFeature(map, ap)}
                        title={`${formatFeatureTitle(ap)}\nAktualizēts : ${dayjs(ap.get('dok_datums_no'))?.format(
                          'DD.MM.YYYY.'
                        )}`}
                      >
                        {ap.get('veids')}
                      </p>
                    </li>
                  ))}
                  {tapisIADT ? (
                    <>
                      {tapisIADT.errorMsg || null}
                      {tapisIADT.features.map((f, i) => (
                        <li key={i}>
                          <p
                            className="other-p"
                            title={
                              f.get('Nosaukums') ||
                              f.get('ĪADTnosaukums') ||
                              f.get('ATIS_veids') ||
                              f.get('Ä¢intslatv.') ||
                              f.get('ATISkods')
                            }
                            onMouseEnter={highlightFeature(map, f)}
                            onClick={highlightFeature(map, f)}
                          >
                            {f.get('Kategorija') ||
                              f.get('ĪADTkategorija') ||
                              f.get('Nosaukums') ||
                              f.get('ĪADTnosaukums') ||
                              f.get('ATIS_veids') ||
                              f.get('Ä¢intslatv.') ||
                              f.get('ATISkods')}
                          </p>
                        </li>
                      ))}
                    </>
                  ) : null}
                </ul>
              </div>
            ) : null}
            {ciemi.length > 0 ||
            pilsetas.length > 0 ||
            tematiskie.length > 0 ||
            (tapisParcels && (tapisParcels.loading || tapisParcels.errorMsg || tapisParcels.features.length > 0)) ? (
              <div className="sub-content">
                <h3>Papildu informācija</h3>
                <ul className="list">
                  {tapisParcels ? (
                    <>
                      {tapisParcels.errorMsg || null}
                      {tapisParcels.features.map((f, i) => (
                        <li key={i}>
                          <p
                            title={`Zemes vienība: ${f.get('code')}`}
                            onMouseEnter={highlightFeature(map, f)}
                            onClick={highlightFeature(map, f)}
                          >
                            {`Zemes vienība: ${f.get('code')} `}
                            {!!f.get('code') && (
                              <>
                                (
                                <a
                                  className="link"
                                  title="Vairāk informācijas portālā www.kadastrs.lv"
                                  target="_blank"
                                  href={`https://www.kadastrs.lv/parcels/search?cad_num=${f.get('code')}`}
                                >
                                  skatīt papildu informāciju
                                </a>
                                )
                              </>
                            )}
                          </p>
                        </li>
                      ))}
                    </>
                  ) : null}
                  {ciemi.map((f, i) => (
                    <li key={i}>
                      <p
                        className="other-p"
                        title={f.get('dok_ori_nos') || f.get('dok_nos')}
                        onMouseEnter={highlightFeature(map, f)}
                        onClick={highlightFeature(map, f)}
                      >
                        {`Ciems "${f.get('nosaukums')}"`}
                      </p>
                    </li>
                  ))}
                  {pilsetas.map((f, i) => (
                    <li key={i}>
                      <p
                        className="other-p"
                        title={f.get('dok_ori_nos') || f.get('dok_nos')}
                        onMouseEnter={highlightFeature(map, f)}
                        onClick={highlightFeature(map, f)}
                      >
                        {`Pilsēta "${f.get('nosaukums')}"`}
                      </p>
                    </li>
                  ))}
                  {tematiskie.map((f, i) => (
                    <li key={i}>
                      <p
                        className="other-p"
                        title={formatFeatureTitle(f)}
                        onMouseEnter={highlightFeature(map, f)}
                        onClick={highlightFeature(map, f)}
                      >
                        {f.get('veids')}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <SmallerTooltipWrapper>
              <Tooltip
                hack
                title={
                  <SmallerTooltipTitleWrapper>
                    {userCanAccess || !isTokenActive()
                      ? intl.formatMessage({ id: 'information_notice' })
                      : intl.formatMessage({ id: 'information_not_allowed' })}
                  </SmallerTooltipTitleWrapper>
                }
              >
                <div className="button-container">
                  <Button
                    disabled={user.name !== '' && !userCanAccess && isTokenActive()}
                    className="more-info-button button"
                    type="text"
                    label={intl.formatMessage({ id: 'notification.get_more_info' })}
                    onClick={() => checkIfUserIsAuth()}
                  />
                </div>
              </Tooltip>
            </SmallerTooltipWrapper>
            {izstrTapisDocs.map((feat, i) => (
              <StyledInfoTapisDocsComponent className="mt-5" key={i}>
                <Icon className="infoIcon" icon="circle-info" faBase="fa-regular" />
                <div className="sub-content">
                  Pievērsiet uzmanību tam, ka atzīmētajā vietā kartē norit jauna&nbsp;
                  {renderFeatureLink(map, feat, 'a')}
                  &nbsp;izstrāde
                </div>
              </StyledInfoTapisDocsComponent>
            ))}
            <SmallerTooltipWrapper>
              <Tooltip
                hack
                title={
                  <SmallerTooltipTitleWrapper>
                    {userCanAccess || !isTokenActive()
                      ? intl.formatMessage({ id: 'notification_notice' })
                      : intl.formatMessage({ id: 'notification_not_allowed' })}
                  </SmallerTooltipTitleWrapper>
                }
              >
                <div className="button-container">
                  <Button
                    disabled={user.name !== '' && !userCanAccess && isTokenActive()}
                    className="notification-button button"
                    type="text"
                    label={intl.formatMessage({ id: 'notification.subscribe' })}
                    onClick={onReceiveMoreInfo}
                  />
                </div>
              </Tooltip>
            </SmallerTooltipWrapper>
            <UnauthenticatedModal
              additionalOnOkExecution={onUnauthenticatedModal}
              setShowModal={setShowUnauthenticated}
              showModal={showUnauthenticated}
            />
          </>
        </Spinner>
      ) : (
        <StyledGeoResponseResultsComponent>
          <Spinner spinning={responses.some((r) => r.loading)}>
            {responses
              .filter((r) => !r.tapis && (r.loading || r.features.length > 0 || !!r.errorMsg))
              .map((r, i) => (
                <div className="item" key={i}>
                  <p>
                    <b>{r.layerTitle}</b>
                  </p>
                  {r.errorMsg || null}
                  {r.features.map((feat, i2) => (
                    <div
                      className="grid grid-cols-2"
                      key={i2}
                      onMouseEnter={highlightFeature(map, feat)}
                      onClick={highlightFeature(map, feat)}
                    >
                      {getTranslatedFeatureProperties(feat, intl, r.layerId).map((prop, i3) => (
                        <Fragment key={i3}>
                          <span className="field-name">{prop[0]}:</span>
                          <span>{prop[1]}</span>
                        </Fragment>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
          </Spinner>
        </StyledGeoResponseResultsComponent>
      )}
      <UnauthenticatedModal setShowModal={setShowModal} showModal={showModal} />
    </StyledMapClickResultsComponent>
  );
};

export default MapClickResults;
