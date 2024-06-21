import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Table, Button, Input, Icon } from 'ui';
import { useIntl } from 'react-intl';
import { StyledPage, ButtonList } from 'styles/layout/table';
import { Form } from 'antd';
import Filter from 'components/Filter';
import dayjs from 'dayjs';

const TableTemplatePage = () => {
  const [filter, setFilter] = useState<any>([]);

  const intl = useIntl();
  const [form] = Form.useForm();

  const columns = [
    {
      title: intl.formatMessage({ id: 'geoproducts.image' }),
      dataIndex: 'who_knows',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'geoproducts.name' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'geoproducts.type' }),
      dataIndex: 'type',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'geoproducts.status' }),
      dataIndex: 'status',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'geoproducts.status_updated_at' }),
      dataIndex: 'statusUpdatedAt',
      sorter: true,
      render: (value: string) => dayjs(value).format('DD.MM.YYYY'),
    },
    {
      title: intl.formatMessage({ id: 'general.actions' }),

      render: () => <Icon icon="ellipsis-vertical" />,
    },
  ];

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            breadcrumb={[
              {
                name: intl.formatMessage({ id: 'navigation.catalog' }),
                path: '/',
              },
            ]}
            title={intl.formatMessage({ id: 'navigation.geoproducts' })}
          />
          <Filter
            form={form}
            filter={
              <>
                <Input name="name" label="label" tooltip={'????'} />
                <Input name="name" label="label" />
                <Input name="name" label="label" />
                <Input name="name" label="label" />
                <Input name="name" label="label" />
              </>
            }
            setFilter={setFilter}
          />
          <div className="theme-container">
            <Table
              url="/api/v1/test"
              columns={columns}
              rowKey="id"
              filter={filter}
              enableSelectedRow
              tableActions={
                <ButtonList>
                  <Button label={intl.formatMessage({ id: 'general.delete' })} />
                  <Button label={'Palaist fona uzdevumu'} />
                  <Button
                    type="primary"
                    label={intl.formatMessage({ id: 'general.add_new' })}
                    href="/layout-table/create"
                  />
                </ButtonList>
              }
            />
          </div>
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default TableTemplatePage;
