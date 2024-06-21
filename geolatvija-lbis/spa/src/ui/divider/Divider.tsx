import { ClassName, Disabled, Name } from 'interfaces/shared';
import { StyledDivider } from './style';
import React from 'react';

export interface DividerProps extends Disabled, ClassName, Name {
  type?: 'horizontal' | 'vertical';
  children?: React.ReactNode;
  className?: string;
}

export const Divider = ({ type, children, className }: DividerProps) => {
  return (
    <StyledDivider type={type} className={className}>
      {children}
    </StyledDivider>
  );
};
