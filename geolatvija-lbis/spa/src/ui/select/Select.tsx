import React, { useRef } from 'react';
import { ClassName, Disabled, Validations } from 'interfaces/shared';
import { StyledSelect } from './style';
import { Icon } from '../icon';
import { Form } from 'antd';
import useFormValidation from '../../utils/useFormValidation';
import { Rule } from 'rc-field-form/lib/interface';
import { CustomTagProps } from 'rc-select/lib/BaseSelect';
import useTooltip from '../../utils/useTooltip';
import { Tooltip } from '../../constants/Tooltip';

export interface SelectProps extends Disabled, ClassName, Validations {
  placeholder?: string;
  children?: React.ReactNode;
  defaultValue?: string | number | React.ReactText[];
  style?: React.CSSProperties;
  onChange?: any;
  onDropdownVisibleChange?: (open: boolean) => void;
  open?: boolean;
  size?: 'large' | 'middle' | 'small';
  mode?: 'multiple' | 'tags';
  value?: number | string | string[];
  showSearch?: boolean;
  maxTagCount?: number | 'responsive';
  allowClear?: boolean;
  loading?: boolean;
  optionLabelProp?: string;
  label?: string;
  name?: (string | number)[] | string | number;
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  tagRender?: (props: CustomTagProps) => React.ReactElement;
  rules?: Rule[];
  initialValue?: string | string[] | number | number[];
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  noStyle?: boolean;
  customSufixIcon?: React.ReactNode;
}

const { Option } = StyledSelect;

export const SelectOption = Option;

export const Select = ({
  disabled,
  open,
  placeholder,
  className,
  children,
  onChange,
  defaultValue,
  style,
  size = 'large',
  value,
  mode,
  showSearch = true,
  maxTagCount,
  allowClear,
  loading,
  optionLabelProp,
  label,
  name,
  dropdownRender,
  tagRender,
  validations,
  rules,
  initialValue,
  placement,
  noStyle,
  onDropdownVisibleChange,
  customSufixIcon,
}: SelectProps) => {
  const { formValidations } = useFormValidation();
  const tooltipText = useTooltip(name);

  const refWrapper = useRef<HTMLDivElement>(null);

  return (
    <div ref={refWrapper}>
      <Form.Item
        label={label}
        name={name}
        rules={validations ? formValidations(validations) : rules}
        tooltip={tooltipText ? { ...Tooltip, title: tooltipText } : undefined}
        initialValue={initialValue}
        noStyle={noStyle}
      >
        <StyledSelect
          width={refWrapper.current && `${refWrapper.current.getBoundingClientRect().width - 40}px`}
          open={open}
          disabled={disabled}
          placeholder={placeholder}
          className={className}
          onChange={onChange}
          defaultValue={defaultValue}
          style={style}
          size={size}
          value={value}
          mode={mode}
          showSearch={showSearch}
          maxTagCount={maxTagCount}
          suffixIcon={
            loading ? undefined : customSufixIcon ? (
              customSufixIcon
            ) : mode === 'multiple' || showSearch ? (
              <Icon faBase="fa-regular" icon="magnifying-glass" />
            ) : (
              <Icon faBase="far" icon="angle-down" />
            )
          }
          removeIcon={<Icon faBase="far" icon="times" />}
          menuItemSelectedIcon={mode === 'multiple' ? <Icon faBase="fal" icon="check" /> : undefined}
          allowClear={allowClear}
          filterOption={(input: string, option: any) => {
            if (mode === 'tags') {
              return true;
            }

            if (React.isValidElement(option.children?.[0])) {
              return String(option.children[1]).toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }
            return String(option.children).toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }}
          loading={loading}
          optionLabelProp={optionLabelProp}
          dropdownRender={dropdownRender}
          tagRender={tagRender}
          placement={placement}
          onDropdownVisibleChange={onDropdownVisibleChange}
        >
          {children}
        </StyledSelect>
      </Form.Item>
    </div>
  );
};
