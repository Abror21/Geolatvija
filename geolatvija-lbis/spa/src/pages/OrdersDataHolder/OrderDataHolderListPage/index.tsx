import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { StyledPage } from 'styles/layout/table';
import { DatePicker, Input, InputNumber, Select, SelectOption, Table, TabPane, Tabs } from 'ui';
import { pages } from 'constants/pages';
import dayjs from 'dayjs';
import Filter from '../../../components/Filter';
import { Form } from 'antd';
import { ClassifierSelect } from '../../../components/Selects';
import useQueryApiClient from '../../../utils/useQueryApiClient';

interface geoProductData {
  id: number;
  name: string;
}

const OrderDataHolderListPage = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filter, setFilter] = useState<any>({});

  const intl = useIntl();
  const [form] = Form.useForm();

  const { data } = useQueryApiClient({
    request: {
      url: `api/v1/geoproducts/geoproducts-by-user`,
    },
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'order_data_holder.num' }),
      dataIndex: 'id',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'order_data_holder.order_date' }),
      dataIndex: 'createdAt',
      render: (value: string) => value && dayjs(value).format('DD.MM.YYYY'),
    },
    {
      title: intl.formatMessage({ id: 'order_data_holder.geoproduct_title' }),
      dataIndex: 'geoProductName',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'order_data_holder.data_type' }),
      dataIndex: 'dataType',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'order_data_holder.amount_with_pvn' }),
      dataIndex: 'paymentAmount',
      render: (value: string) => (value ? value + ' EUR' : 0 + ' EUR'),
    },
    {
      title: intl.formatMessage({ id: 'order_data_holder.order_status' }),
      dataIndex: 'orderStatusClassifier',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'order_data_holder.payment_status' }),
      dataIndex: 'paymentStatus',
      render: (value: string) => {
        switch (value) {
          case 'P':
            return intl.formatMessage({ id: 'order.payment_status_P' });
          case 'E':
            return intl.formatMessage({ id: 'order.payment_status_E' });
          case 'R':
            return intl.formatMessage({ id: 'order.payment_status_R' });
          default:
            return null;
        }
      },
    },
  ];

  const onTabChange = (activeKey: string) => {
    setActiveTab(activeKey);

    let innerFilter = filter;

    switch (activeKey) {
      case 'order-in-progress':
        filter.status = 'DRAFT';
        break;
      case 'all':
        filter.status = null;
        break;
      case 'available-for-users':
        filter.status = 'ACTIVE';
        break;
      case 'finished':
        filter.status = ['DONE', 'ACTIVE', 'INACTIVE', 'CANCELLED', 'ONHOLD'];
        break;
    }

    setFilter(innerFilter);
    //todo add filter
  };

  function removeDuplicates(arr: string[]) {
    let unique: string[] = [];

    arr.forEach((element) => {
      if (!unique.includes(element)) {
        unique.push(element);
      }
    });

    return unique;
  }

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: pages.ordersDataHolder.title })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
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
                  name="statusClassifierValueId"
                  label={intl.formatMessage({ id: 'order_data_holder.order_status' })}
                  defaultValue={intl.formatMessage({ id: 'order_data_holder.all' })}
                />
                <DatePicker name="orderFrom" label={intl.formatMessage({ id: 'order_data_holder.order_from' })} />
                <DatePicker name="orderTo" label={intl.formatMessage({ id: 'order_data_holder.order_to' })} />
                <InputNumber name="id" label={intl.formatMessage({ id: 'order_data_holder.num' })} />
                <Select name="geoProductId" label={intl.formatMessage({ id: 'order_data_holder.geoproduct_title' })}>
                  {data.map((data: geoProductData) => (
                    <SelectOption key={data.id} value={data.id}>
                      {data.name}
                    </SelectOption>
                  ))}
                </Select>
                <Select
                  label={intl.formatMessage({ id: 'order_data_holder.licence_type' })}
                  name="licenseType"
                  defaultValue={intl.formatMessage({ id: 'order_data_holder.all' })}
                >
                  <SelectOption value={'OPEN'}>{intl.formatMessage({ id: 'licence_management.OPEN' })}</SelectOption>
                  <SelectOption value={'PREDEFINED'}>
                    {intl.formatMessage({ id: 'licence_management.PREDEFINED' })}
                  </SelectOption>
                  <SelectOption value={'OTHER'}>{intl.formatMessage({ id: 'licence_management.OTHERS' })}</SelectOption>
                </Select>
                <Select label={intl.formatMessage({ id: 'order_data_holder.data_type' })} name="dataType">
                  <SelectOption value={'other'}>{intl.formatMessage({ id: 'geoproducts.other' })}</SelectOption>
                  <SelectOption value={'file'}>{intl.formatMessage({ id: 'geoproducts.file' })}</SelectOption>
                  <SelectOption value={'service'}>{intl.formatMessage({ id: 'geoproducts.service' })}</SelectOption>
                </Select>
                <Input
                  name="nameSurname"
                  label={intl.formatMessage({ id: 'order_data_holder.data_holder_name_surname' })}
                />
                <Input
                  name="personalCode"
                  label={intl.formatMessage({ id: 'order_data_holder.data_holder_personal_code' })}
                />
              </>
            }
            setFilter={setFilter}
          />
          <Tabs type="card" onChange={onTabChange} activeKey={activeTab}>
            <TabPane
              tab={intl.formatMessage({
                id: 'order_data_holder.all',
              })}
              key="all"
            >
              <Table
                url="/api/v1/orders-data-holder"
                columns={columns}
                linkProps={{ url: pages.ordersDataHolder.edit.url }}
                filter={filter}
              />
            </TabPane>
            <TabPane
              tab={intl.formatMessage({
                id: 'order_data_holder.order_in_progress',
              })}
              key="order-in-progress"
            >
              <Table
                url="/api/v1/orders-data-holder"
                columns={columns}
                linkProps={{ url: pages.ordersDataHolder.edit.url }}
                filter={filter}
              />
            </TabPane>
            <TabPane
              tab={intl.formatMessage({
                id: 'order_data_holder.available_for_users',
              })}
              key="available-for-users"
            >
              <Table
                url="/api/v1/orders-data-holder"
                columns={columns}
                linkProps={{ url: pages.ordersDataHolder.edit.url }}
                filter={filter}
              />
            </TabPane>
            <TabPane
              tab={intl.formatMessage({
                id: 'order_data_holder.finished',
              })}
              key="finished"
            >
              <Table
                url="/api/v1/orders-data-holder"
                columns={columns}
                linkProps={{ url: pages.ordersDataHolder.edit.url }}
                filter={filter}
              />
            </TabPane>
          </Tabs>
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default OrderDataHolderListPage;
