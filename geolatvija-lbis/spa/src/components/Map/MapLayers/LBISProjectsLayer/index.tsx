import { useState, useContext, useEffect } from 'react';

import { ProjectType } from '../../../../pages/LayoutPage/Components/Sidebars/Project';

import MapContext from 'contexts/MapContext';
import { useOpenedTypeState } from 'contexts/OpenedTypeContext';

import {
  getIconStyle,
  PROJ_GPS,
  PROJ_LKS,
  getLbisMuniGetFeatureInfoUrl,
  fromLKSToGPS,
  findLayerByIdDeep,
  getLbisMuniSubmGetFeatureInfoUrl,
  getLbisMuniParcelGetFeatureInfoUrl,
  zoomToMunicipality,
} from 'utils/mapUtils';
import OlFeature from 'ol/Feature';
import OlLayerVector from 'ol/layer/Vector';
import OlLayer from 'ol/layer/Layer';
import OlSourceVector from 'ol/source/Vector';
import OlGeometry from 'ol/geom/Geometry';
import WKT from 'ol/format/WKT';
import Cluster from 'ol/source/Cluster';
import { Fill, Circle, Style as OlStyleStyle, Stroke as OlStyleStroke, Text as TextStyle } from 'ol/style';
import { StyleFunction } from 'ol/style/Style';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import OlSelect from 'ol/interaction/Select';
import OlPoint from 'ol/geom/Point';
import { useNavigate } from 'react-router-dom';
import { useProjectState } from '../../../../contexts/ProjectContext';
import { useParticipationBudgetState } from '../../../../contexts/ParticipationBudgetContext';
import axios, { AxiosResponse } from 'axios';
import GeoJSON from 'ol/format/GeoJSON';
import OlWMTS from 'ol/source/WMTS';
import OlTile from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { Pixel } from 'ol/pixel';
import { defaultTheme } from 'styles/theme/theme';

interface LBISProjectsLayerProps {
  onMarkerClick: Function;
  onCloseProjectModal: Function;
  searchParams: any;
  onMunicipalityClick: Function;
  onCloseMunicipalityModal: Function;
  municipality: string | null;
}

const CLUSTER_ZOOM = 2;
const SUBMISION_ZOOM = 6;

const WKTFormat = new WKT();
const GeoJSONFormat = new GeoJSON();

const pinStyleCache: Map<string, OlStyleStyle> = new Map();
const outerStyleCache: Map<string, OlStyleStyle> = new Map();
const innerStyleCache: Map<string, Circle> = new Map();

const newProjectPinStyle = new OlStyleStyle({
  image: getIconStyle('marker', 'rgba(81, 139, 51, 1)', 'rgba(255, 255, 255, 1)', 0, 1.6),
});

// size 9 from to ... = radius from 14 to 20
const clusterRadiusFromFeatureCount = (size: number): number =>
  size < 10 ? 14 : size > 59 ? 20 : 14 + Math.floor(size / 10);

const canVote = (feature: OlFeature): boolean =>
  (feature.get('features') as OlFeature[]).filter((f) => f.get('can_vote') === true).length > 0;

const defaultPinColor = 'rgba(102, 112, 133, 1)';

const pointStyleFunc = (feature: OlFeature): OlStyleStyle => {
  const selected = !!feature.get('selected');
  const state = feature.get('state');
  const can_vote = feature.get('can_vote');
  const cacheKey = `pin_${selected}_${state}_${can_vote}`;
  if (!pinStyleCache.get(cacheKey)) {
    let color = defaultPinColor;
    switch (state) {
      case 'in_voting': {
        color = can_vote ? defaultTheme.statusGreen : defaultPinColor;
        break;
      }
      case 'in_voting': {
        color = defaultTheme.statusBrown;
        break;
      }
      case 'supported': {
        color = defaultTheme.statusDarkGreen;
        break;
      }
      case 'in_progress': {
        color = defaultTheme.statusBlue;
        break;
      }
      case 'unsupported': {
        color = defaultTheme.statusRed;
        break;
      }
      case 'realized': {
        color = defaultTheme.statusDarkBlue;
        break;
      }
    }
    pinStyleCache.set(
      cacheKey,
      new OlStyleStyle({
        image: getIconStyle('marker', color, 'rgba(255, 255, 255, 1)', 0, selected ? 1.4 : 1.2),
      })
    );
  }
  return pinStyleCache.get(cacheKey) as OlStyleStyle;
};

