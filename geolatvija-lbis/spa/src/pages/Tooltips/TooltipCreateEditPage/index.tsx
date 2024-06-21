import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useIntl } from 'react-intl';
import { Button, Input } from 'ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Form, Row } from 'antd';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonList, StyledForm, StyledPage } from 'styles/layout/form';
import UiMenuSelect from '../../../components/Selects/UiMenuSelect';

const TooltipCreateEditPage = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const {} = useQueryApiClient({
    request: {
      url: `api/v1/tooltips/${id}`,
      disableOnMount: !id,
    },
    onSuccess: (response) => form.setFieldsValue(response),
  });

  const { appendData } = useQueryApiClient({
    request: {
      url: id ? `api/v1/tooltips/${id}` : `api/v1/tooltips`,
      method: id ? 'PATCH' : 'POST',
    },
    onSuccess: () => navigate(pages.tooltips.url),
  });

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({
              id: id ? pages.tooltips.edit.title : pages.tooltips.create.title,
            })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
              {
                path: pages.tooltips.url,
                name: intl.formatMessage({ id: pages.tooltips.title }),
              },
            ]}
          />
          <StyledForm>
            <Form form={form} onFinish={appendData} layout="vertical">
              <Row gutter={30}>
                <Col span={12}>
                  <Input label={intl.formatMessage({ id: 'tooltip.code' })} name="code" validations="required" />
                </Col>
                <Col span={12}>
                  <Input
                    label={intl.formatMessage({ id: 'tooltip.translation' })}
                    name="translation"
                    validations="required"
                  />
                </Col>
              </Row>

              <Row gutter={30}>
                <Col span={12}>
                  <UiMenuSelect
                    name="uiMenuId"
                    label={intl.formatMessage({ id: 'notification.shown_on' })}
                    validations="required"
                  />
                </Col>
              </Row>
              <Row justify="end">
                <ButtonList>
                  <Button
                    label={intl.formatMessage({
                      id: 'general.cancel',
                    })}
                    onClick={() => navigate(pages.tooltips.url)}
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

export default TooltipCreateEditPage;
