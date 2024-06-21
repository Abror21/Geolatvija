import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Table, Button, Switch, Popover, Icon, Tag } from 'ui';
import { FormattedMessage, useIntl } from 'react-intl';
import { StyledPage, ButtonList } from 'styles/layout/table';
import { pages } from 'constants/pages';
import parse from 'html-react-parser';
import useQueryApiClient from 'utils/useQueryApiClient';
import dayjs from 'dayjs';

interface NotificationListProps {
  id: number;
  publicFrom: string;
  publicTo: string;
  isPublic: boolean;
}

const NotificationListPage = () => {
  const [reload, setReload] = useState<number>(0);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const intl = useIntl();

  const { appendData: appendDataUnpublish } = useQueryApiClient({
    request: {
      url: `api/v1/notifications/:id/unpublish`,
      method: 'POST',
    },
    onSuccess: () => setReload((old) => old + 1),
  });

  const { appendData: appendDataPublish } = useQueryApiClient({
    request: {
      url: `api/v1/notifications/:id/publish`,
      method: 'POST',
    },
    onSuccess: () => setReload((old) => old + 1),
  });

  const { appendData: appendDataDelete } = useQueryApiClient({
    request: {
      url: `api/v1/notifications`,
      method: 'DELETE',
    },
    onSuccess: () => {
      setReload((old) => old + 1);
      setSelectedKeys([]);
    },
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'notification.notification_text' }),
      dataIndex: 'content',
      className: 'notification-title',
      render: (value: string) => {
        var cleanedString = value.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');
        return parse(cleanedString);
      },
    },
    {
      title: intl.formatMessage({ id: 'notification.shown_on' }),
      dataIndex: 'uiMenus',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'notification.public_status' }),
      dataIndex: 'isPublic',
      render: (value: boolean) => {
        if (value) {
          return <Tag label={intl.formatMessage({ id: 'ui_menu.public' })} color="green" />;
        }
        return <Tag label={intl.formatMessage({ id: 'notification.status_inactive' })} color="gray" />;
      },
    },
    {
      title: intl.formatMessage({ id: 'notification.public_period' }),
      render: (record: NotificationListProps) => {
        let result = record.publicFrom && dayjs(record.publicFrom).format('DD.MM.YYYY');

        if (record.publicFrom && record.publicTo) {
          result = result + ' - ' + dayjs(record.publicTo).format('DD.MM.YYYY');
        }

        return result;
      },
    },
    {
      render: (record: NotificationListProps) => (
        <Popover
          content={
            <>
              {record?.isPublic ? (
                <div className="popover-item" onClick={() => appendDataUnpublish([], { id: record.id })}>
                  <FormattedMessage id="geoproducts.republish" />
                </div>
              ) : (
                <div className="popover-item" onClick={() => appendDataPublish([], { id: record.id })}>
                  <FormattedMessage id="geoproducts.publish" />
                </div>
              )}
            </>
          }
          trigger="click"
          placement="bottom"
        >
          <Icon faBase="fal" icon="ellipsis-v" />
        </Popover>
      ),
    },
  ];

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: 'navigation.notifications' })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
          />

          <div className="theme-container">
            <Table
              url="/api/v1/notifications"
              columns={columns}
              enableSelectedRow
              linkProps={{ url: pages.notification.editNotification.url }}
              reload={reload}
              setSelectedKeys={setSelectedKeys}
              tableActions={
                <ButtonList>
                  <Button
                    label={intl.formatMessage({ id: 'general.delete_chosen' })}
                    onClick={() => appendDataDelete({ ids: selectedKeys })}
                    disabled={!selectedKeys.length}
                  />
                  <Button
                    type="primary"
                    label={intl.formatMessage({ id: 'general.add_new' })}
                    href={pages.notification.createNotification.url}
                  />
                </ButtonList>
              }
            />
          </div>
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};
export default NotificationListPage;
