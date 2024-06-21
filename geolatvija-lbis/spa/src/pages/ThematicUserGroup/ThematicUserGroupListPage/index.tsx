import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { ButtonList, StyledPage } from 'styles/layout/table';
import { Button, Table } from 'ui';
import { pages } from 'constants/pages';
import DeleteModal from '../../../components/Modals/DeleteModal';

const ThematicUserGroupListPage = () => {
  const [selectedKeys, setSelectedKeys] = useState<Array<number>>([]);
  const [reload, setReload] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const intl = useIntl();

  const columns = [
    {
      title: intl.formatMessage({ id: 'thematic_user_group.name' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
  ];

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: pages.thematicUserGroups.title })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
          />
          <Table
            url="/api/v1/thematic-user-groups"
            columns={columns}
            linkProps={{ url: pages.thematicUserGroups.edit.url }}
            reload={reload}
            enableSelectedRow
            setSelectedKeys={setSelectedKeys}
            tableActions={
              <ButtonList>
                <Button
                  label={intl.formatMessage({ id: 'general.delete_chosen' })}
                  onClick={() => setShowDeleteModal(true)}
                  disabled={!selectedKeys.length}
                />
                <Button
                  type="primary"
                  label={intl.formatMessage({ id: 'general.add_new' })}
                  href={pages.thematicUserGroups.create.url}
                />
              </ButtonList>
            }
          />
        </StyledPage>
        <DeleteModal
          setRefresh={setReload}
          url="api/v1/thematic-user-groups"
          params={{ ids: selectedKeys }}
          setShowModal={setShowDeleteModal}
          showModal={showDeleteModal}
        />
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default ThematicUserGroupListPage;
