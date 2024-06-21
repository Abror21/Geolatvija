import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Button, InputNumber, Modal, Spinner, Table } from 'ui';
import { useIntl } from 'react-intl';
import { ButtonList, StyledPage } from 'styles/layout/table';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import { Form, Row } from 'antd';
import { ButtonListModal } from '../../../styles/layout/form';

const SystemSettingFileListPage = () => {
  const [reload, setReload] = useState<number>(0);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const intl = useIntl();
  const [form] = Form.useForm();

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/system-settings-files`,
      method: 'DELETE',
    },
    onSuccess: () => {
      setReload((old) => old + 1);
      setSelectedKeys([]);
    },
  });

  const { isLoading, refetch } = useQueryApiClient({
    request: {
      url: `api/v1/system-settings-files/size`,
      method: 'GET',
      disableOnMount: true,
    },
    onSuccess: (response) => form.setFieldsValue(response),
  });

  const { appendData: updateFileSize } = useQueryApiClient({
    request: {
      url: `api/v1/system-settings-files/size`,
      method: 'PATCH',
    },
    onSuccess: () => setShowModal(false),
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'system_setting_file.name' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'system_setting_file.value' }),
      dataIndex: 'value',
      render: (value: string) => value,
    },
  ];

  const onCancel = () => {
    form.resetFields();
    setShowModal(false);
  };

  const onFileManagementButtonClick = () => {
    refetch();
    setShowModal(true);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: pages.systemSettingsFiles.title })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
          />
          <div className="theme-container">
            <Button
              label={intl.formatMessage({ id: 'system_setting_file.file_size_management' })}
              onClick={onFileManagementButtonClick}
              type="primary"
              className="mb-4"
            />
            <Table
              url="/api/v1/system-settings-files"
              columns={columns}
              enableSelectedRow
              linkProps={{ url: '/system-files/:id' }}
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
                    href={pages.systemSettingsFiles.create.url}
                  />
                </ButtonList>
              }
            />
          </div>
        </StyledPage>
        <Modal
          open={showModal}
          footer={null}
          onCancel={onCancel}
          title={intl.formatMessage({
            id: 'system_setting_file.file_size_management',
          })}
        >
          <Spinner spinning={isLoading}>
            <Form form={form} onFinish={updateFileSize} layout="vertical">
              <InputNumber
                name="value"
                label={intl.formatMessage({
                  id: 'system_setting_file.size_value',
                })}
                validations={['required']}
              />

              <Row justify="end">
                <ButtonListModal>
                  <Button
                    type="primary"
                    label={intl.formatMessage({
                      id: 'general.save',
                    })}
                    htmlType="submit"
                  />
                </ButtonListModal>
              </Row>
            </Form>
          </Spinner>
        </Modal>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default SystemSettingFileListPage;
