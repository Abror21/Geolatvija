import React, { ChangeEventHandler } from 'react';
import { ClassName, Validations } from 'interfaces/shared';
import { StyledTextArea } from './style';
import { Form } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import useFormValidation from '../../utils/useFormValidation';

export interface TextAreaProps extends ClassName, Validations {
  onChange?: ChangeEventHandler;
  onBlur?: ChangeEventHandler;
  placeholder?: string;
  required?: boolean;
  allowClear?: boolean;
  value?: string;
  disabled?: boolean;
  autoSize?: boolean | object;
  label?: string;
  rules?: Rule[];
  name?: (string | number)[] | string | number;
  className?: string;
  initialValue?: string;
  rows?: number;
  maxLength?: number | undefined;
}

export const TextArea = ({
  placeholder,
  required,
  allowClear,
  value,
  onChange,
  onBlur,
  disabled,
  autoSize,
  label,
  name,
  rules,
  className,
  validations,
  initialValue,
  rows,
  maxLength,
}: TextAreaProps) => {
  const { formValidations } = useFormValidation();

  return (
    <Form.Item
      label={label}
      name={name}
      className={className}
      rules={validations ? formValidations(validations) : rules}
      initialValue={initialValue}
    >
      <StyledTextArea
        placeholder={placeholder}
        rows={rows}
        required={required}
        allowClear={allowClear}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        autoSize={autoSize}
        maxLength={maxLength}
      />
    </Form.Item>
  );
};
