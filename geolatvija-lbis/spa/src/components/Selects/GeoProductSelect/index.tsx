import React from 'react';
import { Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Validations } from 'interfaces/shared';

interface GeoProductId {
  id: number;
  name: string;
  viewsCount: number;
}

interface GeoProductSelectProps extends Validations {
  name?: (string | number)[] | string | number;
  mode?: 'multiple' | 'tags';
  noStyle?: boolean;
  saveProducts?: React.Dispatch<React.SetStateAction<GeoProductId[]>>;
  label?: string;
  disabled?: boolean;
}

const GeoProductSelect = ({
  name,
  mode,
  validations,
  noStyle,
  label,
  disabled,
  saveProducts,
}: GeoProductSelectProps) => {
  const intl = useIntl();

  const { data } = useQueryApiClient({
    request: {
      url: `api/v1/geoproducts/select`,
    },
    onSuccess(response) {
      if (saveProducts) {
        saveProducts(response);
      }
    },
  });

  return (
    <Select
      mode={mode}
      label={label || intl.formatMessage({ id: 'order_data_holder.geoproduct_title' })}
      name={name}
      validations={validations}
      noStyle={noStyle}
      disabled={disabled}
    >
      {data.map((entry: GeoProductId) => (
        <SelectOption key={entry.id} value={entry.id}>
          {entry.name}
        </SelectOption>
      ))}
    </Select>
  );
};

export default GeoProductSelect;
