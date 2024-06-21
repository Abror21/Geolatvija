import { Coordinate } from 'ol/coordinate';
import OlMap from 'ol/Map';
import LayerGroup from 'ol/layer/Group';
import {
  HOME_LAYER_GROUP,
  BASE_LAYER_GROUP,
  PROJ_WEB,
  getZoomFromScale,
  getIconStyle,
  isGeoproductLayer,
} from './mapUtils';
import OlPoint from 'ol/geom/Point';
import { Dispatch } from 'contexts/OpenedTypeContext';
import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import { routes } from '../config/config';
import OlFeature from 'ol/Feature';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlGeometry from 'ol/geom/Geometry';
import OlStyle, { StyleFunction } from 'ol/style/Style';
import Select from 'ol/interaction/Select';
import OlOverlay from 'ol/Overlay';
import { Color } from 'antd/es/color-picker';
import { COLORS } from '../styles/globals';
import { Image as ImageLayer } from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import type { DataNode } from 'antd/es/tree';
import BaseLayer from 'ol/layer/Base';

// json object with current map state, markers... for saving in user embeds and applying in embed page
interface EmbededMapDataType {
  visibleLayers?: string[];
  center?: Coordinate | undefined;
  zoom?: number;
  isTapis?: boolean;
  tapisDokId?: number;
  version?: number;
  markers?: MarkerType[];
  geoproductLayers?: GeoproductLayerDataType[];
}

interface GeoproductLayerDataType {
  title?: string;
  id: string;
  queryable?: boolean;
  geoLayerItems: DataNode[];
  infoFormat?: string;
  LAYERS: string;
  STYLES: string;
  FORMAT: string;
  projection: string | undefined;
  url: string | undefined;
}

interface OldGeolatvijaServiceType {
  id: string;
  visible: boolean;
}

interface MarkerType {
  coord: Coordinate;
  color?: Color | string;
  description?: string;
  uuid?: string;
  fromAPI?: boolean;
}

const MARKERS_LAYERNAME = '_embed_markers_layer';

// recursively get currently visible layers in layer group
const getVisibleLayerKeys = (lg: LayerGroup, path: string): string[] => {
  if (lg.get('singleLayer')) {
    if (lg.getVisible()) {
      return [path];
    }
    return [];
  } else {
    return lg
      .getLayers()
      .getArray()
      .flatMap((l) =>
        l.get('id')
          ? l instanceof LayerGroup
            ? getVisibleLayerKeys(l, `${path}->${l.get('id')}`)
            : l.getVisible()
            ? [`${path}->${l.get('id')}`]
            : []
          : []
      );
  }
};

const filterVisibleGeoproductLayers = (l: BaseLayer): boolean => isGeoproductLayer(l) && l.getVisible();

const filterByIncludableInEmbed =
  (isIcludable: boolean) =>
  (l: BaseLayer): boolean =>
    (l as ImageLayer<ImageWMS>).get('includableInEmbed') === isIcludable;

export const getNonIncludableInEmbedGeoproductLayers = (map: OlMap): string[] =>
  map
    .getLayers()
    .getArray()
    .filter(filterVisibleGeoproductLayers)
    .filter(filterByIncludableInEmbed(false))
    .map((l) => l.get('title'));

const getGeoproductLayers = (map: OlMap): GeoproductLayerDataType[] => {
  return map
    .getLayers()
    .getArray()
    .filter(filterVisibleGeoproductLayers)
    .filter(filterByIncludableInEmbed(true))
    .map((l) => {
      const source = (l as ImageLayer<ImageWMS>).getSource();
      return {
        id: `${l.get('id')}_embed`,
        title: l.get('title'),
        queryable: l.get('queryable'),
        geoLayerItems: l.get('geoLayerItems'),
        infoFormat: l.get('infoFormat'),
        LAYERS: source?.getParams()?.LAYERS,
        STYLES: source?.getParams()?.STYLES,
        FORMAT: source?.getParams()?.FORMAT,
        projection: source?.getProjection()?.getCode(),
        url: source?.getUrl(),
      };
    });
};

