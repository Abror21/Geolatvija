import React from 'react';
import { Button, Tooltip } from 'ui';
import { useIntl } from 'react-intl';
import { useUserState } from 'contexts/UserContext';
import useJwt from 'utils/useJwt';
import InfoWrapper from '../info-wrapper';

interface InVotingProps {
  isVoted: boolean | null;
  isLoadingVotion: boolean | undefined;
  handleClickVoteBtn: Function;
}

const InVotingState = ({ isVoted, isLoadingVotion, handleClickVoteBtn }: InVotingProps) => {
  const intl = useIntl();
  const user = useUserState();
  const { isTokenActive } = useJwt();

  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const isPhysical = activeRole?.code === 'authenticated';
  const activeButNotPhysical = isTokenActive() && !isPhysical;

  return (
    <InfoWrapper>
      <div className="text_side">
        <div>
          <p>
            {/* TODO: Change hard code to real data */}
            {intl.formatMessage({ id: 'participation_budget.you_can_vote_until' })} <span>30.12.2023</span>
          </p>
          <p>{intl.formatMessage({ id: 'participation_budget.notification_3' })}</p>
        </div>
        {!activeButNotPhysical ? (
          isVoted !== null ? (
            <Button
              loading={isLoadingVotion}
              label={
                isVoted
                  ? intl.formatMessage({ id: 'participation_budget.projects_voted_btn' })
                  : intl.formatMessage({ id: 'participation_budget.projects_tovote_btn' })
              }
              type={isVoted ? 'default' : 'primary'}
              onClick={handleClickVoteBtn}
            />
          ) : null
        ) : (
          <Tooltip hack placement="topLeft" title={intl.formatMessage({ id: 'user_with_individual_role_can_vote' })}>
            <Button
              disabled
              label={
                isVoted
                  ? intl.formatMessage({ id: 'participation_budget.projects_voted_btn' })
                  : intl.formatMessage({ id: 'participation_budget.projects_tovote_btn' })
              }
              type={isVoted ? 'default' : 'primary'}
            />
          </Tooltip>
        )}
      </div>
    </InfoWrapper>
  );
};

export default InVotingState;
