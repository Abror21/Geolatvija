import React, { createContext, useEffect, useState } from 'react';
import OlGeometry from 'ol/geom/Geometry';

export const ProposalSubmitContext = createContext({} as ProposalSubmitContextProps);

export interface ProposalSubmitContextProps {
  isOpen: boolean;
  toggleHandler: Function;
  activeTitle: string;
  duration: string;
  activeTitleHandler: (title: string) => void;
  tapisId: number;
  address: string | undefined;
  setAddress: Function;
  cadastre: string | undefined;
  setCadastre: Function;
  geom: OlGeometry | undefined;
  setGeom: Function;
  placeInputType: string;
  setPlaceInputType: Function;
}
export interface ProposalSubmitContextProviderProps {
  children: React.ReactNode;
}

const ProposalSubmitProvider = ({ children }: ProposalSubmitContextProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTitle, setActiveTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [tapisId, setTapisId] = useState<any>();
  const [address, setAddress] = useState<string>();
  const [cadastre, setCadastre] = useState<string>();
  const [geom, setGeom] = useState<OlGeometry>();
  const [placeInputType, setPlaceInputType] = useState<string>('place');

  const activeTitleHandler = (title: string) => {
    setActiveTitle(title);
  };

  const toggleHandler = (title?: string, duration?: string, tapisId?: number) => {
    if (!isOpen && title && duration) {
      setIsOpen(true);
      setActiveTitle(title);
      setDuration(duration);
      setTapisId(tapisId);
    } else {
      setIsOpen(false);
      setActiveTitle('');
      setDuration('');
    }
  };

  return (
    <ProposalSubmitContext.Provider
      value={{
        isOpen,
        toggleHandler,
        activeTitle,
        duration,
        activeTitleHandler,
        tapisId,
        address,
        setAddress,
        cadastre,
        setCadastre,
        geom,
        setGeom,
        placeInputType,
        setPlaceInputType,
      }}
    >
      {children}
    </ProposalSubmitContext.Provider>
  );
};

export default ProposalSubmitProvider;
