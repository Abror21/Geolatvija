import React, { createContext, type Dispatch, type SetStateAction, useContext, useEffect, useState } from 'react';
import useQueryApiClient from '../utils/useQueryApiClient';
import Cookies from 'js-cookie';
import { urlNavigation } from '../constants/navigation';
import { useLocation } from 'react-router-dom';
import { pages } from '../constants/pages';

export const NotificationHeaderContext = createContext({} as NotificationHeaderContextProps);

export interface NotificationHeaderContextProps {
  refetch: Function;
  notificationData: any[];
  setCookiesAccepted: Dispatch<SetStateAction<boolean>>;
  cookiesAccepted: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  height?: number;
  setHeight: Dispatch<SetStateAction<number | undefined>>;
}
export interface NotificationHeaderContextProviderProps {
  children: React.ReactNode;
}

const NotificationHeaderContextProvider = ({ children }: NotificationHeaderContextProviderProps) => {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(false);
  const [receivedData, setReceivedData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<any[]>([]);
  const [height, setHeight] = useState<number>();

  const location = useLocation();
  const notificationCookie = Cookies.get('notification') ?? '';
  const readNotificationIds = notificationCookie ? JSON.parse(decodeURIComponent(notificationCookie)) : [];

  useEffect(() => {
    if (Cookies.get('cookie') != null) {
      setCookiesAccepted(true);
    }
  }, []);

  useEffect(() => {
    setIsOpen(false);
    if (cookiesAccepted) {
      checkForNotifications();
    }
  }, [receivedData, location.pathname, location.search, cookiesAccepted]);

  const { refetch } = useQueryApiClient({
    request: {
      url: 'api/v1/public/notifications',
    },
    onSuccess: (response) => {
      setReceivedData(response);
    },
  });

  const getNotificationList = (notifications: any) => {
    const notificationsToShow: Array<any> = [];
    notifications.forEach((notification: any) => {
      if (!readNotificationIds.includes(notification.id)) {
        notificationsToShow.push({ id: notification.id, content: notification.content });
      }
    });
    if (notificationsToShow.length) {
      setNotificationData(notificationsToShow);
      setIsOpen(true);
    }
  };

  const checkForNotifications = () => {
    let notifications: Array<any> = [];
    for (const uniqueKey in receivedData) {
      let path = window.location.pathname + window.location.search;

      if (path.includes(pages.selectedTapis.url) && !!receivedData?.tapis) {
        notifications = [...receivedData?.tapis];
      } else if (path.includes('predefined-page')) {
        if (path.includes(urlNavigation[uniqueKey])) {
          notifications = [...receivedData[uniqueKey]];
        }
      } else if (path.includes(urlNavigation[uniqueKey])) {
        notifications = [...receivedData[uniqueKey]];
      } else if (uniqueKey === 'tapis' && path === '/main') {
        notifications = [...receivedData[uniqueKey]];
      } else {
        setIsOpen(false);
      }
    }
    getNotificationList(notifications);
  };

  return (
    <NotificationHeaderContext.Provider
      value={{ refetch, notificationData, setCookiesAccepted, cookiesAccepted, setIsOpen, isOpen, height, setHeight }}
    >
      {children}
    </NotificationHeaderContext.Provider>
  );
};

export const useNotificationHeader = () => {
  return useContext(NotificationHeaderContext);
};

export default NotificationHeaderContextProvider;
