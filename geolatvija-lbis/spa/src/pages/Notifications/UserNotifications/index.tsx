import DefaultLayout from '../../../components/DefaultLayout';
import { ButtonList, StyledPage } from '../../../styles/layout/table';
import { Button, Input, Table } from '../../../ui';
import { useIntl } from 'react-intl';
import React, { useState } from 'react';
import { Form } from 'antd';
import Filter from '../../../components/Filter';
import DeleteModal from '../../../components/Modals/DeleteModal';
import { useUserState } from '../../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const UserNotifications = () => {
  const intl = useIntl();
  const [selectedKeys, setSelectedKeys] = useState<Array<number>>([]);
  const [form] = Form.useForm();
  const [filter, setFilter] = useState<any>([]);
  const [reload, setReload] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const isPhysical = activeRole?.code === 'authenticated';
  const navigate = useNavigate();

  if (!isPhysical) {
    navigate('/main');
  }

  const onSearch = () => {
    const values = form.getFieldsValue();

    setFilter(values);
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'user.notification_application' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'user.notification_radius' }),
      dataIndex: 'radius',
      render: (value: string) => value + ' km',
    },
  ];

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: 'user.notification_management' })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.start' }),
              },
            ]}
            rightSideOptions={
              <ButtonList>
                <Button
                  label={intl.formatMessage({ id: 'general.delete_chosen' })}
                  onClick={() => setShowDeleteModal(true)}
                  disabled={!selectedKeys.length}
                />
                <DeleteModal
                  setRefresh={setReload}
                  url="api/v1/user-notifications/"
                  params={{ ids: selectedKeys }}
                  setShowModal={setShowDeleteModal}
                  showModal={showDeleteModal}
                />
                <Button label={intl.formatMessage({ id: 'return.to_map' })} href="/main" />
              </ButtonList>
            }
          />
          <Filter
            form={form}
            rightSideActions={<></>}
            filter={
              <Form.Item label={intl.formatMessage({ id: 'user.notifications_name' })}>
                <ButtonList onKeyDown={handleKeyPress}>
                  <Input name="name" tooltip={'????'} noStyle />
                  <Button type="primary" label={intl.formatMessage({ id: 'general.search' })} onClick={onSearch} />
                </ButtonList>
              </Form.Item>
            }
            setFilter={setFilter}
          />
          <div className="theme-container">
            <Table
              url="api/v1/user-notifications"
              reload={reload}
              filter={filter}
              rowClassName="clickable-row"
              linkProps={{ url: '/main?notification=:id' }}
              columns={columns}
              enableSelectedRow
              setSelectedKeys={setSelectedKeys}
            />
          </div>
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default UserNotifications;
