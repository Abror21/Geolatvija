import React from 'react';
import { Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Validations } from 'interfaces/shared';

interface UsersSelectOptionsProps {
  id: number;
  fullName: string;
  institutionName?: string;
}

interface UsersSelectProps extends Validations {
  name?: (string | number)[] | string | number;
  mode?: 'multiple' | 'tags';
  noStyle?: boolean;
  label?: string;
  disabled?: boolean;
  role?: 'data_owner';
  roleId?: boolean;
  institution?: boolean;
  initialValue?: number | number[];
  type?: 'DEFAULT' | 'LIMITED_BY_DT_ORDERS';
}

const UsersSelect = ({
  name,
  mode,
  validations,
  noStyle,
  label,
  disabled,
  role,
  roleId = false,
  type = 'DEFAULT',
  initialValue,
  institution = false,
}: UsersSelectProps) => {
  const intl = useIntl();

  const { data } = useQueryApiClient({
    request: {
      url: 'api/v1/users/select',
      data: { role: role, roleId: roleId, type: type },
    },
  });

  const getInstitution = (entry: UsersSelectOptionsProps) => {
    if (institution) {
      return `(${entry.institutionName})`;
    }

    return '';
  };

  return (
    <Select
      mode={mode}
      label={label || intl.formatMessage({ id: 'geoproduct_reports.user' })}
      name={name}
      validations={validations}
      noStyle={noStyle}
      disabled={disabled}
      initialValue={initialValue}
    >
      {data.map((entry: UsersSelectOptionsProps) => (
        <SelectOption key={entry.id} value={entry.id}>
          {`${entry.fullName} ${getInstitution(entry)}`}
        </SelectOption>
      ))}
    </Select>
  );
};

export default UsersSelect;
