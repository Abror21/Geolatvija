import React, { useEffect, useState } from 'react';
import { ColumnsType, TableLocale } from 'antd/lib/table/interface';
import { Pagination } from 'constants/Pagination';
import { ClassName, Disabled, Name } from 'interfaces/shared';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { StyledTable } from './style';
import useQueryApiClient from 'utils/useQueryApiClient';
import { FilterValue, Key, SortOrder, TablePaginationConfig, TableRowSelection } from 'antd/es/table/interface';
import { RowClassName } from 'rc-table/lib/interface';
import { AnyObject } from 'antd/es/_util/type';

type TypeType = 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';

export interface TableProps extends Disabled, ClassName, Name {
  locale?: TableLocale;
  loading?: boolean;
  rowKey?: string;
  saveData?: any;
  columns: ColumnsType<any>;
  dataSource?: object[];
  size?: 'small' | 'large' | 'middle';
  rowClassName?: string | RowClassName<AnyObject> | undefined;
  onRow?: any;
  onChange?: any;
  disablePagination?: boolean;
  components?: any;
  scroll?: any;
  linkProps?: {
    url: string;
    recordKey?: string;
  };
  url?: string;
  filter?: object;
  defaultSort?: string;
  defaultOrder?: 'asc' | 'desc';
  enableSelectedRow?: boolean;
  reload?: number;
  setSelectedRows?: any;
  setSelectedKeys?: any;
  rowSelectionFunction?: TableRowSelection<any>;
  tableActions?: React.ReactNode;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex?: string;
  record: any;
  className: string;
  colSpan?: number;
}

interface SorterResult {
  order?: SortOrder;
  field?: string;
  columnKey?: Key;
}

