import React from 'react';
import { ClassName, Disabled, Validations } from 'interfaces/shared';
import { StyledInputNumber } from './style';
import { Form } from 'antd';
import useFormValidation from '../../utils/useFormValidation';
import { Rule } from 'rc-field-form/lib/interface';

export interface InputNumberProps extends Disabled, ClassName, Validations {
  onChange?: (value: number | string | undefined | null) => void;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 'large' | 'middle' | 'small';
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  disabled?: boolean;
  label?: string;
  rules?: Rule[];
  name?: (string | number)[] | string | number;
  formatter?: (
    value: any | undefined,
    info: {
      userTyping: boolean;
      input: string;
    }
  ) => string;
  parser?: (displayValue: string | undefined) => any;
  initialValue?: number;
  precision?: number;
  step?: number;
}

export const InputNumber = ({
  onChange,
  size,
  value,
  defaultValue,
  onBlur,
  min,
  max,
  maxLength,
  disabled,
  label,
  name,
  rules,
  validations,
  formatter,
  parser,
  initialValue,
  precision,
  step,
}: InputNumberProps) => {
  const { formValidations } = useFormValidation();

  return (
    <Form.Item
      label={label}
      name={name}
      rules={validations ? formValidations(validations) : rules}
      initialValue={initialValue}
    >
      <StyledInputNumber
        onChange={onChange}
        size={size}
        value={value}
        defaultValue={defaultValue}
        onBlur={onBlur}
        min={min}
        max={max}
        formatter={formatter}
        maxLength={maxLength}
        className={disabled ? 'ant-input-disabled' : ''}
        disabled={disabled}
        parser={parser}
        precision={precision}
        step={step}
      />
    </Form.Item>
  );
};
