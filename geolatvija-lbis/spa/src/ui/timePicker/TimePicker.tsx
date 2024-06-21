import React from 'react';
import { ClassName, Disabled } from 'interfaces/shared';
import { StyledTimePicker } from './style';
import { Form } from 'antd';
import { Dayjs } from 'dayjs';

export interface TimePickerProps extends Disabled, ClassName {
  suffixIcon?: React.ReactNode;
  defaultValue?: string;
  value?: Dayjs;
  size?: 'large' | 'middle' | 'small' | undefined;
  placeholder?: string;
  onChange?: (value: Dayjs | null, dateString: string) => void;
  format?: string;
  disabled?: boolean;
  label?: string;
  name?: (string | number)[] | string | number;
}

export const TimePicker = ({
  className,
  suffixIcon,
  placeholder,
  onChange,
  format,
  disabled,
  value,
  size,
  label,
  name,
}: TimePickerProps) => {
  return (
    <Form.Item name={name} label={label}>
      <StyledTimePicker
        placeholder={placeholder}
        suffixIcon={suffixIcon}
        className={className}
        onChange={onChange}
        value={value}
        size={size}
        format={format}
        disabled={disabled}
        getPopupContainer={(triggerNode: HTMLElement) => triggerNode}
      />
    </Form.Item>
  );
};
