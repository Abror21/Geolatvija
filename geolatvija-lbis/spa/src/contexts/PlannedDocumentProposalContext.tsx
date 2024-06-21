import React, {createContext, useContext, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import useSessionStorage from "../utils/useSessionStorage";
import useJwt from "../utils/useJwt";

export const PlannedDocumentProposalContext = createContext({} as PlannedDocumentProposalContext);

export interface PlannedDocumentProposalContext {
  value: PlannedDocumentProposalType | null | undefined;
  removeFromSession: Function;
  setSessionValue: (newValue: PlannedDocumentProposalType) => void;
}
export interface PlannedDocumentProposalContextProviderProps {
  children: React.ReactNode;
}

export const usePlannedDocumentProposal = () => {
  return useContext(PlannedDocumentProposalContext);
}

type PlannedDocumentProposalType = {
  id: number,
  open: boolean,
}

const PlannedDocumentProposalContextProvider = ({ children }: PlannedDocumentProposalContextProviderProps) => {
  const {value, removeSessionValue, setSessionValue} = useSessionStorage<PlannedDocumentProposalType | null | undefined>("PLANNED_DOCUMENT_PROPOSAL");
  const {isTokenActive} = useJwt();

  const navigate = useNavigate();

  useEffect(() => {
    if (!!value && value.open && value.id && isTokenActive()) {
      navigate(`/geo/tapis?documents=open#document_${value.id}`);
    }
  }, [value]);

  return (
    <PlannedDocumentProposalContext.Provider value={{ removeFromSession: removeSessionValue, setSessionValue, value }}>
      {children}
    </PlannedDocumentProposalContext.Provider>
  );
};

export default PlannedDocumentProposalContextProvider;
