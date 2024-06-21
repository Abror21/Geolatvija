import React from 'react';
import { Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Validations } from '../../../interfaces/shared';

interface UiMenuProps {
  id: number;
  translation: string;
}

export enum UiMenuSelectFetchType {
  ALL = 'ALL',
  LIMITED = 'LIMITED',
}

interface UiMenuSelectProps extends Validations {
  name: string;
  mode?: 'multiple' | 'tags';
  label?: string;
  disabled?: boolean;
  fetchType?: UiMenuSelectFetchType;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}
// parentId
const UiMenuSelect = ({
  name,
  mode,
  label,
  validations,
  disabled = false,
  fetchType = UiMenuSelectFetchType.LIMITED,
  sortBy = 'translation',
  orderBy = 'asc',
}: UiMenuSelectProps) => {
  const intl = useIntl();

  const { data: uiMenuSelect } = useQueryApiClient({
    request: {
      url: `api/v1/ui-menu-select`,
      data: { fetchType, filter: { sortBy, orderBy } },
    },
  });

  return (
    <Select
      mode={mode}
      label={label || intl.formatMessage({ id: 'general.ui_menu' })}
      name={name}
      disabled={disabled}
      validations={validations}
    >
      {uiMenuSelect.map((entry: UiMenuProps) => (
        <SelectOption key={entry.id} value={entry.id}>
          {entry.translation}
        </SelectOption>
      ))}
    </Select>
  );
};

export default UiMenuSelect;
