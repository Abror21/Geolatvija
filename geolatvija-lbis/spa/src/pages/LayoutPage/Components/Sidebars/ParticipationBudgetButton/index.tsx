import React from 'react';
import { StyledButton } from './style';
import { Spinner } from 'ui';

interface ParticipationBudgetButtonTypes {
  children: React.ReactNode;
  className?: string;
  onClick?: any;
  disabled?: boolean;
  isLoading?: boolean;
}

const ParticipationBudgetButton = ({
  children,
  className,
  onClick,
  disabled = false,
  isLoading = false
}: ParticipationBudgetButtonTypes) => {
  return (
    <StyledButton className={`${className} ${disabled && 'disabled'}`} onClick={onClick} disabled={disabled}>
      <Spinner spinning={isLoading}>{children}</Spinner>
    </StyledButton>
  );
};

export default ParticipationBudgetButton;
