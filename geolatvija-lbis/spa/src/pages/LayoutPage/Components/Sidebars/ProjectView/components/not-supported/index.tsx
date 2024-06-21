import React from 'react';
import { useIntl } from 'react-intl';
import InfoWrapper from '../info-wrapper';
import { Link } from 'react-router-dom';

const NotSupportedState = () => {
  const intl = useIntl();
  return (
    <InfoWrapper>
      <div className="text_side">
        <p>
          {/* TODO: Change hard code to real data */}
          {intl.formatMessage(
            { id: 'participation_budget.votes_from_to' },
            { from_to: <span>30.11.2023 - 30.12.2023</span>, count: <span>4</span> }
          )}
        </p>
        <div className="unsupported-status">{intl.formatMessage({ id: 'participation_budget.unsupported' })}</div>
      </div>

      <div className="not-supported_text">
        {intl.formatMessage({ id: 'project_view.information_text' }, { here: <Link to="!#">šeit</Link> })}
      </div>
    </InfoWrapper>
  );
};

export default NotSupportedState;
