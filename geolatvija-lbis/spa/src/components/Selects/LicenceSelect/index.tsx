import React from 'react';
import { Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Validations } from '../../../interfaces/shared';

interface LicenceProps {
  id: number;
  name: string;
}

interface LicenceSelectProps extends Validations {
  name?: (string | number)[] | string | number;
  mode?: 'multiple' | 'tags';
  type: 'OPEN' | 'PREDEFINED';
  noStyle?: boolean;
  label?: string;
  disabled?: boolean;
}

const LicenceSelect = ({ name, mode, validations, type, noStyle, label, disabled }: LicenceSelectProps) => {
  const intl = useIntl();

  const { data } = useQueryApiClient({
    request: {
      url: `api/v1/licence-management-institutions/select`,
      data: { type: type },
    },
  });

  return (
    <Select mode={mode} label={label} name={name} validations={validations} noStyle={noStyle} disabled={disabled}>
      {data.map((entry: LicenceProps) => (
        <SelectOption key={entry.id} value={entry.id}>
          {entry.name}
        </SelectOption>
      ))}
    </Select>
  );
};

export default LicenceSelect;
