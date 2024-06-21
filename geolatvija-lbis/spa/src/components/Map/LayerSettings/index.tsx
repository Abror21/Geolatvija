import { useEffect, useContext, useState, useCallback } from 'react';
import MapContext from '../../../contexts/MapContext';
import { useOpenedTypeState } from 'contexts/OpenedTypeContext';
import { StyledLayerSettingsComponent } from './styles';
import CheckboxTree from './CheckboxTree';
import LayerGroup from 'ol/layer/Group';
import {
  getDefaultOverLayers,
  getDefaultTAPISOverLayers,
  MapLegendType,
  HOME_LAYER_GROUP,
  isGeoproductLayer,
  getDefaultLBISOverLayers,
} from 'utils/mapUtils';
import type { TreeProps } from 'antd/es/tree';
import type { Key } from 'rc-tree/lib/interface';
import PlannedDocumentLayerSettings from './PlannedDocumentLayerSettings';
import BaseLayer from 'ol/layer/Base';
import { Label, Tooltip, Icon } from 'ui';
import { useIntl } from 'react-intl';
import { Image as ImageLayer } from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import { CollectionEvent } from 'ol/Collection';
import WMSLayerTree from './WMSLayerTree';

let defaultLayers = getDefaultOverLayers();
let defaultTAPISLayers = getDefaultTAPISOverLayers();
let defaultLBISLayers = getDefaultLBISOverLayers();

const getVisibleLayerKeys = (lg: LayerGroup): string[] => {
  if (lg.get('singleLayer')) {
    if (lg.getVisible()) {
      return [lg.get('id')];
    }
    return [];
  } else {
    return lg
      .getLayers()
      .getArray()
      .flatMap((l) => (l instanceof LayerGroup ? getVisibleLayerKeys(l) : l.getVisible() ? l.get('id') : []));
  }
};

export const getDefaultCheckedKeys = (lg: LayerGroup, checkKey: number) => getVisibleLayerKeys(lg);

const checkLayers = (lg: LayerGroup, keys: Key[]) => {
  if (lg.get('singleLayer')) {
    lg.setVisible(keys.length > 0);
  } else {
    (lg as LayerGroup)
      .getLayers()
      .forEach((l) => (l instanceof LayerGroup ? checkLayers(l, keys) : l.setVisible(keys.indexOf(l.get('id')) >= 0)));
  }
};

export const onCheckLayer = (
  layerGroup: LayerGroup,
  checkedKeys: Key[] | { checked: Key[]; halfChecked: Key[] },
  layerGroupId?: string
) => {
  if (layerGroup) {
    const lg = layerGroupId
      ? layerGroup
          .getLayers()
          .getArray()
          .find((l) => l.get('id') === layerGroupId)
      : layerGroup;
    if (lg) {
      checkLayers(lg as LayerGroup, checkedKeys as Key[]);
    }
  }
};

export const getLegendTreeItems = (l: BaseLayer) =>
  l.get('legends') && l.get('legends').length > 0
    ? (l.get('legends') as MapLegendType[]).map((legend) =>
        legend.title
          ? {
              checkable: false,
              title: legend.title,
              key: `${l.get('id')}__${legend.title}`,
              children: [
                {
                  key: legend.url,
                  checkable: false,
                  title: <img src={legend.url} alt={`Apzīmējumi slānim ${legend.title}`} />,
                },
              ],
            }
          : {
              key: legend.url,
              checkable: false,
              title: <img src={legend.url} alt={`Apzīmējumi slānim ${l.get('title')}`} />,
            }
      )
    : [];

interface LayerSettingsProps {
  visibleLayers?: string[];
}

