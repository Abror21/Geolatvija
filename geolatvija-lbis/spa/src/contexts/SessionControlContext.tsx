import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import useQueryApiClient from '../utils/useQueryApiClient';
import { useUserDispatch, useUserState } from './UserContext';
import useJwt from '../utils/useJwt';
import { InactivityModal } from '../components/Modals/InactivityModal/InactivityModal';
import sessionControlBroadcastChannel from '../utils/sessionControlBroadcastChannel';
import useLocalStorage from '../utils/useLocalStorage';
import dayjs from 'dayjs';
import { routes } from '../config/config';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { authAxiosInstance } from '../utils/authAxios';
import toastMessage from '../utils/toastMessage';

export interface SessionControlContextProps {
  alertShown: boolean;
  sessionTime: number;
}

export interface SessionControlContextProviderProps {
  children: React.ReactNode;
}

const SessionControlContext = createContext({} as SessionControlContextProps);

const DEFAULT_TIME = 120;

export const useSessionControl = () => {
  return useContext(SessionControlContext);
};

export enum SessionControlBroadcastType {
  ACTIVITY_DETECTED = 'ACTIVITY_DETECTED',
  INACTIVITY_DETECTED = 'INACTIVITY_DETECTED',
  CLOSE_MODAL = 'CLOSE_MODAL',
  LOG_OUT = 'LOG_OUT',
  SYNCHRONIZE_COUNTDOWN = 'SYNCHRONIZE_COUNTDOWN',
  RELOAD_PAGE = 'RELOAD_PAGE',
}

export enum AuthWebStorageEnums {
  JWT = 'jwt',
  JWT_REFRESH = 'jwt_refresh',
  JWT_INACTIVITY = 'jwt_inactivity',
  INACTIVITY_TOKEN_LIFE = 'INACTIVITY_TOKEN_LIFE',
  REFRESH_TOKEN_LIFE = 'REFRESH_TOKEN_LIFE',
  TOKEN_EXPIRE_AT = 'TOKEN_EXPIRE_AT',
  INITIAL_ROLE_IS_SET = 'INITIAL_ROLE_IS_SET',
  SELECTED_ROLE = 'selected-role',
}

