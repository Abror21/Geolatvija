import React from 'react'
import { StyledTimelineItem } from './style';
import { timelineImg } from 'Assets';
import { Label } from 'ui';

interface TimelineProps {
    title: string;
    date: string;
}

const TimelineItem = ({ title, date }: TimelineProps) => {
  return (
    <StyledTimelineItem>
        <div>
            <img src={timelineImg} alt="" />
        </div>
        <div className='timeline__text'>
            <span>{date}</span>
            <Label label={title} subTitle />
        </div>
    </StyledTimelineItem>
  )
}

export default TimelineItem