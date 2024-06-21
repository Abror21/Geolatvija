import React, { useEffect, useContext, useState } from 'react';
import MapContext from '../../../../contexts/MapContext';
import { StyledLayerSettingsComponent } from '../styles';
import LayerGroup from 'ol/layer/Group';
import { onCheckLayer, getDefaultCheckedKeys, getLegendTreeItems } from '../index';
import useQueryApiClient from 'utils/useQueryApiClient';
import {
  getTAPISIndividualieWMTSLayerCfg,
  HOME_LAYER_GROUP,
  findLayerByIdDeep,
  ANOTACIJAS_LAYER_ZINDEX,
  REGLAMENTETIE_ZINDEX,
  ANOTACIJAS_LAYER_ID,
} from '../../../../utils/mapUtils';
import { useOpenedTypeState } from 'contexts/OpenedTypeContext';
import type { TreeProps } from 'antd/es/tree';
import Collection from 'ol/Collection';
import type { Key } from 'rc-tree/lib/interface';
import CheckboxDirectoryTree from '../CheckboxDirectoryTree';
import { listStatuses } from '../../../../config/config';

interface LayerDataType {
  Label: string;
  [key: string]: any;
}

interface PlannedDocumentLayerSettingsProps {
  visibleLayers?: string[];
  zoom?: boolean;
}

