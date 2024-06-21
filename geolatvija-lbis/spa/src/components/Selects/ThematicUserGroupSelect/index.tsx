import React, { useState } from 'react';
import { Button, Select, SelectOption } from 'ui';
import { useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Validations } from 'interfaces/shared';
import ThematicUserGroupCreateGeoProducts from './AddThematicUserGroupInGeoProductModal';

interface UserInstitutionProps {
  id: number;
  name: string;
}

interface ThematicUserGroupSelectProps extends Validations {
  name?: (string | number)[] | string | number;
  mode?: 'multiple' | 'tags';
  noStyle?: boolean;
  label?: string;
  disabled?: boolean;
}

const ThematicUserGroupSelect = ({
  name,
  mode,
  validations,
  noStyle,
  label,
  disabled,
}: ThematicUserGroupSelectProps) => {
  const [showAddGroupModal, setShowAddGroupModal] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const intl = useIntl();

  const { data, refetch } = useQueryApiClient({
    request: {
      url: `api/v1/thematic-user-groups/select`,
    },
  });

  return (
    <Select
      open={open}
      onDropdownVisibleChange={(open) => {
        setOpen(showAddGroupModal ? true : open);
      }}
      mode={mode}
      label={label}
      name={name}
      validations={validations}
      noStyle={noStyle}
      disabled={disabled}
      dropdownRender={(menu: React.ReactNode) => (
        <>
          {menu}
          <div className="dropdown-button">
            <Button
              label={intl.formatMessage({ id: 'general.add_group' })}
              onClick={() => setShowAddGroupModal(true)}
            />
          </div>
          <ThematicUserGroupCreateGeoProducts
            refetch={refetch}
            isOpen={showAddGroupModal}
            setIsOpen={setShowAddGroupModal}
          />
        </>
      )}
    >
      {data.map((entry: UserInstitutionProps) => (
        <SelectOption key={entry.id} value={entry.id}>
          {entry.name}
        </SelectOption>
      ))}
    </Select>
  );
};

export default ThematicUserGroupSelect;
