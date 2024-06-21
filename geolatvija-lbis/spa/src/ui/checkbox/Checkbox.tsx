import React, { useEffect, useState } from 'react';
import { ClassName, Disabled, Name } from 'interfaces/shared';
import { StyledCheckbox } from './style';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

export interface CheckboxProps extends Disabled, ClassName, Name {
  id?: string;
  checked?: boolean;
  onChange?: (e: any) => void;
  defaultChecked?: boolean;
  value?: number | string;
  key?: string | number;
  label?: any;
  indeterminate?: boolean;
}

export const Checkbox = ({
  disabled,
  label,
  className,
  defaultChecked,
  name,
  value,
  checked,
  onChange,
  key,
  indeterminate,
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState<boolean | undefined>(checked);

  const handleChange = (e: CheckboxChangeEvent) => {
    if (onChange) {
      onChange(e);
    }
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    if (checked) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [checked]);

  return (
    <StyledCheckbox
      indeterminate={indeterminate}
      disabled={disabled}
      className={className}
      defaultChecked={defaultChecked}
      name={name}
      value={value}
      checked={isChecked}
      onChange={handleChange}
      key={key}
    >
      {label}
    </StyledCheckbox>
  );
};
