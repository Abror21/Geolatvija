import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useJwt from 'utils/useJwt';
import useLocalStorage from '../../utils/useLocalStorage';
import { useUserDispatch } from '../../contexts/UserContext';
import { AuthWebStorageEnums } from '../../contexts/SessionControlContext';

const AuthPage = () => {
  const { token, refreshToken, tokenExpire, refreshExpire, refreshTokenExpiresSetAt, roleId } = useParams();
  const { setInitialCookies } = useJwt();
  const dispatch = useUserDispatch();

  const { value: _, setLocalStorageValue: setRefreshTokenLife } = useLocalStorage<{
    start: string;
    end: string;
  }>(AuthWebStorageEnums.REFRESH_TOKEN_LIFE);

  useEffect(() => {
    if (!!token && !!tokenExpire && !!refreshExpire && !!refreshToken && !!refreshTokenExpiresSetAt && !!roleId) {
      setInitialCookies(token, tokenExpire, refreshToken, refreshExpire);
      localStorage.setItem(AuthWebStorageEnums.TOKEN_EXPIRE_AT, tokenExpire);
      setRefreshTokenLife({
        start: refreshTokenExpiresSetAt,
        end: refreshExpire,
      });
      dispatch({
        type: 'SELECT_ROLE',
        payload: { selectedRole: parseInt(roleId), loggingOut: false },
      });
      window.location.assign('/');
    }
  }, []);

  return <></>;
};

export default AuthPage;
