import { useCallback, useContext, useEffect, useState } from 'react';
import OlMap from 'ol/Map';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlCollection from 'ol/Collection';
import OlMultiPolygon from 'ol/geom/MultiPolygon';
import OlMultiLineString from 'ol/geom/MultiLineString';
import OlStyleStyle from 'ol/style/Style';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleFill from 'ol/style/Fill';
import OlStyleCircle from 'ol/style/Circle';
import OlInteractionDraw, { DrawEvent } from 'ol/interaction/Draw';
import { Coordinate } from 'ol/coordinate';
import OlOverlay from 'ol/Overlay';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import OlGeomPolygon from 'ol/geom/Polygon';
import OlGeomLineString from 'ol/geom/LineString';
import OlEvent from 'ol/events/Event';
import MapContext from 'contexts/MapContext';
import { formatArea, formatLength } from 'utils/mapUtils';
import { StyledMeasure } from './styles';
import { Button } from '../../../ui';
import { MeasureProps } from '../../../pages/LayoutPage';

const fillColor = 'rgba(255, 0, 0, 0.5)';
const strokeColor = 'rgba(255, 0, 0, 0.8)';

const getMeasureLabelAndCoord = (geometry: OlGeometry | undefined, map: OlMap): [string | null, Coordinate | null] => {
  let geom = geometry;

  if (geom instanceof OlMultiPolygon) {
    geom = geom.getPolygons()[0];
  } else if (geom instanceof OlMultiLineString) {
    geom = geom.getLineStrings()[0];
  }

  let measureTooltipCoord = null;
  let output = null;

  if (geom instanceof OlGeomPolygon) {
    output = formatArea(geom, map);
    measureTooltipCoord = geom.getInteriorPoint().getCoordinates();
  } else if (geom instanceof OlGeomLineString) {
    output = formatLength(geom, map);
    measureTooltipCoord = geom.getLastCoordinate();
  }
  return [output, measureTooltipCoord];
};

export const Measure = ({
  enabledMeasureButton: enabledButton,
  setEnabledMeasureButton: setEnabledButton,
}: MeasureProps) => {
  const map = useContext(MapContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [measureLayer, setMeasureLayer] = useState<OlLayerVector<OlSourceVector<OlGeometry>> | null>(null);
  const [movingTooltip, setMovingTooltip] = useState<OlOverlay | null>(null);
  const [measureTooltips, setMeasureTooltips] = useState<OlOverlay[]>([]);

  const toggleEnabledButton = (type: 'poly' | 'line') => {
    if (enabledButton === type) {
      setEnabledButton(null);
    } else {
      setEnabledButton(type);
    }
  };

  // add measure layer
  useEffect(() => {
    if (map) {
      const ml = new OlLayerVector({
        properties: {
          name: '_measure',
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
          image: new OlStyleCircle({
            radius: 7,
            fill: new OlStyleFill({
              color: fillColor,
            }),
          }),
        }),
        zIndex: 100,
      });
      map.addLayer(ml);
      setMeasureLayer(ml);
      return () => {
        map.removeLayer(ml);
        setMeasureLayer(null);
      };
    }
  }, [map]);

  const updateMeasureTooltip = useCallback(
    (evt: OlEvent) => {
      if (map && movingTooltip && evt.target instanceof OlGeometry) {
        const [output, measureTooltipCoord] = getMeasureLabelAndCoord(evt.target, map);
        const me = movingTooltip.getElement();
        if (output && me && measureTooltipCoord) {
          me.innerHTML = output;
          movingTooltip.setPosition(measureTooltipCoord);
        }
      }
    },
    [map, movingTooltip]
  );

  const onDrawStart = useCallback(
    (evt: DrawEvent) => {
      const feature = evt.feature as OlFeature<OlGeometry>;
      feature.getGeometry()?.on('change', updateMeasureTooltip);
    },
    [updateMeasureTooltip]
  );

  const onDrawEnd = useCallback(
    (evt: DrawEvent) => {
      if (!movingTooltip || !map) {
        return;
      }
      const feature = evt.feature as OlFeature<OlGeometry>;
      if (feature && feature.getGeometry()) {
        const [output, measureTooltipCoord] = getMeasureLabelAndCoord(feature.getGeometry(), map);
        if (output && measureTooltipCoord) {
          const div = document.createElement('div');
          div.className = 'measure-static-tooltip';
          div.innerHTML = output;
          const over = new OlOverlay({
            element: div,
            offset: [0, -15],
            positioning: 'bottom-center',
          });
          map.addOverlay(over);
          over.setPosition(measureTooltipCoord);
          setMeasureTooltips((p) => [...p, over]);

          //remove last moving tooltip
          const me = movingTooltip.getElement();
          if (me) {
            me.innerHTML = '';
            movingTooltip.setPosition(undefined);
          }
        }
      }
    },
    [map, movingTooltip]
  );

  // add/remove map interaction
  useEffect(() => {
    if (map && measureLayer && enabledButton) {
      const di = new OlInteractionDraw({
        source: measureLayer.getSource() || undefined,
        type: enabledButton === 'poly' ? 'MultiPolygon' : 'MultiLineString',
        stopClick: true,
        style: new OlStyleStyle({
          fill: new OlStyleFill({
            color: fillColor,
          }),
          stroke: new OlStyleStroke({
            color: strokeColor,
            width: 2,
          }),
          image: new OlStyleCircle({
            radius: 5,
            stroke: new OlStyleStroke({
              color: strokeColor,
            }),
            fill: new OlStyleFill({
              color: fillColor,
            }),
          }),
        }),
      });

      di.on('drawstart', (e) => onDrawStart(e));
      di.on('drawend', (e) => onDrawEnd(e));

      map.addInteraction(di);

      return () => {
        map.removeInteraction(di);
        measureLayer.getSource()?.clear();
      };
    }
  }, [map, enabledButton, measureLayer, onDrawEnd, onDrawStart]);

  // add/remove movingTooltip overlay
  useEffect(() => {
    if (map) {
      if (movingTooltip) {
        map.removeOverlay(movingTooltip);
      }
      measureTooltips.forEach((t) => {
        map.removeOverlay(t);
      });
      if (enabledButton) {
        const mte = document.createElement('div');
        mte.className = 'measure-dynamic-tooltip';
        const mt = new OlOverlay({
          element: mte,
          offset: [0, -15],
          positioning: 'bottom-center',
        });
        map.addOverlay(mt);
        setMovingTooltip(mt);
      }
      return () => {
        setMovingTooltip(null);
        setMeasureTooltips([]);
      };
    }
  }, [map, enabledButton]);

  return (
    <StyledMeasure className="ol-unselectable ol-control" onClick={() => setIsExpanded((prev) => !prev)}>
      <Button
        key="length"
        className={
          'length measure-button' +
          (isExpanded ? ' expanded' : '') +
          (enabledButton === 'line' || (enabledButton === 'poly' && !isExpanded) ? ' active' : '')
        }
        icon={!isExpanded && enabledButton === 'poly' ? 'draw-polygon' : 'ruler'}
        faBase="far"
        title="Mērīt attālumu"
        onClick={() => toggleEnabledButton('line')}
      />

      {isExpanded ? (
        <>
          <Button
            key="area"
            className={'area measure-button' + (enabledButton === 'poly' ? ' active' : '')}
            icon="draw-polygon"
            faBase="far"
            title="Mērīt platību"
            onClick={() => toggleEnabledButton('poly')}
          />
        </>
      ) : null}
    </StyledMeasure>
  );
};

export default Measure;
