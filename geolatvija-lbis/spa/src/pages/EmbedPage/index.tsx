import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { SidebarDrawer } from 'ui';
import { StyledEmbedPage, StyledContent } from 'styles/layout/SidebarMap';
import { MapComponent } from 'components/Map/MapComponent';
import { LayerSettings } from 'components/Map/LayerSettings';
import { getEmptyOlMap } from 'utils/mapUtils';
import MapContext from 'contexts/MapContext';
import useQueryApiClient from '../../utils/useQueryApiClient';
import { useSearchParams } from 'react-router-dom';
import { LayerSwitcher } from 'components/Map/LayerSwitcher';
import { useOpenedTypeDispatch } from '../../contexts/OpenedTypeContext';
import { applyEmbedMapState, addMarkers, getMarkersLayer } from 'utils/embedMapUtils';
import EmbedOpenButton from 'components/Map/EmbedOpenButton';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import OlInteractionSelect from 'ol/interaction/Select';
import OlFeature from 'ol/Feature';
import { CollectionEvent } from 'ol/Collection';
import OlPoint from 'ol/geom/Point';
import axios from 'axios';
import { routes } from '../../config/config';
import GeoJSON from 'ol/format/GeoJSON';
import { Extent, extend, createEmpty, isEmpty } from 'ol/extent';

const olMap = getEmptyOlMap(false);

const GeoJSONFormat = new GeoJSON();

