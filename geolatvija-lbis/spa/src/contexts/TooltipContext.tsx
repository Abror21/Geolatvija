import React from 'react';
import { urlNavigation } from '../constants/navigation';

interface PayloadType {
  refetch: Function;
  tooltips: any;
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
  tooltips: any;
  refetch: Function;
};

type TooltipProviderProps = { children: React.ReactNode };

const TooltipStateContext = React.createContext<State>(undefined!);
const TooltipDispatchContext = React.createContext<Dispatch>(undefined!);

function tooltipReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SAVE_PAYLOAD': {
      let payload = action.payload;

      return {
        ...state,
        ...payload,
        tooltips: payload.tooltips?.map((e: any) => {
          e.url = urlNavigation?.[e.uniqueKey];

          return e;
        }),
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

function TooltipProvider({ children }: TooltipProviderProps) {
  const initialState = {
    tooltips: [],
    refetch: () => null,
  };

  const [state, dispatch] = React.useReducer(tooltipReducer, initialState);

  return (
    <TooltipStateContext.Provider value={state}>
      <TooltipDispatchContext.Provider value={dispatch}>{children}</TooltipDispatchContext.Provider>
    </TooltipStateContext.Provider>
  );
}

const useTooltipState = () => React.useContext(TooltipStateContext);
const useTooltipDispatch = () => React.useContext(TooltipDispatchContext);

export { TooltipProvider, useTooltipDispatch, useTooltipState };
