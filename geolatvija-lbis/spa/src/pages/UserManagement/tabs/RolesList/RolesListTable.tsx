import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Table } from 'ui';
import { pages } from '../../../../constants/pages';
import { ButtonList } from '../../../../styles/layout/table';
import DeleteModal from '../../../../components/Modals/DeleteModal';

interface Role {
  id: number;
  name: string;
  hasUsers: boolean;
  code: string;
}

const RolesListTable = ({ activeTab }: any) => {
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [selectedKeysOfRolesTable, setSelectedKeysOfRolesTable] = useState<any>([]);
  const [reload, setReload] = useState<number>(0);

  const intl = useIntl();

  useEffect(() => {
    if (activeTab !== 'roles-list') {
      setSelectedKeysOfRolesTable([]);
    }
  }, [activeTab]);

  const columns = [
    {
      title: intl.formatMessage({ id: 'classifier.title' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
  ];

  const rowSelection = {
    getCheckboxProps: (record: Role) => ({
      // Disable selection for rows with specific conditions
      disabled: record.hasUsers || !!record.code,
    }),
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedKeysOfRolesTable && setSelectedKeysOfRolesTable(selectedRowKeys);
    },
  };

  return (
    <div className="theme-container">
      <Table
        url="/api/v1/roles"
        columns={columns}
        enableSelectedRow
        setSelectedKeys={setSelectedKeysOfRolesTable}
        reload={reload}
        rowSelectionFunction={rowSelection}
        rowClassName="clickable-row"
        linkProps={{
          url: pages.roles.edit.url,
        }}
        tableActions={
          <ButtonList>
            <Button
              label={intl.formatMessage({ id: 'general.delete_chosen' })}
              onClick={() => {
                setShowRoleModal(true);
              }}
              disabled={selectedKeysOfRolesTable.length === 0}
            />
            <Button
              type="primary"
              label={intl.formatMessage({ id: 'general.add_new' })}
              href={pages.roles.create.url}
            />
            <DeleteModal
              setRefresh={setReload}
              url={'api/v1/roles'}
              params={{ ids: selectedKeysOfRolesTable }}
              setShowModal={setShowRoleModal}
              showModal={showRoleModal}
            />
          </ButtonList>
        }
      />
    </div>
  );
};

export default RolesListTable;
