import axios, { CancelTokenSource } from 'axios';
import { routes } from '../config/config';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { AuthWebStorageEnums } from '../contexts/SessionControlContext';

interface TokenResponse {
  access_token: string;
  expires_at: string;
  expiration_value: number;
}

let tokenPromise: Promise<string> | null = null;

const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

export const axiosInstance = axios.create({
  baseURL: `${routes.api.baseUrl}`,
  cancelToken: cancelTokenSource.token,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token: string | undefined = Cookies.get(AuthWebStorageEnums.JWT);
    const refreshToken: string | undefined = Cookies.get(AuthWebStorageEnums.JWT_REFRESH);
    const selectedRole = localStorage.getItem(AuthWebStorageEnums.SELECTED_ROLE);
    const tokenExpireAt = localStorage.getItem(AuthWebStorageEnums.TOKEN_EXPIRE_AT);

    // 10 second buffer
    const isTokenExpiring = tokenExpireAt && dayjs().isAfter(dayjs(tokenExpireAt).subtract(10, 'second'));

    if ((isTokenExpiring || !token) && refreshToken && !!selectedRole) {
      if (!tokenPromise) {
        // Creating a new Promise to fetch a token if one doesn't exist
        tokenPromise = axios
          .get<TokenResponse>(`${routes.api.baseUrl}/api/v1/refresh-token`, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          })
          .then((response) => {
            Cookies.set(AuthWebStorageEnums.JWT, response.data.access_token, {
              expires: response.data.expiration_value / (24 * 60 * 60),
            });
            localStorage.setItem(AuthWebStorageEnums.TOKEN_EXPIRE_AT, response.data.expires_at);
            return response.data.access_token;
          })
          .catch((error) => {
            console.error('Error refreshing token:', error);
            throw error;
          })
          .finally(() => {
            // Resetting the tokenPromise once the request is complete
            tokenPromise = null;
          });
      }

      // Waiting for the tokenPromise to resolve or reject before proceeding
      const newToken = await tokenPromise;

      if (!!config.headers) {
        config.headers['Authorization'] = `Bearer ${newToken}`;
      }
    } else {
      if (!!config.headers) {
        config.headers['Authorization'] = `Bearer ${Cookies.get(AuthWebStorageEnums.JWT)}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.data?.error?.includes('Unauthenticated') || error.response?.status === 401) {
      cancelTokenSource.cancel('Unauthorized: cancelling remaining requests');
      Cookies.remove(AuthWebStorageEnums.JWT);
      Cookies.remove(AuthWebStorageEnums.JWT_REFRESH);
      localStorage.removeItem(AuthWebStorageEnums.INITIAL_ROLE_IS_SET);
      localStorage.removeItem(AuthWebStorageEnums.TOKEN_EXPIRE_AT);
      localStorage.removeItem(AuthWebStorageEnums.SELECTED_ROLE);
    }

    return Promise.reject(error);
  }
);
