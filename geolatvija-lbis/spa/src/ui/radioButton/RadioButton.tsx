import { Radio } from 'antd';
import { ClassName, Disabled, Name } from 'interfaces/shared';

export interface RadioButtonProps extends Disabled, ClassName, Name {
  value?: string;
  children: React.ReactNode;
}

export const RadioButton = ({ value, children }: RadioButtonProps) => {
  return <Radio.Button value={value}>{children}</Radio.Button>;
};
