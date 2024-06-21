import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Button, DatePicker, Spinner } from 'ui';
import { Col, Form, Row } from 'antd';
import { useIntl } from 'react-intl';
import { ButtonList, StyledForm, StyledPage } from 'styles/layout/form';
import { pages } from 'constants/pages';
import { QuillEditor } from 'ui/quillEditor';
import { useNavigate, useParams } from 'react-router-dom';
import { urlNavigation } from 'constants/navigation';
import useQueryApiClient from 'utils/useQueryApiClient';
import UiMenuSelect from '../../../components/Selects/UiMenuSelect';
import dayjs, { Dayjs } from 'dayjs';
import { useNotificationHeader } from '../../../contexts/NotificationHeaderContext';

const UiMenuEditPage = () => {
  const [isPredefinedPage, setIsPredefinedPage] = useState(false);

  const intl = useIntl();
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [publicToMin, setPublicToMin] = useState<Dayjs | null>();
  const [formSet, setFormSet] = useState(false);
  const { refetch: refetchNotifications } = useNotificationHeader();

  const handlePublicFromChange = (date: Dayjs | null) => {
    setPublicToMin(date);
    const publicTo = form.getFieldValue('publicTo');
    const publicFrom = form.getFieldValue('publicFrom');

    if (dayjs(publicTo).isBefore(publicFrom) && publicTo) {
      form.setFieldsValue({ publicTo: undefined });
    }
  };

  const { isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/notifications/${id}`,
    },
    onSuccess: (response) => {
      setIsPredefinedPage(!!urlNavigation[response.uniqueKey]);
      response.publicFrom = response.publicFrom ? dayjs(response.publicFrom) : undefined;
      response.publicTo = response.publicTo ? dayjs(response.publicTo) : undefined;
      setPublicToMin(response.publicFrom);
      form.setFieldsValue(response);
      setFormSet(true);
    },
  });

  const { appendData, isLoading: isUpdateLoading } = useQueryApiClient({
    request: {
      url: `api/v1/notifications/${id}`,
      method: 'PATCH',
    },
    onSuccess: () => onLeave(),
  });

  const onLeave = () => {
    refetchNotifications();
    navigate(pages.notification.url);
  };

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
                    id: pages.notification.title,
                  }),
                  path: pages.notification.url,
                },
              ]}
              title={intl.formatMessage({ id: pages.notification.editNotification.title })}
            />
            <StyledForm>
              <Form form={form} onFinish={appendData} layout="vertical">
                <UiMenuSelect
                  name="uiMenuIds"
                  mode="multiple"
                  label={intl.formatMessage({ id: 'notification.shown_on' })}
                />
                <QuillEditor
                  readOnly={isPredefinedPage}
                  maxLength={600}
                  name="content"
                  label={intl.formatMessage({ id: 'notification.content' })}
                  enableLinks={true}
                  formSet={formSet}
                />

                <Row gutter={20}>
                  <Col span={12}>
                    <DatePicker
                      name="publicFrom"
                      label={intl.formatMessage({ id: 'notification.published_from' })}
                      onChange={handlePublicFromChange}
                      disabledDate={(date: Dayjs) => date && date < dayjs().startOf('day')}
                    />
                  </Col>
                  <Col span={12}>
                    <DatePicker
                      name="publicTo"
                      label={intl.formatMessage({ id: 'notification.published_to' })}
                      disabledDate={(date: Dayjs) => (publicToMin ? date < publicToMin : false)}
                      disabled={!publicToMin}
                    />
                  </Col>
                </Row>

                <Row justify="end">
                  <ButtonList>
                    <Button
                      label={intl.formatMessage({
                        id: 'general.cancel',
                      })}
                      onClick={onLeave}
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
