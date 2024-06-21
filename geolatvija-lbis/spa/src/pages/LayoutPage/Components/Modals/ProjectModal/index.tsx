import React, { useRef, useEffect, useState } from 'react';
import { StyledInfoTooltip, StyledProjectModal } from './style';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Button, Spinner, Tooltip } from 'ui';
import { ProjectType } from '../../Sidebars/Project';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import UnauthenticatedModal from 'components/Modals/UnauthenticatedModal';
import useJwt from 'utils/useJwt';
import { useUserState } from 'contexts/UserContext';
import useQueryApiClient from 'utils/useQueryApiClient';
import { getMapModalPosition } from 'utils/getMapModalPosition';
import { useProjectDispatch } from 'contexts/ProjectContext';

interface ProjectModalType {
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
  isOpenProjectModal?: boolean;
  project: ProjectType | null;
  setIsOpenProjectModal: Function;
  isProjectLoading: boolean;
}

const ProjectModal = ({ project, isOpenProjectModal, setIsOpenProjectModal, isProjectLoading }: ProjectModalType) => {
  const intl = useIntl();
  const modalRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<any>(null);
  const user = useUserState();
  const dispatch = useProjectDispatch();
  const navigate = useNavigate();
  const { isTokenActive } = useJwt();
  let [searchParams] = useSearchParams();
  const dispatchProjects = useProjectDispatch();
  const [isOpenUnauthenticated, setIsOpenUnauthenticated] = useState(false);
  const [userVoted, setUserVoted] = useState(project?.has_voted);
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const indivudualRole = activeRole?.code === 'authenticated';
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const { current } = textRef;
    if (current) {
      setIsOverflowed(current?.scrollHeight > current?.clientHeight);
    }
    if (project) {
      dispatchProjects({
        type: 'HIGHLIGHT_PROJECT',
        payload: project.id,
      });
    }
    setUserVoted(project?.has_voted);
  }, [project]);

  useEffect(() => {
    if (searchParams.get('auto-vote') === 'true' && !userVoted && project?.id) {
      const params = new URLSearchParams(window.location.search);
      params.delete('auto-vote');
      navigate(`/main?${params.toString()}`);
      handleChangeStatus();
    }
  }, [searchParams, project]);

  const { appendData: appendVote, isLoading: isLoadingVotion } = useQueryApiClient({
    request: {
      url: 'api/v1/tapis/vote-for-project',
      method: 'POST',
    },
    onSuccess() {
      setUserVoted((prev: boolean | undefined) => !prev);
      if (project) {
        dispatch({ type: 'VOTE_PROJECT', payload: project?.id });
      }
    },
  });

  const handleChangeStatus = () => {
    if (!isTokenActive()) {
      setIsOpenUnauthenticated(true);
      return;
    }
    if (!indivudualRole) {
      return;
    }
    appendVote({
      vote: {
        project_id: project?.id,
        is_active: !project?.has_voted,
      },
    });
  };
  const coordinatesForModal = project?.coordinatesForModal;

  const handleOpenProjectView = () => {
    navigate(`/main?project-view=open&side=left&geoProjectId=${project?.id}`, {
      state: {
        backBtnRoute: '/main?participation-budget=open',
      },
    });
    setIsOpenProjectModal(false);
  };

  const modalRefWidth = modalRef.current?.clientWidth ? modalRef.current.clientWidth : 0;
  const modalRefHeight = modalRef.current?.clientHeight ? modalRef.current.clientHeight : 0;

  const { left, top } = coordinatesForModal
    ? getMapModalPosition(
        coordinatesForModal.x,
        coordinatesForModal.y,
        coordinatesForModal.mapWidth,
        coordinatesForModal.mapHeight,
        modalRefWidth,
        modalRefHeight
      )
    : { left: 0, top: 0 };

  return (
    <StyledProjectModal>
      <div
        ref={modalRef}
        className={`modal ${isOpenProjectModal ? 'open' : ''}`}
        style={
          coordinatesForModal
            ? {
                left: `${left}px`,
                top: `${top}px`,
              }
            : {}
        }
      >
        <Spinner spinning={isProjectLoading}>
          <Swiper
            cssMode={true}
            navigation={true}
            pagination={true}
            mousewheel={true}
            loop={true}
            modules={[Navigation, Pagination, Mousewheel]}
            className="project-item__swiper"
          >
            {project?.pictures?.map((image: string, idx: number) => (
              <SwiperSlide key={idx}>
                <img src={image} alt="" />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="project-item__content-wrapper">
            <Tooltip overlayClassName="tooltip-white" title={isOverflowed ? project?.name : ''}>
              <h2 className="title_project_modal" ref={textRef}>
                {project?.name}
              </h2>
            </Tooltip>
          </div>
          {!isProjectLoading && (
            <div className="buttons_group">
              <div className="left_side">
                {project?.state === 'in_voting' ? (
                  <Tooltip
                    placement="top"
                    overlayClassName="tooltip-white"
                    title={
                      isTokenActive() &&
                      !indivudualRole &&
                      intl.formatMessage({ id: 'user_with_individual_role_can_vote' })
                    }
                    hack={true}
                  >
                    <Button
                      loading={isLoadingVotion}
                      onClick={() => handleChangeStatus()}
                      disabled={!indivudualRole && isTokenActive()}
                      label={
                        isTokenActive()
                          ? userVoted
                            ? intl.formatMessage({ id: 'participation_budget.projects_voted_btn' })
                            : intl.formatMessage({ id: 'participation_budget.projects_tovote_btn' })
                          : intl.formatMessage({ id: 'participation_budget.projects_tovote_btn' })
                      }
                      type={isTokenActive() ? (userVoted ? undefined : 'primary') : 'primary'}
                    />
                  </Tooltip>
                ) : (
                  <div className={`status ${project?.state}`}>
                    {intl.formatMessage({ id: `participation_budget.${project?.state}` })}
                  </div>
                )}

                {!isTokenActive() && (
                  <Tooltip
                    placement="topLeft"
                    overlayClassName="tooltip-white"
                    title={intl.formatMessage({ id: 'my_participation.to_vote_project_please_authorize' })}
                  >
                    <StyledInfoTooltip>
                      <i className="far fa-info-circle"></i>
                    </StyledInfoTooltip>
                  </Tooltip>
                )}
              </div>

              <Button
                label={intl.formatMessage({
                  id: 'participation_budget.projects_see_description',
                })}
                type="link"
                onClick={handleOpenProjectView}
              />
            </div>
          )}
        </Spinner>
      </div>
      <UnauthenticatedModal
        additionalParam={{ name: 'auto-vote', value: 'true' }}
        setShowModal={setIsOpenUnauthenticated}
        showModal={isOpenUnauthenticated}
      />
    </StyledProjectModal>
  );
};

export default ProjectModal;
