import React, { createContext, useState } from 'react';

export const UserEmbedContext = createContext({} as UserEmbedContextProps);

export interface UserEmbedContextProps {
  isOpen: boolean;
  toggleHandler: Function;
}
export interface UserEmbedContextProviderProps {
  children: React.ReactNode;
}

const UserEmbedContextProvider = ({ children }: UserEmbedContextProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <UserEmbedContext.Provider value={{isOpen, toggleHandler}}>
      {children}
    </UserEmbedContext.Provider>
  );
};

export default UserEmbedContextProvider;
