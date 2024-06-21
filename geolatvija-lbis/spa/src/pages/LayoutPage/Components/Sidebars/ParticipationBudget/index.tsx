import React, { useState } from 'react';
import { StyledParticipationBudget } from './style';
import ParticipationBudgetButton from '../ParticipationBudgetButton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Icon, Spinner, Tooltip } from 'ui';
import UnauthenticatedModal from 'components/Modals/UnauthenticatedModal';
import useJwt from 'utils/useJwt';
import { useUserState } from 'contexts/UserContext';
import { useParticipationBudgetState } from 'contexts/ParticipationBudgetContext';

interface ParticipationBudgetProp {
  setIsOpenProjectSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const ParticipationBudget = ({ setIsOpenProjectSearch }: ParticipationBudgetProp) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [showAuthModal, setshowAuthModal] = useState(false);
  const { isTokenActive } = useJwt();
  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const isPhysical = activeRole?.code === 'authenticated';
  const activeNotPhysicalPerson = isTokenActive() && !isPhysical;
  let [searchParams] = useSearchParams();

  const { budgets: municipalList, isLoading: areBudgetsLoading } = useParticipationBudgetState();
  const isThereAtLeastOneSubmissionPeriod = municipalList.some((municipal: any) => municipal.submission_period_from);

  const closeAuthModal = () => {
    setshowAuthModal(false);
  };

  const handeOpenPysicalRoleSidebar = (link: string) => {
    if (activeNotPhysicalPerson || !isThereAtLeastOneSubmissionPeriod) {
      return;
    }
    if (!isTokenActive()) {
      setshowAuthModal(true);
      return;
    }
    navigate(link);
  };

  return (
    <StyledParticipationBudget>
      <ParticipationBudgetButton
        onClick={() => {
          if (searchParams.get('project-modal') === 'open' && searchParams.get('geoProjectId')) {
            navigate(`/main?project=open&project-modal=open&geoProjectId=${searchParams.get('geoProjectId')}`);
            return;
          }
          navigate('/main?project=open');
        }}
      >
        <Icon icon="bars" faBase="fa-regular" />
        {intl.formatMessage({ id: 'participation_budget.project' })}
      </ParticipationBudgetButton>
      <ParticipationBudgetButton
        onClick={() => {
          navigate('/main?project=open');
          setIsOpenProjectSearch(true);
        }}
      >
        <Icon icon="magnifying-glass" faBase="fa-regular" />
        {intl.formatMessage({ id: 'participation_budget.look_for' })}
      </ParticipationBudgetButton>
      <ParticipationBudgetButton
        onClick={() => handeOpenPysicalRoleSidebar('/main?participation-budget=open&submit-project=open')}
        disabled={activeNotPhysicalPerson || !isThereAtLeastOneSubmissionPeriod}
        isLoading={areBudgetsLoading}
      >
        <Tooltip
          placement="topLeft"
          title={
            activeNotPhysicalPerson && intl.formatMessage({ id: 'participation_budget.only_physic_user_can_vote' })
          }
        >
          <Icon icon="location-plus" faBase="fa-regular" />
          {intl.formatMessage({ id: 'participation_budget.submit_projects' })}
        </Tooltip>
      </ParticipationBudgetButton>
      <ParticipationBudgetButton
        onClick={() => handeOpenPysicalRoleSidebar('/main?my-participation=open')}
        disabled={activeNotPhysicalPerson}
      >
        <Tooltip
          placement="topLeft"
          title={
            activeNotPhysicalPerson &&
            intl.formatMessage({ id: 'planned_documents.only_pysical_person_can_view_section' })
          }
        >
          <Icon icon="bell" faBase="fa-regular" />
          {intl.formatMessage({ id: 'notification.subscribe' })}
        </Tooltip>
      </ParticipationBudgetButton>

      <UnauthenticatedModal showModal={showAuthModal} setShowModal={closeAuthModal} />
    </StyledParticipationBudget>
  );
};

export default ParticipationBudget;
