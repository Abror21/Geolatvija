import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useIntl } from 'react-intl';
import { Button, Collapse, Input, Modal, Select, SelectOption, Table, TextArea } from 'ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Collapse as AntdCollapse, Form, Row } from 'antd';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonList, ButtonListModal, StyledForm, StyledPage } from 'styles/layout/form';
import DocumentFormItem from '../../../components/DocumentFormItem';

const LicenceInstitutionCreateEditPage = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [disableFileInput, setDisableFileInput] = useState(false);
  const [disableSiteInput, setDisableSiteInput] = useState(false);
  const intl = useIntl();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { Panel } = AntdCollapse;

  const {} = useQueryApiClient({
    request: {
      url: `api/v1/licence-management-institutions/${id}`,
      disableOnMount: !id,
    },
    onSuccess: (response) => {
      form.setFieldsValue(response);

      if (response && response.site && response.site.length > 0) {
        setDisableFileInput(true);
      }

      if (response && response.file && response.file.length > 0) {
        setDisableSiteInput(true);
      }
    },
  });

  const { appendData } = useQueryApiClient({
    request: {
      url: id ? `api/v1/licence-management-institutions/${id}?_method=PATCH` : `api/v1/licence-management-institutions`,
      method: 'POST',
      formData: true,
    },
    onSuccess: () => navigate(pages.licenceManagement.url),
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'licence_management.attribute_name' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'licence_management.attribute_tag' }),
      dataIndex: 'attribute',
      render: (value: string) => value,
    },
  ];

  const templateColumns = [
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
      dataIndex: 'site',
      render: (value: string, record: any) => value || record?.attachmentName,
    },
    {
      title: intl.formatMessage({ id: 'licence_management.description' }),
      dataIndex: 'description',
      render: (value: string) => value,
    },
  ];

  const onFinish = () => {
    let bodyFormData = new FormData();

    const values = form.getFieldsValue(true);

    Object.entries(values).forEach((entry: any) => {
      if (entry[0] === 'file') {
        return;
      }

      bodyFormData.append(entry[0], entry[1] || '');
    });

    if (values?.file) {
      bodyFormData.append('file', (values.file[0]?.originFileObj as unknown as Blob) || '');
    }

    appendData(bodyFormData);
  };

  const handleSiteChange = (value: any) => {
    setDisableFileInput(value.length > 0);
  };

  const handleFileChange = (value: any) => {
    setDisableSiteInput(value.fileList.length > 0);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({
              id: id
                ? pages.licenceManagement.institution.edit.title
                : pages.licenceManagement.institution.create.title,
            })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
              {
                path: pages.licenceManagement.url,
                name: intl.formatMessage({ id: pages.licenceManagement.title }),
              },
            ]}
            rightSideOptions={
              <ButtonList>
                <Button
                  type="primary"
                  label={intl.formatMessage({ id: 'licence_management.choose_from_template' })}
                  onClick={() => setShowModal(true)}
                />
              </ButtonList>
            }
          />
          <StyledForm>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Row gutter={30}>
                <Col span={12}>
                  <Input
                    label={intl.formatMessage({ id: 'licence_management.name' })}
                    name="name"
                    validations="required"
                  />
                </Col>
                <Col span={12}>
                  <Select
                    validations="required"
                    label={intl.formatMessage({ id: 'licence_management.licence_type' })}
                    name="licenceType"
                  >
                    <SelectOption value={'OPEN'}>{intl.formatMessage({ id: 'licence_management.OPEN' })}</SelectOption>
                    <SelectOption value={'PREDEFINED'}>
                      {intl.formatMessage({ id: 'licence_management.PREDEFINED' })}
                    </SelectOption>
                  </Select>
                </Col>
              </Row>
              <Row gutter={30}>
                <Col span={12}>
                  <DocumentFormItem
                    onChange={(e) => handleFileChange(e)}
                    disabled={disableFileInput}
                    fieldName="file"
                    accept={'.docx'}
                    label={intl.formatMessage({ id: 'licence_management.file' })}
                    maxCount={1}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    label={intl.formatMessage({ id: 'licence_management.site' })}
                    name="site"
                    onChange={(e) => handleSiteChange(e.target.value)}
                    disabled={disableSiteInput}
                  />
                </Col>
              </Row>
              <Row gutter={30} justify="start">
                <Col span={12}>
                  <TextArea label={intl.formatMessage({ id: 'licence_management.description' })} name="description" />
                </Col>
              </Row>
              <Collapse>
                <Panel key="masks" header={intl.formatMessage({ id: 'licence_management.show_available_masks' })}>
                  <Table url="/api/v1/licence-masks" columns={columns} disablePagination />
                </Panel>
              </Collapse>
              <Row justify="end">
                <ButtonList>
                  <Button
                    label={intl.formatMessage({
                      id: 'general.cancel',
                    })}
                    onClick={() => navigate(pages.licenceManagement.url)}
                  />
                  <Button
                    type="primary"
                    label={intl.formatMessage({
                      id: 'general.save',
                    })}
                    htmlType="submit"
                  />
                </ButtonList>
              </Row>
            </Form>
          </StyledForm>
        </StyledPage>
        <Modal
          open={showModal}
          footer={null}
          onCancel={() => setShowModal(false)}
          title={intl.formatMessage({
            id: 'general.choose_template',
          })}
          closable={false}
          width={700}
        >
          <Table
            url="/api/v1/licence-management-templates"
            columns={templateColumns}
            rowClassName="clickable-row"
            onRow={(record: any) => {
              return {
                onClick: () => {
                  form.setFieldsValue({
                    selectedTemplateId: record.id,
                    name: record.name,
                    site: record.site,
                    description: record.description,
                    licenceType: record.licenceType,
                    file: record.attachmentId
                      ? [
                          {
                            id: record.attachmentId,
                            displayName: record.attachmentName,
                          },
                        ]
                      : [],
                  });
                  if (record.site != null) {
                    setDisableSiteInput(false);
                    setDisableFileInput(true);
                  }
                  if (record.attachmentId != null) {
                    setDisableFileInput(false);
                    setDisableSiteInput(true);
                  }

                  setShowModal(false);
                },
              };
            }}
          />
          <Row justify="end">
            <ButtonListModal>
              <Button
                label={intl.formatMessage({
                  id: 'general.cancel',
                })}
                onClick={() => setShowModal(false)}
              />
            </ButtonListModal>
          </Row>
        </Modal>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default LicenceInstitutionCreateEditPage;
