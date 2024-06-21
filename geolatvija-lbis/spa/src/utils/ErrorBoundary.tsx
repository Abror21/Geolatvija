import React from 'react';
import { routes } from 'config/config';
import axios, { AxiosRequestConfig } from 'axios';

export default class ErrorBoundary extends React.Component {
  componentDidCatch = async (error: Error) => {
    const request = async (url: string, data: Error) => {
      const requestConfig: AxiosRequestConfig = {
        url: url,
        method: 'POST',
        baseURL: routes.api.baseUrl,
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
          'X-FRONTEND-ROUTE': window.location.pathname,
        },
      };
      requestConfig.data = { stack: data.stack, message: data.message };

      try {
        await axios.request(requestConfig);
      } catch (e) {
        console.error(e);
      }
    };

    await request('api/v1/frontend-crash', error);

    if (window.runConfig.nodeEnv === 'production') {
      window.location.assign('/500');
    }
  };
}
