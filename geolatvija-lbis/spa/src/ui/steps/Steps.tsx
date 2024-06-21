import React from 'react';
import { StyledSteps } from './style';
import { StepProps } from 'antd/es/steps';

export interface StepsProps {
  current?: number;
  labelPlacement?: 'horizontal' | 'vertical';
  items?: StepProps[];
  onChange?: (current: number) => void;
  direction?: 'horizontal' | 'vertical' | undefined;
}

export const Steps = ({ current, labelPlacement, items, onChange, direction }: StepsProps) => {
  return (
    <StyledSteps
      onChange={onChange}
      current={current}
      labelPlacement={labelPlacement}
      items={items}
      direction={direction}
    />
  );
};
