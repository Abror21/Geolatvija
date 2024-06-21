import React from 'react';
import { ClassName, Label } from 'interfaces/shared';
import { StyledTag } from './style';

export interface TagProps extends ClassName, Label {
  color: string;
}

export const Tag = ({ label, color, className }: TagProps) => {
  return (
    <StyledTag color={color} className={className}>
      {label}
    </StyledTag>
  );
};
