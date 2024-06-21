import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useIntl } from 'react-intl';
import { Button, Input } from 'ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Form, Row } from 'antd';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonList, StyledForm, StyledPage } from 'styles/layout/form';

const SystemSettingFileCreateEditPage = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const {} = useQueryApiClient({
    request: {
      url: `api/v1/system-settings-files/${id}`,
      disableOnMount: !id,
    },
    onSuccess: (response) => form.setFieldsValue(response),
  });

  const { appendData } = useQueryApiClient({
    request: {
      url: id ? `api/v1/system-settings-files/${id}` : `api/v1/system-settings-files`,
      method: id ? 'PATCH' : 'POST',
    },
    onSuccess: () => navigate(pages.systemSettingsFiles.url),
  });

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({
              id: id ? pages.systemSettingsFiles.edit.title : pages.systemSettingsFiles.create.title,
            })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
              {
                path: pages.systemSettingsFiles.url,
                name: intl.formatMessage({ id: pages.systemSettingsFiles.title }),
              },
            ]}
          />
          <StyledForm>
            <Form form={form} onFinish={appendData} layout="vertical">
              <Row gutter={30}>
                <Col span={12}>
                  <Input label={intl.formatMessage({ id: 'system_setting_file.name' })} name="name" />
                </Col>
                <Col span={12}>
                  <Input label={intl.formatMessage({ id: 'system_setting_file.value' })} name="value" />
                </Col>
              </Row>
              <Row justify="end">
                <ButtonList>
                  <Button
                    label={intl.formatMessage({
                      id: 'general.cancel',
                    })}
                    onClick={() => navigate(pages.systemSettingsFiles.url)}
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

export default SystemSettingFileCreateEditPage;
