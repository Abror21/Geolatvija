import React from 'react';
import { StyledEventSection } from './style';
import { Label } from 'ui';
import { useIntl } from 'react-intl';

export const EventSection = () => {
  const intl = useIntl();
  return (
    <StyledEventSection>
      <Label
        extraBold={true}
        title={true}
        className="section_title"
        label={intl.formatMessage({
          id: 'participation_budget.current_events',
        })}
      />
      <Label bold subTitle label={intl.formatMessage({ id: 'about_event_in_municipiality' })} />
      {/* <div className="events">
        {teporaryEvents.map((event) => (
          <EventSectionItem
            key={event.id}
            event={event}
            btnLabel={intl.formatMessage({ id: 'participation_budget.view_full_post' })}
          />
        ))}
      </div> */}
      {/* <Pagination
        defaultCurrent={1}
        pageSize={10}
        defaultPageSize={10}
        total={teporaryEvents.length}
        showSizeChanger={false}
        onShowSizeChange={(current, size) => {}}
      /> */}
    </StyledEventSection>
  );
};
