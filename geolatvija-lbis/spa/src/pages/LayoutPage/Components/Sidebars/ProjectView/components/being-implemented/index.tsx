import React from 'react'
import { useIntl } from 'react-intl';
import InfoWrapper from '../info-wrapper';
import TimelineItem from './timeline-item';
import { Button, Icon } from 'ui';

const BeingImplementedState = () => {
    const intl = useIntl();
  return (
    <InfoWrapper>
        <span className='in-progress-status'>{intl.formatMessage({ id: 'participation_budget.in_progress' })}</span>
        {/* TODO: change hard code to real date */}
        <TimelineItem title="Uzsākta būvniecība" date="24.04.2024" />
        <TimelineItem title="Noslēgts līgums par projekta būvniecību" date="15.02.2024" />
        <TimelineItem title="Izsludināts iepirkums par projekta būvniecību" date="12.01.2024" />
        <Button label={intl.formatMessage({ id: 'notification.subscribe' })} />
        <p>
            <Icon icon='circle-info' faBase='fa-regular'/>
            &nbsp; {intl.formatMessage({ id: 'participation_budget.notification_2'  })}
        </p>
    </InfoWrapper>
  )
}

export default BeingImplementedState