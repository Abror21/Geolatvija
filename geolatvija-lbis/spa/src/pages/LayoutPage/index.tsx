import React, { useEffect, useState, useContext, useRef } from 'react';
import { useIntl } from 'react-intl';
import { SidebarDrawer } from 'ui';
import { StyledPage, StyledContent } from 'styles/layout/SidebarMap';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { MapComponent } from 'components/Map/MapComponent';
import { LayerSettings } from 'components/Map/LayerSettings';
import { CoordsComponent } from 'components/Map/CoordsComponent';
import { LayerSwitcher } from 'components/Map/LayerSwitcher';
import { Measure } from 'components/Map/Measure';
import MapSearch from '../../components/Map/MapSearch';
import Sidebars from './Components/Sidebars';
import { useOpenedTypeDispatch, useOpenedTypeState } from '../../contexts/OpenedTypeContext';
import { MapClickResults } from 'components/Map/MapClickResults';
import RightSidebars from './Components/RightSidebars/EmbedsSideBar';
import EmbedCreateButton from '../../components/Map/EmbedCreateButton';
import { useApplyForNotifications } from '../../contexts/ApplyForNotificationsContext';
import MapContext from 'contexts/MapContext';
import useQueryApiClient from 'utils/useQueryApiClient';
import { applyEmbedMapState } from 'utils/embedMapUtils';
import UnauthenticatedModal from '../../components/Modals/UnauthenticatedModal';
import { useNotificationHeader } from '../../contexts/NotificationHeaderContext';
import { usePlannedDocumentsFilterContext } from '../../contexts/PlannedDocumentsFilterContext';
import { useMapClickResultsOpening } from '../../contexts/MapClickResultsOpeningContext';
import { ProposalSubmitContext } from 'contexts/ProposalSubmitContext';
import MyParticipationTabs from './Components/Sidebars/MyParticipationTabs/MyParticipationTabs';
import useJwt from 'utils/useJwt';
import { ProjectView } from './Components/Sidebars/ProjectView';
import { IdeaView } from './Components/Sidebars/IdeaView';
import { IdeaSubmisson } from './Components/Sidebars/MyParticipationTabs/components/Ideas/IdeaSubmission';
import LBISProjectsLayer from '../../components/Map/MapLayers/LBISProjectsLayer';
import { ProjectType } from './Components/Sidebars/Project';
import MunicipalityModal from './Components/Modals/MunicipalityModal';
import ProjectModal from './Components/Modals/ProjectModal';
import { useProjectDispatch } from '../../contexts/ProjectContext';
import dayjs from 'dayjs';
import { useParticipationBudgetDispatch } from '../../contexts/ParticipationBudgetContext';

export interface MeasureProps {
  setEnabledMeasureButton: Function;
  enabledMeasureButton: 'line' | 'poly' | null;
}

export interface CoordinatesWindowPosition {
  x: number;
  y: number;
  mapWidth: number;
  mapHeight: number;
}

