import React from 'react';
import LayerGroup from 'ol/layer/Group';

interface SelectedTapisDocumentType {
  dok_id: number;

  [key: string]: any;

  layerGroup: LayerGroup;
}

interface PayloadType {
  openedTapis?: boolean;
  selectedTapisDocument?: SelectedTapisDocumentType;
  selectedGeoproduct?: object;
  openTapisDocument?: boolean;
  openGeoproduct?: boolean;
  openParticipationBudget?: boolean;
  openMyParticipation?: boolean;
}

type PayloadAction = {
  type:
    | 'OPENED_TAPIS'
    | 'CLOSED_TAPIS'
    | 'SELECT_TAPIS_DOCUMENT'
    | 'UNSELECT_TAPIS_DOCUMENT'
    | 'OPEN_TAPIS'
    | 'CLOSE_TAPIS'
    | 'OPEN_GEOPRODUCT'
    | 'CLOSE_GEOPRODUCT'
    | 'OPEN_PARTICIPATION_BUDGET'
    | 'CLOSE_PARTICIPATION_BUDGET'
    | 'OPEN_PROJECT'
    | 'CLOSE_PROJECT'
    | 'OPEN_MUNICIPAL_PROJECT'
    | 'CLOSE_MUNICIPAL_PROJECT'
    | 'OPEN_PROJECT_VIEW'
    | 'CLOSE_PROJECT_VIEW'
    | 'OPEN_IDEA_VIEW'
    | 'CLOSE_IDEA_VIEW'
    | 'OPEN_VOTE_VIEW'
    | 'CLOSE_VOTE_VIEW'
    | 'OPEN_MY_PARTICIPATION'
    | 'OPEN_SUBMIT_PROJECT'
    | 'CLOSE_SUBMIT_PROJECT'
    | 'OPEN_SUBMIT_PROJECT_CREATE_FORM'
    | 'CLOSE_SUBMIT_PROJECT_CREATE_FORM'
    | 'OPEN_SUBMIT_PROJECT_LAST_STEP'
    | 'CLOSE_SUBMIT_PROJECT_LAST_STEP'
    | 'OPEN_SUBMIT_IDEA'
    | 'CLOSE_SUBMIT_IDEA'
    | 'CLOSE_MY_PARTICIPATION'
    | 'OPEN_PANNING_DOCUMENTS'
    | 'CLOSE_PANNING_DOCUMENTS';

  payload?: PayloadType;
};

type Action = PayloadAction;

export type Dispatch = (action: Action) => void;

type State = {
  activeHeaderButton?: string;
  openedTapis?: boolean;
  selectedTapisDocument?: SelectedTapisDocumentType;
  selectedGeoproduct?: object;
  openTapisDocument?: boolean;
  openGeoproduct?: boolean;
  openParticipationBudget?: boolean;
  openProject?: boolean;
  openMunicipalProject?: boolean;
  openProjectView?: boolean;
  openIdeaView?: boolean;
  openVoteView?: boolean;
  openMyParticipation?: boolean;
  openSubmitProject?: boolean;
  openSubmitProjectCreateForm?: boolean;
  openSubmitProjectLastStep?: boolean;
  openSubmitIdea?: boolean;
  openedMapType: string;
  openPlannedDocuments ?: boolean;
};

type OpenedTypeProviderProps = { children: React.ReactNode };

const OpenedTypeContext = React.createContext<State>(undefined!);
const OpenedTypeDispatchContext = React.createContext<Dispatch>(undefined!);

