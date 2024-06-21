import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Button, Input, Spinner } from 'ui';
import { Col, Form, Row } from 'antd';
import { useIntl } from 'react-intl';
import { ButtonList, StyledForm, StyledPage } from 'styles/layout/form';
import { pages } from 'constants/pages';
import { useNavigate, useParams } from 'react-router-dom';
import useQueryApiClient from 'utils/useQueryApiClient';

const SystemSettingEditPage = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/system-settings/${id}`,
    },
    onSuccess: (response) => form.setFieldsValue(response),
  });

  const { appendData, isLoading: isUpdateLoading } = useQueryApiClient({
    request: {
      url: `api/v1/system-settings/${id}`,
      method: 'PATCH',
    },
    onSuccess: () => navigate('/system-settings'),
  });

  return (
    <Spinner spinning={isLoading || isUpdateLoading}>
      <DefaultLayout.PageLayout>
        <DefaultLayout.PageContent>
          <StyledPage>
            <DefaultLayout.PageHeader
              breadcrumb={[
                {
                  path: '/',
                  name: intl.formatMessage({ id: 'general.administration' }),
                },
                {
                  name: intl.formatMessage({
                    id: pages.systemSettings.title,
                  }),
                  path: pages.systemSettings.url,
                },
              ]}
              title={intl.formatMessage({ id: pages.systemSettings.edit.title })}
            />
            <StyledForm>
              <Form form={form} onFinish={appendData} layout="vertical">
                <Row gutter={30}>
                  <Col span={12}>
                    <Input label={intl.formatMessage({ id: 'system_setting.name' })} name="name" />
                  </Col>
                  <Col span={12}>
                    <Input label={intl.formatMessage({ id: 'system_setting.value' })} name="value" />
                  </Col>
                </Row>
                <Row justify="end">
                  <ButtonList>
                    <Button
                      label={intl.formatMessage({
                        id: 'general.cancel',
                      })}
                      onClick={() => navigate('/system-settings')}
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
    </Spinner>
  );
};

export default SystemSettingEditPage;