export const SessionControlProvider = ({ children }: SessionControlContextProviderProps) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now);
  const [showModal, setShowModal] = useState(false);
  const [sessionTime, setSessionTime] = useState(DEFAULT_TIME * 1000);
  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const intl = useIntl();
  const location = useLocation();

  const { value: inactivityTokenLife, setLocalStorageValue: setInactivityTokenLife } = useLocalStorage<{
    start: string;
    end: string;
  }>(AuthWebStorageEnums.INACTIVITY_TOKEN_LIFE);

  const { value: _, setLocalStorageValue: setRefreshTokenLife } = useLocalStorage<{
    start: string;
    end: string;
  }>(AuthWebStorageEnums.REFRESH_TOKEN_LIFE);

  const fetchingNewRefreshToken = useRef(false);

  const { selectedRole } = useUserState();
  const dispatch = useUserDispatch();
  const { isTokenActive, setRefreshCookie, setInactivityCookie, setInitialCookies, remove } = useJwt();

  const _isTokenActive = isTokenActive();

  const { data } = useQueryApiClient({
    request: {
      url: 'api/v1/system-settings/session-inactivity-time',
      disableOnMount: !_isTokenActive,
    },
  });

  const OnError = (error: any) => {
    toastMessage.error(
      intl.formatMessage({
        id: error?.response?.data?.error,
      })
    );

    if (
      (error?.response?.status === 401 || error?.response?.status === 403) &&
      location.pathname !== '/' &&
      location.pathname !== '/main'
    ) {
      sessionControlBroadcastChannel.postMessage({ type: SessionControlBroadcastType.RELOAD_PAGE });
      remove();
      localStorage.removeItem(AuthWebStorageEnums.INITIAL_ROLE_IS_SET);
      localStorage.removeItem(AuthWebStorageEnums.SELECTED_ROLE);
      navigate('/');
    }

    console.error(error);
  };

  const refreshItself = async () => {
    fetchingNewRefreshToken.current = true;
    await authAxiosInstance
      .get('/api/v1/refresh-itself')
      .then((res) => {
        const _res = res.data;
        setRefreshCookie(_res.refresh_token.token, _res.refresh_token.expires_at);
        setRefreshTokenLife({
          start: _res.refresh_token.expire_set_at,
          end: _res.refresh_token.expires_at,
        });
      })
      .catch(OnError)
      .finally(() => {
        fetchingNewRefreshToken.current = false;
        setLoading(false);
      });
  };

  const logout = async () => {
    await authAxiosInstance
      .post('/api/v1/logout')
      .finally(() => {
        sessionControlBroadcastChannel.postMessage({ type: SessionControlBroadcastType.LOG_OUT });
        dispatch({ type: 'SELECT_ROLE', payload: { selectedRole: undefined, loggingOut: true } });
        remove();
        localStorage.removeItem(AuthWebStorageEnums.INITIAL_ROLE_IS_SET);
        localStorage.removeItem(AuthWebStorageEnums.SELECTED_ROLE);

        /*
        This is to make sure it executes window.location.replace()
        as last after the current code block completes its execution
        */
        setTimeout(() => {
          window.location.replace(routes.api.baseUrl + '/vpm/logout');
        }, 0);
      })
      .catch(OnError);
  };

  const setNewTokens = async () => {
    await authAxiosInstance
      .get(`/api/v1/token/${selectedRole}`)
      .then((res) => {
        const _res = res.data;
        remove();
        setInitialCookies(
          _res?.access_token?.token,
          _res?.access_token?.expires_at,
          _res?.refresh_token?.token,
          _res?.refresh_token?.expires_at
        );
        localStorage.setItem(AuthWebStorageEnums.TOKEN_EXPIRE_AT, _res?.access_token?.expires_at);
        setRefreshTokenLife({
          start: _res?.refresh_token?.expire_set_at,
          end: _res?.refresh_token?.expires_at,
        });
      })
      .catch(OnError);
  };

  const getInactivityToken = async () => {
    const refreshToken = Cookies.get(AuthWebStorageEnums.JWT_REFRESH);

    if (!!refreshToken) {
      await authAxiosInstance
        .get(`/api/v1/inactivity-token`)
        .then((res) => {
          Cookies.remove(AuthWebStorageEnums.JWT_REFRESH);
          Cookies.remove(AuthWebStorageEnums.JWT);
          const _res = res.data;

          const expiresAt = dayjs(_res.inactivity_token.expires_at).subtract(30, 'second').toISOString();

          setInactivityCookie(_res.inactivity_token.token, expiresAt);
          setInactivityTokenLife({
            start: _res.inactivity_token.expire_set_at,
            end: expiresAt,
          });

          const currentDate = dayjs();
          const inactivityTokenDateEnd = dayjs(expiresAt);

          const millisecondsLeft = inactivityTokenDateEnd.diff(currentDate);
          setSessionTime(Date.now() + millisecondsLeft);
          setRemainingTime(millisecondsLeft);
          sessionControlBroadcastChannel.postMessage({
            type: SessionControlBroadcastType.SYNCHRONIZE_COUNTDOWN,
            time: millisecondsLeft,
          });
          setLoading(false);

          sessionControlBroadcastChannel.postMessage({ type: SessionControlBroadcastType.INACTIVITY_DETECTED });
          setShowModal(true);
        })
        .catch(OnError);
    }
  };

  useEffect(() => {
    const handleUserActivity = () => {
      if (initialLoad) {
        setInitialLoad(false);
        return;
      }

      setLastActivity(Date.now);
      sessionControlBroadcastChannel.postMessage({ type: SessionControlBroadcastType.ACTIVITY_DETECTED });

      const refreshTokenLifeString = localStorage.getItem(AuthWebStorageEnums.REFRESH_TOKEN_LIFE);
      if (!!refreshTokenLifeString) {
        const refreshTokenLife = JSON.parse(refreshTokenLifeString);

        const refreshTokenDateStart = dayjs(refreshTokenLife?.start);
        const currentDate = dayjs();
        const refreshTokenDateEnd = dayjs(refreshTokenLife?.end);

        const tokenLifeInMillis = refreshTokenDateEnd.diff(refreshTokenDateStart);
        const currentTokenLifeElapsed = currentDate.diff(refreshTokenDateStart);

        if (
          currentTokenLifeElapsed >= tokenLifeInMillis * 0.2 &&
          !!Cookies.get(AuthWebStorageEnums.JWT_REFRESH) &&
          !fetchingNewRefreshToken.current &&
          !initialLoad &&
          !showModal
        ) {
          refreshItself();
        }
      }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [initialLoad, showModal]);

  useEffect(() => {
    const inactivityAlertDuration = (data?.value || DEFAULT_TIME) * 1000;

    const checkInactivity = () => {
      const currentTime = Date.now();
      if (_isTokenActive && !showModal && currentTime - lastActivity > inactivityAlertDuration) {
        const inactivityTokenDateStart = dayjs(inactivityTokenLife?.start);
        const currentDate = dayjs();
        const inactivityTokenDateEnd = dayjs(inactivityTokenLife?.end);

        const tokenLifeInMillis = inactivityTokenDateEnd.diff(inactivityTokenDateStart);
        const currentTokenLifeElapsed = currentDate.diff(inactivityTokenDateStart);

        if (
          currentTokenLifeElapsed >= tokenLifeInMillis &&
          !!Cookies.get(AuthWebStorageEnums.JWT_REFRESH) &&
          !Cookies.get(AuthWebStorageEnums.JWT_INACTIVITY)
        ) {
          // Generate a random delay between 0 and 2000 milliseconds
          // TODO FIX THIS
          const randomDelay = Math.floor(Math.random() * 2000);

          // Use setTimeout to delay the getInactivityToken call
          setTimeout(() => {
            getInactivityToken();
          }, randomDelay);
        }
      }
    };

    const inactivityTimer = setInterval(checkInactivity, 1000);

    return () => {
      clearInterval(inactivityTimer);
    };
  }, [lastActivity, showModal, data?.value, _isTokenActive, inactivityTokenLife]);

  const resetModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    sessionControlBroadcastChannel.onmessage = (event) => {
      const { type, time } = event.data;

      switch (type) {
        case SessionControlBroadcastType.INACTIVITY_DETECTED:
          setShowModal(true);
          break;
        case SessionControlBroadcastType.ACTIVITY_DETECTED:
          setLastActivity(Date.now());
          break;
        case SessionControlBroadcastType.CLOSE_MODAL:
          setShowModal(false);
          resetModal();
          break;
        case SessionControlBroadcastType.LOG_OUT:
          window.location.assign('/');
          break;
        case SessionControlBroadcastType.SYNCHRONIZE_COUNTDOWN:
          setLoading(false);
          if (!!time) {
            setSessionTime(Date.now() + time);
            setRemainingTime(time);
          }
          break;
        case SessionControlBroadcastType.RELOAD_PAGE:
          window.location.reload();
          break;
        default:
          setShowModal(true);
      }
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      const updateSessionTime = () => {
        const timeLeft = sessionTime - Date.now();

        if (timeLeft > 0) {
          setRemainingTime(timeLeft);
        } else {
          clearInterval(countdownTimer);
          setShowModal(false);
          logout();
        }
      };

      const countdownTimer = setInterval(updateSessionTime, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [showModal, sessionTime]);

  return (
    <SessionControlContext.Provider value={{ alertShown: showModal, sessionTime }}>
      <InactivityModal
        loading={loading}
        resetModal={resetModal}
        showModal={showModal}
        setNewTokens={setNewTokens}
        countdown={remainingTime}
        logout={logout}
      />
      {children}
    </SessionControlContext.Provider>
  );
};
