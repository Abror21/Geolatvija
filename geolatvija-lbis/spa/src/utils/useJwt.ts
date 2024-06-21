import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';
import { AuthWebStorageEnums } from '../contexts/SessionControlContext';

function useJwt() {
  const setCookieWithMaxAge = (name: string, value: string, maxAgeSeconds: number) => {
    Cookies.set(name, value, { expires: maxAgeSeconds / (24 * 60 * 60) });
  };

  const setInitialCookies = (token: string, expires: string, refreshToken: string, refreshExpires: string) => {
    Cookies.set(AuthWebStorageEnums.JWT, token, { expires: new Date(expires) });
    Cookies.set(AuthWebStorageEnums.JWT_REFRESH, refreshToken, { expires: new Date(refreshExpires) });
  };

  const setRefreshCookie = (refreshToken: string, refreshExpires: string) => {
    Cookies.set(AuthWebStorageEnums.JWT_REFRESH, refreshToken, { expires: new Date(refreshExpires) });
  };

  const setInactivityCookie = (inactivityToken: string, inactivityExpires: string) => {
    Cookies.set(AuthWebStorageEnums.JWT_INACTIVITY, inactivityToken, { expires: new Date(inactivityExpires) });
  };

  const setToken = (token: string, expires: number) => {
    setCookieWithMaxAge(AuthWebStorageEnums.JWT, token, expires);
  };

  const get = () => {
    return Cookies.get(AuthWebStorageEnums.JWT);
  };

  const getInactivity = () => {
    return Cookies.get(AuthWebStorageEnums.JWT_INACTIVITY);
  };

  const isTokenActive = () => {
    return !!get() || !!getRefresh();
  };

  const getDecoded = () => {
    const token = get();
    return !!token ? (decodeToken(token) as any) : 0;
  };

  const getRefresh = () => {
    return Cookies.get(AuthWebStorageEnums.JWT_REFRESH);
  };

  const getHeader = () => {
    return 'Bearer ' + get();
  };

  const remove = () => {
    Cookies.remove(AuthWebStorageEnums.JWT);
    Cookies.remove(AuthWebStorageEnums.JWT_REFRESH);
    Cookies.remove(AuthWebStorageEnums.JWT_INACTIVITY);
    localStorage.removeItem(AuthWebStorageEnums.INACTIVITY_TOKEN_LIFE);
    localStorage.removeItem(AuthWebStorageEnums.REFRESH_TOKEN_LIFE);
    localStorage.removeItem(AuthWebStorageEnums.TOKEN_EXPIRE_AT);
  };

  const sessionTime = () => {
    const decodedToken = getDecoded();
    if (decodedToken && decodedToken?.iat > 0) {
      return decodedToken?.exp - decodedToken?.iat;
    }
    return decodedToken.exp;
  };

  return {
    setInitialCookies,
    setToken,
    get,
    getDecoded,
    getRefresh,
    getHeader,
    remove,
    sessionTime,
    isTokenActive,
    setRefreshCookie,
    setInactivityCookie,
    getInactivity,
  };
}

export default useJwt;
