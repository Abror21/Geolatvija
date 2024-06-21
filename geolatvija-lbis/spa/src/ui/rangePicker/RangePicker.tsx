import React from 'react';
import { ClassName, Disabled, Validations } from 'interfaces/shared';
import { StyledRangePicker } from './style';
import { Form } from 'antd';
import useFormValidation from '../../utils/useFormValidation';
import { Rule } from 'rc-field-form/lib/interface';

export interface RangePickerProps extends Disabled, ClassName, Validations {
  suffixIcon?: React.ReactNode | undefined;
  defaultValue?: string;
  size?: 'large' | 'middle' | 'small' | undefined;
  // placeholder?: [string, string];
  onChange?: (values: any, formatString: [string, string]) => void;
  rules?: Rule[];
  disabledDate?: any;
  format?: string;
  disabled?: boolean;
  label?: string;
  name?: (string | number)[] | string | number;
}

export const RangePicker = ({
  className,
  suffixIcon,
  // placeholder = ['', ''],
  onChange,
  disabledDate = false,
  format,
  validations,
  rules,
  disabled,
  size = 'large',
  label,
  name,
}: RangePickerProps) => {
  const { formValidations } = useFormValidation();

  return (
    <Form.Item name={name} label={label} rules={validations ? formValidations(validations) : rules}>
      <StyledRangePicker
        // TODO Check why placeholder and suffixIcon for RangePicker randomly throws error
        // placeholder={placeholder}
        // suffixIcon={suffixIcon}
        className={className}
        disabledDate={disabledDate}
        onChange={onChange}
        format={format || 'DD.MM.YYYY'}
        size={size}
        disabled={disabled}
        getPopupContainer={(triggerNode: HTMLElement) => triggerNode}
      />
    </Form.Item>
  );
};
