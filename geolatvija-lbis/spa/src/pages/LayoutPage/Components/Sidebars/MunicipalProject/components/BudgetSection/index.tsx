import React from 'react';
import { StyledBudgetSection } from './styles';
import { Label } from 'ui';
import { useIntl } from 'react-intl';

export const BudgetSection = () => {
  const intl = useIntl();
  return (
    <StyledBudgetSection>
      <Label
        bold
        subTitle
        label={
          intl.formatMessage({ id: 'about_participation_budget_in_municipiality' }) +
          ' ' +
          intl.formatMessage({ id: 'currently_no_information_available' })
        }
      />
      <div className="events">
        {/* {teporaryEvents.map((event, index) => {
          if(index < 2){
            return <EventSectionItem key={event.id} event={event} btnLabel={intl.formatMessage({id: 'participation_budget.view_full_information'})} />
          }
        })} */}
      </div>
      {/* <Pagination
        defaultCurrent={1}
        pageSize={10}
        defaultPageSize={10}
        total={teporaryEvents.length}
        showSizeChanger={false}
        onShowSizeChange={(current, size) => {}}
      /> */}
    </StyledBudgetSection>
  );
};
