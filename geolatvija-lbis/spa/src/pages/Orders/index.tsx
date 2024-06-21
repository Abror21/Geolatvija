import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Table, Input, DatePicker, Button, Tabs, TabPane } from 'ui';
import { FormattedMessage, useIntl } from 'react-intl';
import { StyledPage } from 'styles/layout/table';
import { Form } from 'antd';
import Filter from 'components/Filter';
import dayjs from 'dayjs';
import { StyledOrders } from './styles';
import { useNavigate } from 'react-router-dom';
import useQueryApiClient from '../../utils/useQueryApiClient';
import FileDownload from 'js-file-download';
import { ClassifierSelect } from '../../components/Selects';
import { ViewOrderDetailsModal } from '../../components/Modals/ViewOrderDetailsModal';
import toastMessage from '../../utils/toastMessage';

export enum GeoProductTableType {
  ordered = 'ordered',
  confirmed = 'confirmed',
}

interface GeoProductFilterProps {
  table?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  num?: string;
  geoproduct?: string;
  organizationClassifierValueId?: string;
}

const OrdersPage = () => {
  const [filter, setFilter] = useState<GeoProductFilterProps>({ table: GeoProductTableType.ordered });
  const [selectedOrder, setSelectedOrder] = useState<any>({});
  const [showInformationModal, setShowInformationModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(GeoProductTableType.ordered);

  const intl = useIntl();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { appendData } = useQueryApiClient({
    request: {
      url: `/api/v1/geoproduct-orders/:id/download`,
      method: 'GET',
      multipart: true,
      disableOnMount: true,
    },
    onSuccess: (response) => {
      FileDownload(response, 'order.zip');
    },
  });

  const onCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    toastMessage.success(intl.formatMessage({ id: 'url_copied' }));
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'order.nr' }),
      dataIndex: 'id',
      render: (value: string, record: any) => (
        <div className={record.status !== 'ACTIVE' ? 'geoproducts-disabled' : ''}> {value} </div>
      ),
    },
    {
      title:
        activeTab === GeoProductTableType.confirmed
          ? intl.formatMessage({ id: 'order.confirmed.date' })
          : intl.formatMessage({ id: 'order.date' }),
      dataIndex: activeTab === GeoProductTableType.confirmed ? 'confirmedDate' : 'createdAt',
      render: (value: string, record: any) => (
        <div className={record.status !== 'ACTIVE' ? 'geoproducts-disabled' : ''}>
          {' '}
          {!!value && dayjs(value).format('DD.MM.YYYY HH:mm')}{' '}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'order.date_till' }),
      dataIndex: 'expireAt',
      render: (value: string, record: any) => (
        <div className={record.status !== 'ACTIVE' ? 'geoproducts-disabled' : ''}>
          {' '}
          {(!!value || !!record.filesAvailability) &&
            dayjs(!!record.geoProductServiceId ? value : record.filesAvailability).format('DD.MM.YYYY HH:mm')}{' '}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'geoproducts.name' }),
      dataIndex: 'geoProductName',
      render: (value: string, record: any) => (
        <div
          onClick={() => window.open(`/main?geoProductId=${record.geoProductId}`, '_blank')}
          className={`${record.status !== 'ACTIVE' ? 'geoproducts-disabled' : 'geoproducts-name'} geoproduct-name`}
        >
          {' '}
          {value}
        </div>
      ),
    },
    {
      title:
        activeTab === GeoProductTableType.confirmed
          ? intl.formatMessage({ id: 'order.confirmed.status' })
          : intl.formatMessage({ id: 'order.status' }),
      dataIndex: 'orderStatusClassifier',
      render: (value: string, record: any) => (
        <div className={record.status !== 'ACTIVE' ? 'geoproducts-disabled' : ''}> {value} </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'order.payment_status' }),
      dataIndex: 'paymentStatus',
      render: (value: string, record: any) => {
        return (
          <div className={record.status !== 'ACTIVE' ? 'geoproducts-disabled' : ''}>
            {' '}
            {value ? <FormattedMessage id={'order.payment_status_' + value} /> : null}{' '}
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'order.payment' }),
      dataIndex: 'paymentAmount',
      render: (value: string, record: any) => (
        <div className={record.status !== 'ACTIVE' ? 'geoproducts-disabled' : ''}>
          {' '}
          {!!value && record?.paymentType !== 'FREE' && value + ' EUR'}{' '}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'order.information_about_order' }),
      dataIndex: 'id',
      render: (value: number, record: any) => (
        <Button
          type="primary"
          label={intl.formatMessage({ id: 'general.see' })}
          onClick={() => {
            setShowInformationModal(true);
            setSelectedOrder(record);
          }}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'order.type' }),
      render: (value: string, record: any) => {
        return (
          <div className={record.status !== 'ACTIVE' ? 'geoproducts-disabled' : ''}>
            {' '}
            {record.geoProductServiceId
              ? intl.formatMessage({ id: 'order.service' })
              : intl.formatMessage({ id: 'order.file' })}{' '}
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'order.url' }),
      dataIndex: 'serviceLink',
      className: 'ellipse',
      render: (value: string, record: any) => (
        <div className={record.status !== 'ACTIVE' ? 'geoproducts-disabled' : ''}> {value} </div>
      ),
    },
    {
      dataIndex: 'id',
      render: (_: string, record: any) =>
        record?.serviceLimitationType?.includes('ONLY_GEOPORTAL') ? (
          <Button
            disabled={record.status !== 'ACTIVE'}
            type="primary"
            label={intl.formatMessage({ id: 'general.open' })}
            onClick={() => navigate(`/main?geoproduct=open&geoProductId=${record.geoProductId}`)}
          />
        ) : record.geoProductServiceId ? (
          <Button
            disabled={record.status !== 'ACTIVE'}
            type="primary"
            label={intl.formatMessage({ id: 'general.copy' })}
            onClick={() => onCopy(record.dppsLink)}
          />
        ) : (
          <Button
            disabled={record.status !== 'ACTIVE' || dayjs(record.filesAvailability).isBefore(dayjs())}
            type="primary"
            label={intl.formatMessage({ id: 'general.download' })}
            onClick={() => appendData([], { id: record.id })}
          />
        ),
    },
  ];

  const handleTabChange = (tab: string) => {
    setFilter({ ...filter, table: tab });
    setActiveTab(tab);
  };

  const getRowClassName = (record: any, index: number) => {
    if (record.status === 'INACTIVE' || record.status === 'DRAFT') {
      return 'disable-row';
    }

    return '';
  };

  return (
    <StyledOrders>
      <DefaultLayout.PageLayout>
        <DefaultLayout.PageContent>
          <StyledPage>
            <DefaultLayout.PageHeader
              title={intl.formatMessage({ id: 'profile.my_orders' })}
              breadcrumb={[
                {
                  path: '/',
                  name: intl.formatMessage({ id: 'general.start' }),
                },
              ]}
            />
            <Filter
              form={form}
              filter={
                <>
                  <ClassifierSelect
                    allowClear
                    code="KL19"
                    name="status"
                    label={intl.formatMessage({ id: 'order_data_holder.order_status' })}
                    defaultValue={intl.formatMessage({ id: 'order_data_holder.all' })}
                  />
                  <DatePicker
                    size="large"
                    label={
                      activeTab === GeoProductTableType.ordered
                        ? intl.formatMessage({ id: 'order.date_from' })
                        : intl.formatMessage({ id: 'order.confirmed.date_from' })
                    }
                    name="dateFrom"
                    placeholder=""
                  />
                  <DatePicker
                    size="large"
                    label={
                      activeTab === GeoProductTableType.ordered
                        ? intl.formatMessage({ id: 'order.date_to' })
                        : intl.formatMessage({ id: 'order.confirmed.date_to' })
                    }
                    name="dateTo"
                    placeholder=""
                  />
                  <Input
                    name="num"
                    label={
                      activeTab === GeoProductTableType.ordered
                        ? intl.formatMessage({ id: 'order.num' })
                        : intl.formatMessage({ id: 'order.confirmed.num' })
                    }
                  />
                  <Input name="geoproduct" label={intl.formatMessage({ id: 'geoproducts.geoproduct' })} />
                </>
              }
              setFilter={(value) => setFilter({ ...value, table: activeTab })}
            />
            <Tabs onChange={(tab: string) => handleTabChange(tab)} type="card">
              <TabPane
                tab={intl.formatMessage({
                  id: 'order.ordered',
                })}
                key={GeoProductTableType.ordered}
              >
                {activeTab === GeoProductTableType.ordered && (
                  <div className="theme-container">
                    <Table
                      rowClassName={(record: any, index: number) => getRowClassName(record, index)}
                      url="/api/v1/geoproduct-orders"
                      columns={columns}
                      filter={filter}
                    />
                  </div>
                )}
              </TabPane>

              <TabPane
                tab={intl.formatMessage({
                  id: 'order.confirmed',
                })}
                key={GeoProductTableType.confirmed}
              >
                {activeTab === GeoProductTableType.confirmed && (
                  <div className="theme-container">
                    <Table
                      url="/api/v1/geoproduct-orders"
                      rowClassName={(record: any, index: number) => getRowClassName(record, index)}
                      columns={columns.filter((el: any) => el.dataIndex !== 'paymentStatus')}
                      filter={filter}
                    />
                  </div>
                )}
              </TabPane>
            </Tabs>
          </StyledPage>
        </DefaultLayout.PageContent>
      </DefaultLayout.PageLayout>
      <ViewOrderDetailsModal
        selectedOrder={selectedOrder}
        showInformationModal={showInformationModal}
        setShowInformationModal={setShowInformationModal}
        activeTab={activeTab}
      />
    </StyledOrders>
  );
};
export default OrdersPage;
