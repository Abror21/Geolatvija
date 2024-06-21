import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useIntl } from 'react-intl';
import { Button, Collapse, Input, Select, SelectOption, Switch, Table, TextArea } from 'ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Collapse as AntdCollapse, Form, Row } from 'antd';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonList, StyledForm, StyledPage } from 'styles/layout/form';
import DocumentFormItem from '../../../components/DocumentFormItem';
import dayjs from 'dayjs';
import { UploadChangeParam } from 'antd/lib/upload/interface';

const LicenceTemplateCreateEditPage = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { Panel } = AntdCollapse;
  const [disableFileInput, setDisableFileInput] = useState(false);
  const [disableSiteInput, setDisableSiteInput] = useState(false);

  const {} = useQueryApiClient({
    request: {
      url: `api/v1/licence-management-templates/${id}`,
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
      url: id ? `api/v1/licence-management-templates/${id}?_method=PATCH` : `api/v1/licence-management-templates`,
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

  const onFinish = (values: any) => {
    let bodyFormData = new FormData();

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

  const handleSiteChange = (value: string) => {
    setDisableFileInput(value.length > 0);
  };

  const handleFileChange = (value: UploadChangeParam) => {
    setDisableSiteInput(value.fileList.length > 0);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({
              id: id ? pages.licenceManagement.template.edit.title : pages.licenceManagement.template.create.title,
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
                    label={intl.formatMessage({ id: 'licence_management.file' })}
                    maxCount={1}
                    accept={'.docx'}
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
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default LicenceTemplateCreateEditPage;
