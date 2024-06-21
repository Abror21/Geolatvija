import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useRef, useState } from 'react';
import MapContext from 'contexts/MapContext';
import { Coordinate } from 'ol/coordinate';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import { fromLKSToGPS, getParcelGetFeatureInfoUrl } from 'utils/mapUtils';
import { Button, Tooltip } from 'ui';
import { Space } from 'antd';
import { useIntl } from 'react-intl';
import { StyledCoordsComponent } from './styles';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { VARIABLES } from '../../../styles/globals';
import { MeasureProps } from '../../../pages/LayoutPage';
import { useOpenedTypeState } from 'contexts/OpenedTypeContext';
import UnauthenticatedModal from '../../Modals/UnauthenticatedModal';
import { useNavigate } from 'react-router-dom';
import { useApplyForNotifications } from '../../../contexts/ApplyForNotificationsContext';
import { useInformativeStatement } from '../../../contexts/InformativeStatementContext';
import useJwt from '../../../utils/useJwt';
import { useUserState } from '../../../contexts/UserContext';
import axios from 'axios';
import toastMessage from '../../../utils/toastMessage';

interface CoordinatesWindowPosition {
  x: number;
  y: number;
}

interface CoordComponentProps extends MeasureProps {
  setShowCoordinatesWindow: Dispatch<SetStateAction<boolean>>;
  showCoordinatesWindow: boolean;
}

