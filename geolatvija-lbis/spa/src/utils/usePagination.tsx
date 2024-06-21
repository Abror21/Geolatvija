import { routes } from 'config/config';
import React, { useState } from 'react';

const usePagination = (data: any, current?: number | '' | null, customPageSize?: number) => {
  const configPageSize = customPageSize ? customPageSize : routes.geo.paginationPageSize;
  const itemsPerPage = configPageSize ? configPageSize : 6;
  const [currentPage, setCurrentPage] = useState<number>(current ? current : 1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  const paginatedData = Array.isArray(data) ? data.slice(startIndex, endIndex) : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    paginatedData,
    handlePageChange,
  };
};

export default usePagination;
