import React, {createContext, useContext, useEffect, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import useSessionStorage from "../utils/useSessionStorage";
import type {Coordinate} from "ol/coordinate";
import useJwt from "../utils/useJwt";

type ApplyForNotificationType = {
  open: boolean,
  coordinate?: Coordinate,
}

export const ApplyForNotificationsContext = createContext({} as ApplyForNotificationsContext);

export interface ApplyForNotificationsContext {
  removeFromSession: Function;
  setSessionValue: (newValue: ApplyForNotificationType) => void;
  value: ApplyForNotificationType | null | undefined;
}
export interface ApplyForNotificationsContextProviderProps {
  children: React.ReactNode;
}

export const useApplyForNotifications = () => {
  return useContext(ApplyForNotificationsContext);
}

const ApplyForNotificationsContextProvider = ({ children }: ApplyForNotificationsContextProviderProps) => {
  const {value, removeSessionValue, setSessionValue} = useSessionStorage<ApplyForNotificationType | null | undefined>("NOTIFICATION");
  const {isTokenActive} = useJwt();

  const navigate = useNavigate();

  const navigatedInitially = useRef(false);

  useEffect(() => {
    if (!!value && value.open && value.coordinate && isTokenActive() && !navigatedInitially.current) {
      navigate(`/main?notification=open&long=${value.coordinate?.[0]}&lat=${value.coordinate?.[1]}`);
      navigatedInitially.current = true;
    }
  }, [value]);

  return (
    <ApplyForNotificationsContext.Provider value={{ removeFromSession: removeSessionValue, setSessionValue, value }}>
      {children}
    </ApplyForNotificationsContext.Provider>
  );
};

export default ApplyForNotificationsContextProvider;
