import React, { useState } from 'react';
import { Typography } from 'antd';
import { useIntl } from 'react-intl';
import { Button, Card, Label, Tooltip } from 'ui';
import { ProjectInterface } from '../../temporary-data';
import { StyledProjectListItem } from './style';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserState } from 'contexts/UserContext';
import useJwt from 'utils/useJwt';
import UnauthenticatedModal from 'components/Modals/UnauthenticatedModal';
import useQueryApiClient from '../../../../../../../../utils/useQueryApiClient';
import { useParticipationBudgetState } from 'contexts/ParticipationBudgetContext';
const { Title } = Typography;

interface ProjectListItemProps {
  project: ProjectInterface;
  block: string;
  votingPeriodFrom: string;
  votingPeriodTo: string;
  isVotingPeriod: boolean;
}

export const ProjectListItem = ({
  project,
  block,
  votingPeriodFrom,
  votingPeriodTo,
  isVotingPeriod,
}: ProjectListItemProps) => {
  const intl = useIntl();
  const { pictures, name, state, startDate, endDate, vote_count } = project;
  const startDateString = startDate ? dayjs(startDate).format('DD.MM.YYYY') : '';
  const endDateString = endDate ? dayjs(endDate).format('DD.MM.YYYY') : '';
  const [showAuthModal, setShowAuthModal] = useState(false);
  let [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { isTokenActive } = useJwt();
  const user = useUserState();
  const { budgets } = useParticipationBudgetState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const isPhysical = activeRole?.code === 'authenticated';
  const activeButNotPhysical = isTokenActive() && !isPhysical;
  const atvkId = searchParams.get('atvk_id');
  const municipalName = budgets?.find((municipal: any) => municipal.atvk_id == atvkId)?.name;

  const { appendData: appendVote, isLoading: isLoadingVotion } = useQueryApiClient({
    request: {
      url: 'api/v1/tapis/vote-for-project',
      method: 'POST',
    },
    onSuccess() {
      project.has_voted = !project.has_voted;
    },
  });

  const handleOpenProjectView = () => {
    navigate(`/main?project-view=open&side=left&geoProjectId=${project.id}`, {
      state: {
        navigation: municipalName,
        link: `/main?municipal-project=open&atvk_id=${atvkId}`,
      },
    });
  };

  const handleClickVoteBtn = () => {
    if (!isTokenActive()) {
      setShowAuthModal(true);
      return;
    }
    appendVote({
      vote: {
        project_id: project.id,
        is_active: !project.has_voted,
      },
    });
  };

  return (
    <StyledProjectListItem>
      <Card className="card_inner">
        <img className="card_image" src={pictures[0]} alt="" />
        <div className="content_side">
          <Title level={4}>{name}</Title>
          <div className="status_side">
            {state === 'in_voting' && isVotingPeriod ? (
              !activeButNotPhysical ? (
                <Button
                  label={
                    project.has_voted
                      ? intl.formatMessage({ id: 'participation_budget.projects_voted_btn' })
                      : intl.formatMessage({ id: 'participation_budget.projects_tovote_btn' })
                  }
                  type={project.has_voted ? 'default' : 'primary'}
                  onClick={handleClickVoteBtn}
                  loading={isLoadingVotion}
                />
              ) : (
                <Tooltip
                  hack
                  placement="topLeft"
                  title={intl.formatMessage({ id: 'user_with_individual_role_can_vote' })}
                >
                  <Button
                    label={
                      project.has_voted
                        ? intl.formatMessage({ id: 'participation_budget.projects_voted_btn' })
                        : intl.formatMessage({ id: 'participation_budget.projects_tovote_btn' })
                    }
                    type={project.has_voted ? 'default' : 'primary'}
                    disabled
                  />
                </Tooltip>
              )
            ) : (
              <div className={`status ${block === 'first' ? state : 'unsupported'}`}>
                {intl.formatMessage({ id: `participation_budget.${block === 'first' ? state : 'unsupported'}` })}{' '}
              </div>
            )}
            <Button
              label={intl.formatMessage({ id: 'participation_budget.projects_see_description' })}
              className="desc_btn"
              border={false}
              onClick={handleOpenProjectView}
              type="text"
            />
          </div>
          {!(state === 'in_voting') && (
            <div className="project_date">
              {votingPeriodFrom && votingPeriodTo && (
                <div className="dates">
                  {intl.formatMessage({ id: 'participation_budget.no' })} {startDateString}. - {endDateString}.{' '}
                  {intl.formatMessage({ id: 'participation_budget.voited_for_project' }, { votes: project.vote_count })}
                </div>
              )}
              <Label subTitle={true} bold={true} className="voited" label={`${vote_count} iedzīvotāji`} />
            </div>
          )}
        </div>
      </Card>
      <UnauthenticatedModal showModal={showAuthModal} setShowModal={setShowAuthModal} />
    </StyledProjectListItem>
  );
};
