import React, { createContext, type Dispatch, type SetStateAction, useContext, useState } from 'react';

export const GeoProductSidebarContext = createContext({} as GeoProductSidebarContextProps);

export interface GeoProductSidebarContextProps {
  refetchGeoProduct: boolean;
  setRefetchGeoProduct: Dispatch<SetStateAction<boolean>>;
}
export interface GeoProductSidebarContextProviderProps {
  children: React.ReactNode;
}

export const useGeoProductSidebarContext = () => {
  return useContext(GeoProductSidebarContext);
};

const GeoProductSidebarContextProvider = ({ children }: GeoProductSidebarContextProviderProps) => {
  const [refetchGeoProduct, setRefetchGeoProduct] = useState<boolean>(false);

  return (
    <GeoProductSidebarContext.Provider value={{ setRefetchGeoProduct, refetchGeoProduct }}>
      {children}
    </GeoProductSidebarContext.Provider>
  );
};

export default GeoProductSidebarContextProvider;
