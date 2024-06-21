import React from 'react';

interface PayloadType {
  budgets: any;
  appendData: Function;
}

type PayloadAction = {
  type: 'SAVE_PAYLOAD' | 'REFETCH';
  payload: PayloadType;
};

type RefetchAction = {
  type: 'REFETCH';
  payload: any;
};

type Action = PayloadAction | RefetchAction;

type Dispatch = (action: Action) => void;

type State = {
  budgets: any;
  appendData: Function;
  initialized: boolean;
  isLoading: boolean;
};

type ParticipationBudgetProviderProps = { children: React.ReactNode };

const ParticipationBudgetContext = React.createContext<State>(undefined!);
const ParticipationBudgetDispatchContext = React.createContext<Dispatch>(undefined!);

function userReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SAVE_PAYLOAD': {
      let payload = action.payload;
      return {
        ...state,
        ...payload,
        initialized: true,
        isLoading: false,
      };
    }
    case 'REFETCH': {
      state.appendData(action.payload);
      return {
        ...state,
        budgets: [],
        isLoading: true,
      };
    }
  }
}

function ParticipationBudgetProvider({ children }: ParticipationBudgetProviderProps) {
  const initialState = {
    budgets: [],
    initialized: false,
    isLoading: true,
    appendData: () => null,
  };

  const [state, dispatch] = React.useReducer(userReducer, initialState);

  return (
    <ParticipationBudgetContext.Provider value={state}>
      <ParticipationBudgetDispatchContext.Provider value={dispatch}>
        {children}
      </ParticipationBudgetDispatchContext.Provider>
    </ParticipationBudgetContext.Provider>
  );
}

const useParticipationBudgetState = () => React.useContext(ParticipationBudgetContext);
const useParticipationBudgetDispatch = () => React.useContext(ParticipationBudgetDispatchContext);

export { ParticipationBudgetProvider, useParticipationBudgetDispatch, useParticipationBudgetState };
