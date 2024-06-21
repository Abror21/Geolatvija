import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Button, Input, Spinner, Switch } from 'ui';
import { Col, Form, Row } from 'antd';
import { useIntl } from 'react-intl';
import { ButtonList, StyledForm, StyledPage } from 'styles/layout/form';
import { pages } from 'constants/pages';
import { useNavigate } from 'react-router-dom';
import useQueryApiClient from 'utils/useQueryApiClient';

const ClassifierCreatePage = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { appendData, isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers`,
      method: 'POST',
    },
    onSuccess: () => navigate(pages.classifier.url),
  });

  return (
    <Spinner spinning={isLoading}>
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
                    id: pages.classifier.title,
                  }),
                  path: pages.classifier.url,
                },
              ]}
              title={intl.formatMessage({ id: pages.classifier.createClassifier.title })}
            />
            <StyledForm>
              <Form form={form} onFinish={appendData} layout="vertical">
                <Col>
                  <Switch name="enableWeights" label={intl.formatMessage({ id: 'classifier.enable_weights' })} />
                </Col>
                <Row gutter={30}>
                  <Col span={12}>
                    <Input
                      label={intl.formatMessage({ id: 'classifier.title' })}
                      name="translation"
                      validations={['required']}
                    />
                  </Col>

                  <Col span={12}>
                    <Input
                      label={intl.formatMessage({ id: 'classifier.classifier_code' })}
                      name="uniqueCode"
                      validations={['required']}
                    />
                  </Col>
                </Row>

                <Row justify="end">
                  <ButtonList>
                    <Button
                      label={intl.formatMessage({
                        id: 'general.cancel',
                      })}
                      onClick={() => navigate(pages.classifier.url)}
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

export default ClassifierCreatePage;
