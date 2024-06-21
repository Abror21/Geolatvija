import React from 'react';
import { Label } from 'ui';
import { useIntl } from 'react-intl';
import { StyledInfoWrapper } from './style';

const InfoWrapper = ({ children }: { children: any }) => {
  const intl = useIntl();
  return (
    <StyledInfoWrapper className="information">
      <Label
        label={intl.formatMessage({ id: 'participation_budget.information' })}
        subTitle={true}
        bold={true}
        className="section_title"
      />
      <div className="info_wrapper">{children}</div>
    </StyledInfoWrapper>
  );
};

export default InfoWrapper;
