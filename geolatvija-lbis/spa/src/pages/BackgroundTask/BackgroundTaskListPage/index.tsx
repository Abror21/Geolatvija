import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Button, Icon, Popover, Switch, Table } from 'ui';
import { FormattedMessage, useIntl } from 'react-intl';
import { StyledPage } from 'styles/layout/table';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import dayjs from 'dayjs';

const BackgroundTaskListPage = () => {
  const [reload, setReload] = useState<number>(0);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const intl = useIntl();

  const { appendData: appendDataDisable } = useQueryApiClient({
    request: {
      url: `api/v1/background-tasks/:id/disable`,
      method: 'POST',
    },
    onSuccess: () => setReload((old) => old + 1),
  });

  const { appendData: appendDataRun } = useQueryApiClient({
    request: {
      url: `api/v1/background-tasks/run`,
      method: 'POST',
    },
    onSuccess: () => setReload((old) => old + 1),
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'background_task.name' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'background_task.description' }),
      dataIndex: 'description',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'background_task.planned_at' }),
      dataIndex: 'cron',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'background_task.executed_at' }),
      dataIndex: 'executedAt',

      render: (value: string) => value && dayjs(value).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: intl.formatMessage({ id: 'background_task.execution_time' }),
      dataIndex: 'executionTime',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'background_task.status' }),
      dataIndex: 'failed',
      render: (value: boolean, record: any) =>
        record.isActive && (value ? <Icon icon="circle-xmark" color="red" /> : <Icon icon="check" color="green" />),
    },
    {
      title: intl.formatMessage({ id: 'background_task.active' }),
      dataIndex: 'id',
      render: (value: boolean, record: any) => (
        <Switch
          checked={record.isActive}
          onChange={(a) => appendDataDisable({ active: a }, { id: record.id })}
          disableForm
        />
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedKeys && setSelectedKeys(selectedRowKeys);
    },
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: pages.backgroundTasks.title })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
          />
          <div className="theme-container">
            <Table
              url="/api/v1/background-tasks"
              columns={columns}
              linkProps={{ url: pages.backgroundTasks.edit.url }}
              reload={reload}
              enableSelectedRow
              setSelectedKeys={setSelectedKeys}
              rowSelectionFunction={rowSelection}
              tableActions={
                <Button
                  type="primary"
                  label={intl.formatMessage({ id: 'background_task.run_now' })}
                  disabled={!selectedKeys.length}
                  onClick={() => appendDataRun({ ids: selectedKeys })}
                />
              }
            />
          </div>
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default BackgroundTaskListPage;
