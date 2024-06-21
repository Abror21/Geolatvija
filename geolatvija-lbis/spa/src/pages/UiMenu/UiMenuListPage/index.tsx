import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Table, Button, Input, Switch } from 'ui';
import { useIntl } from 'react-intl';
import { StyledPage, ButtonList } from 'styles/layout/table';
import { Form } from 'antd';
import Filter from 'components/Filter';
import { pages } from 'constants/pages';
import DeleteModal from '../../../components/Modals/DeleteModal';

const UiMenuListPage = () => {
  const [filter, setFilter] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);
  const [selectedKeys, setSelectedKeys] = useState<Array<number>>([]);

  const intl = useIntl();
  const [form] = Form.useForm();

  const columns = [
    {
      title: intl.formatMessage({ id: 'ui_menu.name' }),
      dataIndex: 'translation',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'ui_menu.unique_key' }),
      dataIndex: 'uniqueKey',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'ui_menu.sequence' }),
      dataIndex: 'sequence',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'ui_menu.under' }),
      dataIndex: 'parentTranslation',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'ui_menu.public' }),
      dataIndex: 'isPublic',
      render: (value: boolean) => <Switch checked={value} disabled />,
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
          <DefaultLayout.PageHeader title={intl.formatMessage({ id: 'navigation.ui_menu' })} />
          <Filter
            form={form}
            rightSideActions={<></>}
            hideActions
            filter={
              <>
                <Form.Item label={intl.formatMessage({ id: 'ui_menu.name' })}>
                  <ButtonList>
                    <Input name="name" noStyle />
                    <Button type="primary" label={intl.formatMessage({ id: 'general.search' })} onClick={onSearch} />
                  </ButtonList>
                </Form.Item>
              </>
            }
            setFilter={setFilter}
          />

          <div className="theme-container">
            <Table
              url="/api/v1/ui-menu-list"
              columns={columns}
              filter={filter}
              enableSelectedRow
              linkProps={{ url: '/ui-menu/:id' }}
              reload={reload}
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
                    href={pages.uiMenu.createUiMenu.url}
                  />
                </ButtonList>
              }
            />
          </div>
        </StyledPage>
        <DeleteModal
          setRefresh={setReload}
          url="api/v1/ui-menu"
          params={{ ids: selectedKeys }}
          setShowModal={setShowDeleteModal}
          showModal={showDeleteModal}
        />
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default UiMenuListPage;
