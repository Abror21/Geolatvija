import React from 'react';
import { ClassName, Disabled, Name } from 'interfaces/shared';
import { useIntl } from 'react-intl';
import { StyledSearch } from './style';

export interface BasicSearchProps extends Disabled, ClassName, Name {
  placeholder?: string;
  required?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  type?: string;
  disabled?: boolean;
  size?: 'large' | 'middle' | 'small';
  value?: string;
  onSearch: (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>
  ) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
}

export const BasicSearch = ({
  disabled,
  placeholder,
  name,
  required,
  prefix,
  suffix,
  type,
  size,
  value,
  onSearch,
  onChange,
  defaultValue,
  className,
}: BasicSearchProps) => {
  const intl = useIntl();

  return (
    <StyledSearch
      disabled={disabled}
      placeholder={
        !!placeholder
          ? placeholder
          : intl.formatMessage({
              id: 'general.search',
            })
      }
      name={name}
      required={required}
      prefix={prefix}
      suffix={suffix}
      type={type}
      size={size}
      value={value}
      onSearch={onSearch}
      allowClear
      onChange={onChange}
      defaultValue={defaultValue}
      className={className}
      onKeyDown={(e) => (e.keyCode === 13 ? e.preventDefault() : '')}
    />
  );
};
