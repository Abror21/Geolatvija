import React from 'react';
import type { PaginationProps } from 'antd';
import { StyledPagination } from './style';
import { useIntl } from 'react-intl';
import { Button } from 'ui/button';
import { routes } from 'config/config';

export const Pagination = ({
  current,
  pageSize,
  onChange,
  total,
  className,
  showSizeChanger = false,
}: PaginationProps) => {
  const intl = useIntl();
  const configPageSize = routes.geo.paginationPageSize;
 
  return (
    <StyledPagination
      current={current}
      pageSize={pageSize ? pageSize : configPageSize}
      onChange={onChange}
      total={total}
      className={className}
      showSizeChanger={showSizeChanger}
      prevIcon={<Button label={intl.formatMessage({ id: 'general.previous' })} />}
      nextIcon={<Button label={intl.formatMessage({ id: 'general.next' })} />}
    />
  );
};
