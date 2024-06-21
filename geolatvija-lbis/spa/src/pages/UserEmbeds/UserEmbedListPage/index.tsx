import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useIntl } from 'react-intl';
import { ButtonList, StyledPage } from 'styles/layout/table';
import { CustomUserEmbedList } from '../list/CustomUserEmbedList';
import { Button, Input } from '../../../ui';
import Filter from '../../../components/Filter';
import { Form } from 'antd';
import DeleteModal from '../../../components/Modals/DeleteModal';
import { useUserState } from '../../../contexts/UserContext';

const UserEmbedListPage = () => {
  const [filter, setFilter] = useState<object>();

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<Array<number>>([]);
  const [reload, setReload] = useState<number>(0);

  const intl = useIntl();
  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const [form] = Form.useForm();

  const onSearch = () => {
    const values = form.getFieldsValue();
    setFilter(values);
  };

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
            title={
              activeRole?.institutionClassifierId
                ? intl.formatMessage({ id: 'navigation.org_user_embeds' })
                : intl.formatMessage({ id: 'navigation.user_embeds' })
            }
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
                <Button label={intl.formatMessage({ id: 'return.to_map' })} href="/main" />
              </ButtonList>
            }
          />
        </StyledPage>
        <Filter
          form={form}
          rightSideActions={<></>}
          filter={
            <Form.Item label={intl.formatMessage({ id: 'embedded.name' })}>
              <ButtonList onKeyDown={handleKeyPress}>
                <Input name="name" noStyle />
                <Button type="primary" label={intl.formatMessage({ id: 'general.search' })} onClick={onSearch} />
              </ButtonList>
            </Form.Item>
          }
          setFilter={setFilter}
        />
        <CustomUserEmbedList
          reload={reload}
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          filter={filter}
        />
        <DeleteModal
          setRefresh={setReload}
          url="api/v1/user-embeds/${id}"
          params={{ ids: selectedKeys }}
          setShowModal={setShowDeleteModal}
          showModal={showDeleteModal}
        />
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default UserEmbedListPage;
