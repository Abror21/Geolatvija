import React from 'react';
import InfoWrapper from '../info-wrapper';
import { Button, Icon } from 'ui';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const SubmittedState = ({ projectId }: { projectId: number }) => {
  const navigate = useNavigate();
  const intl = useIntl();
  return (
    <InfoWrapper>
      <div className="submitted-status">
        <p>
          <Icon icon="circle-info" faBase="fa-regular" />
          {/* TODO: change hard code to real date */}
          &nbsp; {intl.formatMessage({ id: 'participation_budget.submission_period_to' }, { date: '11.11.1111' })}
        </p>
        <Button label="Labot" onClick={() => navigate(`/main?submit-project-form=open&project-id=${projectId}`)} />
      </div>
    </InfoWrapper>
  );
};

export default SubmittedState;