export const LayerSettings = ({ visibleLayers }: LayerSettingsProps) => {
  const map = useContext(MapContext);
  const { selectedTapisDocument, openedMapType } = useOpenedTypeState();
  const intl = useIntl();

  const layers =
    openedMapType === 'tapis' ? defaultTAPISLayers : openedMapType === 'lbis' ? defaultLBISLayers : defaultLayers;

  const [layerGroup, setLayerGroup] = useState<LayerGroup>();
  // use state for rerendering layer tree after checking/unchecking layers
  const [checkKey, setCheckKey] = useState<number>(1);
  const [isVisibleLayersApplied, setIsVisibleLayersApplied] = useState<boolean>(false);
  const [geoproductLayers, setGeoproductLayers] = useState<ImageLayer<ImageWMS>[]>([]);

  const onMapLayersAdd = (ce: CollectionEvent<BaseLayer>) => {
    if (isGeoproductLayer(ce.element)) {
      setGeoproductLayers([ce.element as ImageLayer<ImageWMS>, ...geoproductLayers]);
    }
  };

  const onMapLayersRemove = (ce: CollectionEvent<BaseLayer>) => {
    if (isGeoproductLayer(ce.element)) {
      setGeoproductLayers(geoproductLayers.filter((l) => l !== ce.element));
    }
  };

  // listen to map layer changes to update geoproductLayers
  useEffect(() => {
    if (map) {
      map.getLayers().on('add', onMapLayersAdd);
      map.getLayers().on('remove', onMapLayersRemove);
      setGeoproductLayers(
        map
          .getLayers()
          .getArray()
          .filter((l) => isGeoproductLayer(l))
          .map((l) => l as ImageLayer<ImageWMS>)
      );
      return () => {
        map.getLayers().un('add', onMapLayersAdd);
        map.getLayers().un('remove', onMapLayersRemove);
        setGeoproductLayers([]);
      };
    }
  }, [map]);

  // converts layers to layergroup
  useEffect(() => {
    if (map && layers.length > 0) {
      setLayerGroup(
        new LayerGroup({
          properties: {
            id: 'over',
          },
          layers: layers,
          zIndex: 10,
        })
      );
      return () => {
        setLayerGroup(undefined);
      };
    }
  }, [map, layers]);

  // adds/removes layer group in OL Map
  useEffect(() => {
    if (map && layerGroup) {
      map.addLayer(layerGroup);
      return () => {
        map.removeLayer(layerGroup);
      };
    }
  }, [map, layerGroup]);

  //reset isVisibleLayersApplied when only visibleLayers change
  useEffect(() => {
    if (visibleLayers) {
      setIsVisibleLayersApplied(false);
    }
  }, [visibleLayers]);

  // sets visible layers from props
  useEffect(() => {
    if (map && layerGroup && visibleLayers && !isVisibleLayersApplied) {
      if (visibleLayers.length === 1 && visibleLayers[0] === 'initial') {
        // set initial layer visibility
        defaultLayers = getDefaultOverLayers();
        defaultTAPISLayers = getDefaultTAPISOverLayers();
      } else {
        layerGroup
          .getLayers()
          .getArray()
          .forEach((l) => {
            const overKey = `${HOME_LAYER_GROUP}->over->${l.get('id')}->`;
            const checkedKeys = visibleLayers
              .map((k) => (k.startsWith(overKey) ? k.substring(overKey.length) : null))
              .filter((k) => !!k);
            onCheckLayer(layerGroup, checkedKeys as Key[], l.get('id'));
          });
      }
      setIsVisibleLayersApplied(true);
    }
  }, [map, layerGroup, visibleLayers]);

  const onCheckLayerWithState =
    (layerGroupId?: string): TreeProps['onCheck'] =>
    (checkedKeys) => {
      if (layerGroup) {
        onCheckLayer(layerGroup, checkedKeys, layerGroupId);
      }
      setCheckKey(checkKey + 1);
    };

  const renderTitle = (layer: BaseLayer) => {
    if (layer.get('tooltip')) {
      return (
        <Tooltip title={intl.formatMessage({ id: layer.get('tooltip') })}>
          {layer.get('title')}&nbsp;&nbsp;
          <Icon faBase="fal" icon="lightbulb" />
        </Tooltip>
      );
    } else {
      return layer.get('title');
    }
  };

  return (
    <>
      {openedMapType === 'tapis' && selectedTapisDocument && selectedTapisDocument.dok_id ? (
        <div>
          <Label
            extraBold
            subTitle
            label={intl.formatMessage(
              { id: 'layer_settings.tapis_ind' },
              { dok_nosaukums: selectedTapisDocument.Label }
            )}
          />
          <PlannedDocumentLayerSettings visibleLayers={visibleLayers} />
        </div>
      ) : null}
      {openedMapType !== 'tapis'
        ? geoproductLayers.map((layer) => (
            <div>
              <Label extraBold subTitle label={layer.get('title')} />
              <WMSLayerTree wmsLayer={layer} />
            </div>
          ))
        : null}
      <div>
        {openedMapType === 'tapis' ? (
          <Label extraBold subTitle label={intl.formatMessage({ id: 'layer_settings.tapis' })} />
        ) : (
          <Label extraBold subTitle label={intl.formatMessage({ id: 'layer_settings.geo' })} />
        )}
        <StyledLayerSettingsComponent>
          {layerGroup
            ? layerGroup
                .getLayers()
                .getArray()
                .map((l) => (
                  <div key={l.get('id')}>
                    <CheckboxTree
                      defaultExpandedKeys={[l.get('id')]}
                      checkedKeys={getDefaultCheckedKeys(l as LayerGroup, checkKey)}
                      onCheck={onCheckLayerWithState(l.get('id'))}
                      items={[
                        {
                          key: l.get('id'),
                          title: renderTitle(l),
                          children: l.get('singleLayer')
                            ? []
                            : (l as LayerGroup)
                                .getLayers()
                                .getArray()
                                .map((sl) => ({
                                  key: sl.get('id'),
                                  title: renderTitle(sl),
                                  children: getLegendTreeItems(sl),
                                })),
                        },
                      ]}
                    />
                  </div>
                ))
            : null}
        </StyledLayerSettingsComponent>
      </div>
    </>
  );
};

export default LayerSettings;
