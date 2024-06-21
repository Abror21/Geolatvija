import { useEffect, useContext, useState, useCallback } from 'react';
import MapContext from '../../../../contexts/MapContext';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Spinner } from '../../../../ui';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import type { DataNode } from 'antd/es/tree';
import { Image as ImageLayer } from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import { routes } from '../../../../config/config';
import { infoFormats, GEOPRODUCT_LAYER_PREFIX } from 'utils/mapUtils';
import WMSLayerTree, { GROUP_KEY_PREFIX, MAIN_KEY } from '../WMSLayerTree';

interface WMSLayerTreeFromUrlProps {
  capabilitiesUrl: string;
  availableOnlyInGeoPortal: boolean;
  dppsUuid?: string;
  serviceId: number;
  title: string;
  includableInEmbed: boolean;
}

const bestProjections = ['EPSG:3059', 'EPSG:3857', 'EPSG:4326'];
const bestFormats = ['image/png8', 'image/png', 'image/png24', 'image/png32', 'image/jpeg'];

const findBest = (available: string[] | undefined, best: string[]): string => {
  if (available && Array.isArray(available) && available.length > 0) {
    const found = best.find((b) => available.indexOf(b) > -1);
    return found || available[0];
  } else {
    return best[0];
  }
};

export const WMSLayerTreeFromUrl = ({
  capabilitiesUrl,
  availableOnlyInGeoPortal,
  dppsUuid,
  serviceId,
  title,
  includableInEmbed,
}: WMSLayerTreeFromUrlProps) => {
  const map = useContext(MapContext);

  const [layer, setLayer] = useState<ImageLayer<ImageWMS>>();

  const [capabilitiesResponse, setCapabilitiesResponse] = useState<any | undefined>();

  const { isLoading } = useQueryApiClient({
    request: {
      url: capabilitiesUrl,
      disableOnMount: availableOnlyInGeoPortal,
    },
    onSuccess: (res) => setCapabilitiesResponse(res),
  });

  const { isLoading: isLoadingProxyLoading, appendData } = useQueryApiClient({
    request: {
      url: `api/v1/public/geoproducts/dpps-capabilities/:id/:dppsUuid`,
      disableOnMount: true,
    },
    onSuccess: (res) => setCapabilitiesResponse(res),
  });

  useEffect(() => {
    if (availableOnlyInGeoPortal) {
      appendData({}, { id: serviceId, dppsUuid });
    }
  }, [availableOnlyInGeoPortal, serviceId, dppsUuid]);

  //build layers from response
  useEffect(() => {
    if (map && capabilitiesResponse && (!Array.isArray(capabilitiesResponse) || capabilitiesResponse.length > 0)) {
      let wmsLayer: ImageLayer<ImageWMS>;
      const parser = new WMSCapabilities();
      try {
        const wmsData = parser.read(capabilitiesResponse);
        const rootLayer = wmsData?.Capability?.Layer;

        if (rootLayer && rootLayer.Layer && rootLayer.Layer.length > 0) {
          let groupKeyCounter = 0;
          const parseLayers = (layers: any[], onlyLayers: boolean = false): DataNode[] => {
            const children = layers.map((l) => ({
              key: l.Name || `${GROUP_KEY_PREFIX}${groupKeyCounter++}`,
              title: l.Title || 'Kartes slāņi',
              children: l.Layer ? parseLayers(l.Layer, true) : undefined,
            }));

            if (onlyLayers) {
              return children;
            }

            return [
              {
                key: MAIN_KEY,
                title: 'Kartes slāņi',
                children: children,
              },
            ];
          };
          // add wms layer to map

          const wmsInfoFormats = wmsData.Capability.Request?.GetFeatureInfo?.Format;
          const queryable = wmsInfoFormats && wmsInfoFormats.length > 0;

          wmsLayer = new ImageLayer({
            properties: {
              id: `${GEOPRODUCT_LAYER_PREFIX}${
                availableOnlyInGeoPortal
                  ? `${routes.api.baseUrl}/api/v1/public/geoproducts/dpps-capabilities/${serviceId}/${dppsUuid}`
                  : capabilitiesUrl
              }`,
              geoLayerItems: parseLayers(rootLayer.Layer),
              title,
              queryable,
              infoFormat: findBest(wmsInfoFormats, Object.keys(infoFormats)),
              includableInEmbed,
            },
            visible: false,
            source: new ImageWMS({
              attributions: '',
              projection: findBest(rootLayer.CRS, bestProjections),
              url: availableOnlyInGeoPortal
                ? `${routes.api.baseUrl}/api/v1/public/geoproducts/dpps-capabilities/${serviceId}/${dppsUuid}`
                : capabilitiesUrl,
              params: {
                LAYERS: '',
                STYLES: '',
                FORMAT: findBest(wmsData.Capability.Request?.GetMap?.Format, bestFormats),
              },
            }),
          });
          setLayer(wmsLayer);
          map.addLayer(wmsLayer);
        } else {
          setLayer(undefined);
        }
      } catch (error) {
        setLayer(undefined);
      }
      return () => {
        //clean up
        if (wmsLayer) map.removeLayer(wmsLayer);
      };
    }
  }, [map, capabilitiesResponse]);

  return (
    <Spinner spinning={isLoading || isLoadingProxyLoading} dontRender>
      {!layer ? <span>Nevarēja iegūt kartes slāņu sarakstu</span> : <WMSLayerTree wmsLayer={layer} />}
    </Spinner>
  );
};

export default WMSLayerTreeFromUrl;
