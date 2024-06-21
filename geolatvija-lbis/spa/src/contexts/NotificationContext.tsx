import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Coordinate } from 'ol/coordinate';

export const NotificationContext = createContext({} as NotificationContextProps);

export interface NotificationContextProps {
  isOpen: boolean;
  toggleHandler: Function;
  coords: Coordinate | undefined;
  setCoords: Function;
  setIsOpen: (value: boolean) => void;
  address?: string;
  setAddress: Function;
  setInitialPointIsSet: Dispatch<SetStateAction<boolean>>;
  initialPointIsSet: boolean;
}
export interface NotificationContextProviderProps {
  children: React.ReactNode;
}

const NotificationContextProvider = ({ children }: NotificationContextProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<Coordinate | undefined>();
  const [address, setAddress] = useState<string>();
  const [initialPointIsSet, setInitialPointIsSet] = useState(false);

  const toggleHandler = () => {
    setCoords(undefined);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) {
      setInitialPointIsSet(false);
    }
  }, [isOpen]);

  return (
    <NotificationContext.Provider
      value={{
        setInitialPointIsSet,
        initialPointIsSet,
        isOpen,
        toggleHandler,
        coords,
        setCoords,
        address,
        setAddress,
        setIsOpen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
