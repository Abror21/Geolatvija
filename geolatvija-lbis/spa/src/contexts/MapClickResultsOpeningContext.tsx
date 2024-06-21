import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
export const MapClickResultsOpeningContext = createContext({} as MapClickResultsOpeningContext);

export interface MapClickResultsOpeningContext {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}
export interface MapClickResultsOpeningContextProviderProps {
  children: React.ReactNode;
}

export const useMapClickResultsOpening = () => {
  return useContext(MapClickResultsOpeningContext);
};

const MapClickResultsOpeningContextProvider = ({ children }: MapClickResultsOpeningContextProviderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <MapClickResultsOpeningContext.Provider value={{ open, setOpen }}>
      {children}
    </MapClickResultsOpeningContext.Provider>
  );
};

export default MapClickResultsOpeningContextProvider;