function userReducer(state: State, action: Action) {
  switch (action.type) {
    case 'OPENED_TAPIS': {
      return { ...state, openedTapis: true };
    }
    case 'CLOSED_TAPIS': {
      return { ...state, openedTapis: false };
    }
    case 'SELECT_TAPIS_DOCUMENT': {
      return { ...state, selectedTapisDocument: action?.payload?.selectedTapisDocument };
    }
    case 'UNSELECT_TAPIS_DOCUMENT': {
      return { ...state, selectedTapisDocument: undefined };
    }
    case 'OPEN_TAPIS': {
      return { ...state, openTapisDocument: true, activeHeaderButton: 'planned-documents', openedMapType: 'tapis' };
    }
    case 'CLOSE_TAPIS': {
      return { ...state, openTapisDocument: false };
    }
    case 'OPEN_GEOPRODUCT': {
      return { ...state, openGeoproduct: true, activeHeaderButton: 'geoproduct', openedMapType: 'geo' };
    }
    case 'CLOSE_GEOPRODUCT': {
      return { ...state, openGeoproduct: false };
    }
    case 'OPEN_PARTICIPATION_BUDGET': {
      return {
        ...state,
        openParticipationBudget: true,
        activeHeaderButton: 'participation-budget',
        openedMapType: 'lbis',
      };
    }
    case 'CLOSE_PARTICIPATION_BUDGET': {
      return { ...state, openParticipationBudget: false };
    }
    case 'OPEN_PROJECT': {
      return { ...state, openProject: true, activeHeaderButton: 'participation-budget', openedMapType: 'lbis' };
    }
    case 'CLOSE_PROJECT': {
      return { ...state, openProject: false };
    }
    case 'OPEN_MUNICIPAL_PROJECT': {
      return {
        ...state,
        openMunicipalProject: true,
        activeHeaderButton: 'participation-budget',
        openedMapType: 'lbis',
      };
    }
    case 'CLOSE_MUNICIPAL_PROJECT': {
      return { ...state, openMunicipalProject: false };
    }
    case 'OPEN_PROJECT_VIEW': {
      return { ...state, openProjectView: true, openedMapType: 'lbis' };
    }
    case 'OPEN_IDEA_VIEW': {
      return { ...state, openIdeaView: true, openedMapType: 'lbis' };
    }
    case 'OPEN_VOTE_VIEW': {
      return { ...state, openVoteView: true, openedMapType: 'lbis' };
    }
    case 'CLOSE_PROJECT_VIEW': {
      return { ...state, openProjectView: false };
    }
    case 'CLOSE_IDEA_VIEW': {
      return { ...state, openIdeaView: false };
    }
    case 'CLOSE_VOTE_VIEW': {
      return { ...state, openVoteView: false };
    }
    case 'OPEN_MY_PARTICIPATION': {
      return { ...state, openMyParticipation: true, openedMapType: 'lbis' };
    }
    case 'CLOSE_MY_PARTICIPATION': {
      return { ...state, openMyParticipation: false };
    }
    case 'OPEN_SUBMIT_PROJECT': {
      return { ...state, openSubmitProject: true, openedMapType: 'lbis' };
    }
    case 'CLOSE_SUBMIT_PROJECT': {
      return { ...state, openSubmitProject: false };
    }
    case 'OPEN_SUBMIT_PROJECT_CREATE_FORM': {
      return { ...state, openSubmitProjectCreateForm: true, openedMapType: 'lbis' };
    }
    case 'CLOSE_SUBMIT_PROJECT_CREATE_FORM': {
      return { ...state, openSubmitProjectCreateForm: false };
    }
    case 'OPEN_SUBMIT_IDEA': {
      return { ...state, openSubmitIdea: true, openedMapType: 'lbis' };
    }
    case 'CLOSE_SUBMIT_IDEA': {
      return { ...state, openSubmitIdea: false };
    }
    case 'OPEN_SUBMIT_PROJECT_LAST_STEP': {
      return { ...state, openSubmitProjectLastStep: true, openedMapType: 'lbis' };
    }
    case 'CLOSE_SUBMIT_PROJECT_LAST_STEP': {
      return { ...state, openSubmitProjectLastStep: false };
    }

    case 'OPEN_PANNING_DOCUMENTS': {
      return { ...state, openPlannedDocuments : true, activeHeaderButton: 'planned-documents' };
    }
    case 'CLOSE_PANNING_DOCUMENTS': {
      return { ...state, openPlannedDocuments : false };
    }
  }
}

function OpenedTypeProvider({ children }: OpenedTypeProviderProps) {
  const initialState = {
    activeHeaderButton: 'planned-documents',
    openedTapis: true,
    selectedTapisDocument: undefined,
    selectedGeoproduct: undefined,
    openTapisDocument: false,
    openGeoproduct: false,
    openParticipationBudget: false,
    openPlannedDocuments : false,
    openedMapType: 'tapis',
  };

  const [state, dispatch] = React.useReducer(userReducer, initialState);

  return (
    <OpenedTypeContext.Provider value={state}>
      <OpenedTypeDispatchContext.Provider value={dispatch}>{children}</OpenedTypeDispatchContext.Provider>
    </OpenedTypeContext.Provider>
  );
}

const useOpenedTypeState = () => React.useContext(OpenedTypeContext);
const useOpenedTypeDispatch = () => React.useContext(OpenedTypeDispatchContext);

export { OpenedTypeProvider, useOpenedTypeDispatch, useOpenedTypeState };
