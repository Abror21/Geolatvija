import React, { useEffect } from 'react';
import { Icon, Input } from 'ui';
import { Form } from 'antd';
import { ClassName, Disabled, Name } from 'interfaces/shared';
import { useIntl } from 'react-intl';
import { StyledSearch } from './style';

export interface SearchProps extends Disabled, ClassName, Name {
  placeholder?: string;
  required?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  type?: string;
  disabled?: boolean;
  size?: 'large' | 'middle' | 'small';
  value?: string;
  onSearch?: (t: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Search = ({
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
  label,
  onClick,
  onBlur,
}: SearchProps) => {
  const intl = useIntl();
  const [searchForm] = Form.useForm();

  const onFinish = () => {
    const {search} = searchForm.getFieldsValue();
    !!onSearch && !!search && onSearch(search);
  };

  useEffect(() => {
    if (value) {
      searchForm.setFieldValue('search', value);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Form onFinish={onFinish} form={searchForm} name="search-form" layout="vertical">
      <StyledSearch className="ant-input-search" onClick={onClick}>
        <Form.Item name="search" noStyle>
          <Input
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
            suffix={suffix || <Icon icon="search" />}
            type={type}
            size={size}
            allowClear
            onChange={onChange}
            defaultValue={defaultValue}
            className={className}
            label={label}
            onBlur={onBlur}
          />
        </Form.Item>
      </StyledSearch>
    </Form>
  );
};
