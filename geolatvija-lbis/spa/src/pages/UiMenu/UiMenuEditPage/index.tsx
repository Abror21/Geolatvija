import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Button, Input, InputNumber, Spinner, Switch, TextArea } from 'ui';
import { Col, Form, Row } from 'antd';
import { useIntl } from 'react-intl';
import { ButtonList, StyledForm, StyledPage } from 'styles/layout/form';
import { pages } from 'constants/pages';
import { QuillEditor } from 'ui/quillEditor';
import { useNavigate, useParams } from 'react-router-dom';
import { urlNavigation } from 'constants/navigation';
import useQueryApiClient from 'utils/useQueryApiClient';
import UiMenuSelect, { UiMenuSelectFetchType } from '../../../components/Selects/UiMenuSelect';

const UiMenuEditPage = () => {
  const [isPredefinedPage, setIsPredefinedPage] = useState(false);
  const [inFooter, setInFooter] = useState<boolean>(false);

  const intl = useIntl();
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/ui-menu-list/${id}`,
    },
    onSuccess: (response) => {
      setIsPredefinedPage(!!urlNavigation[response.uniqueKey]);
      form.setFieldsValue(response);
      setInFooter(response.isFooter);
    },
  });

  const { appendData, isLoading: isUpdateLoading } = useQueryApiClient({
    request: {
      url: `api/v1/ui-menu/${id}`,
      method: 'PATCH',
    },
    onSuccess: () => navigate('/ui-menu'),
  });

  const onFooter = (value: boolean) => {
    setInFooter(value);
    if (value) {
      form.setFieldValue('parentId', null);
      form.setFieldValue('sequence', null);
    }
  };

  return (
    <Spinner spinning={isLoading || isUpdateLoading}>
      <DefaultLayout.PageLayout>
        <DefaultLayout.PageContent>
          <StyledPage>
            <DefaultLayout.PageHeader
              breadcrumb={[
                {
                  name: intl.formatMessage({
                    id: pages.uiMenu.title,
                  }),
                  path: pages.uiMenu.url,
                },
              ]}
              title={intl.formatMessage({ id: pages.uiMenu.editUiMenu.title })}
            />
            <StyledForm>
              <Form form={form} onFinish={appendData} layout="vertical">
                <Row gutter={30}>
                  <Col span={12}>
                    <Input
                      label={intl.formatMessage({ id: 'ui_menu.name' })}
                      name="translation"
                      validations="required"
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      disabled
                      label={intl.formatMessage({ id: 'ui_menu.unique_key' })}
                      name="uniqueKey"
                      rules={[
                        { required: true, message: intl.formatMessage({ id: 'validation.field_required' }) },
                        {
                          pattern: new RegExp('^[a-zA-Z_]+$'),
                          message: intl.formatMessage({ id: 'validation.ui_menu_code' }),
                        },
                      ]}
                    />
                  </Col>
                </Row>
                <Row gutter={30}>
                  <Col span={12}>
                    <UiMenuSelect
                      sortBy="sequence"
                      name="parentId"
                      disabled={inFooter}
                      fetchType={UiMenuSelectFetchType.ALL}
                      label={intl.formatMessage({ id: 'ui_menu.under' })}
                    />
                  </Col>
                  <Col span={12}>
                    <InputNumber
                      name="sequence"
                      disabled={inFooter}
                      label={intl.formatMessage({ id: 'ui_menu.sequence' })}
                      validations={inFooter ? 'none' : 'required'}
                    />
                  </Col>
                </Row>
                <Row gutter={30}>
                  <Col>
                    <Switch
                      name="isPublic"
                      label={intl.formatMessage({ id: 'ui_menu.public' })}
                      className="horizontal"
                    />
                  </Col>
                  <Col>
                    <Switch
                      onChange={onFooter}
                      name="isFooter"
                      label={intl.formatMessage({ id: 'ui_menu.footer' })}
                      className="horizontal"
                    />
                  </Col>
                </Row>
                <TextArea name="description" label={intl.formatMessage({ id: 'ui_menu.description' })} />
                <QuillEditor
                  enableImages
                  enableLinks
                  enableSubscript
                  enableStrikethrough
                  enableTextAlign
                  enableTextColor
                  enableBulletList
                  enableHeadingSize
                  enableNumberList
                  readOnly={isPredefinedPage}
                  name="content"
                  label={intl.formatMessage({ id: 'ui_menu.content' })}
                />

                <Row justify="end">
                  <ButtonList>
                    <Button
                      label={intl.formatMessage({
                        id: 'general.cancel',
                      })}
                      onClick={() => navigate('/ui-menu')}
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

export default UiMenuEditPage;
