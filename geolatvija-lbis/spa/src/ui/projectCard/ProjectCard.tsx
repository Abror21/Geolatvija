import React, { Dispatch, SetStateAction, useState } from 'react';
import { Typography } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Autoplay } from 'swiper/modules';

import { Card } from 'ui/card';
import { Button, Tooltip } from 'ui';
import { useIntl } from 'react-intl';
import { StyledProjectCard } from './style';
import useJwt from 'utils/useJwt';
import { useUserState } from 'contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import UnauthenticatedModal from 'components/Modals/UnauthenticatedModal';
import useQueryApiClient from 'utils/useQueryApiClient';

const { Title } = Typography;

interface ProjectItemProps {
  project: any;
  className?: string;
  listView?: boolean;
  children?: React.ReactNode;
  isVisibleSeDescBtn?: boolean;
  setActiveProject?: Dispatch<SetStateAction<number | null>> | Function;
  onDescriptionClick?: () => void;
  projectViewSide?: 'left' | 'right';
  id?: number;
  elipseTitle?: boolean;
  section?: string;
  currentPage?: number;
}

export const ProjectCard: React.FC<ProjectItemProps> = ({
  project,
  className,
  listView = false,
  children,
  isVisibleSeDescBtn,
  setActiveProject,
  onDescriptionClick,
  projectViewSide = 'right',
  elipseTitle,
  id,
  currentPage,
  section,
}) => {
  const intl = useIntl();
  const user = useUserState();
  const { isTokenActive } = useJwt();
  const navigate = useNavigate();
  const { pictures, name, has_voted, state } = project;
  const [isOpenUnauthenticated, setIsOpenUnauthenticated] = useState(false);
  const [userVoted, setUserVoted] = useState(has_voted);

  const { appendData: appendVote, isLoading: isLoadingVotion } = useQueryApiClient({
    request: {
      url: 'api/v1/tapis/vote-for-project',
      method: 'POST',
    },
    onSuccess() {
      setUserVoted((prev: boolean) => !prev);
    },
  });

  const handleOpenProjectView = () => {
    navigate(`/main?project-view=open&side=${projectViewSide}&geoProjectId=${id}`, { state: { currentPage } });
  };
  const changeVotingStatus = () => {
    appendVote({
      vote: {
        project_id: project.id,
        is_active: !has_voted,
      },
    });
  };

  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const indivudualRole = activeRole?.code === 'authenticated';

  return (
    <StyledProjectCard
      className={`${listView ? 'list-view' : ''} ${className} ${elipseTitle && 'ellipse-title'} `}
      onClick={() => {
        if (setActiveProject) {
          setActiveProject(project.id);
        }
      }}
    >
      <Card className={`full-height ${className}`}>
        {listView ? (
          <img src={pictures[0]} alt="" />
        ) : (
          <Swiper
            cssMode={true}
            navigation={true}
            pagination={true}
            mousewheel={true}
            loop={false}
            modules={[Navigation, Pagination, Mousewheel, Autoplay]}
            className="project-item__swiper"
          >
            {pictures?.map((image: any, idx: number) => (
              <SwiperSlide key={idx}>
                <img src={image} alt="" />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <div className="project-item__content-wrapper ">
          <Title className="project_title " level={4}>
            {name}
          </Title>
          <div className="project-item__swiper-btns">
            {children ? (
              children
            ) : (
              <>
                {state === 'in_voting' ? (
                  <Tooltip
                    title={
                      isTokenActive() && !indivudualRole
                        ? intl.formatMessage({ id: 'user_with_individual_role_can_vote' })
                        : ''
                    }
                    overlayClassName="white-background"
                  >
                    <Button
                      className={`${isTokenActive() && !indivudualRole ? 'disabled-button' : ''}`}
                      loading={isLoadingVotion}
                      onClick={() => {
                        if (!isTokenActive()) {
                          setIsOpenUnauthenticated(true);
                        } else if (isTokenActive() && indivudualRole) {
                          changeVotingStatus();
                        }
                      }}
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
                  <div className={`status ${project.state}`}>
                    {intl.formatMessage({ id: `participation_budget.${project.state}` })}
                  </div>
                )}
              </>
            )}
            {isVisibleSeDescBtn && (
              <Button
                onClick={onDescriptionClick ? onDescriptionClick : handleOpenProjectView}
                label={intl.formatMessage({ id: 'participation_budget.projects_see_description' })}
                className="project-item__desc-btn"
                border={false}
              />
            )}
          </div>
        </div>
      </Card>
      <UnauthenticatedModal setShowModal={setIsOpenUnauthenticated} showModal={isOpenUnauthenticated} />
    </StyledProjectCard>
  );
};
