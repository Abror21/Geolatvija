import useQueryApiClient from '../../../../utils/useQueryApiClient';
import { Input } from '../../../../ui';
import { Form } from 'antd';
import { ChangeEvent, useEffect, useState } from 'react';

type Option = {
  id: number;
  code: string;
  translation: string;
};

type ClassifierKL15InputProps = {
  name: any;
  placeholder?: string;
  disabled?: boolean;
};

export const ClassifierKL15Input = ({ name, placeholder, disabled = false }: ClassifierKL15InputProps) => {
  const [value, setValue] = useState<string | undefined>();
  const [minValue, setMinValue] = useState<number | undefined>();
  const [maxValue, setMaxValue] = useState<number | undefined>();

  const form = Form.useFormInstance();

  const { data: options } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/select/KL15`,
    },
  });

  useEffect(() => {
    if (options && Array.isArray(options) && options.length > 0) {
      const codes = options
        .map((option: Option) => parseInt(option.code))
        .filter((code: number) => !isNaN(code))
        .sort((a: number, b: number) => a - b);

      if (codes.length > 0) {
        setMinValue(codes[0]);
        setMaxValue(codes[codes.length - 1]);
      }

      const selectedOption = options.find((option: Option) => option.id === form.getFieldValue(name));
      setValue(selectedOption?.code);
    }
  }, [options, form, name]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const code = event.target.value;
    const option = options?.find((option: Option) => option.code === code);

    if (option) {
      form.setFieldValue(name, option.id);
      setValue(option.code);
    } else {
      form.setFieldValue(name, null);
      setValue(undefined);
    }
  };

  return (
    <>
      <Input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={minValue}
        max={maxValue}
        disabled={disabled}
      />
    </>
  );
};
