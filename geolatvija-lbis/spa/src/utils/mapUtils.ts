import OlMap from 'ol/Map';
import OlView from 'ol/View';
import Tile from 'ol/layer/Tile';
import { Image as ImageLayer } from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import LayerGroup from 'ol/layer/Group';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import WMTS from 'ol/source/WMTS';
import { optionsFromCapabilities } from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import { register } from 'ol/proj/proj4.js';
import proj4 from 'proj4';
import * as proj from 'ol/proj.js';
import { addCoordinateTransforms } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import { defaults as defaultControls, FullScreen, ScaleLine, Attribution } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import { getArea, getLength } from 'ol/sphere';
import { routes } from 'config/config';
import Source from 'ol/source/Source';
import { TileCoord } from 'ol/tilecoord';
import { Extent, getTopLeft, getSize } from 'ol/extent';
import { toSize } from 'ol/size';
import GML3 from 'ol/format/GML3';
import OlGeometry from 'ol/geom/Geometry';
import Icon from 'ol/style/Icon';
import { icons } from './mapIcons';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlStyleStyle from 'ol/style/Style';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleFill from 'ol/style/Fill';
import OlStyleCircle from 'ol/style/Circle';
import { getVectorContext } from 'ol/render.js';
import { unByKey } from 'ol/Observable.js';
import RenderEvent from 'ol/render/Event';
import OlFeature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import BaseLayer from 'ol/layer/Base';
import axios, { AxiosResponse } from 'axios';
import { extend, createEmpty, isEmpty } from 'ol/extent';

export interface MapLegendType {
  title: string | null;
  url: string;
}

export const HOME_LAYER_GROUP = 'home';
export const BASE_LAYER_GROUP = 'base';
const GEOSERVER_URL = routes.geo.geoserverUrl;
const TAPIS_WMTS_URL = routes.geo.tapisWMTSUrl;
const DAP_URL = routes.geo.dapUrl;
const DAP_WMS_URL = `${DAP_URL}/arcgis/services/ATIS/MapServer/WMSServer`;
const TAPIS_PROXY_URL = `${routes.api.baseUrl}/api/v1/tapis/`;
const HIGHLIGHT_LAYERNAME = '_highlight_layer';
export const ANOTACIJAS_LAYER_ID = 'anotacijas';
export const ANOTACIJAS_LAYER_ZINDEX = 50;
export const REGLAMENTETIE_ZINDEX = -5;
export const GEOPRODUCT_LAYER_PREFIX = '_geoproduct_layer_';

const GeoJSONFormat = new GeoJSON();
const GML3Format = new GML3();

// LKS92 / Latvia TM
proj4.defs(
  'EPSG:3059',
  '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=-6000000 +ellps=GRS80 ' +
    '+towgs84=0,0,0,0,0,0,0 +units=m +no_defs +axis=neu'
);
// LKS92 / Latvia TM with reverse coordinates
proj4.defs(
  'EPSG:3059R',
  '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=-6000000 +ellps=GRS80 ' +
    '+towgs84=0,0,0,0,0,0,0 +units=m +no_defs +axis=neu'
);
register(proj4);

export const PROJ_GPS = proj.get('EPSG:4326') as proj.ProjectionLike;
export const PROJ_WEB = proj.get('EPSG:3857') as proj.ProjectionLike;
export const PROJ_LKS = proj.get('EPSG:3059') as proj.ProjectionLike;
export const PROJ_LKSR = proj.get('EPSG:3059R') as proj.ProjectionLike;

export const infoFormats: { [key: string]: GeoJSON | GML3 } = {
  'application/json': GeoJSONFormat,
  'application/geojson': GeoJSONFormat,
  'text/xml; subtype=gml/3.1.1': GML3Format,
  'application/vnd.ogc.gml/3.1.1': GML3Format,
  'text/xml': GML3Format,
};

