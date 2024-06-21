import React, { useState } from 'react';
import { StyledPlanningDocuments } from './style';
import ParticipationBudgetButton from '../ParticipationBudgetButton';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Icon, Tooltip } from 'ui';
import UnauthenticatedModal from 'components/Modals/UnauthenticatedModal';
import useJwt from 'utils/useJwt';
import { useUserState } from 'contexts/UserContext';

interface ParticipationBudgetProp {
  setIsOpenProjectSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const TapisDocuments = ({ setIsOpenProjectSearch }: ParticipationBudgetProp) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [showAuthModal, setshowAuthModal] = useState(false);
  const { isTokenActive } = useJwt();
  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const isPhysical = activeRole?.code === 'authenticated';
  const activeNotPhysicalPerson = isTokenActive() && !isPhysical;
  const closeAuthModal = () => {
    setshowAuthModal(false);
  };

  const handleOpenNotification = () => {
    if (activeNotPhysicalPerson) {
      return;
    }
    if (!isTokenActive()) {
      setshowAuthModal(true);
      return;
    }
    navigate('/main?notification=open');
  };

  return (
    <StyledPlanningDocuments>
      <ParticipationBudgetButton
        onClick={() => {
          navigate('/main?document=open');
        }}
      >
        <Icon icon="files" faBase="fa-regular" />
        {intl.formatMessage({ id: 'planned_documents.documents' })}
      </ParticipationBudgetButton>
      <ParticipationBudgetButton
        onClick={() => {
          navigate('/main?document=open&advanced-search=open');
          setIsOpenProjectSearch(true);
        }}
      >
        <Icon icon="magnifying-glass" faBase="fa-regular" />
        {intl.formatMessage({ id: 'planned_documents.search_by_document' })}
      </ParticipationBudgetButton>
      <ParticipationBudgetButton onClick={handleOpenNotification} disabled={activeNotPhysicalPerson}>
        <Tooltip
          placement="topLeft"
          title={
            activeNotPhysicalPerson &&
            intl.formatMessage({ id: 'planned_documents.you_can_apply_notification_only_with_pysical_role' })
          }
        >
          <Icon icon="bell" faBase="fa-regular" />
          {intl.formatMessage({ id: 'notification.subscribe' })}
        </Tooltip>
      </ParticipationBudgetButton>

      <UnauthenticatedModal showModal={showAuthModal} setShowModal={closeAuthModal} />
    </StyledPlanningDocuments>
  );
};

export default TapisDocuments;
