import React from 'react';
import { Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import { Validations } from 'interfaces/shared';
import { useUserState } from 'contexts/UserContext';

interface UserRoleProps {
  id: number;
  name: string;
  institutionName: string;
}

interface UserRoleSelectProps extends Validations {
  name: string;
  onChange?: any;
  mode?: 'multiple' | 'tags';
}

const UserRoleSelect = ({ name, mode, validations, onChange }: UserRoleSelectProps) => {
  const intl = useIntl();
  const user = useUserState();

  const parseName = (entry: UserRoleProps) => {
    if (!entry.institutionName) {
      return intl.formatMessage({ id: 'general.physical_person' });
    }

    return entry.name + (entry.institutionName ? ' - ' + entry.institutionName : '');
  };

  if (user.roles.length <= 1) {
    return <></>;
  }

  return (
    <Select
      mode={mode}
      label={intl.formatMessage({ id: 'general.user_role' })}
      name={name}
      validations={validations}
      initialValue={user.roles.find((e) => e.code === 'authenticated')?.id}
      onChange={onChange}
    >
      {user.roles.map((entry: UserRoleProps) => (
        <SelectOption key={entry.id} value={entry.id}>
          {parseName(entry)}
        </SelectOption>
      ))}
    </Select>
  );
};

export default UserRoleSelect;
