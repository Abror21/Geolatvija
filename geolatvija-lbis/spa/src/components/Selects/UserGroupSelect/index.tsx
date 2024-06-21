import React from 'react';
import { Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Validations } from '../../../interfaces/shared';

interface UserGroupProps {
  id: number;
  name: string;
  code: string;
}

interface UserGroupSelectProps extends Validations {
  name: string;
  mode?: 'multiple' | 'tags';
  type?: 'FULL' | 'LIMITED' | 'LIMITED_OWNED';
}

const UserGroupSelect = ({ name, mode, validations, type = 'FULL' }: UserGroupSelectProps) => {
  const intl = useIntl();

  const { data } = useQueryApiClient({
    request: {
      url: `api/v1/roles/groups-select`,
      data: { type: type },
    },
  });

  return (
    <Select
      mode={mode}
      label={intl.formatMessage({ id: 'user_management.roles' })}
      name={name}
      validations={validations}
    >
      {data.map((entry: UserGroupProps) => (
        <SelectOption key={entry.id} value={entry.id}>
          {entry.name}
        </SelectOption>
      ))}
    </Select>
  );
};

export default UserGroupSelect;
