import { Form, Space } from 'antd';
import { Checkbox } from 'ui';
import {ClassName, Disabled, Validations} from 'interfaces/shared';
import React from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { StyledCheckboxGroup } from './style';
import {Rule} from "rc-field-form/lib/interface";
import useFormValidation from "../../utils/useFormValidation";

interface StandardCheckboxProps {
  label: string;
  value: number | string;
}

export interface CheckboxGroupProps extends Disabled, ClassName, Validations {
  defaultValue?: Array<string>;
  children?: React.ReactNode;
  onChange?: (checkedValue: Array<CheckboxValueType>) => void;
  value?: string[];
  options?: any;
  label?: string;
  direction?: 'vertical' | 'horizontal';
  spaceSize?: 'small' | 'middle' | 'large' | number;
  name?: (string | number)[] | string | number;
  initialValue?: string[];
  rules?: Rule[];
}

export const CheckboxGroup = ({
  disabled,
  className,
  validations,
  rules,
  defaultValue,
  children,
  name,
  onChange,
  value,
  options,
  label,
  direction,
  spaceSize,
  initialValue = [],
}: CheckboxGroupProps) => {
  const { formValidations } = useFormValidation();
  return (
    <Form.Item name={name} label={label} initialValue={initialValue} rules={validations ? formValidations(validations) : rules}>
      <StyledCheckboxGroup
        disabled={disabled}
        className={className}
        defaultValue={defaultValue}
        onChange={onChange}
        value={value}
      >
        <Space direction={direction || 'horizontal'} size={spaceSize}>
          {options
            ? options.map((entry: StandardCheckboxProps) => {
                return <Checkbox label={entry.label} value={entry.value} />;
              })
            : children}
        </Space>
      </StyledCheckboxGroup>
    </Form.Item>
  );
};