const LayoutPage = () => {
  const { isTokenActive } = useJwt();
  let [searchParams] = useSearchParams();
  const { state } = useLocation();

  const map = useContext(MapContext);
  const { value: applyForNotificationsValue } = useApplyForNotifications();
  const intl = useIntl();
  const dispatch = useOpenedTypeDispatch();
  const navigate = useNavigate();
  const states = useOpenedTypeState();
  const { toggleHandler: toggleProposalSubmitHandler, isOpen: isProposalSumbitOpen } =
    useContext(ProposalSubmitContext);
  const { height: notificationHeight } = useNotificationHeader();
  const { setFilterParams } = usePlannedDocumentsFilterContext();
  const { open: isOpenMapClickResults, setOpen: setIsOpenMapClickResults } = useMapClickResultsOpening();

  const [isOpenLayerSettings, setIsOpenLayerSettings] = useState<boolean>(false);
  const [isOpenEmbedded, setIsOpenedEmbedded] = useState<boolean>(false);
  const [enabledMeasureButton, setEnabledMeasureButton] = useState<'line' | 'poly' | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<string[] | undefined>(undefined);
  const [openedUserEmbedUuid, setOpenedUserEmbedUuid] = useState<string | null>(null);
  const [isOpenUnauthenticated, setIsOpenUnauthenticated] = useState(false);
  const [showCoordinatesWindow, setShowCoordinatesWindow] = useState(false);
  const [isOpenProjectModal, setIsOpenProjectModal] = useState<boolean>(false);
  const [isOpenMunicipalityModal, setIsOpenMunicipalityModal] = useState<boolean>(false);
  const [submittedProjectTitle, setSubmittedProjectTitle] = useState('');
  const [municipality, setMunicipality] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectType | null>(null);
  const [coordinatesWindowPosition, setCoordinatesWindowPosition] = useState<CoordinatesWindowPosition | null>(null);

  const {
    openedTapis,
    openTapisDocument,
    openGeoproduct,
    openMyParticipation,
    openParticipationBudget,
    openProject,
    openMunicipalProject,
    openProjectView,
    openIdeaView,
    openVoteView,
    openSubmitProject,
    openSubmitProjectCreateForm,
    openSubmitIdea,
    openedMapType,
    openPlannedDocuments,
  } = states;

  const openSubmitProjectRef = useRef(openSubmitProject);

  useEffect(() => {
    openSubmitProjectRef.current = openSubmitProject;
  }, [openSubmitProject]);

  useEffect(() => {
    if (!!applyForNotificationsValue && applyForNotificationsValue.open && !isOpenMapClickResults) {
      setIsOpenMapClickResults(true);
    }
  }, [applyForNotificationsValue]);

  useEffect(() => {
    if (searchParams.get('planned-documents') && !openedTapis) {
      dispatch({ type: 'OPENED_TAPIS' });
    } else if (!searchParams.get('planned-documents') && openedTapis) {
      dispatch({ type: 'CLOSED_TAPIS' });
    }
    if (
      (searchParams.get('planned-documents') === 'open' ||
        !searchParams.toString().length ||
        searchParams.get('documents') === 'open') &&
      !openTapisDocument
    ) {
      dispatch({ type: 'OPEN_TAPIS' });
    } else if (
      searchParams.get('planned-documents') !== 'open' &&
      searchParams.toString().length &&
      searchParams.get('documents') !== 'open' &&
      openTapisDocument
    ) {
      dispatch({ type: 'CLOSE_TAPIS' });
    }
    if (searchParams.get('participation-budget') === 'open' && !openParticipationBudget) {
      dispatch({ type: 'OPEN_PARTICIPATION_BUDGET' });
      appendData({ search: { state: ['in_voting'] } }); // refetch projects
    } else if (searchParams.get('participation-budget') !== 'open' && openParticipationBudget) {
      dispatch({ type: 'CLOSE_PARTICIPATION_BUDGET' });
    }
    if (searchParams.get('geoproduct') === 'open' && !openGeoproduct) {
      dispatch({ type: 'OPEN_GEOPRODUCT' });
    } else if (searchParams.get('geoproduct') !== 'open' && openGeoproduct) {
      dispatch({ type: 'CLOSE_GEOPRODUCT' });
    }
    if (searchParams.get('my-participation') === 'open' && isTokenActive() && !openMyParticipation) {
      dispatch({ type: 'OPEN_MY_PARTICIPATION' });
    } else if (searchParams.get('my-participation') !== 'open' && openMyParticipation) {
      dispatch({ type: 'CLOSE_MY_PARTICIPATION' });
    } else if (searchParams.get('my-participation') === 'open' && !isTokenActive()) {
      navigate('/main');
    }
    if (searchParams.get('project') === 'open' && !openProject) {
      dispatch({ type: 'OPEN_PROJECT' });
      setProject((prevProject: any) => ({
        ...prevProject,
        coordinatesForModal: undefined,
      }));
    } else if (searchParams.get('project') !== 'open' && openProject) {
      dispatch({ type: 'CLOSE_PROJECT' });
    }
    if (searchParams.get('municipal-project') === 'open' && !openMunicipalProject) {
      dispatch({ type: 'OPEN_MUNICIPAL_PROJECT' });
    } else if (searchParams.get('municipal-project') !== 'open' && openMunicipalProject) {
      dispatch({ type: 'CLOSE_MUNICIPAL_PROJECT' });
    }
    if (searchParams.get('project-view') === 'open' && !openProjectView) {
      dispatch({ type: 'OPEN_PROJECT_VIEW' });
    } else if (searchParams.get('project-view') !== 'open' && openProjectView) {
      dispatch({ type: 'CLOSE_PROJECT_VIEW' });
    }
    if (searchParams.get('vote-view') === 'open' && !openVoteView) {
      dispatch({ type: 'OPEN_VOTE_VIEW' });
    } else if (searchParams.get('vote-view') !== 'open' && openVoteView) {
      dispatch({ type: 'CLOSE_VOTE_VIEW' });
    }
     if (searchParams.get('idea-view') === 'open' && !openIdeaView) {
      dispatch({ type: 'OPEN_IDEA_VIEW' });
    } else if (searchParams.get('idea-view') !== 'open' && openIdeaView) {
      dispatch({ type: 'CLOSE_IDEA_VIEW' });
    }

    if (searchParams.get('submit-project') === 'open' && isTokenActive() && !openSubmitProject) {
      dispatch({ type: 'OPEN_SUBMIT_PROJECT' });
    } else if (searchParams.get('submit-project') !== 'open' && openSubmitProject) {
      dispatch({ type: 'CLOSE_SUBMIT_PROJECT' });
    } else if (searchParams.get('submit-project') === 'open' && !isTokenActive()) {
      navigate('/main');
    }

    if (searchParams.get('submit-project-form') === 'open' && isTokenActive() && !openSubmitProjectCreateForm) {
      dispatch({ type: 'OPEN_SUBMIT_PROJECT_CREATE_FORM' });
    } else if (searchParams.get('submit-project-form') !== 'open' && openSubmitProjectCreateForm) {
      dispatch({ type: 'CLOSE_SUBMIT_PROJECT_CREATE_FORM' });
    } else if (searchParams.get('submit-project-form') === 'open' && !isTokenActive()) {
      navigate('/main');
    }

    if (searchParams.get('submit-idea') === 'open' && isTokenActive() && !openSubmitIdea) {
      dispatch({ type: 'OPEN_SUBMIT_IDEA' });
    } else if (searchParams.get('submit-idea') !== 'open' && openSubmitIdea) {
      dispatch({ type: 'CLOSE_SUBMIT_IDEA' });
    } else if (searchParams.get('submit-idea') === 'open' && !isTokenActive()) {
      navigate('/main');
    }

    if (searchParams.get('project-modal') === 'open' && !isOpenProjectModal) {
      setIsOpenProjectModal(true);
    } else if (searchParams.get('project-modal') !== 'open' && isOpenProjectModal) {
      setIsOpenProjectModal(false);
    }

    if (searchParams.get('document') === 'open' && !openPlannedDocuments) {
      dispatch({ type: 'OPEN_PANNING_DOCUMENTS' });
    } else if (searchParams.get('document') !== 'open' && openPlannedDocuments) {
      dispatch({ type: 'CLOSE_PANNING_DOCUMENTS' });
    }

    // handle link from embeded iframe
    if (searchParams.get('embed_uuid')) {
      setOpenedUserEmbedUuid(searchParams.get('embed_uuid'));
    }
    if (isProposalSumbitOpen) toggleProposalSubmitHandler();
  }, [searchParams]);

  const { data: embededDataByUuid } = useQueryApiClient({
    request: {
      url: `api/v1/user-embeds/${openedUserEmbedUuid}/uuid`,
      disableOnMount: !openedUserEmbedUuid,
    },
  });

  const dispatchSettings = useProjectDispatch();

  const { appendData } = useQueryApiClient({
    request: {
      url: `/api/v1/tapis/projects?year=${dayjs().year()}`,
      method: 'GET',
      disableOnMount: true,
    },
    onSuccess: (response) => {
      dispatchSettings({
        type: 'SAVE_PAYLOAD',
        payload: {
          projects: response,
          appendData: appendData,
        },
      });
    },
    onError: () => {
      dispatchSettings({
        type: 'SAVE_PAYLOAD',
        payload: {
          projects: [],
          appendData: appendData,
        },
      })
    }
  });

  useEffect(() => {
    appendData({ search: { state: ['in_voting'] } });
  }, []);

  const dispatchBudgetSettings = useParticipationBudgetDispatch();

  const { appendData: budgetAppendData } = useQueryApiClient({
    request: {
      url: `/api/v1/tapis/participation_budgets?search[year]=${dayjs().year()}`,
      method: 'GET',
    },
    onSuccess: (response) => {
      dispatchBudgetSettings({
        type: 'SAVE_PAYLOAD',
        payload: {
          budgets: response,
          appendData: budgetAppendData,
        },
      });
    },
    onError: () => {
      dispatchBudgetSettings({
        type: 'SAVE_PAYLOAD',
        payload: {
          budgets: [],
          appendData: budgetAppendData,
        },
      });
    },
  });

  const { isLoading: isGetOneProjectLoading, refetch: refetchOneProject } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/projects/${searchParams.get('geoProjectId')}`,
      disableOnMount: true,
    },
    onSuccess(res) {
      setProject({ ...res, ...res.versions[0] });
    },
  });

  useEffect(() => {
    if (searchParams.get('project-modal') === 'open' && !project) {
      refetchOneProject();
    }
  }, [searchParams]);

  useEffect(() => {
    if (map && embededDataByUuid?.data) {
      const embedData = JSON.parse(embededDataByUuid.data);
      const visibleLayers = applyEmbedMapState(map, embedData, dispatch);
      setVisibleLayers(visibleLayers);
    }
  }, [map, embededDataByUuid]);

  const onMarkerClick = (project: ProjectType, coordinatesForModal: CoordinatesWindowPosition) => {
    const params = new URLSearchParams(window.location.search);
    if (openSubmitProjectRef.current) {
      navigate('/main?submit-project-form=open');
      return;
    }

    params.delete('project-modal');
    params.delete('geoProjectId');

    params.set('project-modal', 'open');
    params.set('geoProjectId', String(project?.id));

    const newQueryString = params.toString();
    navigate(`/main?${newQueryString}`);

    setProject({
      ...project,
      coordinatesForModal,
    });
  };

  const onCloseProjectModal = () => {
    setIsOpenProjectModal(false);
  };

  const onCloseMunicipalityModal = () => {
    setIsOpenMunicipalityModal(false);
  };

  const onMunicipalityClick = (municipality: string, coordinatesForModal: CoordinatesWindowPosition) => {
    const params = new URLSearchParams(window.location.search);
    params.delete('project-modal');
    params.delete('geoProjectId');
    const newQueryString = params.toString();
    navigate(`/main?${newQueryString}`);
    setMunicipality(municipality); //TODO
    setCoordinatesWindowPosition(coordinatesForModal);
    setIsOpenMunicipalityModal(true);
  };

  const handleBackClick = () => {
    if (searchParams.get('idea-view') == 'open') {
      navigate('/main?my-participation=open&tab=ideas_tab', { state: { currentPage: state.currentPage } });
    } else if (searchParams.get('project-view') == 'open') {
      navigate('/main?my-participation=open&tab=submitted_projects_tab', { state: { currentPage: state.currentPage } });
    } else if(searchParams.get('vote-view') == 'open') {
      // TODO: for now there is no my votes, after adding check vote section that when view vote info and return to vote list check current list page
      navigate('/main?my-participation=open&tab=my_votes_tab');
    } else {
      navigate(-1);
    }
  };
  const handleCloseMyParticipation = () => {
    if(!!searchParams.get('tab')){
      dispatch({ type: 'CLOSE_MY_PARTICIPATION' });
    }else{
      navigate(-1);
    }
  }

  return (
    <StyledPage notificationHeight={notificationHeight}>
      <Sidebars
        isOpenPlannedDocuments={openPlannedDocuments as boolean}
        isOpenGeoproducts={openGeoproduct as boolean}
        isOpenParticipationBudget={openParticipationBudget as boolean}
        isOpenProject={openProject as boolean}
        isOpenMunicipalProject={openMunicipalProject as boolean}
      />
      <SidebarDrawer
        title={intl.formatMessage({ id: 'layer_settings.map_layers' })}
        isOpen={isOpenLayerSettings}
        onClose={() => setIsOpenLayerSettings(false)}
      >
        <LayerSettings visibleLayers={visibleLayers} />
      </SidebarDrawer>
      <StyledContent>
        {(!openedUserEmbedUuid || visibleLayers) && (
          <MapComponent zoomButtons={openedMapType === 'lbis'}>
            <LBISProjectsLayer
              onMarkerClick={onMarkerClick}
              onCloseProjectModal={onCloseProjectModal}
              searchParams={searchParams}
              onMunicipalityClick={onMunicipalityClick}
              onCloseMunicipalityModal={onCloseMunicipalityModal}
              municipality={municipality}
            />

            <MapSearch show={!(openGeoproduct || openTapisDocument || openParticipationBudget || openProject)} />

            <ProjectModal
              project={project}
              isOpenProjectModal={isOpenProjectModal}
              setIsOpenProjectModal={setIsOpenProjectModal}
              isProjectLoading={isGetOneProjectLoading}
            />

            <MunicipalityModal
              municipality={municipality}
              isOpenMunicipalityModal={isOpenMunicipalityModal}
              setIsOpenMunicipalityModal={setIsOpenMunicipalityModal}
              coordinatesWindowPosition={coordinatesWindowPosition}
            />

            <LayerSwitcher setIsOpenLayerSettings={setIsOpenLayerSettings} visibleLayers={visibleLayers} />
            {(openedMapType === 'tapis' || openedMapType === 'geo') && (
              <>
                <CoordsComponent
                  setShowCoordinatesWindow={setShowCoordinatesWindow}
                  showCoordinatesWindow={showCoordinatesWindow}
                  enabledMeasureButton={enabledMeasureButton}
                  setEnabledMeasureButton={setEnabledMeasureButton}
                />
                <Measure
                  enabledMeasureButton={enabledMeasureButton}
                  setEnabledMeasureButton={setEnabledMeasureButton}
                />
                <EmbedCreateButton setIsOpenedEmbedded={setIsOpenedEmbedded} setShowModal={setIsOpenUnauthenticated} />
              </>
            )}
          </MapComponent>
        )}
      </StyledContent>
      {!isOpenEmbedded && (openedMapType === 'tapis' || openedMapType === 'geo') ? (
        <SidebarDrawer
          title={openedMapType === 'tapis' ? 'Teritorijas izmantošana' : 'Rezultāti'}
          isOpen={isOpenMapClickResults}
          onClose={() => {
            setIsOpenMapClickResults(false);
            setFilterParams({});
          }}
        >
          <MapClickResults
            isShowCoordinatesWindowOpen={showCoordinatesWindow}
            setIsOpenMapClickResults={setIsOpenMapClickResults}
            isOpenMapClickResults={isOpenMapClickResults}
            isOpenPlannedDocuments={openTapisDocument as boolean}
          />
        </SidebarDrawer>
      ) : null}

      {openMyParticipation ? (
        <SidebarDrawer
          title={intl.formatMessage({ id: 'my_participation.my_participation' })}
          breadcrumb={[{ path: '/', name: intl.formatMessage({ id: 'general.start' }) }]}
          isOpen={openMyParticipation}
          onClose={handleCloseMyParticipation}
          width={'50%'}
          // width={'735'} //for pixelperfect
          className="sidebar-style-2"
        >
          <MyParticipationTabs />
        </SidebarDrawer>
      ) : null}

      {openSubmitIdea ? (
        <SidebarDrawer
          title={intl.formatMessage({ id: 'my_participation.submission_idea' })}
          breadcrumb={[
            { path: '/', name: intl.formatMessage({ id: 'general.start' }) },
            {
              path: '/main?my-participation=open&tab=ideas_tab',
              name: intl.formatMessage({ id: 'my_participation.tab_title.ideas' }),
            },
          ]}
          isOpen={openSubmitIdea}
          onClose={() => {
            navigate(-1);
          }}
          showTitleInBreadcrump={false}
          width={'50%'}
          className="sidebar-style-2"
          backText={'general.back'}
        >
          <IdeaSubmisson />
        </SidebarDrawer>
      ) : null}

      {(openProjectView || openIdeaView || openVoteView) && searchParams.get('side') === 'right' && (
        <SidebarDrawer
          width="50%"
          className="sidebar-style-2"
          title={submittedProjectTitle}
          isOpen={openProjectView || openIdeaView || openVoteView}
          showBreadcrumb={true}
          backIcon={'right'}
          onClose={handleBackClick}
          breadcrumb={
            openIdeaView
              ? [
                  { name: 'Sākums' },
                  { name: 'Mana līdzdalība', goBack: true },
                  {
                    name: intl.formatMessage({ id: 'my_participation.tab_title.ideas' }),
                    path: '/main?my-participation=open&tab=ideas_tab',
                    withState: true,
                  },
                ]
              : [{ name: 'Sākums' }, { name: 'Mana līdzdalība', goBack: true }]
          }
          dividerVisible={false}
          backText={'general.back'}
        >
          {openIdeaView && <IdeaView setSubmittedIdeaTitle={setSubmittedProjectTitle} />}
          {openVoteView && <ProjectView setSubmittedProjectTitle={setSubmittedProjectTitle} />}
          {openProjectView && <ProjectView setSubmittedProjectTitle={setSubmittedProjectTitle} />}
        </SidebarDrawer>
      )}
      <RightSidebars
        setIsOpenedEmbedded={setIsOpenedEmbedded}
        isOpenEmbedded={isOpenEmbedded}
        setVisibleLayers={setVisibleLayers}
      />
      <UnauthenticatedModal setShowModal={setIsOpenUnauthenticated} showModal={isOpenUnauthenticated} />
    </StyledPage>
  );
};
export default LayoutPage;
