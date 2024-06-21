import { useEffect, useState, useCallback } from 'react';
import { StyledLayerSettingsComponent } from '../styles';
import CheckboxTree from '.././CheckboxTree';
import LayerGroup from 'ol/layer/Group';
import type { TreeProps } from 'antd/es/tree';
import type { Key } from 'rc-tree/lib/interface';
import { Spinner } from '../../../../ui';
import { Image as ImageLayer } from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import OlLayerBase from 'ol/layer/Base';
import Tile from 'ol/layer/Tile';
import Image from 'ol/layer/Image';

interface WMSLayerTreeProps {
  wmsLayer: ImageLayer<ImageWMS>;
}

export const GROUP_KEY_PREFIX = 'fake_group_key_';
export const MAIN_KEY = 'main-key';

const defaultExpandedKeys: string[] = [MAIN_KEY];

export const WMSLayerTree = ({ wmsLayer }: WMSLayerTreeProps) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<number>(0);

  const addLoading = useCallback(() => {
    setLoading((l) => l + 1);
  }, []);

  const addLoaded = useCallback(() => {
    setLoading((l) => l - 1);
  }, []);

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

  useEffect(() => {
    if (wmsLayer) {
      setLoadingEvents(wmsLayer);
      const selectedLayers = wmsLayer.getSource()?.getParams()?.LAYERS?.split(',');
      setCheckedKeys(selectedLayers ? selectedLayers : []);
    }
  }, [wmsLayer]);

  useEffect(() => {
    // update wms layer visibility
    // update extra params
    if (wmsLayer) {
      let layerKeys = checkedKeys.filter((k) => !k.startsWith(GROUP_KEY_PREFIX) && k !== MAIN_KEY && k !== '');

      wmsLayer.getSource()?.updateParams({ LAYERS: layerKeys.join(','), STYLES: layerKeys.map((k) => '').join(',') });
      wmsLayer.setVisible(layerKeys.length > 0);
    }
  }, [checkedKeys]);

  const onCheck: TreeProps['onCheck'] = (checkedKeys: any) => {
    setCheckedKeys((checkedKeys as Key[]).map((k) => k.toString()));
  };

  const layerItems = wmsLayer.get('geoLayerItems');

  return (
    <StyledLayerSettingsComponent>
      <CheckboxTree
        checkedKeys={checkedKeys}
        onCheck={onCheck}
        defaultExpandedKeys={defaultExpandedKeys}
        items={layerItems}
      />
      <Spinner className="mt-4" spinning={loading > 0} children={''} />
    </StyledLayerSettingsComponent>
  );
};

export default WMSLayerTree;
