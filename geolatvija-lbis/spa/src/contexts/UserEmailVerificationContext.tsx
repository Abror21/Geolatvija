import React, { createContext, type Dispatch, type SetStateAction, useContext, useEffect, useState } from 'react';
import useQueryApiClient from '../utils/useQueryApiClient';
import { useNavigate } from 'react-router-dom';

export const UserEmailVerificationContext = createContext({} as UserEmailVerificationContextProps);

export const useUserEmailVerification = () => {
  return useContext(UserEmailVerificationContext);
};

export interface UserEmailVerificationContextProps {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  verifiedEmail?: VerifyResponse;
  clear: Function;
  isLoading: boolean;
}
export interface UserEmbedContextProviderProps {
  children: React.ReactNode;
}

export enum EmailVerificationResponseType {
  SUCCESS = 'SUCCESS',
  EXPIRED = 'EXPIRED',
  ERROR = 'ERROR',
}

export type VerifyResponse = {
  email: string;
  responseType: EmailVerificationResponseType;
};

const UserEmailVerificationContextProvider = ({ children }: UserEmbedContextProviderProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<VerifyResponse>();

  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);

  const token = searchParams.get('email-verify');

  const { appendData: verifyEmail, isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/verify-email`,
      method: 'POST',
      disableOnMount: true,
    },
    onSuccess: (response) => {
      setVerifiedEmail(response);
    },
  });

  useEffect(() => {
    if (!!token) {
      setModalOpen(true);
      verifyEmail({ token });
    }
  }, []);

  const clear = () => {
    navigate(window.location.pathname);
    setModalOpen(false);
  };

  return (
    <UserEmailVerificationContext.Provider value={{ modalOpen, setModalOpen, verifiedEmail, clear, isLoading }}>
      {children}
    </UserEmailVerificationContext.Provider>
  );
};

export default UserEmailVerificationContextProvider;
