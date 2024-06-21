import { Icon } from '../../ui';
import { FormattedMessage } from 'react-intl';
import parse from 'html-react-parser';
import { FullWidthNotification } from './styles';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import { updateUrlsInStringForHref } from '../../utils/formatUrl';

type NotificationItemProps = {
  notification: any;
  show: boolean;
};

export const NotificationItem = ({ notification, show }: NotificationItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setIsOpen(show);
  }, [show, location.pathname, location.search]);

  const confirmMessage = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 500);

    const notificationCookie = Cookies.get('notification') ?? '';
    const readNotificationIds = notificationCookie ? JSON.parse(decodeURIComponent(notificationCookie)) : [];

    const confirmedNotifications = JSON.stringify([...readNotificationIds, notification.id]);
    Cookies.set('notification', confirmedNotifications, { expires: 100 });
  };

  return (
    <FullWidthNotification isOpen={isOpen} isClosing={isClosing}>
      <div className="notification-container">
        <div className="notification-wrapper">
          <div className="info-icon-wrapper">
            <Icon icon="circle-info" faBase="fa-regular" />
            <FormattedMessage id="navigation.notification" />
          </div>
          <div className="text-wrapper">{parse(updateUrlsInStringForHref(notification.content))}</div>
        </div>
        <Icon className="close" icon="circle-xmark" faBase="fa-regular" onClick={confirmMessage} />
      </div>
    </FullWidthNotification>
  );
};
