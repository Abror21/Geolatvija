import React from 'react';
import { Form, Space } from 'antd';
import { Radio } from 'ui';
import { ClassName, Disabled } from 'interfaces/shared';
import { StyledRadioGroup } from './style';
import { RadioChangeEvent } from 'antd/es/radio/interface';

interface StandardOptionProps {
  label: string;
  value: number | string | boolean;
}

export interface RadioGroupProps extends Disabled, ClassName {
  defaultValue?: Array<string> | string | number;
  children?: React.ReactNode;
  value?: string | number | boolean;
  onChange?: (e: RadioChangeEvent) => void;
  size?: 'large' | 'middle' | 'small';
  options?: StandardOptionProps[];
  label?: string;
  initialValue?: string | number | boolean;
  direction?: 'vertical' | 'horizontal';
  name?: (string | number)[] | string | number;
}

export const RadioGroup = ({
  disabled,
  className,
  defaultValue,
  children,
  value,
  name,
  onChange,
  size,
  options,
  label,
  initialValue,
  direction,
}: RadioGroupProps) => {
  return (
    <Form.Item label={label} name={name} initialValue={initialValue}>
      <StyledRadioGroup
        disabled={disabled}
        className={className}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        size={size}
      >
        <Space direction={direction || 'horizontal'}>
          {options
            ? options.map((entry, idx) => {
                return <Radio key={idx} label={entry.label} value={entry.value} />;
              })
            : children}
        </Space>
      </StyledRadioGroup>
    </Form.Item>
  );
};
