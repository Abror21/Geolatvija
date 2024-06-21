import React, { useCallback, useContext } from 'react';
import MapContext from '../../../contexts/MapContext';
import { StyledMapComponent } from './styles';

interface MapComponentProps {
  children?: React.ReactNode;
  embeded?: boolean;
  zoomButtons?: boolean;
}

export const MapComponent = ({ children, embeded, zoomButtons }: MapComponentProps) => {
  const map = useContext(MapContext);

  const refCallback = useCallback(
    (ref: HTMLDivElement) => {
      if (!map) {
        return;
      }
      if (ref === null) {
        map.setTarget(undefined);
      } else {
        map.setTarget(ref);
      }
    },
    [map]
  );

  if (!map) {
    return <></>;
  }

  return (
    <StyledMapComponent
      ref={refCallback}
      role="presentation"
      className={`map ${zoomButtons ? 'zoom-buttons-only' : ''}`}
      embeded={embeded}
    >
      {children}
    </StyledMapComponent>
  );
};

export default MapComponent;
