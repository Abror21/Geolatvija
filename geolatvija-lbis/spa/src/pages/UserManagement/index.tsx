import React, { useCallback } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { StyledPage } from 'styles/layout/table';
import { Input, TabPane, Tabs } from 'ui';
import UsersListTable from './tabs/UsersList/UsersListTable';
import RolesListTable from './tabs/RolesList/RolesListTable';
import RightsListTable from './tabs/RightsList/RightsListTable';
import { Form } from 'antd';
import Filter from 'components/Filter';
import { ClassifierSelect } from 'components/Selects';
import UserInstitutionSelect from '../../components/Selects/UserInstitutionSelect';
import { useUserState } from '../../contexts/UserContext';
import UserGroupSelect from '../../components/Selects/UserGroupSelect';

export interface FilterProps {
  name?: string;
  statusClassifierValueId?: number;
}

const UserManagementPage = () => {
  const [filter, setFilter] = useState<FilterProps>({});
  const [activeTab, setActiveTab] = useState<string>('users-list');

  const intl = useIntl();
  const [form] = Form.useForm();
  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);

  const onTabChange = (activeKey: string) => {
    form.resetFields();
    setFilter({});
    setActiveTab(activeKey);
  };

  const filtersComponents = useCallback(() => {
    if (activeTab === 'users-list') {
      return (
        <>
          <Input name="name" label={intl.formatMessage({ id: 'user_management.user_search' })} />
          <ClassifierSelect
            allowClear
            code="KL21"
            name="statusClassifierValueId"
            label={intl.formatMessage({ id: 'user_management.status' })}
          />
          <UserInstitutionSelect name="institutions" mode="multiple" type="LIMITED_OWNED" />
          <UserGroupSelect name="userGroups" mode="multiple" type="LIMITED_OWNED" />
        </>
      );
    }
  }, [activeTab]);

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: 'user_management.user_management' })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
          />
          {activeTab === 'users-list' && (
            <Filter form={form} filter={<>{filtersComponents()}</>} setFilter={setFilter} />
          )}
          <Tabs type="card" onChange={onTabChange} activeKey={activeTab}>
            <TabPane
              tab={intl.formatMessage({
                id: 'user_management.users_list',
              })}
              key="users-list"
            >
              {activeTab === 'users-list' && <UsersListTable filter={filter} activeTab={activeTab} />}
            </TabPane>
            {activeRole?.code === 'admin' && (
              <>
                <TabPane
                  tab={intl.formatMessage({
                    id: 'user_management.roles_list',
                  })}
                  key="roles-list"
                >
                  {activeTab === 'roles-list' && <RolesListTable activeTab={activeTab} />}
                </TabPane>
                <TabPane
                  tab={intl.formatMessage({
                    id: 'user_management.rights_list',
                  })}
                  key="rights-list"
                >
                  {activeTab === 'rights-list' && <RightsListTable />}
                </TabPane>
              </>
            )}
          </Tabs>
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default UserManagementPage;
