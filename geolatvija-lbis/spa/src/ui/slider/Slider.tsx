import { StyledSlider } from './style';
import * as React from 'react';
import { Form } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import useFormValidation from '../../utils/useFormValidation';
import { Validations } from 'interfaces/shared';

interface SliderProps extends Validations {
  range?: boolean;
  min: number;
  max: number;
  onChange?: (value: number | [number, number]) => void;
  step?: number;
  value?: number | [number, number];
  label?: string;
  rules?: Rule[];
  name?: (string | number)[] | string | number;
}
const Slider = ({
  min,
  max,
  onChange,
  step = 1,
  value,
  range = false,
  label,
  name,
  rules,
  validations,
}: SliderProps) => {
  const { formValidations } = useFormValidation();
  // @ts-ignore
  return (
    <>
      <Form.Item label={label} name={name} rules={validations ? formValidations(validations) : rules}>
        {/*@ts-ignore*/}
        <StyledSlider range={range} value={value} min={min} max={max} onChange={onChange} step={step} />
      </Form.Item>
    </>
  );
};

export default Slider;
