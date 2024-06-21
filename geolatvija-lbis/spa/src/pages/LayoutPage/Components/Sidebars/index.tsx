import React, { useEffect, useContext, useState } from 'react';
import { SidebarDrawer } from 'ui';
import { useIntl } from 'react-intl';
import { DetailedPlannedDocument } from './DetailedPlannedDocument';
import { NotificationContext } from '../../../../contexts/NotificationContext';
import ApplyingForNotification from './ApplyingForNotification';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ProposalSubmitContext } from '../../../../contexts/ProposalSubmitContext';
import ProposalSubmit from './ProposalSubmit';
import PlannedDocuments from './PlannedDocuments';
import { useOpenedTypeDispatch, useOpenedTypeState } from '../../../../contexts/OpenedTypeContext';
import GeoProductList from './GeoProductList';
import { GeoProduct } from './GeoProduct';
import useSessionStorage from '../../../../utils/useSessionStorage';
import { usePlannedDocumentProposal } from '../../../../contexts/PlannedDocumentProposalContext';
import { useApplyForNotifications } from '../../../../contexts/ApplyForNotificationsContext';
import { ApplyForNotificationSideBarWrapper } from './styles';
import ParticipationBudget from './ParticipationBudget';
import Project from './Project';
import { MunicipalProject } from './MunicipalProject';
import SubmitProjectFirstStep from './ParticipationBudget/components/SubmitProjectFirstStep';
import SubmitProjectForm from './ParticipationBudget/components/SubmitProjectForm';
import SubmitProjectLastStep from './ParticipationBudget/components/SubmitProjectLastStep';
import TapisDocuments from './TapisDocuments';
import { ProjectView } from './ProjectView';
import { useProjectDispatch } from 'contexts/ProjectContext';

interface SidebarsProps {
  isOpenPlannedDocuments: boolean;
  isOpenGeoproducts: boolean;
  isOpenParticipationBudget: boolean;
  isOpenProject: boolean;
  isOpenMunicipalProject: boolean;
}

