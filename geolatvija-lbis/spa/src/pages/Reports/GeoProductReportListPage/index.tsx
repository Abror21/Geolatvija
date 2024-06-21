import React, { useEffect, useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Table, Popover, Button } from 'ui';
import { useIntl } from 'react-intl';
import { StyledPage } from 'styles/layout/table';
import { Form } from 'antd';
import Filter from 'components/Filter';
import { pages } from 'constants/pages';
import dayjs from 'dayjs';
import GeoProductSelect from 'components/Selects/GeoProductSelect';
import UsersSelect from 'components/Selects/UsersSelect';
import UserInstitutionSelect from 'components/Selects/UserInstitutionSelect';
import useQueryApiClient from 'utils/useQueryApiClient';
import FileDownload from 'js-file-download';
import { useUserState } from '../../../contexts/UserContext';
import { RangePickerProps } from 'antd/es/date-picker';
import { StyledReportInfo } from './styles';
import CustomDatePicker from '../../../components/DateRangePicker/DateRangePicker';

interface GeoProductId {
  id: number;
  name: string;
  viewsCount: number;
}

const GeoProductReportListPage = () => {
  const [filter, setFilter] = useState<any>([]);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [products, setProducts] = useState<GeoProductId[] | []>([]);
  const [disabled, setDisabled] = useState(true);
  const [data, setData] = useState([]);
  const [reportInfo, setReportInfo] = useState(<div></div>);
  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const [columns, setColumns] = useState([]);

  const intl = useIntl();
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      columnBuilder();
    }
  }, [data]);

  useEffect(() => {
    if (filter.productId && filter.range) {
      viewCountRefetch();
    }
  }, [filter]);

  const { refetch } = useQueryApiClient({
    request: {
      url: '/api/v1/reports/export',
      data: { filter: { ...filter, ids: selectedKeys } },
      multipart: true,
      disableOnMount: true,
    },
    onSuccess: (response) => {
      FileDownload(response, generateTitle());
    },
  });

  const { refetch: viewCountRefetch } = useQueryApiClient({
    request: {
      url: '/api/v1/reports/view-count',
      data: { filter: { ...filter } },
      disableOnMount: true,
    },
    onSuccess: (response) => {
      buildReportInfo(response.viewsCount);
    },
  });

  const generateTitle = () => {
    let title;

    const product = products.filter((el: GeoProductId) => el.id === filter.productId)[0];

    const characterMap = {
      ē: 'e',
      ū: 'u',
      ī: 'i',
      ā: 'a',
      š: 's',
      ķ: 'k',
      ģ: 'g',
      ļ: 'l',
      ž: 'z',
      č: 'c',
      ņ: 'n',
    };

    function replaceCharacters(title: string) {
      let output = title;
      for (const [char, replacement] of Object.entries(characterMap)) {
        const regex = new RegExp(char, 'g'); // Create a regular expression to match all occurrences
        output = output.replace(regex, replacement);
      }
      return output;
    }

    title = replaceCharacters(product.name.replace('-', '')) + '_';

    title = title.replace(/ /g, '_');

    title += dayjs(filter.range?.start).format('DD_MM_YYYY') + '_-_' + dayjs(filter.range?.end).format('DD_MM_YYYY');

    return title + '.xlsx';
  };

  const handleExport = () => {
    if (filter.productId && filter.range) {
      refetch();
    }
  };
  const handleTouch = (e: any, al: any) => {
    const product = al.filter((el: any) => el.name[0] === 'productId');
    const dateRange = al.filter((el: any) => el.name[0] === 'range');

    const dateRangeStart = dateRange?.filter((el: any) => el?.name?.[1] === 'start')[0];
    const dateRangeEnd = dateRange?.filter((el: any) => el?.name?.[1] === 'end')[0];

    if (product[0]?.value && dateRangeStart?.value && dateRangeEnd?.value) {
      setDisabled(false);
    } else if (!product[0].value || !dateRangeStart?.value || !dateRangeEnd?.value) {
      setDisabled(true);
    }
  };

  const manualFieldsTouched = (value: boolean) => {
    if (!value) return;
    const values = form.getFieldsValue();

    const product = values?.productId;
    const dateRange = values?.range;

    if (product && dateRange?.start && dateRange?.end) {
      setDisabled(false);
    } else if (!product || !dateRange?.start || !dateRange?.end) {
      setDisabled(true);
    }
  };

  const handleFilterClear = () => {
    form.resetFields();
    setFilter({});
    setDisabled(true);
    setReportInfo(<div></div>);
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current >= dayjs().endOf('day');
  };

  const columnBuilder = () => {
    let parsedColumns: any = [];

    const columnKeys = [
      'licenceType',
      'distributionType',
      'distributionCode',
      'viewCount',
      'numberOfUses',
      'downloadCount',
      'fullName',
      'organization',
      'orderDate',
      'confirmedDate',
      'files',
      'filesCount',
      'paymentAmount',
      'orderNumber',
    ];

    if (data && data.length > 0) {
      Object.keys(data[0]).map((el: any) => {
        if (columnKeys.includes(el)) {
          if ('files' === el) {
            parsedColumns.push({
              title: intl.formatMessage({ id: 'geoproduct_reports.' + el }),
              dataIndex: el,
              render: (value: string) => {
                const files = value ? value.split(',') : null;

                if (files) {
                  const content = (
                    <>
                      {files.map((file: string) => {
                        return <div>{file}</div>;
                      })}
                    </>
                  );

                  // TODO add pointer
                  return (
                    <Popover
                      content={content}
                      title={intl.formatMessage({ id: 'geoproduct_reports.list_of_files' })}
                      trigger={'hover'}
                    >
                      <div>{files[0]} ...</div>
                    </Popover>
                  );
                } else {
                  return '-';
                }
              },
            });
          } else if (['orderDate', 'confirmedDate'].includes(el)) {
            parsedColumns.push({
              title: intl.formatMessage({ id: 'geoproduct_reports.' + el }),
              dataIndex: el,
              render: (value: string) => (value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-'),
            });
          } else if (['licenceType', 'distributionCode'].includes(el)) {
            parsedColumns.push({
              title: intl.formatMessage({ id: 'geoproduct_reports.' + el }),
              dataIndex: el,
              render: (value: string) => (value ? intl.formatMessage({ id: 'geoproduct_reports.' + value }) : '-'),
            });
          } else {
            parsedColumns.push({
              title: intl.formatMessage({ id: 'geoproduct_reports.' + el }),
              dataIndex: el,
              render: (value: string) => value || '-',
            });
          }
        }
      });
    }
    setColumns(parsedColumns);
  };

  const buildReportInfo = (count: number) => {
    const product = products.filter((el: GeoProductId) => el.id === filter.productId)[0];

    setReportInfo(
      <StyledReportInfo>
        <div className={'report-filter-info'}>
          {product.name} {filter.range?.start && dayjs(filter.range?.start).format('DD.MM.YYYY')} -{' '}
          {filter.range?.end && dayjs(filter.range?.end).format('DD.MM.YYYY')}, Skatījumu skaits {count}
        </div>
      </StyledReportInfo>
    );
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: pages.geoproductReports.title })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
            ]}
          />
          <Filter
            form={form}
            onFormTouch={handleTouch}
            disabled={disabled}
            leftSideActions={reportInfo}
            primaryLabel={intl.formatMessage({ id: 'geoproduct_reports.create_report' })}
            onDelete={handleFilterClear}
            additionalActions={
              <Button
                type="primary"
                disabled={disabled || !data.length}
                label={intl.formatMessage({ id: 'geoproduct_reports.export' })}
                onClick={() => handleExport()}
              />
            }
            filter={
              <>
                {activeRole?.institutionClassifierId && (
                  <UserInstitutionSelect
                    disabled={activeRole?.code !== 'admin'}
                    name="ownerInstitutionClassifierId"
                    label={intl.formatMessage({ id: 'geoproducts.data_holder' })}
                    type="LIMITED"
                    mode="multiple"
                    initialValue={activeRole?.code !== 'admin' ? activeRole?.institutionClassifierId : undefined}
                  />
                )}
                <GeoProductSelect validations={'required'} saveProducts={setProducts} name="productId" />
                <UserInstitutionSelect
                  name="organization"
                  label={intl.formatMessage({ id: 'geoproducts.organization_name' })}
                  type="LIMITED_BY_DT_ORDERS"
                  mode="multiple"
                />
                <CustomDatePicker
                  triggerFieldsTouched={manualFieldsTouched}
                  form={form}
                  validations={'required'}
                  name="range"
                  label={intl.formatMessage({ id: 'geoproduct_reports.range' })}
                />
                <UsersSelect mode="multiple" name="users" type="LIMITED_BY_DT_ORDERS" />
              </>
            }
            setFilter={setFilter}
          />
          {!!filter.productId && (
            <div className="theme-container">
              <Table
                url={disabled ? undefined : '/api/v1/reports'}
                rowKey={'uuid'}
                columns={columns}
                saveData={setData}
                filter={filter}
                setSelectedKeys={setSelectedKeys}
                enableSelectedRow
              />
            </div>
          )}
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default GeoProductReportListPage;
