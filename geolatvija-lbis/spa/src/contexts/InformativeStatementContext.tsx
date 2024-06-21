import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import useSessionStorage from '../utils/useSessionStorage';
import SubscribeModal from '../components/Modals/SubscribeModal';
import UnauthenticatedModal from '../components/Modals/UnauthenticatedModal';
import useJwt from '../utils/useJwt';

type InformativeStatementType = {
  open: boolean;
};

export const InformativeStatementContext = createContext({} as InformativeStatementContext);

export interface InformativeStatementContext {
  removeFromSession: Function;
  setSessionValue: (newValue: InformativeStatementType) => void;
  setShowUnauthenticated: Dispatch<SetStateAction<boolean>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  isModalOpen: boolean;
  value: InformativeStatementType | null | undefined;
  setKadastrs: Dispatch<SetStateAction<number | undefined>>;
}
export interface ApplyForNotificationsContextProviderProps {
  children: React.ReactNode;
}

export const useInformativeStatement = () => {
  return useContext(InformativeStatementContext);
};

const InformativeStatementContextProvider = ({ children }: ApplyForNotificationsContextProviderProps) => {
  const { value, removeSessionValue, setSessionValue } = useSessionStorage<InformativeStatementType | null | undefined>(
    'INFORMATIVE_STATEMENT'
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kadastrs, setKadastrs] = useState<number>();
  const [showUnauthenticated, setShowUnauthenticated] = useState(false);

  const navigatedInitially = useRef(false);

  const { isTokenActive } = useJwt();

  useEffect(() => {
    if (!!value && value.open && isTokenActive() && !navigatedInitially.current) {
      setIsModalOpen(true);
      navigatedInitially.current = true;
    }
  }, [value]);

  const onAdditionalUnauthenticated = () => {
    setSessionValue({
      open: true,
    });
  };

  return (
    <InformativeStatementContext.Provider
      value={{
        removeFromSession: removeSessionValue,
        setSessionValue,
        value,
        setIsModalOpen,
        isModalOpen,
        setShowUnauthenticated,
        setKadastrs,
      }}
    >
      <SubscribeModal
        removeSessionValue={removeSessionValue}
        showModal={isModalOpen}
        setShowModal={setIsModalOpen}
        showUnauthenticated={showUnauthenticated}
        setShowUnauthenticated={setShowUnauthenticated}
        kadastrs={kadastrs}
      />
      <UnauthenticatedModal
        additionalOnOkExecution={onAdditionalUnauthenticated}
        setShowModal={setShowUnauthenticated}
        showModal={showUnauthenticated}
      />
      {children}
    </InformativeStatementContext.Provider>
  );
};

export default InformativeStatementContextProvider;
