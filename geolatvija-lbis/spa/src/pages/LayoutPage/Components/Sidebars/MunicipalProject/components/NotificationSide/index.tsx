import React from 'react';
import { StyledNotificationSide } from './style';
export const NotificationSide = ({message}: {message: string}) => {
  return (
    <StyledNotificationSide>
      {/* This is temporary data */}
      <p>{message}</p>
    </StyledNotificationSide>
  );
};
