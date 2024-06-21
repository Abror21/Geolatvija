import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { ButtonList, StyledPage } from 'styles/layout/table';
import { Button, Input, InputNumber, Select, SelectOption, Table } from 'ui';
import { pages } from 'constants/pages';
import DeleteModal from 'components/Modals/DeleteModal';
import Filter from '../../../components/Filter';
import { Form } from 'antd';
import UiMenuSelect from '../../../components/Selects/UiMenuSelect';

const TooltipListPage = () => {
  const [selectedKeys, setSelectedKeys] = useState<Array<number>>([]);
  const [reload, setReload] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [filter, setFilter] = useState({});

  const intl = useIntl();
  const [form] = Form.useForm();

  const columns = [
    {
      title: intl.formatMessage({ id: 'tooltip.code' }),
      dataIndex: 'code',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'tooltip.translation' }),
      dataIndex: 'translation',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'tooltip.ui_menu' }),
      dataIndex: 'uiMenuTranslation',
      render: (value: string) => value,
    },
  ];

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: pages.tooltips.title })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
          />
          <Filter
            form={form}
            filter={
              <>
                <Input label={intl.formatMessage({ id: 'tooltip.code' })} name="code" />
                <Input label={intl.formatMessage({ id: 'tooltip.translation' })} name="translation" />
                <UiMenuSelect name="uiMenuId" label={intl.formatMessage({ id: 'tooltip.ui_menu' })} />
              </>
            }
            setFilter={setFilter}
          />
          <Table
            url="/api/v1/tooltips"
            columns={columns}
            linkProps={{ url: pages.tooltips.edit.url }}
            reload={reload}
            enableSelectedRow
            setSelectedKeys={setSelectedKeys}
            filter={filter}
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
                  href={pages.tooltips.create.url}
                />
              </ButtonList>
            }
          />
        </StyledPage>
        <DeleteModal
          setRefresh={setReload}
          url="api/v1/tooltips"
          params={{ ids: selectedKeys }}
          setShowModal={setShowDeleteModal}
          showModal={showDeleteModal}
        />
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default TooltipListPage;