const wmtsCapabilities = {
  version: '1.0.0',
  Contents: {
    Layer: [
      {
        Title: 'Administratīvās teritorijas TAPIS kartei',
        Identifier: 'vraa:tapis_admin_ter',
        Style: [
          {
            Identifier: '',
            isDefault: true,
          },
        ],
        Format: ['image/png8'],
        TileMatrixSetLink: [
          {
            TileMatrixSet: 'lks92',
            TileMatrixSetLimits: [
              {
                TileMatrix: 'lks92:0',
                MinTileRow: 0,
                MaxTileRow: 1,
                MinTileCol: 0,
                MaxTileCol: 2,
              },
              {
                TileMatrix: 'lks92:1',
                MinTileRow: 0,
                MaxTileRow: 2,
                MinTileCol: 0,
                MaxTileCol: 4,
              },
              {
                TileMatrix: 'lks92:2',
                MinTileRow: 0,
                MaxTileRow: 4,
                MinTileCol: 0,
                MaxTileCol: 9,
              },
              {
                TileMatrix: 'lks92:3',
                MinTileRow: 1,
                MaxTileRow: 9,
                MinTileCol: 1,
                MaxTileCol: 18,
              },
              {
                TileMatrix: 'lks92:4',
                MinTileRow: 1,
                MaxTileRow: 22,
                MinTileCol: 2,
                MaxTileCol: 45,
              },
              {
                TileMatrix: 'lks92:5',
                MinTileRow: 3,
                MaxTileRow: 45,
                MinTileCol: 5,
                MaxTileCol: 91,
              },
              {
                TileMatrix: 'lks92:6',
                MinTileRow: 7,
                MaxTileRow: 90,
                MinTileCol: 11,
                MaxTileCol: 182,
              },
              {
                TileMatrix: 'lks92:7',
                MinTileRow: 18,
                MaxTileRow: 225,
                MinTileCol: 29,
                MaxTileCol: 455,
              },
              {
                TileMatrix: 'lks92:8',
                MinTileRow: 37,
                MaxTileRow: 451,
                MinTileCol: 58,
                MaxTileCol: 910,
              },
              {
                TileMatrix: 'lks92:9',
                MinTileRow: 94,
                MaxTileRow: 1128,
                MinTileCol: 145,
                MaxTileCol: 2275,
              },
              {
                TileMatrix: 'lks92:10',
                MinTileRow: 189,
                MaxTileRow: 2256,
                MinTileCol: 291,
                MaxTileCol: 4551,
              },
              {
                TileMatrix: 'lks92:11',
                MinTileRow: 378,
                MaxTileRow: 4512,
                MinTileCol: 582,
                MaxTileCol: 9103,
              },
              {
                TileMatrix: 'lks92:12',
                MinTileRow: 756,
                MaxTileRow: 9023,
                MinTileCol: 1164,
                MaxTileCol: 18206,
              },
              {
                TileMatrix: 'lks92:13',
                MinTileRow: 1512,
                MaxTileRow: 18046,
                MinTileCol: 2328,
                MaxTileCol: 36413,
              },
            ],
          },
        ],
        ResourceURL: [
          {
            format: 'image/png8',
            template: `${GEOSERVER_URL}/gwc/service/wmts/rest/vraa:tapis_admin_ter/{style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}?format=image/png8`,
            resourceType: 'tile',
          },
        ],
      },
    ],
    TileMatrixSet: [
      {
        Identifier: 'lks92',
        SupportedCRS: 'urn:ogc:def:crs:EPSG::3059',
        TileMatrix: [
          {
            Identifier: 'lks92:0',
            ScaleDenominator: 1889884.732150179,
            TopLeftCorner: [691868, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 3,
            MatrixHeight: 2,
          },
          {
            Identifier: 'lks92:1',
            ScaleDenominator: 944942.3660750896,
            TopLeftCorner: [556401, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 5,
            MatrixHeight: 3,
          },
          {
            Identifier: 'lks92:2',
            ScaleDenominator: 472471.1830375448,
            TopLeftCorner: [488667, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 10,
            MatrixHeight: 5,
          },
          {
            Identifier: 'lks92:3',
            ScaleDenominator: 236235.5915187724,
            TopLeftCorner: [488667, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 20,
            MatrixHeight: 10,
          },
          {
            Identifier: 'lks92:4',
            ScaleDenominator: 94494.23660750895,
            TopLeftCorner: [475121, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 48,
            MatrixHeight: 24,
          },
          {
            Identifier: 'lks92:5',
            ScaleDenominator: 47247.118303754476,
            TopLeftCorner: [475121, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 96,
            MatrixHeight: 48,
          },
          {
            Identifier: 'lks92:6',
            ScaleDenominator: 23623.559151877238,
            TopLeftCorner: [475121, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 192,
            MatrixHeight: 96,
          },
          {
            Identifier: 'lks92:7',
            ScaleDenominator: 9449.423660750897,
            TopLeftCorner: [475121, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 480,
            MatrixHeight: 240,
          },
          {
            Identifier: 'lks92:8',
            ScaleDenominator: 4724.711830375449,
            TopLeftCorner: [475121, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 960,
            MatrixHeight: 480,
          },
          {
            Identifier: 'lks92:9',
            ScaleDenominator: 1889.8847321501792,
            TopLeftCorner: [475121, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 2400,
            MatrixHeight: 1200,
          },
          {
            Identifier: 'lks92:10',
            ScaleDenominator: 944.9423660750898,
            TopLeftCorner: [475121, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 4799,
            MatrixHeight: 2400,
          },
          {
            Identifier: 'lks92:11',
            ScaleDenominator: 472.4711830375447,
            TopLeftCorner: [475053, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 9597,
            MatrixHeight: 4799,
          },
          {
            Identifier: 'lks92:12',
            ScaleDenominator: 236.23559151877254,
            TopLeftCorner: [475019, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 19193,
            MatrixHeight: 9597,
          },
          {
            Identifier: 'lks92:13',
            ScaleDenominator: 118.11779575938607,
            TopLeftCorner: [475002, 150000],
            TileWidth: 512,
            TileHeight: 512,
            MatrixWidth: 38386,
            MatrixHeight: 19193,
          },
        ],
      },
    ],
  },
};

const wmtsOptions = optionsFromCapabilities(wmtsCapabilities, {
  layer: 'vraa:tapis_admin_ter',
  matrixSet: 'lks92',
});

if (!wmtsOptions) {
  throw Error("can't parse wmts capabilites");
}

const tileGrid = wmtsOptions.tileGrid;

const resolutions = tileGrid.getResolutions();

const topoMapOptions = {
  url: `${GEOSERVER_URL}/gwc/service/wmts`,
  matrixSet: 'lks92',
  format: 'image/png8',
  projection: PROJ_LKS,
  tileGrid,
  style: '',
};

export const fromGPSToWEB = (coord: Coordinate) => proj.transform(coord, PROJ_GPS, PROJ_WEB);
export const fromGPSToLKS = (coord: Coordinate) => proj.transform(coord, PROJ_GPS, PROJ_LKS);
export const fromWEBToGPS = (coord: Coordinate) => proj.transform(coord, PROJ_WEB, PROJ_GPS);
export const fromLKSToGPS = (coord: Coordinate) => proj.transform(coord, PROJ_LKS, PROJ_GPS);
const fromLKSRToWEB = (coord: Coordinate) => proj.transform([coord[1], coord[0]], PROJ_LKS, PROJ_WEB);
const fromWEBToLKSR = (coord: Coordinate) => {
  const cNew = proj.transform(coord, PROJ_WEB, PROJ_LKS);
  return [cNew[1], cNew[0]];
};
addCoordinateTransforms(PROJ_LKSR, PROJ_WEB, fromLKSRToWEB, fromWEBToLKSR);

export const getEmptyOlMap = (fullscreen = false) => {
  const controls = defaultControls({
    rotate: false,
    zoomOptions: {
      duration: 0,
      zoomInTipLabel: 'Tuvināt karti',
      zoomOutTipLabel: 'Attālināt karti',
      zoomInLabel: '\u002b',
      zoomOutLabel: '\uf068',
    },
    attribution: false,
  }).extend([
    new Attribution({
      collapsible: true,
      tipLabel: 'Karšu autortiesības',
      label: 'Karšu autortiesības',
      collapseLabel: 'Karšu autortiesības',
    }),
  ]);
  if (fullscreen) {
    controls.extend([
      new FullScreen({
        tipLabel: 'Pilnekrāna režīms',
        label: '\uf424',
        labelActive: '\uf422',
      }),
    ]);
  }
  const interactions = defaultInteractions({
    zoomDuration: 0,
  });
  controls.extend([new ScaleLine()]);
  return new OlMap({
    controls,
    interactions,
    maxTilesLoading: 32,
    view: new OlView({
      center: fromGPSToLKS([24.1, 56.95]),
      projection: PROJ_LKS,
      resolutions,
      constrainResolution: true,
      zoom: 1,
    }),
  });
};

export const addHighlightLayerToMap = (map: OlMap) => {
  const s = new OlSourceVector();
  const l = new OlLayerVector({
    properties: {
      name: HIGHLIGHT_LAYERNAME,
    },
    source: s,
    style: new OlStyleStyle({
      fill: new OlStyleFill({
        color: 'rgba(255, 0, 0, 0.0)',
      }),
      stroke: new OlStyleStroke({
        color: 'rgba(255, 0, 0, 0.0)',
        width: 2,
      }),
      image: new OlStyleCircle({
        radius: 7,
        fill: new OlStyleFill({
          color: 'rgba(255, 0, 0, 0.0)',
        }),
      }),
    }),
    zIndex: 100,
  });
  const duration = 1300;
  const flash = (f: OlFeature) => {
    const start = Date.now();
    const geom = f.getGeometry();
    if (geom) {
      const flashGeom = geom.clone();
      const animate = (event: RenderEvent) => {
        const frameState = event.frameState;
        if (frameState) {
          const elapsed = frameState.time - start;
          if (elapsed >= duration) {
            unByKey(listenerKey);
            return;
          }
          const vectorContext = getVectorContext(event);
          const elapsedRatio = elapsed / duration;
          const opacity = 1 - elapsedRatio;

          const style = new OlStyleStyle({
            fill: new OlStyleFill({
              color: 'rgba(0, 0, 0, ' + opacity * 0.5 + ')',
            }),
            stroke: new OlStyleStroke({
              color: 'rgba(0, 0, 0, ' + opacity + ')',
              width: 2 + elapsedRatio * 8,
            }),
            image: new OlStyleCircle({
              radius: 5 + elapsedRatio * 10,
              fill: new OlStyleFill({
                color: 'rgba(0, 0, 0, ' + opacity + ')',
              }),
            }),
          });

          vectorContext.setStyle(style);
          vectorContext.drawGeometry(flashGeom);
          // tell OpenLayers to continue postrender animation
          map.render();
        }
      };
      const listenerKey = l.on('postrender', animate);
    }
  };
  s.on('addfeature', (e) => {
    if (e.feature) {
      flash(e.feature);
    }
  });
  map.addLayer(l);
};

export const highlightFeaturesGeoJson = (map: OlMap, jsonData: any) => {
  const features = GeoJSONFormat.readFeatures(jsonData);
  if (features && features.length > 0) {
    highlightFeature(map, features[0])();
  }
};

export const highlightFeature = (map: OlMap, feature: OlFeature) => () => {
  const highlightLayer = map
    .getLayers()
    .getArray()
    .find((l) => l.get('name') === HIGHLIGHT_LAYERNAME);
  if (highlightLayer) {
    (highlightLayer as OlLayerVector<OlSourceVector<OlGeometry>>).getSource()?.clear();
    (highlightLayer as OlLayerVector<OlSourceVector<OlGeometry>>).getSource()?.addFeature(feature);
  }
};

const getOrtoLayer = (visible: boolean = false) =>
  new Tile({
    properties: {
      id: 'orto',
      title: 'Ortofoto karte',
      queryable: false,
    },
    visible,
    source: new WMTS({
      attributions: 'Ortofotokarte © Latvijas Ģeotelpiskās informācijas aģentūra. Autortiesības aizsargātas',
      url: `${GEOSERVER_URL}/gwc/service/wmts`,
      layer: 'ortofoto_kombi',
      matrixSet: 'lks92',
      format: 'image/png',
      projection: PROJ_LKS,
      tileGrid,
      style: '',
    }),
  });

export const getDefaultBackgroundLayersForLBIS = () => {
  return [
    new Tile({
      properties: {
        id: 'osm_light',
        title: 'OpenStreetMap karte',
      },
      source: new XYZ({
        crossOrigin: 'anonymous',
        //url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
        tileUrlFunction: (t) =>
          `https://${String.fromCharCode(97 + Math.floor(Math.random() * 4))}.basemaps.cartocdn.com/rastertiles/${
            t[0] > 6 ? 'light_all' : 'light_nolabels'
          }/${t[0]}/${t[1]}/${t[2]}.png`,
        attributions:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy' +
          '; <a href="https://carto.com/attribution">CARTO</a>',
      }),
    }),
  ];
};

export const getDefaultBackgroundLayers = () => {
  // get WMTS configuration:
  /*const parser = new WMTSCapabilities();
   fetch(`${GEOSERVER_URL}/gwc/service/wmts?service=WMTS&version=1.1.1&request=GetCapabilities`)
     .then(function (response) {
       return response.text();
     })
     .then(function (text) {
       const result = parser.read(text);
       console.log({ result });
       const options = optionsFromCapabilities(result, {
         layer: 'vraa:tapis_admin_ter',
         matrixSet: 'lks92',
       });
       console.log({ options });
     });
 */
  return [
    new Tile({
      properties: {
        id: 'osm',
        title: 'OpenStreetMap karte',
      },
      source: new OSM(),
    }),
    getOrtoLayer(),
    new LayerGroup({
      properties: {
        id: 'topo',
        title: 'Topogrāfiskā karte',
        singleLayer: true,
      },
      layers: [
        new Tile({
          properties: {
            queryable: false,
          },
          source: new WMTS({
            attributions:
              'Topogrāfiskā karte 250 000 © Latvijas Ģeotelpiskās informācijas aģentūra. Autortiesības aizsargātas',
            ...topoMapOptions,
            layer: 'Topo250',
          }),
          maxZoom: 3,
        }),
        new Tile({
          properties: {
            queryable: false,
          },
          source: new WMTS({
            attributions:
              'Topogrāfiskā karte 50 000 © Latvijas Ģeotelpiskās informācijas aģentūra. Autortiesības aizsargātas',
            ...topoMapOptions,
            layer: 'Topo50_v2',
          }),
          minZoom: 3,
          maxZoom: 6,
        }),
        new Tile({
          properties: {
            queryable: false,
          },
          source: new WMTS({
            attributions:
              'Topogrāfiskā karte 10 000 © Latvijas Ģeotelpiskās informācijas aģentūra. Autortiesības aizsargātas',
            ...topoMapOptions,
            layer: 'Topo10v3',
          }),
          minZoom: 6,
        }),
      ],
    }),
  ];
};

export const getDefaultBackgroundLayersForTAPIS = () => [getOrtoLayer()];

const getGeoServerImageWMS = (layer: string, attributions: string, extraParms = {}) =>
  new ImageWMS({
    attributions,
    projection: PROJ_LKS,
    url: `${GEOSERVER_URL}/vraa/wms`,
    params: {
      LAYERS: layer,
      FORMAT: 'image/png8',
      ...extraParms,
    },
    ratio: 1.2,
    serverType: 'geoserver',
  });

const getGeoServerWMSLayerCfg = (
  layer: string,
  title: string,
  attributions: string,
  minZoom?: number,
  maxZoom?: number
) =>
  new ImageLayer({
    properties: {
      id: layer,
      title,
      legends: [
        {
          title: null,
          url: `${GEOSERVER_URL}/vraa/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=${layer}&legend_options=wrap_limit%3A400%3Bwrap%3Atrue%3BfontSize%3A11`,
        },
      ],
    },
    visible: false,
    minZoom,
    maxZoom,
    source: getGeoServerImageWMS(layer, attributions),
  });

const getGeoServerWMTSTiledLayerCfg = (
  layer: string,
  title: string,
  attributions: string,
  minZoom?: number,
  maxZoom?: number,
  visible: boolean = false,
  zIndex?: number
) =>
  new Tile({
    properties: {
      id: layer,
      title,
      legends: [
        {
          title: null,
          url: `${GEOSERVER_URL}/vraa/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=${layer}&legend_options=wrap_limit%3A400%3Bwrap%3Atrue%3BfontSize%3A11`,
        },
      ],
    },
    visible,
    minZoom,
    maxZoom,
    zIndex,
    source: new WMTS({
      attributions,
      url: `${GEOSERVER_URL}/gwc/service/wmts`,
      layer: `vraa:${layer}`,
      matrixSet: 'lks92',
      format: 'image/png8',
      projection: PROJ_LKS,
      tileGrid,
      style: '',
      crossOrigin: 'anonymous',
    }),
  });

const getTAPISLegendCfgFromLayer = (layerName: string, isTAPISApvienotie: boolean) => {
  switch (layerName) {
    case 'planojumu_teritorijas':
      return [
        {
          title: null,
          url: getTAPISLegendURL('planojumu_teritorijas', isTAPISApvienotie),
        },
      ];
    case 'planojuma_robeza':
      return [
        {
          title: null,
          url: getTAPISLegendURL('planojuma_robeza', isTAPISApvienotie),
        },
      ];
    case 'tematiskie':
      return [
        {
          title: 'Kultūrvēsturiskie un dabas objekti',
          url: getTAPISLegendURL('kulturvesturiskie_un_dabas_objekti', isTAPISApvienotie),
        },
        {
          title: 'Riska objekti',
          url: getTAPISLegendURL('riska_objekti', isTAPISApvienotie),
        },
        {
          title: 'Riska teritorijas',
          url: getTAPISLegendURL('riska_teritorijas', isTAPISApvienotie),
        },
        {
          title: 'Inženierbūvju punktveida objekti',
          url: getTAPISLegendURL(
            isTAPISApvienotie ? 'inzenierbuvju_objekti' : 'inzenierbuvju_punktveida_objekti',
            isTAPISApvienotie
          ),
        },
        {
          title: 'Inženierbūvju līnijveida objekti',
          url: getTAPISLegendURL('inzenierbuvju_linijveida_objekti', isTAPISApvienotie),
        },
        {
          title: 'Inženierbūvju laukumveida objekti',
          url: getTAPISLegendURL('inzenierbuvju_laukumveida_objekti', isTAPISApvienotie),
        },
        {
          title: 'Autoceļi',
          url: getTAPISLegendURL('autoceli', isTAPISApvienotie),
        },
      ];
    case 'reglamentetie':
      return [
        {
          title: 'Funkcionālais zonējums',
          url: getTAPISLegendURL('funkcionalais_zonejums', isTAPISApvienotie),
        },
        {
          title: 'Teritorijas ar īpašiem noteikumiem',
          url: getTAPISLegendURL('teritorijas_ar_ipasiem_noteikumiem', isTAPISApvienotie),
        },
        {
          title: 'Ciemu robežas',
          url: getTAPISLegendURL('ciemu_robezas', isTAPISApvienotie),
        },
        {
          title: 'Pilsētu robežas',
          url: getTAPISLegendURL('planotas_teritorialas_vienibas', isTAPISApvienotie),
        },
        {
          title: 'Nacionālas nozīmes lauksaimniecības teritorijas',
          url: getTAPISLegendURL('nacionalas_nozimes_lauksaimniecibas_teritorijas', isTAPISApvienotie),
        },
        {
          title: 'Nacionālo interešu objekti',
          url: getTAPISLegendURL('nacionalo_interesu_objekti', isTAPISApvienotie),
        },
        {
          title: 'Apgrūtinātās teritorijas',
          url: getTAPISLegendURL('apgrutinatas_teritorijas', isTAPISApvienotie),
        },
        {
          title: 'Pašvaldību nozīmes ceļi un ielas',
          url: getTAPISLegendURL('pasvaldibas_nozimes_celi_vai_ielas', isTAPISApvienotie),
        },
      ];
    default:
      return [];
  }
};

const getTAPISApvienotieWMTSLayerCfg = (layer: string, title: string) =>
  getTAPISWMTSLayerCfg(
    layer,
    title,
    getTAPISLegendCfgFromLayer(layer, true),
    '/tapis_apvienotie/wmts',
    true,
    getTAPISZIndexFromLayerId(layer)
  );

const getTAPISLegendURL = (layer: string, isTAPISApvienotie: boolean) => {
  const wmsUrl = isTAPISApvienotie ? '/tapis_apvienotie/wms' : '/document_layers/wms';
  return `${TAPIS_WMTS_URL}${wmsUrl}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=${layer}&legend_options=wrap_limit%3A400%3Bwrap%3Atrue%3BfontSize%3A11`;
};

export const getTAPISIndividualieWMTSLayerCfg = (
  layer: string,
  title: string,
  dokId: number,
  layerName?: string,
  visible: boolean = true,
  id?: string
) =>
  getTAPISWMTSLayerCfg(
    layer,
    title,
    getTAPISLegendCfgFromLayer(layer, false),
    '/document_layers/wmts',
    visible,
    getTAPISZIndexFromLayerId(layer) + 2,
    {
      dimensions: layerName
        ? { CQL_FILTER: `location='../orto_d_${dokId}_${layerName}.tif'` }
        : { VIEWPARAMS: `dok_id:${dokId}` },
    },
    id || `${dokId}_${layer}`
  );

const getTAPISWMTSLayerCfg = (
  layer: string,
  title: string,
  legends: MapLegendType[],
  wmtsUrl: string,
  visible: boolean,
  zIndex?: number,
  extraOptions: any = {},
  id?: string
) =>
  new Tile({
    properties: {
      id: id || layer,
      title,
      legends,
    },
    visible,
    zIndex,
    source: new WMTS({
      attributions: 'Teritorijas attīstības plānošanas informācijas sistēma',
      url: `${TAPIS_WMTS_URL}${wmtsUrl}`,
      layer,
      matrixSet: 'lks92',
      format: 'image/png',
      projection: PROJ_LKS,
      tileGrid,
      style: '',
      ...extraOptions,
    }),
  });

const getTAPISOtherWMTSLayerCfg = (
  layer: string,
  title: string,
  minZoom: number,
  maxZoom: number,
  attributions: string,
  format?: string,
  zIndex?: number
) =>
  new Tile({
    properties: {
      id: layer,
      title,
    },
    visible: true,
    minZoom,
    maxZoom,
    zIndex,
    source: new WMTS({
      attributions,
      ...topoMapOptions,
      format: format || 'image/png8',
      layer,
    }),
  });

const getGeoServerWMSLayerCfgVZDKK = (layer: string, title: string, minZoom?: number, maxZoom?: number) =>
  getGeoServerWMSLayerCfg(
    layer,
    title,
    'Nekustamā īpašuma valsts kadastra informācijas sistēmas dati © Valsts Zemes dienests. Autortiesības aizsargātas',
    minZoom,
    maxZoom
  );

const getGeoServerWMSLayerCfgVZD = (layer: string, title: string) =>
  getGeoServerWMSLayerCfg(layer, title, '© Valsts Zemes dienests. Autortiesības aizsargātas');

const getGeoServerWMTSTiledLayerCfgVZD = (
  layer: string,
  title: string,
  minZoom?: number,
  maxZoom?: number,
  visible?: boolean,
  zIndex?: number
) =>
  getGeoServerWMTSTiledLayerCfg(
    layer,
    title,
    '© Valsts Zemes dienests. Autortiesības aizsargātas',
    minZoom,
    maxZoom,
    visible,
    zIndex
  );

const getGeoServerWMSLayerCfgKN = (layer: string, title: string) =>
  getGeoServerWMSLayerCfg(
    layer,
    title,
    'Karšu nomenklatūra © Latvijas Ģeotelpiskās informācijas aģentūra. Autortiesības aizsargātas'
  );

export const getDefaultOverLayers = () => {
  return [
    new LayerGroup({
      properties: {
        id: 'kk',
        title: 'Kadastra kartes publiskā daļa',
      },
      layers: [
        getGeoServerWMSLayerCfgVZDKK('building', 'Ēkas'),
        getGeoServerWMSLayerCfgVZDKK('parcel', 'Zemes vienības'),
        getGeoServerWMSLayerCfgVZDKK('parcel_part', 'Zemes vienību daļas'),
      ],
    }),
    new LayerGroup({
      properties: {
        id: 'adr',
        title: 'Adreses',
      },
      layers: [
        getGeoServerWMSLayerCfgVZD('ekas', 'Adrešu punkti'),
        getGeoServerWMTSTiledLayerCfgVZD('autoceli_ielas', 'Ielu un ceļu viduslīnijas'),
        getGeoServerWMTSTiledLayerCfgVZD('ciemi', 'Ciemi'),
        getGeoServerWMTSTiledLayerCfgVZD('pilsetas', 'Pilsētas'),
        getGeoServerWMTSTiledLayerCfgVZD('pagasti', 'Pagasti'),
        getGeoServerWMTSTiledLayerCfgVZD('novadi', 'Novadi'),
      ],
    }),
    new LayerGroup({
      properties: {
        id: 'tks',
        title: 'Karšu nomenklatūra',
      },
      layers: [
        getGeoServerWMSLayerCfgKN('tks93_10000', 'TKS93_10000'),
        getGeoServerWMSLayerCfgKN('tks93_25000', 'TKS93_25000'),
        getGeoServerWMSLayerCfgKN('tks93_50000', 'TKS93_50000'),
        getGeoServerWMSLayerCfgKN('tks93_100000', 'TKS93_100000'),
        getGeoServerWMSLayerCfgKN('tks93_200000', 'TKS93_200000'),
      ],
    }),
    new LayerGroup({
      properties: {
        id: 'vietv',
        title: 'Vietvārdi',
        singleLayer: true,
      },
      visible: false,
      layers: [
        new Tile({
          properties: {
            queryable: false,
          },
          source: new WMTS({
            attributions:
              'Vietvārdi no topogrāfiskās kartes 250 000 © Latvijas Ģeotelpiskās informācijas aģentūra. Autortiesības aizsargātas',
            ...topoMapOptions,
            layer: 'Topo250_txt',
          }),
          maxZoom: 2,
        }),
        new Tile({
          properties: {
            queryable: false,
          },
          source: new WMTS({
            attributions:
              'Vietvārdi no topogrāfiskās kartes 250 000 © Latvijas Ģeotelpiskās informācijas aģentūra. Autortiesības aizsargātas',
            ...topoMapOptions,
            layer: 'Topo250_txt_2',
          }),
          minZoom: 2,
          maxZoom: 4,
        }),
        new Tile({
          properties: {
            queryable: false,
          },
          source: new WMTS({
            attributions:
              'Vietvārdi no topogrāfiskās kartes 50 000 © Latvijas Ģeotelpiskās informācijas aģentūra. Autortiesības aizsargātas',
            ...topoMapOptions,
            layer: 'Topo50_v2_txt',
          }),
          minZoom: 4,
          maxZoom: 6,
        }),
        new Tile({
          properties: {
            queryable: false,
          },
          source: new WMTS({
            attributions:
              'Vietvārdi no topogrāfiskās kartes 10 000 © Latvijas Ģeotelpiskās informācijas aģentūra. Autortiesības aizsargātas',
            ...topoMapOptions,
            layer: 'Topo10v3_txt',
          }),
          minZoom: 6,
          maxZoom: 10,
        }),
      ],
    }),
  ];
};

export const getDefaultLBISOverLayers = () => {
  return [
    new LayerGroup({
      properties: {
        id: 'lbis',
        title: 'LBIS fona slāņi',
      },
      visible: true,
      layers: [
        getGeoServerWMTSTiledLayerCfgVZD('lbis_pasvaldibas', 'Administratīvās teritorijas', undefined, undefined, true),
        getGeoServerWMTSTiledLayerCfgVZD(
          'lbis_pasvaldibas_subm',
          'Administratīvās teritorijas ar aktīvu projektu iesniegšanu',
          undefined,
          5,
          false,
          10
        ),
        getGeoServerWMSLayerCfgVZDKK('parcel_owned_by_municipality', 'Pašvaldības zemes vienības', 5),
      ],
    }),
  ];
};

export const getTAPISZIndexFromLayerId = (layerId: string): number => {
  switch (layerId) {
    case ANOTACIJAS_LAYER_ID:
      return ANOTACIJAS_LAYER_ZINDEX;
    case 'citas_datu_kopas':
      return 20;
    case 'planojuma_robeza':
      return 36;
    case 'planojumu_teritorijas':
      return 35;
    case 'tematiskie':
      return 30;
    case 'reglamentetie':
      return REGLAMENTETIE_ZINDEX;
    default:
      return 0;
  }
};

const iadtImageWMS = new ImageWMS({
  attributions: 'Dabas datu pārvaldības sistēmas "OZOLS" aktuālie dati',
  projection: PROJ_LKS,
  url: DAP_WMS_URL,
  params: {
    LAYERS: '0,1,2,3,4',
    FORMAT: 'image/png',
    TRANSPARENT: true,
  },
  ratio: 1.2,
});

const getIADTLegendUrl = (layerName: string) =>
  `${DAP_WMS_URL}?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=${layerName}&legend_options=wrap_limit%3A400%3Bwrap%3Atrue%3BfontSize%3A11`;

export const getDefaultTAPISOverLayers = () => [
  new LayerGroup({
    properties: {
      id: 'tapis',
      title: 'TAPIS dati',
      tooltip: 'layer_settings.tapis_data_tooltip',
    },
    layers: [
      getTAPISApvienotieWMTSLayerCfg(ANOTACIJAS_LAYER_ID, 'Paskaidrojošie teksti'),
      getTAPISApvienotieWMTSLayerCfg('planojumu_teritorijas', 'Plānošanas dokumentu teritorijas'),
      getTAPISApvienotieWMTSLayerCfg('tematiskie', 'Tematiskie dati'),
      getTAPISApvienotieWMTSLayerCfg('reglamentetie', 'Reglamentētie dati'),
    ],
  }),
  new LayerGroup({
    properties: {
      id: 'tapis_citi',
      title: 'Citu datu turētāju dati',
    },
    layers: [
      getTAPISOtherWMTSLayerCfg(
        'topo10_txt_tapis_komb',
        'Topogrāfiskās kartes anotācijas',
        6,
        8,
        'Vietvārdi no topogrāfiskās kartes 10 000 © Latvijas Ģeotelpiskās informācijas aģentūra. Autortiesības aizsargātas',
        'image/png',
        45
      ),
      getGeoServerWMTSTiledLayerCfgVZD('tapis_kadastrs', 'Kadastra dati', 6, undefined, true, 25),
      getTAPISOtherWMTSLayerCfg(
        'topo10_tapis_komb',
        'Topogrāfiskās kartes pamatkarte',
        6,
        8,
        'Topogrāfiskās kartes 10 000 dati © Latvijas Ģeotelpiskās informācijas aģentūra. Autortiesības aizsargātas',
        'image/png'
      ),
      //getGeoServerWMSLayerCfgVZD('tapis_admin_ter', 'Administratīvās teritorijas'),
      getGeoServerWMTSTiledLayerCfgVZD(
        'tapis_admin_ter',
        'Administratīvās teritorijas',
        undefined,
        undefined,
        true,
        40
      ),
      new ImageLayer({
        properties: {
          id: 'iadt',
          title: 'Īpaši aizsargājamās dabas teritorijas',
          legends: [
            {
              title: 'Mikroliegumu buferzonas',
              url: getIADTLegendUrl('0'),
            },
            {
              title: 'Mikroliegumi',
              url: getIADTLegendUrl('1'),
            },
            {
              title: 'ĪADT zonējums',
              url: getIADTLegendUrl('2'),
            },
            {
              title: 'ĪADT - pamatteritorijas',
              url: getIADTLegendUrl('3'),
            },
            {
              title: 'ĪADT - aizsargājamie koki',
              url: getIADTLegendUrl('4'),
            },
          ],
        },
        visible: true,
        source: iadtImageWMS,
      }),
    ],
  }),
  new LayerGroup({
    properties: {
      id: 'tapis_juras_planojums',
      title: 'Jūras plānojums',
    },
    layers: [
      getGeoServerWMTSTiledLayerCfg(
        'tapis_juras_plan_nosac',
        'Jūras plānojumā noteiktie jūras izmantošanas nosacījumi',
        ''
      ),
      getGeoServerWMTSTiledLayerCfg(
        'msp_2_legcond',
        'Normatīvajā regulējumā noteiktie jūras izmantošanas nosacījumi',
        ''
      ),
      getGeoServerWMTSTiledLayerCfg('tapis_juras_telpas_izm', 'Esošā situācija jūras telpas izmantošanā', ''),
    ],
  }),
];

export const formatLength = (line: LineString, map: OlMap): string => {
  const length = getLength(line, {
    projection: map.getView().getProjection().getCode(),
    radius: 6363150.0, //earth radius in Riga
  });
  let output;
  if (length > 1000) {
    output = Math.round((length / 1000) * 100) / 100 + ' km';
  } else if (length > 1) {
    output = Math.round(length * 10) / 10 + ' m';
  } else {
    output = Math.round(length * 1000) + ' mm';
  }
  return output;
};

export const formatArea = (poly: Polygon, map: OlMap): string => {
  const area = getArea(poly, {
    projection: map.getView().getProjection().getCode(),
    radius: 6363150.0, //earth radius in Riga
  });
  let output;
  if (area > 10000) {
    output = Math.round((area / 10000) * 100) / 100 + ' ha';
  } else if (area > 1) {
    output = Math.round(area * 10) / 10 + ' m<sup>2</sup>';
  } else {
    output = '';
  }
  return output;
};

export const getFeatureInfoUrlFromOLSource = (
  source: Source,
  map: OlMap,
  coordinate: Coordinate,
  featureCount: number = 20,
  infoFormat: string = 'application/json',
  buffer: number = 2
): string => {
  if (source instanceof ImageWMS) {
    const params = (source as ImageWMS).getParams();
    let extraParams = {};
    if (params?.layers) {
      extraParams = {
        QUERY_LAYERS: params.layers,
      };
    }
    const infoUrl = (source as ImageWMS).getFeatureInfoUrl(
      coordinate,
      map.getView().getResolution() as number,
      map.getView().getProjection(),
      { ...params, INFO_FORMAT: infoFormat, feature_count: featureCount, buffer, ...extraParams }
    );
    if (infoUrl) {
      return infoUrl;
    }
    throw Error("Couldn't create getFeatureInfo request URL from WMS service");
  }
  if (source instanceof WMTS) {
    //construct WMS from WMTS
    if (source.getUrls() && source.getTileGrid()) {
      const wmtsTileGrid = source.getTileGrid() as WMTSTileGrid;
      const zoom = map.getView().getZoom() as number;

      //calculate the pixel in the hitted tile from clicked map coordinate
      const tileCoord = wmtsTileGrid.getTileCoordForCoordAndZ(coordinate, zoom) as TileCoord;
      const tileExtent = wmtsTileGrid.getTileCoordExtent(tileCoord) as Extent;
      const tileTopLeft = getTopLeft(tileExtent);
      const tileSizeInMapUnits = getSize(tileExtent);
      const tileSizePx = toSize(wmtsTileGrid.getTileSize(zoom));
      const dx = Math.abs(tileTopLeft[0] - coordinate[0]);
      const dy = Math.abs(tileTopLeft[1] - coordinate[1]);
      const pxX = Math.round((dx / tileSizeInMapUnits[0]) * tileSizePx[0]);
      const pxY = Math.round((dy / tileSizeInMapUnits[1]) * tileSizePx[1]);

      //https://geoserver-test.esynergy.lv/geoserver/gwc/service/wmts/rest/vraa:ciemi/{style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}/{J}/{I}?format=application/json
      //<baseUrl>/temperature/default/WholeWorld_CRS_84/30m/4/5/23/35?format=text/html&time=2016-02-23T03:00:00.000Z&elevation=500
      return `${
        (source.getUrls() as string[])[0]
      }/rest/${source.getLayer()}//${source.getMatrixSet()}/${wmtsTileGrid.getMatrixId(zoom)}/${tileCoord[2]}/${
        tileCoord[1]
      }/${pxY}/${pxX}?format=${infoFormat}&feature_count=${featureCount}`;
    }
    throw Error("Couldn't create getFeatureInfo request URL from WMTS service");
  }
  throw Error("This OL Source doesn't support GetFeatureInfo requests");
};

const commonTAPISLayers =
  'funkcionalais_zonejums,teritorijas_ar_ipasiem_noteikumiem,nacionalo_interesu_objekti,' +
  'nacionalas_nozimes_lauksaimniecibas_teritorijas,pasvaldibas_nozimes_celi_vai_ielas,apgrutinatas_teritorijas,' +
  'ciemu_robezas,planotas_teritorialas_vienibas,riska_teritorijas,kulturvesturiskie_un_dabas_objekti,' +
  'riska_objekti,inzenierbuvju_linijveida_objekti,autoceli,inzenierbuvju_laukumveida_objekti';

const commonTAPISStyles =
  'polygon,polygon,line,polygon,polygon,polygon,polygon,polygon,polygon,point,point,line,line,polygon';

const tapisApvienotieWMS = new ImageWMS({
  projection: PROJ_LKS,
  url: `${TAPIS_PROXY_URL}geoserver/tapis_apvienotie/wms`,
  params: {
    LAYERS: 'planojumu_teritorijas,' + commonTAPISLayers + ',inzenierbuvju_objekti',
    STYLES: 'polygon,' + commonTAPISStyles + ',point',
  },
  serverType: 'geoserver',
});

const getTapisIndividualieWMS = (dokId: number) =>
  new ImageWMS({
    projection: PROJ_LKS,
    url: `${TAPIS_PROXY_URL}geoserver/document_layers/wms`,
    params: {
      LAYERS: 'planojuma_robeza,' + commonTAPISLayers + ',inzenierbuvju_punktveida_objekti',
      STYLES: 'polygon,' + commonTAPISStyles + ',point',
      VIEWPARAMS: `dok_id:${dokId}`,
    },
    serverType: 'geoserver',
  });

export const getTAPISApvienotieGetFeatureInfoUrl = (map: OlMap, coordinate: Coordinate): string =>
  getFeatureInfoUrlFromOLSource(tapisApvienotieWMS, map, coordinate, 1000);

export const getTAPISIndividualieGetFeatureInfoUrl = (map: OlMap, coordinate: Coordinate, dokId: number): string =>
  getFeatureInfoUrlFromOLSource(getTapisIndividualieWMS(dokId), map, coordinate, 1000);

export const getIADTGetFeatureInfoUrl = (map: OlMap, coordinate: Coordinate): string =>
  getFeatureInfoUrlFromOLSource(iadtImageWMS, map, coordinate, 20, 'application/geojson');

const parcelImageWMS = getGeoServerImageWMS('parcel', '', { STYLES: 'polygon' });

export const getParcelGetFeatureInfoUrl = (map: OlMap, coordinate: Coordinate): string =>
  getFeatureInfoUrlFromOLSource(parcelImageWMS, map, coordinate, 5);

const lbisMuniImageWMS = getGeoServerImageWMS('lbis_pasvaldibas', '', {});

export const getLbisMuniGetFeatureInfoUrl = (map: OlMap, coordinate: Coordinate): string =>
  getFeatureInfoUrlFromOLSource(lbisMuniImageWMS, map, coordinate, 1);

export const getLbisMuniSubmGetFeatureInfoUrl = (map: OlMap, coordinate: Coordinate, extraParams: any): string =>
  getFeatureInfoUrlFromOLSource(getGeoServerImageWMS('lbis_pasvaldibas_subm', '', extraParams), map, coordinate, 1);

const lbisMuniParcelImageWMS = getGeoServerImageWMS('parcel_owned_by_municipality', '', {});

export const getLbisMuniParcelGetFeatureInfoUrl = (map: OlMap, coordinate: Coordinate): string =>
  getFeatureInfoUrlFromOLSource(lbisMuniParcelImageWMS, map, coordinate, 1);

export const getGMLStringFromGeometry = (geom: OlGeometry) => {
  return new XMLSerializer().serializeToString(GML3Format.writeGeometryNode(geom).childNodes[0]);
};

export const getIconStyle = (
  icon: string,
  fill: string,
  stroke: string,
  symbol_angle?: number,
  symbol_scale?: number
) => {
  const i = icons[icon]({ fill, stroke });
  return new Icon({
    anchor: i.anchor,
    rotation: symbol_angle ?? 0,
    scale: symbol_scale ?? 1.0,
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(i.icon)}`,
  });
};

interface CoordinateWithProjection {
  coord: Coordinate;
  proj: proj.ProjectionLike;
}

interface SingleCoord {
  dec: number;
  isLKS92: boolean;
  isLatitude: boolean | undefined;
}

export const parseCoordInput = (str: string): CoordinateWithProjection => {
  if (str) {
    const seperateCoords = str.split(',');
    var first: SingleCoord | undefined;
    var second: SingleCoord | undefined;
    if (seperateCoords.length === 2) {
      first = parseSingleCoord(seperateCoords[0]);
      second = parseSingleCoord(seperateCoords[1]);
    } else if (seperateCoords.length === 4) {
      first = parseSingleCoord(`${seperateCoords[0]}.${seperateCoords[1]}`);
      second = parseSingleCoord(`${seperateCoords[2]}.${seperateCoords[3]}`);
    } else if (seperateCoords.length === 1) {
      const seperateCoordsBySpace = str.replace(/[ ]+/g, ' ').trim().split(' ');
      if (seperateCoordsBySpace.length === 2) {
        first = parseSingleCoord(seperateCoordsBySpace[0]);
        second = parseSingleCoord(seperateCoordsBySpace[1]);
      }
      if (seperateCoordsBySpace.length === 4) {
        first = parseSingleCoord(`${seperateCoordsBySpace[0]} ${seperateCoordsBySpace[1]}`);
        second = parseSingleCoord(`${seperateCoordsBySpace[2]} ${seperateCoordsBySpace[3]}`);
      }
      if (seperateCoordsBySpace.length === 6) {
        first = parseSingleCoord(`${seperateCoordsBySpace[0]} ${seperateCoordsBySpace[1]} ${seperateCoordsBySpace[2]}`);
        second = parseSingleCoord(
          `${seperateCoordsBySpace[3]} ${seperateCoordsBySpace[4]} ${seperateCoordsBySpace[5]}`
        );
      }
    }
    if (!first || !second) {
      throw new Error('unparsable coordinates');
    }
    if (first.isLKS92 || second.isLKS92) {
      if (first.dec > 100000 && first.dec < 900000 && second.dec > 100000 && second.dec < 900000) {
        //assume the latitude is the first one or the one with 6milj
        const coord = second.isLatitude ? [first.dec, second.dec] : [second.dec, first.dec];
        return {
          coord,
          proj: PROJ_LKS,
        };
      }
    } else if (first.dec > 10 && first.dec < 70 && second.dec > 10 && second.dec < 70) {
      const coord = second.dec > first.dec ? [first.dec, second.dec] : [second.dec, first.dec];
      return {
        coord,
        proj: PROJ_GPS,
      };
    }
  }
  throw new Error('unparsable coordinates');
};

//old code for parsing DMS and other type of coordinates
const parseSingleCoord = (str: string): SingleCoord => {
  str = str.replace(/[,]/g, '.');
  str = str.replace(/[/NEWS°′″°‘"'\u2032\u2033\u00B0\u005C\u201C\xB0]/gi, ' ');
  str = str.replace(/[ ]+/g, ' ');
  str = str.trim();
  const parts = str.split(' ');
  var dec = 0;
  var isLKS92 = false;
  var isLatitude: boolean | undefined = undefined;
  if (parts.length === 3) {
    const g = parseFloat(parts[0]);
    const m = parseFloat(parts[1]);
    const s = parseFloat(parts[2]);
    dec = (s / 60 + m) / 60 + g;
  } else if (parts.length === 2) {
    const g = parseFloat(parts[0]);
    var m = parseFloat(parts[1]);
    const commaParts = parts[1].split('.');
    var minSize = 0;
    if (commaParts.length > 0) {
      minSize = commaParts[0].length;
    } else {
      minSize = parts[1].length;
    }
    if (minSize > 2) {
      m = parseFloat(parts[1].substring(0, 2));
      var s = parseFloat(parts[1].substring(2));
      dec = (s / 60 + m) / 60 + g;
    } else {
      dec = m / 60 + g;
    }
  } else if (parts.length === 1) {
    dec = parseFloat(parts[0]);
    //check for lks92 format
    if (dec > 100000) {
      if (dec > 6000000) {
        dec = dec - 6000000;
        isLatitude = true;
      }
      isLKS92 = true;
    }
  }
  return { dec, isLKS92, isLatitude };
};

export const getZoomFromScale = (scale: number): number => {
  // find the closest scale from tile matrix
  const tileMatrix = wmtsCapabilities.Contents.TileMatrixSet[0].TileMatrix;
  const closest = tileMatrix.reduce((closest, curr) =>
    Math.abs(curr.ScaleDenominator - scale) < Math.abs(closest.ScaleDenominator - scale) ? curr : closest
  );
  return tileMatrix.findIndex((m) => m === closest);
};

export const findLayerByIdDeep = (map: OlMap, id: string): BaseLayer | undefined => {
  const layers = findLayerInLayerArrayById(map.getLayers().getArray(), id);
  return layers.length > 0 ? layers[0] : undefined;
};

const findLayerInLayerArrayById = (layers: BaseLayer[], id: string): BaseLayer[] =>
  layers
    .flatMap((l) =>
      l.get('id') === id ? l : l instanceof LayerGroup ? findLayerInLayerArrayById(l.getLayers().getArray(), id) : []
    )
    .filter((l) => !!l);

export const isGeoproductLayer = (l: BaseLayer): boolean =>
  l instanceof ImageLayer && l.get('id')?.startsWith(GEOPRODUCT_LAYER_PREFIX);

export const zoomToMunicipality = (atvkId: number, map: OlMap) => {
  axios
    .get(`${GEOSERVER_URL}/vraa/wfs`, {
      params: {
        request: 'GetFeature',
        service: 'WFS',
        version: '2.0.0',
        outputFormat: 'application/json',
        cql_filter: `atrib='${atvkId}'`,
        typename: 'lbis_pasvaldibas',
      },
    })
    .then((response: AxiosResponse) => {
      if (response?.['data']?.['features']?.length > 0) {
        const features = GeoJSONFormat.readFeatures(response?.['data']);
        const extent = features.reduce(
          (extent, f) => extend(extent, f.getGeometry() ? (f.getGeometry()?.getExtent() as Extent) : createEmpty()),
          createEmpty()
        );
        if (!isEmpty(extent)) {
          map.getView().fit(extent, {
            duration: 800,
            maxZoom: 8,
          });
        }
      }
    });
};
