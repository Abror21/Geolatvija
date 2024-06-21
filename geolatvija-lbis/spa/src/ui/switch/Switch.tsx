import React from 'react';
import { SwitchChangeEventHandler } from 'antd/lib/switch';
import { ClassName, Disabled, Validations } from 'interfaces/shared';
import { StyledSwitch } from './style';
import { Rule } from 'rc-field-form/lib/interface';
import { Form } from 'antd';
import useFormValidation from '../../utils/useFormValidation';
import useTooltip from '../../utils/useTooltip';
import { Tooltip } from '../../constants/Tooltip';

export interface SwitchProps extends Disabled, ClassName, Validations {
  disabled?: boolean;
  checked?: boolean;
  onChange?: SwitchChangeEventHandler;
  defaultChecked?: boolean;
  label?: string | React.ReactNode;
  rules?: Rule[];
  name?: (string | number)[] | string | number;
  noStyle?: boolean;
  className?: string;
  initialValue?: boolean;
  disableForm?: boolean;
}

export const Switch = ({
  disabled,
  checked,
  onChange,
  defaultChecked,
  label,
  rules,
  name,
  noStyle,
  className,
  validations,
  initialValue = false,
  disableForm,
}: SwitchProps) => {
  const { formValidations } = useFormValidation();
  const tooltipText = useTooltip(name);

  const parseSwitch = (
    <StyledSwitch disabled={disabled} checked={checked} onChange={onChange} defaultChecked={defaultChecked} />
  );

  if (disableForm) {
    return parseSwitch;
  }

  return (
    <Form.Item
      valuePropName="checked"
      label={label}
      name={name}
      rules={validations ? formValidations(validations) : rules}
      noStyle={noStyle}
      className={className}
      initialValue={initialValue}
      tooltip={tooltipText ? { ...Tooltip, title: tooltipText } : undefined}
    >
      {parseSwitch}
    </Form.Item>
  );
};
