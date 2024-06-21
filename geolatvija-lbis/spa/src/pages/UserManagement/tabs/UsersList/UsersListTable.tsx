import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Table } from 'ui';
import dayjs from 'dayjs';
import { pages } from 'constants/pages';
import { FilterProps } from '../../index';
import { ButtonList } from '../../../../styles/layout/table';
import DeleteModal from '../../../../components/Modals/DeleteModal';
import useQueryApiClient from '../../../../utils/useQueryApiClient';

interface UsersListTableProps {
  filter: FilterProps;
  activeTab: string;
}

interface User {
  activeTill: string;
  createdAt: string;
  email: string;
  id: number;
  institutionClassifierValueId: number;
  lastLogin: string;
  name: string;
  surname: string;
  personalCode: string;
  regNr: string;
  statusClassifierValueId: number;
  updatedAt: string;
  userType: string;
}

const UsersListTable = ({ filter, activeTab }: UsersListTableProps) => {
  const [reload, setReload] = useState<number>(0);
  const [selectedKeysOfUsersTable, setSelectedKeysOfUsersTable] = useState<Array<number>>([]);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);

  const intl = useIntl();

  useEffect(() => {
    if (activeTab !== 'users-list') {
      setSelectedKeysOfUsersTable([]);
    }
  }, [activeTab]);

  const { appendData: appendDataExtend } = useQueryApiClient({
    request: {
      url: `api/v1/users/extend`,
      method: 'POST',
    },
    onSuccess: () => {
      setReload((old) => old + 1);
    },
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'user_management.name_surname_title' }),
      dataIndex: 'name',
      render: (value: string, record: User) => value + ' ' + record.surname,
    },
    {
      title: intl.formatMessage({ id: 'user_management.personal_code' }),
      dataIndex: 'personalCode',
      render: (value: string, record: User) => value || record.regNr,
    },
    {
      title: intl.formatMessage({ id: 'user_management.institutions' }),
      dataIndex: 'institutions',
      render: (value: string) =>
        removeDuplicates([...(value?.split(', ') || [])])
          .filter((e) => !!e)
          .join(', '),
    },
    {
      title: intl.formatMessage({ id: 'user_management.status' }),
      dataIndex: 'statusClassifier',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'user_management.roles' }),
      dataIndex: 'roles',
      render: (value: string) =>
        removeDuplicates([...value?.split(', ')])
          .filter((e) => !!e)
          .join(', '),
    },
    {
      title: intl.formatMessage({ id: 'user_management.participant' }),
      dataIndex: 'createdAt',
      render: (value: string) => dayjs(value).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: intl.formatMessage({ id: 'user_management.last_login' }),
      dataIndex: 'lastLogin',
      render: (value: string | null) => value && dayjs(value).format('DD.MM.YYYY HH:mm'),
    },
  ];

  function removeDuplicates(arr: string[]) {
    let unique: string[] = [];

    arr.forEach((element) => {
      if (!unique.includes(element)) {
        unique.push(element);
      }
    });

    return unique;
  }

  return (
    <div className="theme-container">
      <Table
        url="/api/v1/users"
        columns={columns}
        filter={filter}
        reload={reload}
        enableSelectedRow
        setSelectedKeys={setSelectedKeysOfUsersTable}
        rowClassName="clickable-row"
        linkProps={{
          url: pages.userManagement.edit.url,
        }}
        tableActions={
          <ButtonList>
            <Button
              label={intl.formatMessage({ id: 'general.delete_chosen' })}
              onClick={() => {
                setShowUserModal(true);
              }}
              disabled={selectedKeysOfUsersTable.length === 0}
            />
            <Button
              label={intl.formatMessage({ id: 'general.extend_by_year' })}
              onClick={() => appendDataExtend({ ids: selectedKeysOfUsersTable })}
              disabled={selectedKeysOfUsersTable.length === 0}
            />
            <Button
              type="primary"
              label={intl.formatMessage({ id: 'general.add_new' })}
              href={pages.userManagement.create.url}
            />
            <DeleteModal
              setRefresh={setReload}
              url={'api/v1/users'}
              params={{ ids: selectedKeysOfUsersTable }}
              setShowModal={setShowUserModal}
              showModal={showUserModal}
            />
          </ButtonList>
        }
      />
    </div>
  );
};

export default UsersListTable;
