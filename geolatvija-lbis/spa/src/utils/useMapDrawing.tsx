import { useCallback, useContext, useEffect, useState } from 'react';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlCollection from 'ol/Collection';
import OlStyleStyle from 'ol/style/Style';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleFill from 'ol/style/Fill';
import OlInteractionModify, { ModifyEvent } from 'ol/interaction/Modify';
import Feature from 'ol/Feature';
import { Circle, SimpleGeometry } from 'ol/geom';
import Point from 'ol/geom/Point';
import OlGeometry from 'ol/geom/Geometry';
import OlFeature from 'ol/Feature';
import { getIconStyle } from 'utils/mapUtils';
import { Coordinate } from 'ol/coordinate';
import Map from 'ol/Map';
import MapContext from 'contexts/MapContext';

const fillColor = 'rgba(81, 139, 51, 0.3)';
const strokeColor = 'rgba(81, 139, 51, 0.9)';
const MIN_RADIUS = 0.2;
const MAX_RADIUS = 9.0;
const INITIAL_RADIUS = 1.0;

type UseMapDrawingProps = {
  coords: Coordinate | undefined;
  setCoords: Function;
  form?: any;
  notificationData?: any;
  setInitialPointIsSet?: React.Dispatch<React.SetStateAction<boolean>>;
  initialPointIsSet?: boolean;
  readOnly?: boolean;
};

const useMapDrawing = ({
  form,
  coords,
  setInitialPointIsSet,
  initialPointIsSet,
  notificationData,
  setCoords,
  readOnly,
}: UseMapDrawingProps) => {
  const [drawLayer, setDrawLayer] = useState<OlLayerVector<OlSourceVector<OlGeometry>> | null>(null);
  const [iconLayer, setIconLayer] = useState<OlLayerVector<OlSourceVector<OlGeometry>> | null>(null);
  const map = useContext(MapContext);

  // add drawing layer
  useEffect(() => {
    if (map) {
      const ml = new OlLayerVector({
        properties: {
          name: '_apply_for_notifications_draw',
        },
        source: new OlSourceVector({
          features: new OlCollection<OlFeature<OlGeometry>>(),
        }),
        style: new OlStyleStyle({
          fill: new OlStyleFill({
            color: fillColor,
          }),
          stroke: new OlStyleStroke({
            color: strokeColor,
            width: 2,
          }),
        }),
        zIndex: 100,
      });
      map.addLayer(ml);
      setDrawLayer(ml);
      return () => {
        map.removeLayer(ml);
        setDrawLayer(null);
      };
    }
  }, [map]);

  // update coordinates and radius after editing in map
  const onModifyEnd = useCallback(
    (evt: ModifyEvent) => {
      if (map && evt.features?.item(0)?.getGeometry()) {
        const circle = evt.features.item(0).getGeometry() as Circle;
        setCoords([...circle.getCenter()]);
        const radius = circle.getRadius() / 1000.0;
        const formattedRadius =
          radius < MIN_RADIUS ? MIN_RADIUS : radius > MAX_RADIUS ? MAX_RADIUS : parseFloat(radius.toFixed(1));
        if (form) {
          form.setFieldValue('radius', formattedRadius);
        }
      }
    },
    [map]
  );

  // add/remove map interaction
  useEffect(() => {
    if (map && drawLayer && readOnly !== true) {
      const modify = new OlInteractionModify({
        source: drawLayer.getSource() || undefined,
      });
      modify.on('modifyend', (e) => onModifyEnd(e));
      map.addInteraction(modify);
      return () => {
        map.removeInteraction(modify);
      };
    }
  }, [map, drawLayer, onModifyEnd, readOnly]);

  // update geometry on map
  const updateMapCircle = () => {
    const radius = notificationData?.radius
      ? notificationData?.radius
      : form?.getFieldValue('radius')
      ? form?.getFieldValue('radius')
      : 1;
    if (map && drawLayer) {
      drawLayer.getSource()?.clear();
      if (coords) {
        drawLayer.getSource()?.addFeature(
          new Feature({
            geometry: new Circle([...coords], radius * 1000),
          })
        );
        const point = new Point([...coords]);
        if (!initialPointIsSet && setInitialPointIsSet) {
          zoomToInputAddress(point);
          setInitialPointIsSet(true);
        } else if (!setInitialPointIsSet && !initialPointIsSet) {
          zoomToInputAddress(point);
        }
      }
    }
  };

  // update geometry when coords changes
  useEffect(() => {
    updateMapCircle();
  }, [map, drawLayer, coords]);

  // Zoom map to input address entered by user
  const zoomToInputAddress = (geometry: OlGeometry, zoom = true) => {
    if (coords) {
      drawLayer?.getSource()?.addFeature(
        new OlFeature({
          geometry,
        })
      );
      zoom &&
        map?.getView().fit(geometry as SimpleGeometry, {
          duration: 800,
          maxZoom: 6,
        });
    }
  };

  // Define the icon marker styles
  useEffect(() => {
    if (map) {
      const iconLayer = new OlLayerVector({
        properties: {
          name: '_icon_click_result_on_zoom',
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

  // If cords are applied set the icon marker in center of map
  useEffect(() => {
    if (iconLayer) {
      iconLayer?.getSource()?.clear();
      if (coords) {
        iconLayer?.getSource()?.addFeature(
          new Feature({
            geometry: new Point([...coords]),
          })
        );
      }
    }
  }, [coords, iconLayer]);

  return { updateMapCircle };
};

export default useMapDrawing;
