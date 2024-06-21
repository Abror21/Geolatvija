import React from 'react';
import { Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import { Validations } from 'interfaces/shared';
import useQueryApiClient from '../../../utils/useQueryApiClient';

interface PlannedDocumentsOrganizationSelect extends Validations {
  name: string;
  onChange?: any;
  mode?: 'multiple' | 'tags';
  label?: string;
}

const PlannedDocumentsOrganizationSelect = ({
  name,
  mode,
  validations,
  onChange,
  label,
}: PlannedDocumentsOrganizationSelect) => {
  const intl = useIntl();

  const { data } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/organizations`,
    },
  });

  return (
    <Select
      mode={mode}
      label={label}
      placeholder={intl.formatMessage({ id: 'planned_documents.search_by_organization' })}
      name={name}
      validations={validations}
      onChange={onChange}
    >
      {data?.features?.map((entry: any) => (
        <SelectOption key={entry?.properties?.id} value={entry?.properties?.id}>
          {entry?.properties?.name}
        </SelectOption>
      ))}
    </Select>
  );
};

export default PlannedDocumentsOrganizationSelect;
