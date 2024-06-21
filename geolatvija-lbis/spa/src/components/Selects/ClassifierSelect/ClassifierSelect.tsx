import React, { useState } from 'react';
import { ClassName, Disabled, Validations } from 'interfaces/shared';
import { StyledSelect } from 'ui/select/style';
import { Icon } from 'ui';
import { Form } from 'antd';
import useQueryApiClient from '../../../utils/useQueryApiClient';
import useFormValidation from '../../../utils/useFormValidation';
import { Rule } from 'rc-field-form/lib/interface';
import useTooltip from '../../../utils/useTooltip';
import { Tooltip } from '../../../constants/Tooltip';

export interface ClassifierSelectProps extends Disabled, ClassName, Validations {
  placeholder?: string;
  children?: React.ReactNode;
  defaultValue?: string | number | React.ReactText[];
  style?: React.CSSProperties;
  onChange?: any;
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
  code: string;
  type?: 'id' | 'code';
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
  rules?: Rule[];
  noStyle?: boolean;
  onChangeWithRecord?: boolean;
  initialValue?: any;
}

const { Option } = StyledSelect;

const SelectOption = Option;

interface ClassifierOptionsProps {
  id: number;
  code: string;
  translation: string;
}

export const ClassifierSelect = ({
  disabled,
  placeholder,
  className,
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
  code,
  type = 'id',
  dropdownRender,
  validations,
  rules,
  noStyle,
  onChangeWithRecord,
  initialValue,
}: ClassifierSelectProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const { formValidations } = useFormValidation();
  const tooltipText = useTooltip(name);

  const { data: options } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/select/${code}`,
    },
    onFinally: () => setIsLoading(false),
  });

  const onInnerChange: any = (id: number) => {
    const selected = options.find((entry: any) => entry.id === id);

    if (onChangeWithRecord) {
      onChange && onChange(selected);
    } else {
      onChange && onChange(id);
    }
  };

  return (
    <Form.Item
      noStyle={noStyle}
      label={label}
      name={name}
      rules={validations ? formValidations(validations) : rules}
      tooltip={tooltipText ? { ...Tooltip, title: tooltipText } : undefined}
      initialValue={initialValue}
    >
      <StyledSelect
        disabled={disabled}
        placeholder={placeholder}
        className={className}
        getPopupContainer={(triggerNode: HTMLElement) => triggerNode}
        onChange={onInnerChange}
        defaultValue={defaultValue}
        style={style}
        size={size}
        value={value}
        mode={mode}
        showSearch={showSearch}
        maxTagCount={maxTagCount}
        suffixIcon={isLoading || loading ? undefined : <Icon faBase="far" icon="angle-down" />}
        removeIcon={<Icon faBase="far" icon="times" />}
        menuItemSelectedIcon={mode === 'multiple' ? <Icon faBase="fal" icon="check" /> : undefined}
        allowClear={allowClear}
        filterOption={(input: string, option: any) => {
          if (React.isValidElement(option.children[0])) {
            return option.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }
          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}
        loading={isLoading || loading}
        optionLabelProp={optionLabelProp}
        dropdownRender={dropdownRender}
      >
        {options?.map((entry: ClassifierOptionsProps, index: number) => (
          <SelectOption key={index} value={entry?.[type]}>
            {entry.translation}
          </SelectOption>
        ))}
      </StyledSelect>
    </Form.Item>
  );
};
