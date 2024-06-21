import React from 'react';
import TimelineItem from './timeline-item';
import { generate } from 'random-words';

const BeingImplementedState = () => {
  return (
    <>
      {/* TODO: temporary data */}
      <TimelineItem title={generate({ exactly: 16, join: ' ' })} date="19.05.2024" />
      <TimelineItem title={generate({ exactly: 10, join: ' ' })} date="05.03.2024" />
      <TimelineItem title={generate({ exactly: 28, join: ' ' })} date="10.01.2024" />
    </>
  );
};

export default BeingImplementedState;
