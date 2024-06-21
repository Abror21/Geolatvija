import React from 'react';
import { Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Validations } from '../../../interfaces/shared';

interface UserInstitutionProps {
  id: number;
  name: string;
}

interface UserInstitutionSelectProps extends Validations {
  name?: (string | number)[] | string | number;
  mode?: 'multiple' | 'tags';
  type?: 'FULL' | 'LIMITED' | 'LIMITED_OWNED' | 'LIMITED_BY_DT_ORDERS' | 'USER_MANAGEMENT';
  noStyle?: boolean;
  label?: string;
  disabled?: boolean;
  initialValue?: number | number[];
  allowClear?: boolean;
}

const UserInstitutionSelect = ({
  name,
  mode,
  validations,
  type = 'FULL',
  noStyle,
  label,
  disabled,
  initialValue,
  allowClear = false,
}: UserInstitutionSelectProps) => {
  const intl = useIntl();

  const { data } = useQueryApiClient({
    request: {
      url: `api/v1/institution-classifiers/select`,
      data: { type: type },
    },
  });

  return (
    <Select
      mode={mode}
      label={label || intl.formatMessage({ id: 'user_management.user_affiliation' })}
      name={name}
      validations={validations}
      noStyle={noStyle}
      disabled={disabled}
      initialValue={initialValue}
      allowClear={allowClear}
    >
      {data.map((entry: UserInstitutionProps) => (
        <SelectOption key={entry.id} value={entry.id}>
          {entry.name}
        </SelectOption>
      ))}
    </Select>
  );
};

export default UserInstitutionSelect;
