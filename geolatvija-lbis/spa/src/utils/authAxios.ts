import axios from 'axios';
import Cookies from 'js-cookie';
import { routes } from '../config/config';
import { AuthWebStorageEnums } from '../contexts/SessionControlContext';

const DEBOUNCE_TIME = 10000; // 10 seconds in milliseconds

const isRecentRequest = (url: string): boolean => {
  const currentTime = Date.now();
  const lastRequestTimeKey = `lastRequestTime:${url}`;
  const lastRequestTime = parseInt(localStorage.getItem(lastRequestTimeKey) || '0');

  if (currentTime - lastRequestTime < DEBOUNCE_TIME) {
    return true;
  }

  localStorage.setItem(lastRequestTimeKey, currentTime.toString());
  return false;
};

export const authAxiosInstance = axios.create({
  baseURL: `${routes.api.baseUrl}`,
});

authAxiosInstance.interceptors.request.use(async (config) => {
  if (!!config.url && isRecentRequest(config.url)) {
    return Promise.reject(new Error('Request cancelled due to rapid duplicate requests of the same URL'));
  }

  if (!!config.headers) {
    const latestRefreshToken = Cookies.get(AuthWebStorageEnums.JWT_REFRESH);
    const latestInactivityToken = Cookies.get(AuthWebStorageEnums.JWT_INACTIVITY);
    const selectedRole = window.localStorage.getItem(AuthWebStorageEnums.SELECTED_ROLE);

    switch (config.url) {
      case '/api/v1/refresh-itself':
        if (latestRefreshToken) {
          config.headers.Authorization = `Bearer ${latestRefreshToken}`;
          config.data = {
            refresh_token: Cookies.get(AuthWebStorageEnums.JWT_REFRESH),
          };
        }
        break;
      case '/api/v1/logout':
        if (latestInactivityToken) config.headers.Authorization = `Bearer ${latestInactivityToken}`;
        break;
      case `/api/v1/token/${selectedRole}`:
        if (latestInactivityToken) config.headers.Authorization = `Bearer ${latestInactivityToken}`;
        break;
      case '/api/v1/inactivity-token':
        if (latestRefreshToken) {
          config.headers.Authorization = `Bearer ${latestRefreshToken}`;
          config.data = {
            refresh_token: Cookies.get(AuthWebStorageEnums.JWT_REFRESH),
          };
        }
    }
  }

  return config;
});
