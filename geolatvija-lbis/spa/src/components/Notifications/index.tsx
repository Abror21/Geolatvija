import React, { useEffect, useRef } from 'react';
import { NotificationItem } from './NotificationItem';
import { StyledNotificationList } from './styles';
import { useNotificationHeader } from '../../contexts/NotificationHeaderContext';

const NotificationHeaderPopup = () => {
  const { isOpen, notificationData, setHeight } = useNotificationHeader();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (listRef.current) {
        const height = listRef.current.getBoundingClientRect().height;
        setHeight(height);
      }
    };

    updateHeight();

    const observer = new MutationObserver(updateHeight);
    if (listRef.current) {
      observer.observe(listRef.current, { attributes: true, childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, [isOpen, notificationData]);

  return (
    <StyledNotificationList ref={listRef}>
      {notificationData?.map((notification, index) => (
        <NotificationItem key={index} show={isOpen} notification={notification} />
      ))}
    </StyledNotificationList>
  );
};

export default NotificationHeaderPopup;