const Sidebars = ({
  isOpenPlannedDocuments,
  isOpenGeoproducts,
  isOpenParticipationBudget,
  isOpenProject,
  isOpenMunicipalProject,
}: SidebarsProps) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [isOpenGeoProduct, setIsOpenGeoproduct] = useState<boolean>(false);
  const [selectedGeoProduct, setSelectedGeoProduct] = useState<number | null>(null);
  const {
    isOpen: isOpenNotification,
    setIsOpen: setIsOpenNotification,
    setCoords,
    setAddress: setMapAddress,
  } = useContext(NotificationContext);
  const dispatchSettings = useProjectDispatch();
  const [isOpenDetailPlannedDocument, setIsOpenDetailPlannedDocument] = useState<boolean>(false);
  const [selectedPlannedDocument, setSelectedPlannedDocument] = useState<number | null>(null);
  const [selectedGeoProductTitle, setSelectedGeoProductTitle] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);
  const [isOpenUserNotification, setIsOpenUserNotification] = useState<boolean>(false);
  const [isZoomToPlannedDocument, setIsZoomToPlannedDocument] = useState<boolean>(true);
  const [isOpenProjectSearch, setIsOpenProjectSearch] = useState<boolean>(false);
  const [selectedPlannedDocumentTitle, setSelectedPlannedDocumentTitle] = useState<string>('');
  const [plannedDocumentMunicipality, setPlannedDocumentMunicipality] = useState<string>('');
  const [projectTitle, setProjectTitle] = useState<string>('');

  const { hash } = useLocation();
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const openedTypeDispatch = useOpenedTypeDispatch();

  const states = useOpenedTypeState();
  const { openSubmitProjectCreateForm, openProjectView, openTapisDocument } = states;

  const { setSessionValue: setGeoProductIdInSession, removeSessionValue: removeGeoProductIdFromSession } =
    useSessionStorage('GEO_PRODUCT_ID');
  const { setSessionValue: setGeoOrderIdInSession, removeSessionValue: removeGeoOrderIdFromSession } =
    useSessionStorage('GEO_ORDER_ID');
  const { removeFromSession: removeProposalFromSession } = usePlannedDocumentProposal();
  const { removeFromSession: removeApplyForNotificationsFromSession } = useApplyForNotifications();
  const { value: OrderModalIsOpen } = useSessionStorage('ORDER_CONFIRMATION');

  const {
    isOpen: isProposalSubmitOpen,
    duration,
    toggleHandler: ProposalSubmitHandler,
  } = useContext(ProposalSubmitContext);

  useEffect(() => {
    if (searchParams.get('notification')) {
      setSelectedNotification(parseInt(searchParams.get('notification') || ''));
      setIsOpenUserNotification(true);
      setIsOpenNotification(true);
    } else {
      setIsOpenUserNotification(false);
      setIsOpenNotification(false);
      setCoords(undefined);
      setMapAddress(undefined);
      removeApplyForNotificationsFromSession();
    }
  }, [searchParams]);

  const closeUserNotification = () => {
    setIsOpenUserNotification(false);
    setIsOpenNotification(false);
    setCoords(undefined);
    setMapAddress(undefined);
    removeApplyForNotificationsFromSession();
    navigate(-1);
  };

  useEffect(() => {
    if (selectedNotification) {
      setIsOpenUserNotification(true);
    }
  }, [selectedNotification]);

  useEffect(() => {
    const geoProductId = searchParams.get('geoProductId');
    const geoOrderId = searchParams.get('geoOrderId');

    if (geoOrderId) {
      setGeoOrderIdInSession(geoOrderId);
    } else {
      removeGeoOrderIdFromSession();
    }

    if (geoProductId) {
      setSelectedGeoProduct(parseInt(geoProductId || ''));
      setGeoProductIdInSession(geoProductId);
      setIsOpenGeoproduct(true);
    } else if (!OrderModalIsOpen) {
      setIsOpenGeoproduct(false);
      setSelectedGeoProduct(null);
      removeGeoProductIdFromSession();
    }
  }, [searchParams]);

  useEffect(() => {
    if (hash) {
      setIsZoomToPlannedDocument(!(hash.indexOf('nozoom') > -1));
      setSelectedPlannedDocument(parseInt(hash.replace('#document_', '')));

      if (isProposalSubmitOpen) {
        onProposalSubmitDrawerClose();
      }
    } else {
      setSelectedPlannedDocument(null);
      setIsOpenDetailPlannedDocument(false);
      openedTypeDispatch({ type: 'UNSELECT_TAPIS_DOCUMENT' });
      removeProposalFromSession();
    }
  }, [hash]);

  const closePlannedDocuments = () => {
    const existingHash = location.hash;
    navigate(location.pathname + existingHash);
  };

  const closeProject = () => {
    navigate('/main?participation-budget=open');
  };
  const closeGeoProducts = () => {
    setSearchParams((params) => {
      params.set('geoproduct', 'false');
      return params;
    });
  };

  // show detailDocument when select it from List
  useEffect(() => {
    if (selectedPlannedDocument) {
      setIsOpenDetailPlannedDocument(true);
    }
  }, [selectedPlannedDocument]);

  // show detailDocument when select it from List
  useEffect(() => {
    if (selectedGeoProduct) {
      setIsOpenGeoproduct(true);
    }
  }, [selectedGeoProduct]);

  useEffect(() => {
    openedTypeDispatch({ type: 'CLOSE_TAPIS' });
  }, [isOpenNotification]);

  const onProposalSubmitDrawerClose = () => {
    ProposalSubmitHandler();
  };

  const onPlannedDocumentSelect = (id: number) => {
    setSelectedPlannedDocument(id);
    navigate(`/geo/tapis?documents=open#document_${id}`);
  };

  const onGeoproductSelect = (id: number) => {
    setSelectedGeoProduct(id);
    setGeoProductIdInSession(String(id));
    navigate(`/main?geoproduct=open&geoProductId=${id}`);
  };

  const handlePlannedDocumentTitle = (documentTitle: string) => {
    setSelectedPlannedDocumentTitle(documentTitle);
  };

  const handlePlannedDocumentMunicipality = (documentMunicipality: string) => {
    setPlannedDocumentMunicipality(documentMunicipality);
  };

  const handleCloseMunicipalSidebar = () => {
    navigate(-1);
    dispatchSettings({
      type: 'REFETCH',
      payload: {
        search: {
          state: ['in_voting'],
        },
      },
    });
  };

  return (
    <>
      <ApplyForNotificationSideBarWrapper>
        <SidebarDrawer
          title={intl.formatMessage({ id: 'notification.application_for_notification' })}
          subtitle={
            <div className="mt-3">
              <i>{intl.formatMessage({ id: 'notification.intend_to_apply' })}</i>
            </div>
          }
          isOpen={isOpenUserNotification}
          onClose={closeUserNotification}
        >
          {isOpenUserNotification && <ApplyingForNotification onClose={closeUserNotification} />}
        </SidebarDrawer>
      </ApplyForNotificationSideBarWrapper>
      <SidebarDrawer
        title={intl.formatMessage({ id: 'planned_documents.documents' })}
        isOpen={isOpenPlannedDocuments}
        onClose={closePlannedDocuments}
        backIcon={'left'}
        className="sidebar-style-2"
      >
        {isOpenPlannedDocuments && (
          <PlannedDocuments
            isOpenDocument={isOpenDetailPlannedDocument}
            setSelectedPlannedDocument={(id: number) => onPlannedDocumentSelect(id)}
          />
        )}
      </SidebarDrawer>
      <SidebarDrawer
        hideLabel={true}
        width="100"
        className="participation-budget"
        title={''}
        isOpen={isOpenParticipationBudget}
      >
        <ParticipationBudget setIsOpenProjectSearch={setIsOpenProjectSearch} />
      </SidebarDrawer>

      <SidebarDrawer hideLabel={true} width="100" className="tapis-documents" title={''} isOpen={openTapisDocument}>
        <TapisDocuments setIsOpenProjectSearch={setIsOpenProjectSearch} />
      </SidebarDrawer>

      <SidebarDrawer
        width="50vw"
        backIcon={'left'}
        className="sidebar-style-2"
        title={intl.formatMessage({ id: 'participation_budget.project_submission' })}
        isOpen={openSubmitProjectCreateForm}
        onClose={closeProject}
        showBreadcrumb={false}
      >
        {openSubmitProjectCreateForm && <SubmitProjectForm />}
      </SidebarDrawer>
      <SubmitProjectFirstStep />
      <SubmitProjectLastStep />
      <SidebarDrawer
        width="50vw"
        className="sidebar-style-2"
        title={intl.formatMessage({ id: 'navigation.projects' })}
        isOpen={isOpenProject}
        showBreadcrumb={false}
        backIcon={'left'}
        onClose={() => {
          closeProject();
          sessionStorage.setItem('ProjectCurrentPage', '1');
        }}
      >
        {isOpenProject && (
          <Project isOpenProjectSearch={isOpenProjectSearch} setIsOpenProjectSearch={setIsOpenProjectSearch} />
        )}
      </SidebarDrawer>

      {isOpenMunicipalProject && (
        <MunicipalProject closeProject={handleCloseMunicipalSidebar} isOpenMunicipalProject={isOpenMunicipalProject} />
      )}

      {openProjectView && searchParams.get('side') === 'left' && (
        <SidebarDrawer
          width="50%"
          className="sidebar-style-2"
          title={projectTitle}
          isOpen={openProjectView}
          showBreadcrumb={true}
          backIcon={'left'}
          onClose={() => navigate(location?.state?.backBtnRoute ? location.state.backBtnRoute : -1)}
          breadcrumb={[
            { name: 'Sākums', path: '/main?participation-budget=open' },
            {
              name: location?.state?.navigation ? location.state.navigation : 'Projekti',
              path: location?.state?.link ? location.state.link : '/main?project=open',
            },
          ]}
          dividerVisible={false}
          backText={'general.back'}
        >
          <ProjectView setSubmittedProjectTitle={setProjectTitle} />
        </SidebarDrawer>
      )}
      <SidebarDrawer
        title={selectedPlannedDocumentTitle}
        subtitle={plannedDocumentMunicipality}
        isOpen={isOpenDetailPlannedDocument}
        onClose={() => {
          setIsOpenDetailPlannedDocument(false);
          openedTypeDispatch({ type: 'UNSELECT_TAPIS_DOCUMENT' });
          setSelectedPlannedDocument(null);
          removeProposalFromSession();
          navigate('/main?documents=open');
        }}
      >
        {selectedPlannedDocument && (
          <DetailedPlannedDocument
            documentTitle={handlePlannedDocumentTitle}
            documentMunicipality={handlePlannedDocumentMunicipality}
            id={selectedPlannedDocument}
            isZoomToPlannedDocument={isZoomToPlannedDocument}
          />
        )}
      </SidebarDrawer>
      <SidebarDrawer title="Ģeoproduktu katalogs" isOpen={isOpenGeoproducts} onClose={closeGeoProducts}>
        {isOpenGeoproducts && (
          <GeoProductList setSelectedGeoProduct={onGeoproductSelect} setSelectedTitle={setSelectedGeoProductTitle} />
        )}
      </SidebarDrawer>
      <SidebarDrawer
        title={selectedGeoProductTitle}
        isOpen={isOpenGeoProduct}
        onClose={() => {
          setIsOpenGeoproduct(false);
          setSelectedGeoProduct(null);
          removeGeoProductIdFromSession();
          navigate('/main?geoproduct=open');
        }}
      >
        {selectedGeoProduct && <GeoProduct id={selectedGeoProduct} setSelectedTitle={setSelectedGeoProductTitle} />}
      </SidebarDrawer>
      <SidebarDrawer
        title={intl.formatMessage({ id: 'proposal.submit' })}
        isOpen={isProposalSubmitOpen}
        onClose={onProposalSubmitDrawerClose}
      >
        <ProposalSubmit duration={duration} />
      </SidebarDrawer>
    </>
  );
};

export default Sidebars;