const applyGeoproductLayers = (map: OlMap, geoproductLayers: GeoproductLayerDataType[]) => {
  geoproductLayers.forEach((l) => {
    map.addLayer(
      new ImageLayer({
        properties: {
          id: l.id,
          geoLayerItems: l.geoLayerItems,
          title: l.title,
          queryable: l.queryable,
          infoFormat: l.infoFormat,
        },
        zIndex: 10,
        visible: true,
        source: new ImageWMS({
          attributions: '',
          projection: l.projection,
          url: l.url,
          params: {
            LAYERS: l.LAYERS,
            STYLES: l.STYLES,
            FORMAT: l.FORMAT,
          },
        }),
      })
    );
  });
};

// get currently visible map layers
export const getCurrentLayerVisibilityState = (map: OlMap) =>
  getVisibleLayerKeys(map.getLayerGroup(), HOME_LAYER_GROUP);

// get map state for user embeds
export const getCurrentMapState = (map: OlMap, openedType: any): EmbededMapDataType => ({
  visibleLayers: getCurrentLayerVisibilityState(map),
  center: map.getView().getCenter(),
  zoom: map.getView().getZoom(),
  isTapis: openedType.openedMapType === 'tapis',
  tapisDokId: openedType.selectedTapisDocument?.dok_id,
  geoproductLayers: openedType.openedMapType === 'tapis' ? [] : getGeoproductLayers(map),
  markers: getMarkers(map),
  version: 1,
});

// parse and apply embed map state from json data
export const applyEmbedMapState = (map: OlMap, jsonData: any, dispatch: Dispatch): string[] => {
  let embedData: EmbededMapDataType;
  const view = map.getView();
  if (jsonData.version === 1) {
    embedData = jsonData as EmbededMapDataType;
  } else {
    //assume old geolatvija data
    const isTapis = jsonData.map.wkid === 3059;
    const pos = jsonData.map.initialPosition;
    const center = new OlPoint([pos.x, pos.y]);
    let visibleLayers = ['initial'];
    if (!isTapis) {
      center.transform(PROJ_WEB, view.getProjection());
      visibleLayers =
        (jsonData.services as OldGeolatvijaServiceType[]).filter((s) => s.id.startsWith('Pamata') && s.visible).length >
        0
          ? [`${HOME_LAYER_GROUP}->${BASE_LAYER_GROUP}->topo`]
          : visibleLayers;
    }
    embedData = {
      isTapis,
      center: center.getCoordinates(),
      zoom: getZoomFromScale(pos.scale),
      visibleLayers,
    };
  }
  // dispatch Tapis vs GeoProduct
  dispatch({ type: embedData.isTapis ? 'OPENED_TAPIS' : 'OPEN_GEOPRODUCT' });

  // dispatch selected planned document
  if (embedData.isTapis && embedData.tapisDokId) {
    const errMsg = 'Plānošanas dokumenta kartes slāņus nevarēja attēlot!';
    axios
      .get(`${routes.api.baseUrl}/api/v1/tapis/planned-documents/${embedData.tapisDokId}`)
      .then((response: AxiosResponse) => {
        if (response.status !== 200) {
          //show error
          message.error(errMsg, 15);
        }
        dispatch({
          type: 'SELECT_TAPIS_DOCUMENT',
          payload: {
            selectedTapisDocument: {
              ...response.data,
              zoomMapToDocument: false,
              dok_id: embedData.tapisDokId,
              layerGroup: new LayerGroup({
                properties: {
                  id: 'tapis_indiv_layers',
                  title: 'Plānošanas dokumenta slāņi',
                },
              }),
            },
          },
        });
      })
      .catch((error: any) => {
        //show error
        message.error(errMsg, 15);
      });
  } else {
    dispatch({ type: 'UNSELECT_TAPIS_DOCUMENT' });
  }
  // center and zoom map
  if (embedData.center) {
    view.setCenter(embedData.center);
  }
  if (embedData.zoom) {
    view.setZoom(embedData.zoom);
  }
  if (embedData.markers) {
    replaceMarkers(map, embedData.markers);
  }
  if (embedData.geoproductLayers) {
    applyGeoproductLayers(map, embedData.geoproductLayers);
  }
  // return layerVisibility for use in layer components
  return embedData.visibleLayers || [];
};

export const addMarkers = (map: OlMap, markers: MarkerType[]) => {
  const features = markers.map(
    (m) =>
      new OlFeature({
        geometry: new OlPoint(m.coord),
        description: m.description,
        color: (typeof m.color === 'string' ? m.color : m.color?.toHexString()) ?? COLORS.brand02,
        uuid: m.uuid,
        fromAPI: m.fromAPI,
      })
  );
  (getMarkersLayer(map).getSource() as OlSourceVector<OlPoint>).addFeatures(features);
};