export const PlannedDocumentLayerSettings = ({ visibleLayers, zoom = false }: PlannedDocumentLayerSettingsProps) => {
  const map = useContext(MapContext);
  const openedType = useOpenedTypeState();
  const { selectedTapisDocument } = openedType;
  // use state for rerendering layer tree after checking/unchecking layers
  const [checkKey, setCheckKey] = useState<number>(1);
  const [isVisibleLayersApplied, setIsVisibleLayersApplied] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const { refetch } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/geoserver/get_extent/${selectedTapisDocument?.dok_id}`,
      disableOnMount: true,
    },
    onSuccess: (r) => {
      // zoom map to extent
      if (r && r.st_xmin && zoom) {
        map?.getView().fit([r.st_xmin, r.st_ymin, r.st_xmax, r.st_ymax]);
      }
    },
  });

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue as string[]);
  };

  useEffect(() => {
    if (map) {
      if (window.location.pathname === '/geo/tapis' && window.location.hash === '') {
        return;
      }
      if (selectedTapisDocument && selectedTapisDocument.dok_id) {
        const { dok_id, layerGroup } = selectedTapisDocument;
        if (selectedTapisDocument.zoomMapToDocument !== false && zoom) {
          refetch();
        }
        // create layers from planned document data
        const layerKeys = Object.keys(selectedTapisDocument).filter((k) => k.startsWith(`d_${dok_id}_`));

        const layers = layerKeys.map((lk) => {
          const layerName = lk.substring(`d_${dok_id}_`.length);
          const layerData = selectedTapisDocument[lk] as LayerDataType;
          if (layerName === 'citas_datu_kopas' && layerData) {
            const rasterLayerKeys = Object.keys(layerData).filter((k) => k.startsWith(`d_${dok_id}_`));
            const rasterLayers = rasterLayerKeys.map((rlk) => {
              const rasterLayerName = rlk.substring(`d_${dok_id}_`.length);
              return getTAPISIndividualieWMTSLayerCfg(
                layerName,
                layerData[rlk].Label,
                dok_id,
                rasterLayerName,
                false,
                `${dok_id}_${rasterLayerName}`
              );
            });
            return new LayerGroup({
              properties: {
                id: 'tapis_indiv_layer_rasters',
                title: layerData.Label,
              },
              layers: rasterLayers,
            });
          }
          return getTAPISIndividualieWMTSLayerCfg(layerName, layerData.Label, dok_id);
        });

        // indiv. slāņi:
        // https://tapis-atr.vraa.gov.lv/geoserver/document_layers/wmts?layer=reglamentetie&style=&tilematrixset=lks92&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=lks92%3A9&TileCol=1382&TileRow=480&VIEWPARAMS=dok_id:8371

        // citas datu kopas
        // https://tapis-atr.vraa.gov.lv/geoserver/document_layers/wmts?layer=citas_datu_kopas&style=&tilematrixset=lks92&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=lks92%3A9&TileCol=1382&TileRow=480&CQL_FILTER=location=%27../orto_d_8371_kadastra_karte.tif%27

        layerGroup.setLayers(new Collection(layers));
        map.removeLayer(layerGroup);
        map.addLayer(layerGroup);

        // move anotacijas layer to be just over reglamentetie if doc statuss is not Izstrādē and dok type LP or TP
        if (
          (selectedTapisDocument.DocType === 'Lokālplānojums' ||
            selectedTapisDocument.DocType === 'Teritorijas plānojums') &&
          selectedTapisDocument.TAPDStatuss !== listStatuses.find((s) => s.searchStatus === 'draft')?.treeJsonTitle
        ) {
          const anotacijasLayer = findLayerByIdDeep(map, ANOTACIJAS_LAYER_ID);
          if (anotacijasLayer) {
            anotacijasLayer.setZIndex(REGLAMENTETIE_ZINDEX + 1);
          }
        }
        //set to rerender layer tree
        setCheckKey(checkKey + 1);
      }
      return () => {
        if (selectedTapisDocument && selectedTapisDocument.layerGroup) {
          map.removeLayer(selectedTapisDocument.layerGroup);
          // move anotacijas layer back
          const anotacijasLayer = findLayerByIdDeep(map, ANOTACIJAS_LAYER_ID);
          if (anotacijasLayer) {
            anotacijasLayer.setZIndex(ANOTACIJAS_LAYER_ZINDEX);
          }
        }
      };
    }
  }, [map, selectedTapisDocument]);

  const onCheckLayerWithState =
    (layerGroupId?: string): TreeProps['onCheck'] =>
    (checkedKeys) => {
      if (selectedTapisDocument?.layerGroup) {
        onCheckLayer(selectedTapisDocument?.layerGroup, checkedKeys, layerGroupId);
      }
      setCheckKey(checkKey + 1);
    };

  //reset isVisibleLayersApplied when only visibleLayers change
  useEffect(() => {
    if (visibleLayers) {
      setIsVisibleLayersApplied(false);
    }
  }, [visibleLayers]);

  // sets visible layers from props
  useEffect(() => {
    if (map && selectedTapisDocument && selectedTapisDocument.layerGroup && visibleLayers && !isVisibleLayersApplied) {
      // check individual layers
      const indKey = `${HOME_LAYER_GROUP}->tapis_indiv_layers->`;
      const checkedKeys = visibleLayers
        .map((k) => (k.startsWith(indKey) ? k.substring(indKey.length) : null))
        .filter((k) => !!k);
      onCheckLayer(selectedTapisDocument.layerGroup, checkedKeys as Key[]);

      // check layers in layer groups
      selectedTapisDocument.layerGroup
        .getLayers()
        .getArray()
        .forEach((l) => {
          if (l instanceof LayerGroup) {
            const indGroupKey = `${HOME_LAYER_GROUP}->tapis_indiv_layers->${l.get('id')}->`;
            const checkedKeys = visibleLayers
              .map((k) => (k.startsWith(indGroupKey) ? k.substring(indGroupKey.length) : null))
              .filter((k) => !!k);
            onCheckLayer(selectedTapisDocument.layerGroup, checkedKeys as Key[], l.get('id'));
          }
        });
      setIsVisibleLayersApplied(true);
    }
  }, [map, selectedTapisDocument, visibleLayers]);

  if (!selectedTapisDocument || !selectedTapisDocument.dok_id || !selectedTapisDocument.layerGroup) return null;

  return (
    <div key={selectedTapisDocument.dok_id}>
      <StyledLayerSettingsComponent>
        <CheckboxDirectoryTree
          checkedKeys={getDefaultCheckedKeys(selectedTapisDocument.layerGroup, checkKey)}
          onCheck={onCheckLayerWithState()}
          defaultExpandedKeys={[]}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          items={selectedTapisDocument.layerGroup
            .getLayers()
            .getArray()
            .map((l) => ({
              key: l.get('id'),
              title: l.get('title'),
              children:
                l instanceof LayerGroup
                  ? (l as LayerGroup)
                      .getLayers()
                      .getArray()
                      .map((sl) => ({
                        key: sl.get('id'),
                        title: sl.get('title'),
                      }))
                  : getLegendTreeItems(l),
            }))}
        />
      </StyledLayerSettingsComponent>
    </div>
  );
};

export default PlannedDocumentLayerSettings;