const textFill = new Fill({
  color: '#fff',
});

const getOuterCircleStyle = (feature: OlFeature): OlStyleStyle => {
  const size = clusterRadiusFromFeatureCount(feature.get('features').length) + 4;
  const can_vote = canVote(feature);
  const cacheKey = `outer_${size}_${can_vote}`;
  if (!outerStyleCache.get(cacheKey)) {
    outerStyleCache.set(
      cacheKey,
      new OlStyleStyle({
        image: new Circle({
          radius: size,
          fill: new Fill({
            color: can_vote ? 'rgba(81, 139, 51, 0.5)' : 'rgba(102, 112, 133, 0.5)',
          }),
        }),
      })
    );
  }
  return outerStyleCache.get(cacheKey) as OlStyleStyle;
};

const getInnerCircleStyle = (feature: OlFeature): Circle => {
  const size = clusterRadiusFromFeatureCount(feature.get('features').length);
  const can_vote = canVote(feature);
  const cacheKey = `inner_${size}_${can_vote}`;
  if (!innerStyleCache.get(cacheKey)) {
    innerStyleCache.set(
      cacheKey,
      new Circle({
        radius: size,
        fill: new Fill({
          color: can_vote ? 'rgba(81, 139, 51, 0.9)' : 'rgba(102, 112, 133, 0.9)',
        }),
      })
    );
  }
  return innerStyleCache.get(cacheKey) as Circle;
};

const clusterStyleFunc = (feature: OlFeature): OlStyleStyle | OlStyleStyle[] => [
  getOuterCircleStyle(feature),
  new OlStyleStyle({
    image: getInnerCircleStyle(feature),
    text: new TextStyle({
      font: '12px Ubuntu',
      text: feature.get('features').length.toString(),
      fill: textFill,
    }),
  }),
];

const isSubmisionLayersVisible = (map: OlMap) => {
  const parcelLayer = findLayerByIdDeep(map, 'parcel_owned_by_municipality');
  const pasvLayer = findLayerByIdDeep(map, 'lbis_pasvaldibas_subm');
  return parcelLayer?.getVisible() || pasvLayer?.getVisible();
};

const isMunicipalitySumbmisionLayerAtPixel = (map: OlMap, pixel: Pixel) => {
  const pasvLayer = findLayerByIdDeep(map, 'lbis_pasvaldibas_subm');
  if (pasvLayer && (pasvLayer as OlTile<OlWMTS>).getVisible()) {
    const rgba = (pasvLayer as OlTile<OlWMTS>).getData(pixel);
    if (!!rgba && rgba instanceof Uint8ClampedArray && (rgba as Uint8ClampedArray).length > 3 && rgba[3] > 0) {
      return true;
    }
  }
  return false;
};

const getViewparamsFromSubmitBudgets = (budgets: any) => ({
  VIEWPARAMS: `atvk:${budgets
    .filter((b: any) => b.submit_available === true)
    .map((b: any) => b.atvk_id)
    .join('$$$')}`,
});