export const Table = ({
  locale,
  loading,
  rowKey = 'id',
  columns,
  dataSource,
  size,
  rowClassName,
  saveData,
  onRow,
  onChange,
  disablePagination,
  components,
  scroll,
  linkProps,
  url,
  filter,
  defaultSort,
  defaultOrder,
  enableSelectedRow,
  reload,
  setSelectedRows,
  setSelectedKeys,
  rowSelectionFunction,
  tableActions,
  className,
}: TableProps) => {
  const [innerData, setInnerData] = useState<any>(dataSource || []);
  const [currentPage, setCurrentPage] = useState<number | undefined>(Pagination.page);
  const [pageSize, setPageSize] = useState(Pagination.pageSize);
  const [sortBy, setSortBy] = useState<string | undefined>(defaultSort);
  const [orderBy, setOrderBy] = useState<string | undefined>(defaultOrder);
  const [localPagination, setLocalPagination] = useState<any>({
    showSizeChanger: false,
    showQuickJumper: false,
  });

  const intl = useIntl();

  useEffect(() => {
    setInnerData(dataSource);
  }, [dataSource]);

  // Update sort if it dynamically changes at parent level.
  useEffect(() => {
    setSortBy(defaultSort);
  }, [defaultSort]);

  // Update order by if it dynamically changes at parent level.
  useEffect(() => {
    setOrderBy(defaultOrder);
  }, [defaultOrder]);

  const { refetch, isLoading } = useQueryApiClient({
    request: {
      url: url || '',
      data: {
        page: currentPage,
        pageSize: pageSize,
        options: [],
        sortBy: sortBy,
        orderBy: orderBy,
        filter: filter,
      },
      disableOnMount: true,
    },
    onSuccess: (response) => {
      setInnerData(response.data);
      saveData?.(response.data);
      setCurrentPage(response.currentPage);
      setLocalPagination({
        ...localPagination,
        lastPage: response.lastPage,
        current: response.currentPage,
        total: response.total,
      });

      if (currentPage !== 1 && response.data.length === 0) {
        setCurrentPage((old) => (old ? old - 1 : 1));
      }
    },
  });

  useEffect(() => {
    if (url) {
      refetch();
    }
  }, [pageSize, sortBy, currentPage, orderBy, filter, reload]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!locale) {
    locale = {
      emptyText: intl.formatMessage({ id: 'general.found_no_data' }),
      filterConfirm: intl.formatMessage({ id: 'general.filter' }),
      filterReset: intl.formatMessage({ id: 'general.clear' }),
    };
  }

  function itemRender(current: number, type: TypeType, originalElement: React.ReactElement<HTMLElement>) {
    if (type === 'prev') {
      return <div className="pagination-left-button">{intl.formatMessage({ id: 'general.previous' })}</div>;
    }

    if (type === 'next') {
      return <div className="pagination-right-button">{intl.formatMessage({ id: 'general.next' })}</div>;
    }

    return originalElement;
  }

  const pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: Pagination.pageSizeOptions,
    defaultPageSize: Pagination.pageSize,
    itemRender: itemRender,
  };

  const element = document.getElementsByClassName('anticon anticon-down ant-select-suffix');

  element[0]?.classList?.add('far');
  element[0]?.classList?.add('fa-angle-down');
  element[0]?.classList?.remove('anticon');
  element[0]?.classList?.remove('anticon-down');
  element[0]?.classList?.remove('ant-select-suffix');

  const EditableCell: React.FC<EditableCellProps> = ({ record, children, className, ...rest }) => {
    // actions dont have link
    if (rest.dataIndex === 'id' || rest.dataIndex === undefined) {
      return (
        <td className={className} colSpan={rest.colSpan}>
          {children}
        </td>
      );
    }

    let parsedProps = {
      url: linkProps?.url,
      recordKey: linkProps?.recordKey,
    };

    //default key is id
    if (!parsedProps?.recordKey) {
      parsedProps.recordKey = 'id';
    }

    // for data not found
    if (rest.colSpan) {
      parsedProps.url = undefined;
    }

    if (!linkProps?.url) {
      return (
        <td className={className} colSpan={rest.colSpan}>
          {children}
        </td>
      );
    }

    return (
      <td className={className + ' history-clickable'} colSpan={rest.colSpan}>
        <Link to={linkProps.url.replace(':id', record?.[parsedProps.recordKey] || 'undefined')}>{children}</Link>
      </td>
    );
  };

  const parsedColumns = columns.map((col: any) => {
    if (components) {
      return { ...col };
    }

    return {
      ...col,
      onCell: (record: object) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });

  const onTableChange = async (
    { current, pageSize }: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    { field, order }: SorterResult
  ) => {
    setPageSize(pageSize || 10);

    if (!order) {
      field = field || '';
      order = order || null;
    }

    setCurrentPage(current || currentPage);
    !defaultOrder && setOrderBy(order === 'descend' ? 'desc' : 'asc');
    !defaultSort && setSortBy(field);
  };

  const rowSelection = {
    preserveSelectedRowKeys: false,
    onChange: (selectedRowKeys: React.Key[], selectedRows: object) => {
      setSelectedRows && setSelectedRows(selectedRows);
      setSelectedKeys && setSelectedKeys(selectedRowKeys);
    },
  };

  return (
    <>
      <div className={`actions-list-table ${tableActions ? 'mb-9' : ''}`}>
        <div className="right-side">{tableActions}</div>
      </div>
      <StyledTable
        locale={locale}
        className={className}
        loading={isLoading || loading}
        rowKey={rowKey}
        columns={parsedColumns}
        dataSource={innerData}
        size={size}
        pagination={!disablePagination && localPagination.total > 10 && { ...pagination, ...localPagination }}
        rowClassName={rowClassName}
        onRow={onRow}
        onChange={onChange || onTableChange}
        components={{
          body: {
            cell: EditableCell,
          },
          ...components,
        }}
        showSorterTooltip={false}
        scroll={scroll}
        rowSelection={enableSelectedRow ? rowSelectionFunction ?? rowSelection : undefined}
      />
    </>
  );
};
