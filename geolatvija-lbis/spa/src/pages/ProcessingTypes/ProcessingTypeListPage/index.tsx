import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Button, Table } from 'ui';
import { useIntl } from 'react-intl';
import { ButtonList, StyledPage } from 'styles/layout/table';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';

const ProcessingTypeListPage = () => {
  const [reload, setReload] = useState<number>(0);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const intl = useIntl();

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/processing-types`,
      method: 'DELETE',
    },
    onSuccess: () => {
      setReload((old) => old + 1);
      setSelectedKeys([]);
    },
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'processing_type.name' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
  ];

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: pages.processingTypes.title })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
          />
          <div className="theme-container">
            <Table
              url="/api/v1/processing-types"
              columns={columns}
              enableSelectedRow
              linkProps={{ url: pages.processingTypes.edit.url }}
              setSelectedKeys={setSelectedKeys}
              reload={reload}
              tableActions={
                <ButtonList>
                  <Button
                    label={intl.formatMessage({ id: 'general.delete_chosen' })}
                    onClick={() => appendData({ ids: selectedKeys })}
                    disabled={!selectedKeys.length}
                  />
                  <Button
                    type="primary"
                    label={intl.formatMessage({ id: 'general.add_new' })}
                    href={pages.processingTypes.create.url}
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

export default ProcessingTypeListPage;