export const LBISProjectsLayer = ({
  onMarkerClick,
  onCloseProjectModal,
  searchParams,
  onMunicipalityClick,
  onCloseMunicipalityModal,
  municipality,
}: LBISProjectsLayerProps) => {
  const map = useContext(MapContext);
  const navigate = useNavigate();
  const { openedMapType } = useOpenedTypeState();
  const { projects, highlightedProjectId } = useProjectState();
  const { budgets } = useParticipationBudgetState();

  const [pinLayer, setPinLayer] = useState<OlLayerVector<OlSourceVector<OlGeometry>> | null>(null);
  const [muniLayer, setMuniLayer] = useState<OlLayerVector<OlSourceVector<OlGeometry>> | null>(null);
  const [newProjectPinLayer, setNewProjectPinLayer] = useState<OlLayerVector<OlSourceVector<OlPoint>> | null>(null);

  // adds/removes lbis projects map layer
  useEffect(() => {
    if (map && openedMapType === 'lbis') {
      // project pin layer
      const pinLayer = new OlLayerVector({
        properties: {
          name: '_lbis_project_pins',
        },
        source: new OlSourceVector<OlGeometry>(),
        style: pointStyleFunc as StyleFunction,
        zIndex: 50,
        minZoom: CLUSTER_ZOOM,
      });
      map.addLayer(pinLayer);
      setPinLayer(pinLayer);

      // project cluster layer
      const clusterLayer = new OlLayerVector({
        properties: {
          name: '_lbis_project_clusters',
        },
        source: new Cluster({
          distance: 40,
          source: pinLayer.getSource() as OlSourceVector<OlGeometry>,
        }),
        style: clusterStyleFunc as StyleFunction,
        zIndex: 50,
        maxZoom: CLUSTER_ZOOM,
      });
      map.addLayer(clusterLayer);

      // layer for selected municipality
      const municLayer = new OlLayerVector({
        properties: {
          name: '_lbis_selected_municipality',
        },
        source: new OlSourceVector<OlGeometry>(),
        style: new OlStyleStyle({
          fill: new Fill({
            color: 'rgba(81, 139, 51, 0.2)',
          }),
          stroke: new OlStyleStroke({
            color: 'rgba(81, 139, 51, 0.9)',
            width: 3,
          }),
        }),
        zIndex: 40,
      });
      map.addLayer(municLayer);
      setMuniLayer(municLayer);

      // new project pin
      const newProjectPinLayer = new OlLayerVector({
        properties: {
          name: '_lbis_new_project_pin',
        },
        source: new OlSourceVector<OlPoint>(),
        style: newProjectPinStyle,
        zIndex: 60,
      });
      map.addLayer(newProjectPinLayer);
      setNewProjectPinLayer(newProjectPinLayer);

      // pointer cursor over layers
      const isPointerOverLayers = (f: any, layer: OlLayer) => {
        return layer === pinLayer || layer === clusterLayer;
      };

      const pointermoveInteraction = (evt: OlMapBrowserEvent<MouseEvent>) =>
        (map.getTargetElement().style.cursor =
          map.forEachFeatureAtPixel(evt.pixel, isPointerOverLayers) ||
          (isSubmisionLayersVisible(map) && isMunicipalitySumbmisionLayerAtPixel(map, evt.pixel))
            ? 'pointer'
            : '');

      map.on('pointermove', pointermoveInteraction);

      // cluster click
      const clusterSelectInteraction = new OlSelect({
        layers: [clusterLayer],
        style: null,
      });
      clusterSelectInteraction.on('select', (e) => {
        if (e.selected.length > 0) {
          map.getView().animate({
            zoom: CLUSTER_ZOOM + 1,
            center: (e.selected[0].getGeometry() as OlPoint).getCoordinates(),
            duration: 800,
          });
          e.mapBrowserEvent?.preventDefault();
        }
      });
      map.addInteraction(clusterSelectInteraction);

      // pin click
      const pinSelectInteraction = new OlSelect({
        layers: [pinLayer],
        style: null,
      });
      pinSelectInteraction.on('select', (e) => {
        (pinLayer.getSource() as OlSourceVector<OlGeometry>)
          .getFeatures()
          .filter((f) => f.get('selected'))
          .forEach((f) => f.set('selected', false));
        onCloseProjectModal();
        if (e.selected.length > 0) {
          e.selected[0].set('selected', true);

          const x = e.mapBrowserEvent?.pixel[0];
          const y = e.mapBrowserEvent?.pixel[1];

          const coordinatesForModal = {
            x,
            y,
            mapWidth: e.target.map_.overlayContainer_.clientWidth,
            mapHeight: e.target.map_.overlayContainer_.clientHeight,
          };

          onMarkerClick(e.selected[0].get('project'), coordinatesForModal);
          e.mapBrowserEvent?.preventDefault();
        }
      });
      map.addInteraction(pinSelectInteraction);

      // handle generic clicks on lbis map
      const onMapClickInner = (olEvt: OlMapBrowserEvent<MouseEvent>) => {
        // always close municipality modal
        onCloseMunicipalityModal();
        // skip the click when it is on pin or cluster layer, thats handled with select interaction
        if (!map.forEachFeatureAtPixel(olEvt.pixel, isPointerOverLayers)) {
          if (!olEvt.pixel) {
            return;
          }
          // skip click when submiting projects
          if (isSubmisionLayersVisible(map)) {
            return;
          }
          const x = olEvt.pixel[0];
          const y = olEvt.pixel[1];
          const coordinatesForModal = {
            x,
            y,
            mapWidth: olEvt.target.overlayContainer_.clientWidth,
            mapHeight: olEvt.target.overlayContainer_.clientHeight,
          };

          // make getfeatureinfo request for municipality geometry highlight and atvk code
          axios.get(getLbisMuniGetFeatureInfoUrl(map, olEvt.coordinate) as string).then((response: AxiosResponse) => {
            if (response?.['data']?.['features']?.length > 0) {
              const features = GeoJSONFormat.readFeatures(response?.['data']);
              municLayer.getSource()?.clear();
              municLayer.getSource()?.addFeatures(features);
              onMunicipalityClick(features[0].get('atrib'), coordinatesForModal);
            }
          });
        }
      };
      map.on('click', onMapClickInner);

      return () => {
        map.un('click', onMapClickInner);
        map.removeInteraction(pinSelectInteraction);
        map.removeInteraction(clusterSelectInteraction);
        map.un('pointermove', pointermoveInteraction);
        map.removeLayer(newProjectPinLayer);
        map.removeLayer(municLayer);
        map.removeLayer(clusterLayer);
        map.removeLayer(pinLayer);
        setMuniLayer(null);
        setPinLayer(null);
      };
    }
  }, [map, openedMapType]);

  // add/update projects into layer
  useEffect(() => {
    if (map && pinLayer) {
      const source = pinLayer.getSource() as OlSourceVector<OlGeometry>;
      source.clear();

      if (projects && Array.isArray(projects)) {
        const features = (projects as ProjectType[])
          .filter((m) => !!m.the_geom)
          .map(
            (m) =>
              new OlFeature({
                ...m,
                project: m,
                geometry: WKTFormat.readGeometry(m.the_geom, {
                  dataProjection: PROJ_GPS,
                  featureProjection: PROJ_LKS,
                }),
              })
          );
        source.addFeatures(features);
      }
    }
  }, [map, pinLayer, projects]);

  // highlight project on map
  useEffect(() => {
    if (map && pinLayer) {
      const source = pinLayer.getSource() as OlSourceVector<OlGeometry>;
      source.forEachFeature((f) => {
        if (f.get('selected') === true) {
          f.set('selected', false);
        }
        if (highlightedProjectId && f.get('id') === highlightedProjectId) {
          f.set('selected', true);
          map.getView().fit(f.getGeometry() as OlPoint, {
            duration: 800,
            maxZoom: 3,
          });
        }
      });
    }
  }, [map, pinLayer, highlightedProjectId]);

  // remove highlighted municipality when municipality is null in the upper level
  useEffect(() => {
    if (map && muniLayer && !municipality) {
      muniLayer.getSource()?.clear();
    }
  }, [map, muniLayer, municipality]);

  // show map layers for project submission
  useEffect(() => {
    if (
      map &&
      (searchParams.get('submit-project') === 'open' || searchParams.get('submit-project-form') === 'open') &&
      budgets &&
      budgets.length > 0
    ) {
      // show municipality layer with active submission
      const pasvLayer = findLayerByIdDeep(map, 'lbis_pasvaldibas_subm');
      if (pasvLayer) {
        ((pasvLayer as OlTile<OlWMTS>).getSource() as OlWMTS).updateDimensions(getViewparamsFromSubmitBudgets(budgets));
        pasvLayer.setVisible(true);
      }

      // show municipality land layer
      const parcelLayer = findLayerByIdDeep(map, 'parcel_owned_by_municipality');
      parcelLayer?.setVisible(true);

      return () => {
        pasvLayer?.setVisible(false);
        parcelLayer?.setVisible(false);
      };
    }
  }, [map, searchParams, budgets]);

  // allow to place a new project marker
  useEffect(() => {
    if (map && (searchParams.get('submit-project') === 'open' || searchParams.get('submit-project-form') === 'open')) {
      const onMapClickNewProject = (olEvt: OlMapBrowserEvent<MouseEvent>) => {
        // check zoom, if we click on submision municipality - first click zooms map to closer zoom level
        if ((map.getView().getZoom() as number) < SUBMISION_ZOOM) {
          if (isMunicipalitySumbmisionLayerAtPixel(map, olEvt.pixel)) {
            map.getView().animate({
              zoom: SUBMISION_ZOOM,
              center: olEvt.coordinate,
              duration: 800,
            });
          }
        } else {
          // read atvk_id and municipality owner land

          const muniResp = axios.get(
            getLbisMuniSubmGetFeatureInfoUrl(map, olEvt.coordinate, getViewparamsFromSubmitBudgets(budgets)) as string
          );
          const parcelResp = axios.get(getLbisMuniParcelGetFeatureInfoUrl(map, olEvt.coordinate) as string);

          Promise.all([muniResp, parcelResp]).then((responses) => {
            const features = responses.map((resp) => {
              if (resp?.['data']?.['features']?.length > 0) {
                return GeoJSONFormat.readFeatures(resp?.['data']);
              }
              return [];
            });
            // if user has clicked on municipality with active submission and also on any parcel
            if (features.length === 2 && features[0].length > 0 && features[1].length > 0) {
              const atvk = features[0][0].get('atrib');
              const onMunicipalityLand = features[1][0].get('owned_by_municipality');
              const coords = WKTFormat.writeGeometry(new OlPoint(fromLKSToGPS(olEvt.coordinate)));
              navigate(
                `/main?submit-project-form=open&coords=${coords}&atvk=${atvk}&ml=${onMunicipalityLand ? 't' : 'f'}`
              );
            }
          });
        }
      };
      map.on('click', onMapClickNewProject);

      return () => {
        map.un('click', onMapClickNewProject);
      };
    }
  }, [map, searchParams, budgets]);

  //zoom map to municipality and remove atvk_id from url
  useEffect(() => {
    if (map && searchParams.get('submit-project') === 'open' && !!searchParams.get('atvk_id')) {
      zoomToMunicipality(searchParams.get('atvk_id'), map);
      navigate(`/main?participation-budget=open&submit-project=open&step=1`);
    }
  }, [map, searchParams]);

  // add new project pin on map
  useEffect(() => {
    if (map && newProjectPinLayer && searchParams.get('submit-project-form') === 'open' && searchParams.get('coords')) {
      const source = newProjectPinLayer.getSource() as OlSourceVector<OlPoint>;
      source.clear();
      const feature = new OlFeature({
        geometry: WKTFormat.readGeometry(searchParams.get('coords'), {
          dataProjection: PROJ_GPS,
          featureProjection: PROJ_LKS,
        }),
      });
      source.addFeature(feature as OlFeature<OlPoint>);
      return () => {
        newProjectPinLayer.getSource()?.clear();
      };
    }
  }, [map, searchParams, newProjectPinLayer]);

  return null;
};

export default LBISProjectsLayer;
