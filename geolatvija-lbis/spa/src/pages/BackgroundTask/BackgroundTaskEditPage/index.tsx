import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useIntl } from 'react-intl';
import { Button, Input, Switch, TextArea } from 'ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Row } from 'antd';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonList, StyledForm, StyledPage } from 'styles/layout/form';

const BackgroundTaskEditPage = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const {} = useQueryApiClient({
    request: {
      url: `api/v1/background-tasks/${id}`,
      disableOnMount: !id,
    },
    onSuccess: (response) => form.setFieldsValue(response),
  });

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/background-tasks/${id}`,
      method: 'PATCH',
    },
    onSuccess: () => navigate(pages.backgroundTasks.url),
  });

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({
              id: pages.backgroundTasks.edit.title,
            })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
              {
                path: pages.backgroundTasks.url,
                name: intl.formatMessage({ id: pages.backgroundTasks.title }),
              },
            ]}
          />
          <StyledForm>
            <Form form={form} onFinish={appendData} layout="vertical">
              <Input
                label={intl.formatMessage({ id: 'background_task.name' })}
                name="name"
                validations="required"
                disabled
              />
              <Switch name="isActive" label={intl.formatMessage({ id: 'background_task.is_enabled' })} />

              <TextArea label={intl.formatMessage({ id: 'background_task.description' })} name="description" />
              <Input
                label={intl.formatMessage({ id: 'background_task.by_periodicity' })}
                name="cron"
                validations="required"
              />
              <Row justify="end">
                <ButtonList>
                  <Button
                    label={intl.formatMessage({
                      id: 'general.cancel',
                    })}
                    onClick={() => navigate(pages.backgroundTasks.url)}
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

export default BackgroundTaskEditPage;
