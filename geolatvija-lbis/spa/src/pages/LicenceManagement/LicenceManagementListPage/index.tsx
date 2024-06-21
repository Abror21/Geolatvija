import React, { useEffect } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { ButtonList, StyledPage } from 'styles/layout/table';
import { Button, Label, Switch, Table, TabPane, Tabs } from 'ui';
import { Form } from 'antd';
import { useUserState } from 'contexts/UserContext';
import { pages } from 'constants/pages';
import dayjs from 'dayjs';
import useQueryApiClient from '../../../utils/useQueryApiClient';
import DeleteModal from '../../../components/Modals/DeleteModal';
import { Link } from 'react-router-dom';
import FileDownload from 'js-file-download';

const LicenceManagementListPage = () => {
  const [selectedKeys, setSelectedKeys] = useState<Array<number>>([]);
  const [reload, setReload] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('institution-list');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [activeName, setActiveName] = useState('');

  useEffect(() => {
    setSelectedKeys([]);
  }, [activeTab]);

  const intl = useIntl();
  const [form] = Form.useForm();
  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);

  const { appendData: appendDataPublic } = useQueryApiClient({
    request: {
      url: `api/v1/licence-management-templates/:id/public`,
      method: 'PATCH',
    },
    onSuccess: () => {
      setReload((old) => old + 1);
      setSelectedKeys([]);
    },
  });

  const { appendData: appendInstitutionPublic } = useQueryApiClient({
    request: {
      url: `api/v1/licence-management-institutions/:id/public`,
      method: 'PATCH',
    },
    onSuccess: () => {
      setReload((old) => old + 1);
      setSelectedKeys([]);
    },
  });

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/storage/:id`,
      method: 'GET',
      multipart: true,
      disableOnMount: true,
    },
    onSuccess: (response, passOnSuccess) => {
      FileDownload(response, passOnSuccess.name);
      setIsDownloadLoading(false);
    },
  });

  const download = async (id: number, name: string) => {
    setIsDownloadLoading(true);
    appendData([], { id: id }, { name: name });
  };

  const institutionColumns = [
    {
      title: intl.formatMessage({ id: 'licence_management.licence_name' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'licence_management.licence_type' }),
      dataIndex: 'licenceType',
      render: (value: string) => intl.formatMessage({ id: 'licence_management.' + value }),
    },
    {
      title: intl.formatMessage({ id: 'licence_management.created_at' }),
      dataIndex: 'createdAt',
      render: (value: string) => value && dayjs(value).format('DD.MM.YYYY'),
    },
    {
      title: intl.formatMessage({ id: 'licence_management.template' }),
      dataIndex: 'id',
      render: (value: string, record: any) =>
        record.site ? (
          <Label
            clickable
            bold
            color="primary"
            onClick={() => {
              if (record.site.includes('http')) {
                window.open(record.site, '_blank', 'noreferrer');
              } else {
                window.open('https://' + record.site, '_blank', 'noreferrer');
              }
            }}
            label={record?.site}
          />
        ) : (
          <Label
            clickable
            bold
            color="primary"
            onClick={() => download(record.attachmentId, record?.attachmentName)}
            label={record?.attachmentName}
          />
        ),
    },
    {
      title: intl.formatMessage({ id: 'licence_management.description' }),
      dataIndex: 'description',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'licence_management.status' }),
      dataIndex: 'id',
      render: (value: boolean, record: any) => (
        <Switch
          defaultChecked={record.isPublic}
          onChange={(value) => appendInstitutionPublic({ isPublic: value }, { id: record.id })}
          disableForm
        />
      ),
    },
  ];

  const columns = [
    {
      title: intl.formatMessage({ id: 'licence_management.licence_name' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'licence_management.licence_type' }),
      dataIndex: 'licenceType',
      render: (value: string) => intl.formatMessage({ id: 'licence_management.' + value }),
    },
    {
      title: intl.formatMessage({ id: 'licence_management.template' }),
      dataIndex: 'id',
      render: (value: string, record: any) =>
        record.site ? (
          <Label
            clickable
            bold
            color="primary"
            onClick={() => {
              if (record.site.includes('http')) {
                window.open(record.site, '_blank', 'noreferrer');
              } else {
                window.open('https://' + record.site, '_blank', 'noreferrer');
              }
            }}
            label={record?.site}
          />
        ) : (
          <Label
            clickable
            bold
            color="primary"
            onClick={() => download(record.attachmentId, record?.attachmentName)}
            label={record?.attachmentName}
          />
        ),
    },
    {
      title: intl.formatMessage({ id: 'licence_management.created_at' }),
      dataIndex: 'createdAt',
      render: (value: string) => value && dayjs(value).format('DD.MM.YYYY'),
    },
    {
      title: intl.formatMessage({ id: 'licence_management.description' }),
      dataIndex: 'description',
      render: (value: string) => value,
    },
    activeRole?.code === 'admin'
      ? {
          title: intl.formatMessage({ id: 'licence_management.status' }),
          dataIndex: 'id',
          render: (value: boolean, record: any) => (
            <Switch
              defaultChecked={record.isPublic}
              onChange={(value) => appendDataPublic({ isPublic: value }, { id: record.id })}
              disableForm
            />
          ),
        }
      : {},
  ];

  const onTabChange = (activeKey: string) => {
    form.resetFields();
    setActiveTab(activeKey);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: pages.licenceManagement.title })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
          />
          <Tabs type="card" onChange={onTabChange} activeKey={activeTab}>
            <TabPane
              tab={intl.formatMessage({
                id: 'licence_management.institution_list',
              })}
              key="institution-list"
            >
              <Table
                url="/api/v1/licence-management-institutions"
                columns={institutionColumns}
                linkProps={{ url: pages.licenceManagement.institution.edit.url }}
                reload={reload}
                enableSelectedRow
                setSelectedKeys={setSelectedKeys}
                tableActions={
                  (activeRole?.code === 'admin' || activeTab === 'institution-list') && (
                    <ButtonList>
                      <Button
                        label={intl.formatMessage({ id: 'general.delete_chosen' })}
                        onClick={() => setShowDeleteModal(true)}
                        disabled={!selectedKeys.length}
                      />
                      <Button
                        type="primary"
                        label={intl.formatMessage({ id: 'general.add_new' })}
                        href={
                          activeTab === 'institution-list'
                            ? pages.licenceManagement.institution.create.url
                            : pages.licenceManagement.template.create.url
                        }
                      />
                    </ButtonList>
                  )
                }
              />
            </TabPane>
            <TabPane
              tab={intl.formatMessage({
                id: 'licence_management.templates',
              })}
              key="template-list"
            >
              <Table
                url="/api/v1/licence-management-templates"
                columns={columns}
                linkProps={
                  activeRole?.code === 'admin' ? { url: pages.licenceManagement.template.edit.url } : undefined
                }
                reload={reload}
                enableSelectedRow={activeRole?.code === 'admin'}
                setSelectedKeys={setSelectedKeys}
                tableActions={
                  (activeRole?.code === 'admin' || activeTab === 'institution-list') && (
                    <ButtonList>
                      <Button
                        label={intl.formatMessage({ id: 'general.delete_chosen' })}
                        onClick={() => setShowDeleteModal(true)}
                        disabled={!selectedKeys.length}
                      />
                      <Button
                        type="primary"
                        label={intl.formatMessage({ id: 'general.add_new' })}
                        href={
                          activeTab === 'institution-list'
                            ? pages.licenceManagement.institution.create.url
                            : pages.licenceManagement.template.create.url
                        }
                      />
                    </ButtonList>
                  )
                }
              />
            </TabPane>
          </Tabs>
        </StyledPage>
        <DeleteModal
          setRefresh={setReload}
          url={
            activeTab === 'institution-list'
              ? 'api/v1/licence-management-institutions'
              : 'api/v1/licence-management-templates'
          }
          params={{ ids: selectedKeys }}
          setShowModal={setShowDeleteModal}
          showModal={showDeleteModal}
        />
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default LicenceManagementListPage;
