import React, { useState } from 'react';
import { Button, Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Validations } from 'interfaces/shared';
import AddProcessingTypeModal from '../../../pages/GeoProducts/GeoProductCreateEditPage/modals/AddProcessingTypeModal';

interface GeoProductId {
  id: number;
  name: string;
}

interface ProcessingSelectProps extends Validations {
  name?: (string | number)[] | string | number;
  mode?: 'multiple' | 'tags';
  noStyle?: boolean;
  label?: string;
}

const ProcessingSelect = ({ name, mode, validations, noStyle, label }: ProcessingSelectProps) => {
  const [showProcessingTypeModal, setShowProcessingTypeModal] = useState<boolean>(false);
  const intl = useIntl();

  const { data, refetch } = useQueryApiClient({
    request: {
      url: `api/v1/processing-types/select`,
    },
  });

  return (
    <Select
      mode={mode}
      label={label || intl.formatMessage({ id: 'geoproducts.file_processing_type' })}
      name={name}
      validations={validations}
      noStyle={noStyle}
      dropdownRender={(menu: React.ReactNode) => (
        <>
          {menu}
          <div className="dropdown-button">
            <Button
              label={intl.formatMessage({ id: 'geoproducts.add_processing_type' })}
              onClick={() => setShowProcessingTypeModal(true)}
            />
          </div>
          <AddProcessingTypeModal
            isOpen={showProcessingTypeModal}
            setIsOpen={setShowProcessingTypeModal}
            refetch={refetch}
          />
        </>
      )}
    >
      {data.map((entry: GeoProductId) => (
        <SelectOption key={entry.id} value={entry.id}>
          {entry.name}
        </SelectOption>
      ))}
    </Select>
  );
};

export default ProcessingSelect;
