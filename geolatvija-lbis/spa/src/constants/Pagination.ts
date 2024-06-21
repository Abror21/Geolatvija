interface PaginationProps {
  pageSize: number;
  page: number;
  pageSizeOptions: string[];
}

export const Pagination: PaginationProps = {
  pageSize: 10,
  page: 1,
  pageSizeOptions: ['10', '20', '50', '100'],
};