export const replaceMarkers = (map: OlMap, markers: MarkerType[]) => {
  clearMarkers(map);
  addMarkers(map, markers);
};

export const clearMarkers = (map: OlMap) => {
  // clear layer
  (getMarkersLayer(map).getSource() as OlSourceVector<OlPoint>).clear();
  const popups = map.getOverlayById('embeded_marker_popups');
  if (popups) popups.setPosition(undefined);
};

export const getMarkers = (map: OlMap): MarkerType[] => {
  return (getMarkersLayer(map).getSource() as OlSourceVector<OlPoint>).getFeatures().map((f) => {
    const props = f.getProperties();
    return {
      coord: (f.getGeometry() as OlPoint).getCoordinates(),
      description: props.description,
      color: props.color,
      uuid: props.uuid,
    };
  });
};

//cache marker styles
const cachedMarkerStyles: any = {};
const createMarkerStyleFunc = ({ selected = false }): StyleFunction => {
  //return style function based on feature color
  return (feature) => {
    const color = feature.get('color') || 'rgba(70, 70, 70, 1.0)';
    const key = `${selected ? 'T' : 'F'}_${color}`;
    if (!cachedMarkerStyles[key]) {
      cachedMarkerStyles[key] = new OlStyle({
        image: getIconStyle('marker', color, '', 0, selected ? 1.6 : 1.4),
      });
    }
    return cachedMarkerStyles[key] as OlStyle;
  };
};

export const getMarkersLayer = (map: OlMap): OlLayerVector<OlSourceVector<OlGeometry>> => {
  let markersLayer = map
    .getLayers()
    .getArray()
    .find((l) => l.get('name') === MARKERS_LAYERNAME);
  if (!markersLayer) {
    // add markers layer
    markersLayer = new OlLayerVector({
      properties: {
        name: MARKERS_LAYERNAME,
      },
      source: new OlSourceVector<OlPoint>(),
      style: createMarkerStyleFunc({}),
      zIndex: 100,
    });
    map.addLayer(markersLayer);

    // add popup html elements
    const container = document.createElement('div');
    container.className = 'ol-popup';
    const closer = document.createElement('a');
    closer.className = 'ol-popup-closer';
    closer.href = '#';
    const content = document.createElement('div');
    container.appendChild(closer);
    container.appendChild(content);

    // add popup overlay
    const popupOverlay = new OlOverlay({
      id: 'embeded_marker_popups',
      element: container,
      offset: [0, -32],
      positioning: 'bottom-left',
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    map.addOverlay(popupOverlay);

    // add select interaction
    const selectInteraction = new Select({
      layers: [markersLayer as OlLayerVector<OlSourceVector<OlGeometry>>],
      style: createMarkerStyleFunc({ selected: true }),
    });
    markersLayer.set('selectInteraction', selectInteraction);
    map.addInteraction(selectInteraction);
    selectInteraction.on('select', (e) => {
      e.stopPropagation();
      popupOverlay.setPosition(undefined);
      if (e.selected.length > 0 && popupOverlay.getElement()) {
        const marker = e.selected[0];
        const desc = (marker.get('description') || '').replace(/(?:\r\n|\r|\n)/g, '<br/>');
        const fromAPI = marker.get('fromAPI');
        if (
          desc.length > 0 &&
          ((markersLayer?.get('EnableMarkerPopups') !== false && fromAPI === true) ||
            (markersLayer?.get('EnableApplicationMarkerPopups') !== false && fromAPI !== true))
        ) {
          content.innerHTML = desc;
          popupOverlay.setPosition((e.selected[0].getGeometry() as OlPoint).getCoordinates());
        }
      }
    });
    // popup closer click
    closer.onclick = () => {
      popupOverlay.setPosition(undefined);
      selectInteraction.getFeatures().clear();
      return false;
    };
    // and pointer cursor
    map.on('pointermove', function (evt) {
      var hit = map.forEachFeatureAtPixel(evt.pixel, function (f, layer) {
        return layer === markersLayer;
      });
      if (hit) {
        map.getTargetElement().style.cursor = 'pointer';
      } else {
        map.getTargetElement().style.cursor = '';
      }
    });
  }
  return markersLayer as OlLayerVector<OlSourceVector<OlGeometry>>;
};
