import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useIntl } from 'react-intl';
import { Button, Input, Spinner } from 'ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Form, Row } from 'antd';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonList, StyledPage } from 'styles/layout/form';

const RoleCreateEditPage = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const {} = useQueryApiClient({
    request: {
      url: `api/v1/roles/${id}`,
      disableOnMount: !id,
    },
    onSuccess: (response) => form.setFieldsValue(response),
  });

  const { appendData, isLoading } = useQueryApiClient({
    request: {
      url: id ? `api/v1/roles/${id}` : `api/v1/roles`,
      method: id ? 'PATCH' : 'POST',
    },
    onSuccess: () => navigate(pages.userManagement.url),
  });

  return (
    <Spinner spinning={isLoading}>
      <DefaultLayout.PageLayout>
        <DefaultLayout.PageContent>
          <StyledPage>
            <DefaultLayout.PageHeader
              title={intl.formatMessage({ id: id ? 'user_management.edit_role' : 'user_management.add_role' })}
              breadcrumb={[
                {
                  path: '/',
                  name: intl.formatMessage({ id: 'general.administration' }),
                },
                {
                  path: pages.userManagement.url,
                  name: intl.formatMessage({ id: 'user_management.user_management' }),
                },
              ]}
            />
            <Form form={form} layout="vertical" onFinish={appendData}>
              <Row gutter={20}>
                <Col span={12}>
                  <Input
                    name="name"
                    label={intl.formatMessage({ id: 'user_management.role_name' })}
                    validations={['required']}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    name="description"
                    label={intl.formatMessage({ id: 'user_management.role_description' })}
                    validations={['required']}
                  />
                </Col>
              </Row>
              <ButtonList>
                <Button label={intl.formatMessage({ id: 'general.cancel' })} href={pages.userManagement.url} />
                <Button htmlType="submit" type="primary" label={intl.formatMessage({ id: 'general.save' })} />
              </ButtonList>
            </Form>
          </StyledPage>
        </DefaultLayout.PageContent>
      </DefaultLayout.PageLayout>
    </Spinner>
  );
};

export default RoleCreateEditPage;
