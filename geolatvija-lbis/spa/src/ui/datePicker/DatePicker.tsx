import React from 'react';
import { ClassName, Disabled } from 'interfaces/shared';
import { StyledDatePicker } from './style';
import { Form } from 'antd';
import { Icon } from '../icon';
import { Dayjs } from 'dayjs';

export interface DatePickerProps extends Disabled, ClassName {
  size?: 'large' | 'middle' | 'small' | undefined;
  placeholder?: string;
  onChange?: (value: Dayjs | null, dateString: string) => void;
  disabled?: boolean;
  value?: Dayjs;
  picker?: any;
  format?: string;
  name?: string;
  label?: string;
  disabledDate?: (date: Dayjs) => boolean;
  initialValue?: any;
}

export const DatePicker = ({
  className,
  placeholder = '',
  onChange,
  disabled,
  value,
  size,
  picker,
  format = 'DD.MM.YYYY',
  name,
  label,
  disabledDate,
  initialValue,
}: DatePickerProps) => {
  return (
    <Form.Item name={name} label={label} initialValue={initialValue}>
      <StyledDatePicker
        suffixIcon={<Icon icon="calendar-days" baseClass="fa-regular" />}
        className={className}
        getPopupContainer={(triggerNode: HTMLElement) => triggerNode}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        value={value}
        size={size}
        format={format || 'DD.MM.YYYY'}
        picker={picker}
        disabledDate={disabledDate}
      />
    </Form.Item>
  );
};
