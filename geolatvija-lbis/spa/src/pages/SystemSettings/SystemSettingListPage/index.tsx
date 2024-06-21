import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Table } from 'ui';
import { useIntl } from 'react-intl';
import { StyledPage } from 'styles/layout/table';
import { pages } from '../../../constants/pages';

const SystemSettingListPage = () => {
  const intl = useIntl();

  const columns = [
    {
      title: intl.formatMessage({ id: 'system_setting.name' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'system_setting.value' }),
      dataIndex: 'value',
      render: (value: string) => value,
    },
  ];

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
            title={intl.formatMessage({ id: pages.systemSettings.title })} />
          <div className="theme-container">
            <Table
              url="/api/v1/system-settings"
              columns={columns}
              enableSelectedRow
              linkProps={{ url: '/system-settings/:id' }}
            />
          </div>
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default SystemSettingListPage;
