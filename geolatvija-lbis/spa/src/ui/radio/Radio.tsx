import * as React from 'react';
import { ClassName, Disabled, Label, Name } from 'interfaces/shared';
import { StyledRadio } from './style';

export interface RadioProps extends Disabled, ClassName, Label, Name {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: any;
  value?: string | number | boolean;
  className?: string;
}

export const Radio = ({ disabled, label, defaultChecked, name, value, onChange, checked, className }: RadioProps) => {
  return (
    <StyledRadio
      disabled={disabled}
      defaultChecked={defaultChecked}
      name={name}
      value={value}
      onChange={onChange}
      checked={checked}
      className={className}
    >
      {label}
    </StyledRadio>
  );
};
