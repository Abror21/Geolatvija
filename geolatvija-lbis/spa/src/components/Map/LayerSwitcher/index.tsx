import { useState, useContext, useEffect, useCallback } from 'react';

import OlLayerBase from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';
import Tile from 'ol/layer/Tile';
import Image from 'ol/layer/Image';

import MapContext from '../../../contexts/MapContext';
import { useOpenedTypeState } from 'contexts/OpenedTypeContext';
import {
  getDefaultBackgroundLayers,
  getDefaultBackgroundLayersForTAPIS,
  getDefaultBackgroundLayersForLBIS,
  HOME_LAYER_GROUP,
  BASE_LAYER_GROUP,
} from 'utils/mapUtils';
import { StyledLayerSwitcher, VerticalLine } from './styles';
import { Button } from '../../../ui';

const defaultLayers = getDefaultBackgroundLayers();
const defaultTAPISLayers = getDefaultBackgroundLayersForTAPIS();
const defaultLBISLayers = getDefaultBackgroundLayersForLBIS();

const getCurrentLayer = (layerGroup: LayerGroup, currentLayer: String) =>
  layerGroup &&
  layerGroup
    .getLayers()
    .getArray()
    .find((l) => l.get('id') === currentLayer);

interface LayerSwitcherProps {
  setIsOpenLayerSettings: Function;
  visibleLayers?: string[];
}

export const LayerSwitcher = ({ setIsOpenLayerSettings, visibleLayers }: LayerSwitcherProps) => {
  const map = useContext(MapContext);
  const { openedMapType } = useOpenedTypeState();
  const layers =
    openedMapType === 'tapis' ? defaultTAPISLayers : openedMapType === 'lbis' ? defaultLBISLayers : defaultLayers;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [layerGroup, setLayerGroup] = useState<LayerGroup>();
  const [currentLayer, setCurrentLayer] = useState<String>('');
  const [loading, setLoading] = useState<number>(0);
  const [isVisibleLayersApplied, setIsVisibleLayersApplied] = useState<boolean>(false);

  const addLoading = useCallback(() => {
    setLoading((l) => l + 1);
  }, []);

  const addLoaded = useCallback(() => {
    setLoading((l) => l - 1);
  }, []);

  const resetLoading = useCallback(() => {
    setLoading(0);
  }, []);

  // converts layers to layergroup
  useEffect(() => {
    if (map && layers.length > 0) {
      setLayerGroup(
        new LayerGroup({
          properties: {
            id: BASE_LAYER_GROUP,
          },
          layers,
        })
      );
      // get first visible layer
      const visibleLayer = layers.find((l) => l.getVisible());
      if (visibleLayer) {
        setCurrentLayer(visibleLayer.get('id'));
      }

      const setLoadingEvents = (l: OlLayerBase) => {
        if (l instanceof Tile) {
          const src = l.getSource();
          if (src) {
            src.on('tileloadstart', addLoading);
            src.on('tileloadend', addLoaded);
            src.on('tileloaderror', addLoaded);
          }
        }
        if (l instanceof Image) {
          const src = l.getSource();
          src.on('imageloadstart', addLoading);
          src.on('imageloadend', addLoaded);
          src.on('imageloaderror', addLoaded);
        }
        if (l instanceof LayerGroup) {
          l.getLayers().forEach((ll) => setLoadingEvents(ll));
        }
      };
      layers.forEach((l) => setLoadingEvents(l));

      return () => {
        resetLoading();
        setLayerGroup(undefined);
        setCurrentLayer('');
      };
    }
  }, [map, layers, addLoading, addLoaded, resetLoading]);

  // adds/removes layer group in OL Map
  useEffect(() => {
    if (map && layerGroup) {
      map.addLayer(layerGroup);
      return () => {
        map.removeLayer(layerGroup);
      };
    }
  }, [map, layerGroup]);

  // set current layer to be visible on map
  useEffect(() => {
    if (layerGroup) {
      layerGroup.getLayers().forEach((l) => l.setVisible(false));
      getCurrentLayer(layerGroup, currentLayer)?.setVisible(true);
    }
  }, [currentLayer, layerGroup]);

  //reset isVisibleLayersApplied when only visibleLayers change
  useEffect(() => {
    if (visibleLayers) {
      setIsVisibleLayersApplied(false);
    }
  }, [visibleLayers]);

  // sets visible layers from props
  useEffect(() => {
    if (map && layerGroup && visibleLayers && !isVisibleLayersApplied) {
      const baseKey = `${HOME_LAYER_GROUP}->${BASE_LAYER_GROUP}->`;
      const visibleLayer = visibleLayers
        .map((k) => (k.startsWith(baseKey) ? k.substring(baseKey.length) : null))
        .filter((k) => !!k);
      if (visibleLayer.length > 0 && visibleLayer[0]) {
        setCurrentLayer(visibleLayer[0]);
      } else {
        openedMapType === 'tapis' ? setCurrentLayer('') : setCurrentLayer('osm');
      }
      setIsVisibleLayersApplied(true);
    }
  }, [map, layerGroup, visibleLayers]);

  if (!layerGroup) {
    return null;
  }

  const currentOLLayer = getCurrentLayer(layerGroup, currentLayer);
  if (openedMapType === 'lbis') {
    return null;
  }
  return (
    <StyledLayerSwitcher
      className={'ol-unselectable ol-control ' + (isExpanded ? 'expanded' : '')}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {!currentOLLayer ? (
        <Button
          className="layer-button"
          key="current_empty"
          label="Slāņi"
          icon="layer-group"
          faBase="far"
          onClick={() => setIsExpanded(true)}
        />
      ) : loading > 0 ? (
        <Button
          key={'current_loading_' + currentOLLayer.get('id')}
          loading={true}
          className={currentOLLayer.get('id')}
        />
      ) : (
        <Button
          key={'current_' + currentOLLayer.get('id')}
          label="Slāņi"
          icon="layer-group"
          faBase="far"
          className={currentOLLayer.get('id')}
          onClick={() => setIsExpanded(true)}
        />
      )}

      {isExpanded ? (
        <>
          <VerticalLine />
          {currentLayer !== '' ? (
            <Button className="options" onClick={() => setCurrentLayer('')} title="Bez fona kartes" />
          ) : null}
          {layerGroup
            .getLayers()
            .getArray()
            .filter((l) => l.get('id') !== currentLayer)
            .map((l) => (
              <Button
                key={l.get('id')}
                className={l.get('id') + ' options'}
                onClick={() => setCurrentLayer(l.get('id'))}
                title={l.get('title')}
              />
            ))}
          <Button
            className={'more options layer-button'}
            label={<i className="fa-regular fa-gear"></i>}
            onClick={() => setIsOpenLayerSettings(true)}
            title="Atvērt karšu slāņu konfigurēšanu"
          />
        </>
      ) : null}
    </StyledLayerSwitcher>
  );
};

export default LayerSwitcher;
