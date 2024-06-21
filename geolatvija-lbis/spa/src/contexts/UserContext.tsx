import React from 'react';
import { AuthWebStorageEnums } from './SessionControlContext';

interface PayloadType {
  id: number;
  name: string;
  surname: string;
  personalCode: string;
  regNr: string;
  lastLogin: string;
  userType: string;
  selectedRole: number;
  roles: UserRole[];
  refetch: Function;
  loggingOut: boolean;
  sendEmail: boolean;
  userNotifications: number;
  publicDiscussionCommentAnswers: number;
  userEmbeds: number;
}

export interface UserRole {
  id: number;
  name: string;
  code: string;
  institutionName: string;
  institutionClassifierId: number;
  email: string;
  emailVerified: boolean;
  regNr?: string;
}

type PayloadAction = {
  type: 'SAVE_PAYLOAD' | 'REFETCH' | 'SELECT_ROLE';
  payload: PayloadType;
};

type RefetchAction = {
  type: 'REFETCH';
};

type SeenAction = {
  type: 'NOTIFICATION_SEEN';
};

type SelectRoleAction = {
  type: 'SELECT_ROLE';
  payload: {
    selectedRole?: number;
    loggingOut: boolean;
  };
};

type Action = PayloadAction | RefetchAction | SelectRoleAction | SeenAction;

type Dispatch = (action: Action) => void;

type State = {
  id: number;
  name: string;
  surname: string;
  personalCode: string;
  regNr: string;
  lastLogin: string;
  userType: string;
  selectedRole?: number;
  roles: UserRole[];
  refetch: Function;
  logout: Function;
  loggingOut: boolean;
  sendEmail: boolean;
  userNotifications: number;
  publicDiscussionCommentAnswers: number;
  userEmbeds: number;
};

type UserProviderProps = { children: React.ReactNode };

const UserStateContext = React.createContext<State>(undefined!);
const UserDispatchContext = React.createContext<Dispatch>(undefined!);

function userReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SAVE_PAYLOAD': {
      let payload = action.payload;

      if (payload.roles.length === 1) {
        payload.selectedRole = payload.roles[0].id;
        window.localStorage.setItem(AuthWebStorageEnums.SELECTED_ROLE, payload.roles[0].id.toString());
      }

      return {
        ...state,
        ...payload,
      };
    }
    case 'REFETCH': {
      state.refetch();
      return {
        ...state,
      };
    }
    case 'SELECT_ROLE': {
      let payload = action.payload.selectedRole;
      let loggingOut = action.payload.loggingOut;
      window.localStorage.setItem(AuthWebStorageEnums.SELECTED_ROLE, payload?.toString() || '');

      return {
        ...state,
        loggingOut,
        selectedRole: payload,
      };
    }

    case 'NOTIFICATION_SEEN': {
      return {
        ...state,
        publicDiscussionCommentAnswers: state.publicDiscussionCommentAnswers - 1,
      };
    }
  }
}

function UserProvider({ children }: UserProviderProps) {
  const initialState = {
    id: 0,
    name: '',
    surname: '',
    personalCode: '',
    regNr: '',
    lastLogin: '',
    userType: '',
    email: '',
    selectedRole: parseInt(window.localStorage.getItem(AuthWebStorageEnums.SELECTED_ROLE) || ''),
    roles: [],
    sendEmail: false,
    userNotifications: 0,
    publicDiscussionCommentAnswers: 0,
    userEmbeds: 0,
    loggingOut: false,
    refetch: () => null,
    logout: () => null,
  };

  const [state, dispatch] = React.useReducer(userReducer, initialState);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

const useUserState = () => React.useContext(UserStateContext);
const useUserDispatch = () => React.useContext(UserDispatchContext);

export { UserProvider, useUserDispatch, useUserState };
