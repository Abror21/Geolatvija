import React from 'react';
import { Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Validations } from 'interfaces/shared';

interface EnumProps {
  id: number;
  name: string;
}

interface EnumSelectProps extends Validations {
  name?: (string | number)[] | string | number;
  mode?: 'multiple' | 'tags';
  noStyle?: boolean;
  label?: string;
  disabled?: boolean;
  code: string;
}

const EnumSelect = ({ name, mode, validations, noStyle, label, disabled, code }: EnumSelectProps) => {
  const intl = useIntl();

  const { data } = useQueryApiClient({
    request: {
      url: `api/v1/enums/${code}`,
    },
  });

  return (
    <Select mode={mode} label={label} name={name} validations={validations} noStyle={noStyle} disabled={disabled}>
      {data.map((entry: EnumProps) => (
        <SelectOption key={entry.id} value={entry.id}>
          {intl.formatMessage({ id: 'enum.' + entry })}
        </SelectOption>
      ))}
    </Select>
  );
};

export default EnumSelect;
