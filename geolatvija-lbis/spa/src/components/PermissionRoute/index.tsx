import React from 'react';
import { Navigate, Route, RouteProps } from 'react-router-dom';

const PermissionRoute = ({ path, element }: RouteProps) => {
  const exceptions = ['/403', '/404', '/500', '/'];

  if (typeof path === 'string' && !exceptions.includes(path)) {
    const isAllowedRoute = true; //menuItems.find((el: NavigationParentEntry) => path.includes(el.url)) || null;

    if (!isAllowedRoute) {
      if (path === '/login') {
        return <Route path="*" element={<Navigate to="/" replace />} />;
      }

      return <Route path="*" element={<Navigate to="/403" replace />} />;
    }
  }

  return <Route path={path} element={element} />;
};

export default PermissionRoute;
