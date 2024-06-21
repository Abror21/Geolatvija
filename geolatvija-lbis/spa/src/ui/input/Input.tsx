import React, { MouseEventHandler } from 'react';
import { Form } from 'antd';
import { ClassName, Disabled, Validations } from 'interfaces/shared';
import { StyledInput } from './style';
import { Tooltip } from 'constants/Tooltip';
import useFormValidation from '../../utils/useFormValidation';
import { Rule } from 'rc-field-form/lib/interface';
import useTooltip from '../../utils/useTooltip';

export interface InputProps extends Disabled, ClassName, Validations {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  type?: string;
  size?: 'large' | 'middle' | 'small';
  value?: string;
  defaultValue?: string;
  maxLength?: number;
  allowClear?: boolean;
  label?: string | React.ReactNode;
  rules?: Rule[];
  name?: (string | number)[] | string | number;
  tooltip?: React.ReactNode;
  className?: string;
  validateTrigger?: string | string[];
  noStyle?: boolean;
  initialValue?: string;
  onClick?: MouseEventHandler<HTMLInputElement> | undefined;
  min?: number;
  max?: number;
  getValueProps?: ((value: any) => Record<string, unknown>) | undefined;
  readOnly?: boolean;
}

export const Input = ({
  disabled = false,
  placeholder,
  name,
  required,
  prefix,
  suffix,
  type,
  onChange,
  size = 'large',
  value,
  onBlur,
  defaultValue,
  maxLength = 255,
  allowClear,
  label,
  rules,
  className,
  validateTrigger,
  tooltip,
  validations,
  noStyle,
  initialValue,
  min,
  max,
  onClick,
  getValueProps,
  readOnly,
}: InputProps) => {
  const { formValidations } = useFormValidation();
  const tooltipText = useTooltip(name);

  return (
    <Form.Item
      getValueProps={getValueProps}
      initialValue={initialValue}
      label={label}
      name={name}
      rules={validations ? formValidations(validations) : rules}
      className={className}
      validateTrigger={validateTrigger}
      tooltip={tooltip || tooltipText ? { ...Tooltip, title: tooltip ? tooltip : tooltipText } : undefined}
      noStyle={noStyle}
    >
      <StyledInput
        readOnly={readOnly}
        onClick={onClick}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        prefix={prefix}
        suffix={suffix}
        type={type}
        onChange={onChange}
        size={size}
        value={value}
        onBlur={onBlur}
        defaultValue={defaultValue}
        maxLength={maxLength}
        allowClear={allowClear}
        min={min}
        max={max}
      />
    </Form.Item>
  );
};
