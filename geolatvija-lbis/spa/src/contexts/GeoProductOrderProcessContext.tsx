import React, {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GeoProductOrderModal from '../pages/LayoutPage/Components/Modals/GeoProductOrderModal';
import useSessionStorage from '../utils/useSessionStorage';
import GeoProductOrderConfirmationModal from '../pages/LayoutPage/Components/Modals/GeoProductOrderConfirmationModal';
import { useGeoProductSidebarContext } from './GeoProductSidebarContext';
import useLocalStorage from '../utils/useLocalStorage';
import { AuthWebStorageEnums } from './SessionControlContext';

export const GeoProductOrderProcessContext = createContext({} as GeoProductOrderProcessContext);

export interface GeoProductOrderProcessContext {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedService: any;
  setSelectedService: Dispatch<SetStateAction<any>>;
  purchaseSuccessful: boolean;
}
export interface GeoProductProcessContextProviderProps {
  children: React.ReactNode;
}

export const useGeoProductOrderProcess = () => {
  return useContext(GeoProductOrderProcessContext);
};

const GeoProductOrderProcessContextProvider = ({ children }: GeoProductProcessContextProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [purchaseSuccessful, setPurchaseSuccessful] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const initialOpen = useRef(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const paymentRequestId = searchParams.get('paymentRequestId');

  const {
    value: selectedService,
    setSessionValue: setSelectedService,
    removeSessionValue: removeSelectedDiv,
  } = useSessionStorage('SELECTED_DIV');
  const { value: geoProductId, removeSessionValue: removeGeoProductId } = useSessionStorage('GEO_PRODUCT_ID');
  const { value: openModal, removeSessionValue: removeOrderConfirmation } = useSessionStorage('ORDER_CONFIRMATION');
  const { value: geoOrderId, removeSessionValue: removeGeoOrderId } = useSessionStorage('GEO_ORDER_ID');
  const { value: initialRoleIsSet } = useLocalStorage<boolean>(AuthWebStorageEnums.INITIAL_ROLE_IS_SET);

  const { setRefetchGeoProduct } = useGeoProductSidebarContext();

  useEffect(() => {
    if (!!openModal && !!geoProductId && !initialOpen.current && !!initialRoleIsSet) {
      navigate(`/main?geoproduct=open&geoProductId=${geoProductId}`);
      setIsOpen(true);
    }
    initialOpen.current = true;
  }, [geoProductId, openModal, initialRoleIsSet]);

  const onClose = () => {
    removeGeoOrderId();
    removeSelectedDiv();
    removeGeoProductId();
    removeOrderConfirmation();
    initialOpen.current = false;
  };

  const onPurchaseSuccessful = () => {
    onClose();
    setPurchaseSuccessful(true);
    setRefetchGeoProduct(true);
    setSearchParams('');
  };

  useEffect(() => {
    if (!!paymentRequestId) {
      onPurchaseSuccessful();
    }
  }, [paymentRequestId, searchParams]);

  return (
    <GeoProductOrderProcessContext.Provider
      value={{ purchaseSuccessful, isOpen, setIsOpen, setSelectedService, selectedService }}
    >
      <GeoProductOrderModal
        orderId={geoOrderId}
        onClose={onClose}
        onPurchaseSuccessful={onPurchaseSuccessful}
        setShowModal={setIsOpen}
        showModal={isOpen}
        service={selectedService ?? {}}
        setIsDraft={setIsDraft}
      />
      <GeoProductOrderConfirmationModal
        isDraft={isDraft}
        showModal={purchaseSuccessful && !isOpen}
        setShowModal={setPurchaseSuccessful}
      />
      {children}
    </GeoProductOrderProcessContext.Provider>
  );
};

export default GeoProductOrderProcessContextProvider;
