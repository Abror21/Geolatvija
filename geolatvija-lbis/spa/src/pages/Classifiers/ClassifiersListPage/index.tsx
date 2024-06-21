import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Button, Input, Table } from 'ui';
import { pages } from 'constants/pages';
import { useIntl } from 'react-intl';
import { ButtonList, StyledPage } from 'styles/layout/table';
import Filter from 'components/Filter';
import { Form } from 'antd';
import useQueryApiClient from '../../../utils/useQueryApiClient';

const ClassifiersPage = () => {
  const [filter, setFilter] = useState<any>([]);
  const [reload, setReload] = useState<number>(0);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const intl = useIntl();
  const [form] = Form.useForm();

  const { appendData: appendDataDelete } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers`,
      method: 'DELETE',
    },
    onSuccess: () => {
      setReload((old) => old + 1);
      setSelectedKeys([]);
    },
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'classifier.classifier_code' }),
      dataIndex: 'uniqueCode',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'classifier.title' }),
      dataIndex: 'translation',
      render: (value: string) => value,
    },
  ];

  const onSearch = () => {
    const values = form.getFieldsValue();

    setFilter(values);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: pages.classifier.title })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
          />
          <Filter
            form={form}
            rightSideActions={<></>}
            filter={
              <Form.Item label={intl.formatMessage({ id: 'classifier.name' })}>
                <ButtonList>
                  <Input name="translation" noStyle />
                  <Button type="primary" label={intl.formatMessage({ id: 'general.search' })} onClick={onSearch} />
                </ButtonList>
              </Form.Item>
            }
            setFilter={setFilter}
          />
          <div className="theme-container">
            <Table
              url="api/v1/classifiers"
              columns={columns}
              filter={filter}
              defaultOrder="asc"
              defaultSort="translation"
              rowClassName="clickable-row"
              linkProps={{
                url: pages.classifier.editClassifier.url,
              }}
              reload={reload}
              enableSelectedRow
              setSelectedKeys={setSelectedKeys}
              tableActions={
                <ButtonList>
                  <Button
                    label={intl.formatMessage({ id: 'general.delete_chosen' })}
                    onClick={() => appendDataDelete({ ids: selectedKeys })}
                    disabled={!selectedKeys.length}
                  />
                  <Button
                    type="primary"
                    label={intl.formatMessage({ id: 'general.add_new' })}
                    href={pages.classifier.createClassifier.url}
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

export default ClassifiersPage;