export const CoordsComponent = ({
  enabledMeasureButton,
  setEnabledMeasureButton,
  setShowCoordinatesWindow,
  showCoordinatesWindow,
}: CoordComponentProps) => {
  const [coords, setCoords] = useState<Coordinate | undefined>();
  const [showUnauthenticated, setShowUnauthenticated] = useState<boolean>(false);
  const [coordinatesWindowPosition, setCoordinatesWindowPosition] = useState<CoordinatesWindowPosition | null>(null);

  const intl = useIntl();
  const map = useContext(MapContext);
  const { openedMapType } = useOpenedTypeState();
  const { setCoords: setNotificationCoords } = useContext(NotificationContext);
  const { setSessionValue: setApplyForNotificationsSessionValue } = useApplyForNotifications();
  const { setIsModalOpen, setKadastrs } = useInformativeStatement();
  const { setShowUnauthenticated: showInformativeStatementUnauthenticated } = useInformativeStatement();
  const { isTokenActive } = useJwt();
  const navigate = useNavigate();
  const user = useUserState();
  const coordsComponentRef = useRef<HTMLDivElement>(null);

  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const userCanAccess = activeRole?.code === 'authenticated';

  const onMapClick = useCallback((olEvt: OlMapBrowserEvent<MouseEvent>) => {
    olEvt.preventDefault();
    setCoords(olEvt.coordinate);
    setShowCoordinatesWindow(false);
  }, []);

  const onMapRightClick = useCallback(
    (evt: MouseEvent) => {
      if (map) {
        evt.preventDefault();
        const eventWithLayerXY = evt as MouseEvent & { layerX: number; layerY: number; target: Element };

        const displaySize = { innerHeight: window.innerHeight, innerWidth: window.innerWidth };
        const calcWidthDiff = displaySize.innerWidth - eventWithLayerXY.layerX;
        let calcWidthPosition =
          calcWidthDiff < parseInt(VARIABLES.coordinateWindowWidth)
            ? eventWithLayerXY.layerX - parseInt(VARIABLES.coordinateWindowWidthToDecrease)
            : eventWithLayerXY.layerX;
        const calcHeightDiff = displaySize.innerHeight - eventWithLayerXY.layerY - (openedMapType === 'geo' ? 50 : 150);

        let calcHeightPosition =
          calcHeightDiff < parseInt(VARIABLES.coordinateWindowHeight)
            ? eventWithLayerXY.layerY -
              parseInt(VARIABLES.coordinateWindowHeightToDecrease) -
              30 +
              (openedMapType === 'geo' ? 100 : 0)
            : eventWithLayerXY.layerY;

        if (openedMapType === 'geo' || openedMapType === 'tapis') {
          calcWidthPosition -= parseInt(VARIABLES.coordinateWindowWidthToDecrease);
        }

        setCoords(map.getCoordinateFromPixel([eventWithLayerXY.layerX, eventWithLayerXY.layerY]));
        setCoordinatesWindowPosition({ x: calcWidthPosition, y: calcHeightPosition });

        //disable right click for buttons open coord window
        if (
          ['ol-zoom-out', 'ol-zoom-in', 'ol-full-screen-false', 'ol-full-screen-true'].includes(
            eventWithLayerXY?.target?.className
          )
        ) {
          return;
        }

        axios
          .get(
            getParcelGetFeatureInfoUrl(
              map,
              map.getCoordinateFromPixel([eventWithLayerXY.layerX, eventWithLayerXY.layerY])
            ) as string
          )
          .then((response: any) => {
            setKadastrs(response?.['data']?.['features']?.[0]?.['properties']?.['code']);
          });

        setShowCoordinatesWindow(true);
      }
    },
    [map, openedMapType]
  );

  useEffect(() => {
    if (map) {
      map.on('click', onMapClick);
      map.getViewport().addEventListener('contextmenu', onMapRightClick);
      return () => {
        // unsubscription
        map.getViewport().removeEventListener('contextmenu', onMapRightClick);
        map.un('click', onMapClick);
      };
    }
  }, [map, onMapClick, onMapRightClick]);

  // When map starts moving close the coords modal
  useEffect(() => {
    if (map && showCoordinatesWindow) {
      map.on('movestart', () => {
        setShowCoordinatesWindow(false);
      });

      return () => {
        map.un('movestart', () => {
          setShowCoordinatesWindow(false);
        });
      };
    }
  }, [map, showCoordinatesWindow]);

  // Handles clicks and esc key press outside coords modal
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (coordsComponentRef.current && !coordsComponentRef.current.contains(event.target as Node)) {
        setShowCoordinatesWindow(false);
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCoordinatesWindow(false);
      }
    };

    if (showCoordinatesWindow) {
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [showCoordinatesWindow]);

  const copyLink = (text: string) => () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toastMessage.success(intl.formatMessage({ id: 'map.copied_to_clipboard' }));
      setShowCoordinatesWindow(false);
    }
  };

  const onSignUpClick = () => {
    if (!isTokenActive()) {
      setShowUnauthenticated(true);
      return;
    }

    setNotificationCoords(coords);
    setShowCoordinatesWindow(false);
    navigate('/main?notification=open');
  };

  const checkIfUserIsAuth = () => {
    const hasJwt = isTokenActive();
    showInformativeStatementUnauthenticated(!hasJwt);
    setIsModalOpen(hasJwt);
  };

  const onClickMeasureDistance = () => {
    setEnabledMeasureButton(enabledMeasureButton === 'line' ? null : 'line');
    setShowCoordinatesWindow(false);
  };

  const onClickMeasureArea = () => {
    setEnabledMeasureButton(enabledMeasureButton === 'poly' ? null : 'poly');
    setShowCoordinatesWindow(false);
  };

  const lksCoordsFormatted = coords ? `${coords[1].toFixed(1)}, ${coords[0].toFixed(1)}` : '';
  const wgsCoords = coords ? fromLKSToGPS(coords) : null;
  const wgsCoordsFormatted = wgsCoords ? `${wgsCoords[1].toFixed(6)}, ${wgsCoords[0].toFixed(6)}` : '';

  const onUnauthenticated = () => {
    if (!coords?.[0] || !coords?.[1]) return;
    setApplyForNotificationsSessionValue({
      open: true,
      coordinate: [coords?.[0], coords?.[1]],
    });
  };

  return (
    <StyledCoordsComponent ref={coordsComponentRef}>
      {showCoordinatesWindow && (
        <div
          className="coordinate-window"
          style={{
            top: coordinatesWindowPosition ? `${coordinatesWindowPosition.y}px` : 0,
            left: coordinatesWindowPosition ? `${coordinatesWindowPosition.x}px` : 0,
          }}
        >
          <div className="options-wrapper">
            {openedMapType === 'tapis' && (
              <>
                {!userCanAccess && isTokenActive() ? (
                  <>
                    <Tooltip
                      className="disabled-option-tooltip"
                      hack
                      title={intl.formatMessage({ id: 'map.sign_up_for_notification_not_allowed' })}
                    >
                      <div
                        onClick={onSignUpClick}
                        className={`option-label ${!userCanAccess && isTokenActive() && 'disabled-option'}`}
                      >
                        {intl.formatMessage({ id: 'map.sign_up_for_notification' })}
                      </div>
                    </Tooltip>
                    <Tooltip
                      className="disabled-option-tooltip"
                      hack
                      title={intl.formatMessage({ id: 'map.informative_statement_not_allowed' })}
                    >
                      <div
                        onClick={() => checkIfUserIsAuth()}
                        className={`option-label ${!userCanAccess && isTokenActive() && 'disabled-option'}`}
                      >
                        {intl.formatMessage({ id: 'map.informative_statement' })}
                      </div>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip hack title={intl.formatMessage({ id: 'map.tooltip.sign_up_for_notification' })}>
                      <div onClick={onSignUpClick} className="option-label">
                        {intl.formatMessage({ id: 'map.sign_up_for_notification' })}
                      </div>
                    </Tooltip>
                    <Tooltip hack title={intl.formatMessage({ id: 'map.tooltip.informative_statement' })}>
                      <div onClick={() => checkIfUserIsAuth()} className="option-label">
                        {intl.formatMessage({ id: 'map.informative_statement' })}
                      </div>
                    </Tooltip>
                  </>
                )}
              </>
            )}
            <div onClick={onClickMeasureDistance} className="option-label">
              {enabledMeasureButton === 'line'
                ? intl.formatMessage({ id: 'map.to_stop_measure' })
                : intl.formatMessage({ id: 'map.to_measure' })}
            </div>
            <div onClick={onClickMeasureArea} className="option-label">
              {enabledMeasureButton === 'poly'
                ? intl.formatMessage({ id: 'map.to_stop_measure_area' })
                : intl.formatMessage({ id: 'map.to_measure_area' })}
            </div>
            <Tooltip hack title={intl.formatMessage({ id: 'map.tooltip.coords_lks' })}>
              <div className="option-label" onClick={copyLink(lksCoordsFormatted)}>
                {intl.formatMessage({ id: 'map.coords_lks' }, { coords: lksCoordsFormatted })}
              </div>
            </Tooltip>
            <Tooltip hack title={intl.formatMessage({ id: 'map.tooltip.coords_wgs' })}>
              <div className="option-label" onClick={copyLink(wgsCoordsFormatted)}>
                {intl.formatMessage({ id: 'map.coords_wgs' }, { coords: wgsCoordsFormatted })}
              </div>
            </Tooltip>
          </div>
        </div>
      )}
      <UnauthenticatedModal
        additionalOnOkExecution={onUnauthenticated}
        setShowModal={setShowUnauthenticated}
        showModal={showUnauthenticated}
      />
    </StyledCoordsComponent>
  );
};

export default CoordsComponent;
