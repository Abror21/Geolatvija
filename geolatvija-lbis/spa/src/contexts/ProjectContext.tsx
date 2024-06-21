import React from 'react';

interface PayloadType {
  projects: any;
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

type HighlightAction = {
  type: 'HIGHLIGHT_PROJECT';
  payload: number;
};

type VoteAction = {
  type: 'VOTE_PROJECT';
  payload: number;
};
type Action = PayloadAction | RefetchAction | HighlightAction | VoteAction;

type Dispatch = (action: Action) => void;

type State = {
  projects: any;
  appendData: Function;
  initialized: boolean;
  isLoading: boolean;
  highlightedProjectId: number | null;
};

type ProjectProviderProps = { children: React.ReactNode };

const ProjectContext = React.createContext<State>(undefined!);
const ProjectDispatchContext = React.createContext<Dispatch>(undefined!);

function userReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SAVE_PAYLOAD': {
      let payload = action.payload;
      return {
        ...state,
        ...payload,
        projects: payload.projects || [],
        initialized: true,
        isLoading: false,
        highlightedProjectId: null,
      };
    }
    case 'REFETCH': {
      state.appendData(action.payload);
      return {
        ...state,
        projects: [],
        isLoading: true,
        highlightedProjectId: null,
      };
    }
    case 'HIGHLIGHT_PROJECT': {
      return {
        ...state,
        highlightedProjectId: action.payload,
      };
    }

    case 'VOTE_PROJECT': {
      const projectId = action.payload;
      return {
        ...state,
        projects: state.projects.map((project: any) =>
          project.id === projectId ? { ...project, has_voted: !project.has_voted } : project
        ),
      };
    }
  }
}

function ProjectProvider({ children }: ProjectProviderProps) {
  const initialState = {
    projects: [],
    initialized: false,
    isLoading: true,
    appendData: () => null,
    highlightedProjectId: null,
  };

  const [state, dispatch] = React.useReducer(userReducer, initialState);

  return (
    <ProjectContext.Provider value={state}>
      <ProjectDispatchContext.Provider value={dispatch}>{children}</ProjectDispatchContext.Provider>
    </ProjectContext.Provider>
  );
}

const useProjectState = () => React.useContext(ProjectContext);
const useProjectDispatch = () => React.useContext(ProjectDispatchContext);

export { ProjectProvider, useProjectDispatch, useProjectState };
