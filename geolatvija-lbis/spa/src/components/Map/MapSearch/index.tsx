import React, { useEffect, useState, useContext } from 'react';
import { Search, CustomCollapse } from 'ui';
import { StyledMapSearch, StyledPopoverContent } from './styles';
import useQueryApiClient from '../../../utils/useQueryApiClient';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { parseCoordInput, PROJ_GPS, getIconStyle } from 'utils/mapUtils';
import MapContext from 'contexts/MapContext';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlStyleStyle from 'ol/style/Style';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleFill from 'ol/style/Fill';
import OlGeometry from 'ol/geom/Geometry';
import OlFeature from 'ol/Feature';
import Point from 'ol/geom/Point';
import SimpleGeometry from 'ol/geom/SimpleGeometry';
import GeoJSON from 'ol/format/GeoJSON';
import { getCenter } from 'ol/extent';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { ProposalSubmitContext } from '../../../contexts/ProposalSubmitContext';
import { useOpenedTypeDispatch } from '../../../contexts/OpenedTypeContext';

interface MapSearchProps {
  show: boolean;
}

const fillColor = 'rgba(120, 34, 34, 0.3)';
const strokeColor = 'rgba(120, 34, 34, 0.9)';

const GeoJSONFormat = new GeoJSON();

export const MapSearch = ({ show = false }: MapSearchProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isShown, setIsShown] = useState<boolean>(show);
  const [coords, setCoords] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState();
  const [inputedValue, setInputedValue] = useState('');
  const [skipKadastrs, setSkipKadastrs] = useState<boolean>(true);
  const [searchLayer, setSearchLayer] = useState<OlLayerVector<OlSourceVector<OlGeometry>> | null>(null);

  const intl = useIntl();
  const navigate = useNavigate();
  const map = useContext(MapContext);
  const {
    isOpen: isNotificationOpen,
    setCoords: setNotificationCoords,
    setAddress: setNotificationAddress,
  } = useContext(NotificationContext);
  const {
    isOpen: isProposalOpen,
    setAddress: setProposalAddress,
    setCadastre: setProposalCadastre,
    setGeom: setProposalGeom,
    placeInputType: proposalPlaceInputType,
  } = useContext(ProposalSubmitContext);
  const openedTypeDispatch = useOpenedTypeDispatch();

  const { appendData, isLoading, data } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/planned-documents-search`,
      method: 'GET',
      disableOnMount: true,
    },
  });

  const {
    appendData: addressAppendData,
    isLoading: addressIsLoading,
    data: addressData,
  } = useQueryApiClient({
    request: {
      url: `api/v1/amk/address-struct`,
      disableOnMount: true,
    },
  });

  const {
    appendData: kadastrsAppendData,
    isLoading: kadastrsIsLoading,
    data: kadastrsData,
  } = useQueryApiClient({
    request: {
      url: `geoserver/vraa/wfs?request=GetFeature&service=WFS`,
      disableOnMount: true,
    },
  });

  const {
    appendData: geoproductsAppendData,
    isLoading: geoproductsIsLoading,
    data: geoproductsData,
  } = useQueryApiClient({
    request: {
      url: 'api/v1/public/geoproducts-search',
      disableOnMount: true,
    },
  });

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      onSearch(inputedValue);
    }, 1000);

    return () => clearTimeout(timeOutId);
  }, [inputedValue]);

  useEffect(() => {
    setIsShown(show);
  }, [show]);

  const onSearchClick = () => {
    if (!isShown) {
      setIsShown(true);
    }
  };

  const onSearchBlur = () => {
    if (!show) {
      setIsShown(false);
    }
  };

  const checkKadastrs = (value: string) => {
    let requestData = {
      version: '2.0.0',
      outputFormat: 'application/json',
      count: '1',
      cql_filter: `code='${value}'`,
      typename: '',
    };

    if (parseInt(value)) {
      switch (value.length) {
        case 11:
          requestData.typename = 'parcel';
          break;
        case 14:
          requestData.typename = 'building';
          break;
        case 15:
          requestData.typename = 'parcel_part';
          break;
        default:
          setSkipKadastrs(true);
          return;
      }
      setSkipKadastrs(false);
      kadastrsAppendData(requestData);
    } else {
      setSkipKadastrs(true);
    }
  };

  const onSearch = (value: string) => {
    if (value.length < 3) {
      return;
    }

    appendData({ search: value, pageSize: 50 });
    addressAppendData({ search: value });
    setIsPopoverOpen(true);
    geoproductsAppendData({
      filter: { search: value },
      page: 1,
      pageSize: 5,
      count: 5,
    });
    onClose(value);

    checkKadastrs(value);

    //todo check if valid coordinates
    try {
      const coords = parseCoordInput(value);
      setCoords([
        {
          ...coords,
          name:
            coords.proj === PROJ_GPS
              ? `${coords.coord[1].toFixed(6)}, ${coords.coord[0].toFixed(6)}`
              : `${coords.coord[1].toFixed(1)}, ${coords.coord[0].toFixed(1)}`,
        },
      ]);
    } catch (err) {
      setCoords([]);
    }
  };

  const onClose = (value: string) => {
    if (!value) {
      setIsPopoverOpen(false);
    }
  };

  const clearMap = () => {
    searchLayer?.getSource()?.clear();
  };

  const showOnMap = (geometry: OlGeometry, zoom = true, clear = true) => {
    clear && clearMap();
    searchLayer?.getSource()?.addFeature(
      new OlFeature({
        geometry,
      })
    );
    zoom &&
      map?.getView().fit(geometry as SimpleGeometry, {
        duration: 800,
        maxZoom: isNotificationOpen ? 6 : 8,
      });
  };

  const onAddressClick = (value: any) => {
    setSelectedValue(value.address);

    if (value.lksLong && value.lksLat) {
      const addrPoint = new Point([value.lksLong, value.lksLat]);
      showOnMap(addrPoint);
      if (isNotificationOpen) {
        setNotificationCoords([value.lksLong, value.lksLat]);
        setNotificationAddress(value.address);
      }
      if (isProposalOpen && proposalPlaceInputType === 'search') {
        setProposalAddress(value.address);
        setProposalGeom(addrPoint.clone());
      }
    }

    onClose('');
  };

  const onKadastrClick = (value: any) => {
    const feat = GeoJSONFormat.readFeature(value);
    const code = value?.properties?.code;
    setSelectedValue(code);
    const geom = feat.getGeometry();
    if (geom) {
      showOnMap(geom);
      const centerCoord = getCenter(geom.getExtent());
      showOnMap(new Point(centerCoord), false, false);
      if (isNotificationOpen) {
        setNotificationCoords(centerCoord);
        setNotificationAddress(value.address);
      }
      if (isProposalOpen && proposalPlaceInputType === 'search') {
        setProposalCadastre(code);
        setProposalGeom(new Point(centerCoord));
      }
    }

    onClose('');
  };

  const onCoordClick = (value: any) => {
    setSelectedValue(value.name);
    const point = new Point([...value.coord]);
    if (value.proj !== map?.getView().getProjection()) {
      point.transform(value.proj, map?.getView().getProjection());
    }
    showOnMap(point);
    if (isNotificationOpen) {
      setNotificationCoords(point.getCoordinates());
    }
    if (isProposalOpen && proposalPlaceInputType === 'search') {
      setProposalGeom(point.clone());
    }
    onClose('');
  };

  useEffect(() => {
    if (map) {
      const ml = new OlLayerVector({
        properties: {
          name: '_searched_objects',
        },
        source: new OlSourceVector(),
        style: new OlStyleStyle({
          fill: new OlStyleFill({
            color: fillColor,
          }),
          stroke: new OlStyleStroke({
            color: strokeColor,
            width: 2,
          }),
          image: getIconStyle('marker_outline', strokeColor, '', 0, 1.35),
        }),
        zIndex: 100,
      });
      map.addLayer(ml);
      setSearchLayer(ml);
      return () => {
        map.removeLayer(ml);
        setSearchLayer(null);
      };
    }
  }, [map]);

  const onViewMoreGeoProduct = () => {
    navigate(`/main?geoproduct=open&search=${inputedValue}`);
  };

  const onViewMoreDocumentsProduct = () => {
    navigate(`/main?documents=open&search=${inputedValue}`);
  };

  return (
    <StyledMapSearch show={isShown || isPopoverOpen}>
      <Search
        className="map-search"
        onClick={onSearchClick}
        onSearch={onSearch}
        onChange={(value) => {
          const inputText = value.target.value;
          setInputedValue(inputText);
          onClose(inputText);
          if (!inputText) {
            clearMap();
          }
        }}
        suffix={!isShown}
        onBlur={onSearchBlur}
        value={selectedValue}
      />
      {isPopoverOpen &&
        (!!addressData?.length ||
          !!data?.features?.length ||
          !!geoproductsData?.data?.length ||
          !!kadastrsData?.features?.length ||
          !!coords?.length) && (
          <StyledPopoverContent>
            <CustomCollapse
              icon="road"
              header={'Adreses'}
              action={intl.formatMessage({ id: 'search.expand_search' })}
              items={addressData || []}
              total={addressData?.length}
              isLoading={addressIsLoading}
              parseLabel={(item: { address: string }) => item?.address}
              max={5}
              defaultOpen
              onClick={(values: { address: string }) => onAddressClick(values)}
            />
            <CustomCollapse
              icon="file"
              header={'Plān. dokumenti'}
              action={intl.formatMessage({ id: 'search.expand_search' })}
              items={data?.features || []}
              total={data?.totalFeatures}
              isLoading={isLoading}
              parseLabel={(item: { properties: { dok_nosaukums: string } }) => item?.properties?.dok_nosaukums}
              onClick={(e: any) => {
                openedTypeDispatch({ type: 'OPENED_TAPIS' });
                navigate(`/geo/tapis#document_${e.properties.dok_id}`);
              }}
              max={5}
              defaultOpen
              onViewMoreClick={onViewMoreDocumentsProduct}
              allowExtend
            />
            <CustomCollapse
              icon="globe-stand"
              header={'Ģeoprodukti'}
              action={intl.formatMessage({ id: 'search.expand_search' })}
              items={geoproductsData?.data}
              total={geoproductsData.total}
              isLoading={geoproductsIsLoading}
              onViewMoreClick={onViewMoreGeoProduct}
              parseLabel={(item: any) => item?.name}
              defaultOpen
              onClick={(e: any) => {
                openedTypeDispatch({ type: 'OPEN_GEOPRODUCT' });
                navigate(`/main?geoProductId=${e.id}`);
              }}
            />
            <CustomCollapse
              icon="road"
              header={intl.formatMessage({ id: 'search.kadastra_designation' })}
              items={!skipKadastrs ? kadastrsData?.features || [] : []}
              total={kadastrsData?.totalFeatures}
              isLoading={kadastrsIsLoading}
              parseLabel={(item: { properties: { code: string } }) => item?.properties?.code}
              defaultOpen={true}
              disableOpen
              onClick={(values: { code: string }) => onKadastrClick(values)}
            />
            <CustomCollapse
              icon="map"
              header={intl.formatMessage({ id: 'search.coordinates' })}
              items={coords}
              isLoading={false}
              parseLabel={(item: any) => item?.name}
              defaultOpen={true}
              disableOpen
              onClick={(values: { name: string }) => onCoordClick(values)}
            />
          </StyledPopoverContent>
        )}
    </StyledMapSearch>
  );
};

export default MapSearch;
