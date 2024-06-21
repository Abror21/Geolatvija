import Title from 'antd/es/typography/Title';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Tooltip } from 'ui';
import { StyledSpecialistInfo } from './style';
import { useUserState } from 'contexts/UserContext';
import useJwt from 'utils/useJwt';
import UnauthenticatedModal from 'components/Modals/UnauthenticatedModal';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SpecialistInfo = ({ isThereSubmissionPeriod, isMunicipalLoading }: {isThereSubmissionPeriod: boolean; isMunicipalLoading: boolean}) => {
  const intl = useIntl();
  let [searchParams] = useSearchParams();
  const { isTokenActive } = useJwt();
  const user = useUserState();
  const navigate = useNavigate();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const isPhysical = activeRole?.code === 'authenticated';
  const activeButNotPhysical = isTokenActive() && !isPhysical;
  const atvkId = searchParams.get('atvk_id');

  const [showAuthModal, setShowAuthModal] = useState(false);

  const closeModal = () => {
    setShowAuthModal(false);
  };

  return (
    <StyledSpecialistInfo>
      <Title level={5} className="title">
        {intl.formatMessage({ id: 'participation_budget.specialist_info' })}
      </Title>
      <Title level={4} className="name">
        Armīns Skudra
      </Title>
      <a href="">armins.skudra@marupe.lv</a>
      <p>+371 26824756</p>
      <Tooltip
        title={`${
          activeButNotPhysical ? intl.formatMessage({ id: 'participation_budget.only_physic_user_can_vote' }) : ''
        }`}
      >
        <Button
          loading={isMunicipalLoading}
          disabled={!isThereSubmissionPeriod}
          type={(!isMunicipalLoading && !isThereSubmissionPeriod) ? 'default' : 'primary'}
          className={`${activeButNotPhysical ? 'disabled-button' : ''}`}
          label={intl.formatMessage({ id: 'participation_budget.submit_projects' })}
          onClick={() => {
            if (!isTokenActive()) {
              setShowAuthModal(true);
            } else if (!activeButNotPhysical) {
              navigate(`/main?participation-budget=open&submit-project=open&step=1&atvk_id=${atvkId}`);
              return;
            }
          }}
        />
      </Tooltip>
      <UnauthenticatedModal showModal={showAuthModal} setShowModal={closeModal} />
    </StyledSpecialistInfo>
  );
};