const EmbedPage = () => {
  const [selectedUserEmbed, setSelectedUserEmbed] = useState<string | null>(null);
  const [isOpenLayerSettings, setIsOpenLayerSettings] = useState<boolean>(false);
  const [visibleLayers, setVisibleLayers] = useState<string[] | undefined>(undefined);

  const [mapApiParentDomain, setMapApiParentDomain] = useState<string | null>(null);
  const [mapApiIframeId, setMapApiIframeId] = useState<string | null>(null);
  const [mapApiEventSource, setMapApiEventSource] = useState<Window | null>(null);

  const dispatch = useOpenedTypeDispatch();

  let [searchParams] = useSearchParams();
  const intl = useIntl();

  useEffect(() => {
    if (searchParams.get('id')) {
      setSelectedUserEmbed(searchParams.get('id'));
    }
  }, [searchParams]);

  const { data } = useQueryApiClient({
    request: {
      url: `api/v1/user-embeds/${selectedUserEmbed}/uuid`,
      disableOnMount: !selectedUserEmbed,
    },
  });

  useEffect(() => {
    if (olMap && data?.data) {
      //const test =
      //  '{"visibleLayers":["home->base->osm","home->_geoproduct_layer_https://dpps-test.esynergy.lv/api/DPPSPackage/client/LV_geoprod_583_KNkQ0w/c63f8631-a34d-4c9b-ac72-9fadc47cd11f"],"center":[508600.19837815844,311633.5260020369],"zoom":5,"isTapis":false,"geoproductLayers":[{"id":"_geoproduct_layer_https://dpps-test.esynergy.lv/api/DPPSPackage/client/LV_geoprod_583_KNkQ0w/c63f8631-a34d-4c9b-ac72-9fadc47cd11f_embed","title":"\\"Datu izplatīšanas veida apraksts\\" slāņi","queryable":true,"geoLayerItems":[{"key":"main-key","title":"Kartes slāņi","children":[{"key":"0","title":"GIS.OZOLS.GIS_OZOLS_Microres_buffer_PUB"},{"key":"1","title":"GIS.OZOLS.GIS_OZOLS_Microreserves_PUB"},{"key":"2","title":"ĪADT zonējums"},{"key":"3","title":"ĪADT - pamatteritorijas"},{"key":"4","title":"ĪADT - aizsargājamie koki"}]}],"infoFormat":"application/geojson","LAYERS":"3","STYLES":"","FORMAT":"image/png8","projection":"EPSG:3059","url":"https://dpps-test.esynergy.lv/api/DPPSPackage/client/LV_geoprod_583_KNkQ0w/c63f8631-a34d-4c9b-ac72-9fadc47cd11f"}],"markers":[{"uuid":"7ee88e3f-4979-4890-879e-986f693f4485","coord":[509617.3993057888,311029.9957422425],"color":"#d71d47","description":"ir apraksts"},{"uuid":"04f354dc-7857-4f1d-aa1b-7b41fed5e2ed","coord":[509715.481370443,312062.079512139],"color":"#00ffa6"}],"version":1}';
      //const embedData = JSON.parse(test);
      const embedData = JSON.parse(data.data);
      const visibleLayers = applyEmbedMapState(olMap, embedData, dispatch);
      setVisibleLayers(visibleLayers);
    }
  }, [olMap, data]);

  // handle initial Map API message "mapApiOnLoad" and register in the react state the caller
  useEffect(() => {
    const handleEmbededMapApiInitialCall = (event: MessageEvent) => {
      const { origin, source, data } = event;
      if (data?.mapApiAction === 'mapApiOnLoad') {
        setMapApiParentDomain(origin);
        setMapApiIframeId(data.frameId);
        setMapApiEventSource(source as Window);
        window.removeEventListener('message', handleEmbededMapApiInitialCall);
      }
    };

    window.addEventListener('message', handleEmbededMapApiInitialCall);

    return () => {
      window.removeEventListener('message', handleEmbededMapApiInitialCall);
    };
  }, []);

  // everything loaded
  useEffect(() => {
    if (olMap && visibleLayers) {
      // if we have everything send MAP_LOADED and register for message events
      if (mapApiParentDomain && mapApiIframeId && mapApiEventSource) {
        const onMapClick = (olEvt: OlMapBrowserEvent<MouseEvent>) => {
          //eliminate marker clicks:
          const markerLayer = getMarkersLayer(olMap);
          const hit = olMap.forEachFeatureAtPixel(olEvt.pixel, (f, layer) => layer === markerLayer);
          if (!hit) {
            const msg = {
              mapEvent: 'onMapClick',
              frameId: mapApiIframeId,
              params: olEvt.coordinate,
            };
            mapApiEventSource.postMessage(msg, mapApiParentDomain);
          }
        };
        const onAnyMarkerClick = (fromAPI: boolean, mapEvent: string) => (ce: CollectionEvent<OlFeature>) => {
          if ((fromAPI && ce.element.get('fromAPI') === true) || (!fromAPI && ce.element.get('fromAPI') !== true)) {
            const msg = {
              mapEvent,
              frameId: mapApiIframeId,
              params: [
                ...(ce.element.getGeometry() as OlPoint).getCoordinates(),
                [
                  {
                    DESCRIPTION: ce.element.get('description'),
                    COLOR: ce.element.get('color'),
                    UUID: ce.element.get('uuid'),
                  },
                ],
              ],
            };
            mapApiEventSource.postMessage(msg, mapApiParentDomain);
          }
        };
        const onMarkerClick = onAnyMarkerClick(true, 'onMarkerClick');
        const onApplicationMarkerClick = onAnyMarkerClick(false, 'onApplicationMarkerClick');

        const handleEmbededMapApiCall = (event: MessageEvent) => {
          const { data, origin } = event;
          if (origin !== mapApiParentDomain) return;
          if (!data || !data.mapApiAction) return;

          const { params, mapApiAction } = data;

          const selectFeatureCollection = (
            getMarkersLayer(olMap).get('selectInteraction') as OlInteractionSelect
          ).getFeatures();

          switch (mapApiAction) {
            case 'REGISTER_FOR_EVENT': {
              //register to map events
              if (params && params[0]) {
                switch (params[0]) {
                  case 'onMapClick': {
                    olMap.on('click', onMapClick);
                    break;
                  }
                  case 'onMarkerClick': {
                    selectFeatureCollection.on('add', onMarkerClick);
                    break;
                  }
                  case 'onApplicationMarkerClick': {
                    selectFeatureCollection.on('add', onApplicationMarkerClick);
                    break;
                  }
                  case 'onAddressClick': {
                    //TODO
                    // ja klikšķina uz adreses vai admin teritorijas
                    break;
                  }
                }
              }
              break;
            }
            case 'UNREGISTER_FOR_EVENT': {
              //unregister from map events
              if (params && params[0]) {
                switch (params[0]) {
                  case 'onMapClick': {
                    olMap.un('click', onMapClick);
                    break;
                  }
                  case 'onMarkerClick': {
                    selectFeatureCollection.un('add', onMarkerClick);
                    break;
                  }
                  case 'onApplicationMarkerClick': {
                    selectFeatureCollection.un('add', onApplicationMarkerClick);
                    break;
                  }
                  case 'onAddressClick': {
                    //TODO
                    break;
                  }
                }
              }
              break;
            }
            case 'ZOOM_TO_POINT': {
              //zoom map to coordinates
              olMap.getView().setCenter(params);
              break;
            }
            case 'ZOOM_TO_ADDRESS': {
              //zoom map to address
              if (params && params[0] && Array.isArray(params[0])) {
                const commonWFSRequestParams = {
                  request: 'GetFeature',
                  service: 'WFS',
                  version: '2.0.0',
                  outputFormat: 'application/json',
                };
                const url = `${routes.api.baseUrl}/geoserver/vraa/wfs`;

                //ATVK requests
                const atvkResp = (params[0] as string[]).flatMap((atvk) =>
                  ['pilsetas', 'novadi', 'pagasti'].map((layer) =>
                    axios.get(url, {
                      params: {
                        ...commonWFSRequestParams,
                        cql_filter: `atrib='${atvk}'`,
                        typename: layer,
                      },
                    })
                  )
                );

                //addreses requests
                const addrResp =
                  params[1] && Array.isArray(params[1])
                    ? (params[1] as string[]).map((code) =>
                        axios.get(url, {
                          params: {
                            ...commonWFSRequestParams,
                            cql_filter: `kods='${code}'`,
                            typename: 'ekas',
                          },
                        })
                      )
                    : [];

                Promise.all([...atvkResp, ...addrResp]).then((responses) => {
                  const features = responses.flatMap((resp) => {
                    if (resp?.['data']?.['features']?.length > 0) {
                      return GeoJSONFormat.readFeatures(resp?.['data']);
                    }
                    return [];
                  });

                  //zoom map to all features
                  if (features.length > 0) {
                    const extent = features.reduce(
                      (extent, f) =>
                        extend(extent, f.getGeometry() ? (f.getGeometry()?.getExtent() as Extent) : createEmpty()),
                      createEmpty()
                    );
                    if (!isEmpty(extent)) {
                      olMap.getView().fit(extent, {
                        duration: 800,
                        maxZoom: 8,
                      });
                    }
                  }
                });
              }
              break;
            }
            case 'ENABLE_ADDRESS_POPUPS': {
              //show address point popups
              //TODO
              throw Error('not implemented');
            }
            case 'SHOW_MARKERS': {
              //show markers on map
              if (params && params[0] && Array.isArray(params[0])) {
                const markers = (params[0] as Array<any>).map((m) => ({
                  coord: [m.x, m.y],
                  description: m.description,
                  color: m.color,
                  fromAPI: true,
                }));
                addMarkers(olMap, markers);
              }
              break;
            }
            case 'ENABLE_MARKER_POPUPS': {
              //enable popups for markers added with API
              if (params && params.length > 0) {
                getMarkersLayer(olMap).set('EnableMarkerPopups', params[0]);
              }
              break;
            }
            case 'ENABLE_APPLICATION_MARKER_POPUPS': {
              //enable popups for markers which where added in geolatvija while creating embeded map
              if (params && params.length > 0) {
                getMarkersLayer(olMap).set('EnableApplicationMarkerPopups', params[0]);
              }
              break;
            }
          }
        };

        window.addEventListener('message', handleEmbededMapApiCall);

        const msg = {
          mapEvent: 'MAP_LOADED',
          frameId: mapApiIframeId,
        };
        mapApiEventSource.postMessage(msg, mapApiParentDomain);

        return () => {
          window.removeEventListener('message', handleEmbededMapApiCall);
        };
      } else {
        // if nobody has sent mapApiOnLoad message then send MAP_INIT
        window.parent.postMessage({ mapEvent: 'MAP_INIT' }, '*');
      }
    }
  }, [olMap, visibleLayers, mapApiParentDomain, mapApiIframeId, mapApiEventSource]);

  if (!selectedUserEmbed) {
    return null;
  }

  return (
    <MapContext.Provider value={olMap}>
      {visibleLayers ? (
        <StyledEmbedPage>
          <SidebarDrawer
            title={intl.formatMessage({ id: 'layer_settings.map_layers' })}
            isOpen={isOpenLayerSettings}
            onClose={() => setIsOpenLayerSettings(false)}
          >
            <LayerSettings visibleLayers={visibleLayers} />
          </SidebarDrawer>
          <StyledContent>
            <MapComponent embeded>
              <LayerSwitcher setIsOpenLayerSettings={setIsOpenLayerSettings} visibleLayers={visibleLayers} />
              <EmbedOpenButton uuid={selectedUserEmbed} />
            </MapComponent>
          </StyledContent>
        </StyledEmbedPage>
      ) : null}
    </MapContext.Provider>
  );
};

export default EmbedPage;
