import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useIntl } from 'react-intl';
import { Button, Input, InputNumber, Radio, RadioGroup, TextArea } from 'ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Form, Row, Space } from 'antd';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonList, StyledForm, StyledPage } from 'styles/layout/form';
import { RadioChangeEvent } from 'antd/es/radio/interface';

const ProcessingTypeCreateEditPage = () => {
  const [unificationType, setUnificationType] = useState<string>('NONE');

  const intl = useIntl();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const {} = useQueryApiClient({
    request: {
      url: `api/v1/processing-types/${id}`,
      disableOnMount: !id,
    },
    onSuccess: (response) => {
      form.setFieldsValue(response);
      setUnificationType(response.unificationType || 'NONE');
    },
  });

  const { appendData } = useQueryApiClient({
    request: {
      url: id ? `api/v1/processing-types/${id}` : `api/v1/processing-types`,
      method: id ? 'PATCH' : 'POST',
    },
    onSuccess: () => navigate(pages.processingTypes.url),
  });

  const onUnificationChange = (value: RadioChangeEvent) => {
    setUnificationType(value.target.value);
    form.setFieldsValue({
      symbolAmount: null,
      directoryName: null,
    });
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({
              id: id ? pages.processingTypes.edit.title : pages.processingTypes.create.title,
            })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
              {
                path: pages.processingTypes.url,
                name: intl.formatMessage({ id: pages.processingTypes.title }),
              },
            ]}
          />
          <StyledForm>
            <Form form={form} onFinish={appendData} layout="vertical">
              <Input label={intl.formatMessage({ id: 'processing_type.name' })} name="name" validations="required" />
              <Space size={23} direction="vertical" style={{ width: '100%' }}>
                <RadioGroup
                  size="middle"
                  name="unificationType"
                  direction="vertical"
                  label={intl.formatMessage({ id: 'processing_type.file_add_type' })}
                  initialValue="NONE"
                  onChange={onUnificationChange}
                >
                  <Radio value="NONE" label={intl.formatMessage({ id: 'processing_type.not' })} />
                  <Radio value="UNIFY" label={intl.formatMessage({ id: 'processing_type.combine' })} />
                </RadioGroup>
              </Space>
              <Row gutter={30}>
                <Col span={12}>
                  <InputNumber
                    label={intl.formatMessage({ id: 'processing_type.first_symbols' })}
                    name="symbolAmount"
                    disabled={unificationType !== 'UNIFY'}
                    validations={unificationType === 'UNIFY' ? ['required'] : []}
                    min={1}
                    max={255}
                    precision={0}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    label={intl.formatMessage({ id: 'processing_type.directory_names' })}
                    name="directoryName"
                    validations={['required']}
                  />
                </Col>
              </Row>

              <TextArea label={intl.formatMessage({ id: 'processing_type.description' })} name="description" />
              <Row justify="end">
                <ButtonList>
                  <Button
                    label={intl.formatMessage({
                      id: 'general.cancel',
                    })}
                    onClick={() => navigate(pages.processingTypes.url)}
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

export default ProcessingTypeCreateEditPage;
