import React from 'react';

interface PayloadType {
  fileSize: number;
  fileFormat: string[];
  pvn: string;
  refetch: Function;
}

type PayloadAction = {
  type: 'SAVE_PAYLOAD' | 'REFETCH';
  payload: PayloadType;
};

type RefetchAction = {
  type: 'REFETCH';
};

type Action = PayloadAction | RefetchAction;

type Dispatch = (action: Action) => void;

type State = {
  fileSize: number;
  fileFormat: string[];
  pvn: string;
  refetch: Function;
};

type SystemSettingProviderProps = { children: React.ReactNode };

const SystemSettingContext = React.createContext<State>(undefined!);
const SystemSettingDispatchContext = React.createContext<Dispatch>(undefined!);

function userReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SAVE_PAYLOAD': {
      let payload = action.payload;
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
  }
}

function SystemSettingProvider({ children }: SystemSettingProviderProps) {
  const initialState = {
    fileSize: 0,
    fileFormat: [],
    pvn: '0',
    refetch: () => null,
  };

  const [state, dispatch] = React.useReducer(userReducer, initialState);

  return (
    <SystemSettingContext.Provider value={state}>
      <SystemSettingDispatchContext.Provider value={dispatch}>{children}</SystemSettingDispatchContext.Provider>
    </SystemSettingContext.Provider>
  );
}

const useSystemSettingState = () => React.useContext(SystemSettingContext);
const useSystemSettingDispatch = () => React.useContext(SystemSettingDispatchContext);

export { SystemSettingProvider, useSystemSettingDispatch, useSystemSettingState };
