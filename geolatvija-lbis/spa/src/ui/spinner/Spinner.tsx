import React from 'react';
import { StyledSpinner } from './styles';

export interface SpinnerProps {
  spinning: boolean;
  className?: string;
  delay?: number;
  children: React.ReactNode;
  dontRender?: boolean;
}
export const Spinner = ({ spinning, className, children, dontRender }: SpinnerProps) => {
  return (
    <>
      <StyledSpinner spinning={spinning} wrapperClassName={className}>
        {dontRender && spinning ? <div className="full-spinner"></div> : children}
      </StyledSpinner>
    </>
  );
};
