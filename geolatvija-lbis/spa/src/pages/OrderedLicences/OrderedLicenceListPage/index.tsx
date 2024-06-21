import React from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { StyledPage } from 'styles/layout/table';
import {Button, Input, InputNumber, Radio, Select, SelectOption, Table} from 'ui';
import { pages } from 'constants/pages';
import Filter from '../../../components/Filter';
import { Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import useQueryApiClient from "../../../utils/useQueryApiClient";
import FileDownload from "js-file-download";

const OrderedLicenceListPage = () => {
  const [filter, setFilter] = useState({});
  const intl = useIntl();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const columns = [
    {
      title: intl.formatMessage({ id: 'ordered_licences.num' }),
      dataIndex: 'id',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'ordered_licences.geoproduct_name' }),
      dataIndex: 'geoProductName',
      render: (value: string, record: any) => (
        <span onClick={() => navigate(`/main?geoProductId=${record.geoProductId}`)}>{value}</span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'ordered_licences.type' }),
      render: (record: any) =>
        record.geoProductServiceId
          ? intl.formatMessage({ id: 'order.service' })
          : intl.formatMessage({ id: 'order.file' }),
    },
    {
      title: intl.formatMessage({ id: 'ordered_licences.status' }),
      dataIndex: 'orderStatusClassifier',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'ordered_licences.data_user' }),
      dataIndex: 'institutionName',
      render: (value: string, record: any) => value || record.name + ' ' + record.surname + ' ' + record.personalCode,
    },
    {
      title: intl.formatMessage({ id: 'ordered_licences.licence_type' }),
      dataIndex: 'licenseType',
      render: (value: string) => {
        switch (value) {
          case 'OPEN':
            return intl.formatMessage({ id: 'geoproducts.open_data' });
          case 'PREDEFINED':
            return intl.formatMessage({ id: 'geoproducts.predefined_license' });
          case 'OTHER':
            return intl.formatMessage({ id: 'geoproducts.other_license' });
          case 'NONE':
            return intl.formatMessage({ id: 'geoproducts.no_license' });
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'ordered_licences.target' }),
      dataIndex: 'target',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'ordered_licences.licence_status' }),
      dataIndex: 'confirmedRules',
      render: (value: boolean) =>
        intl.formatMessage({ id: value ? 'ordered_licences.accept' : 'ordered_licences.reject' }),
    },
    {
      title: intl.formatMessage({ id: 'ordered_licences.licence' }),
      dataIndex: 'todo',
      render: (_: string, record: any) => (record.displayName ?
          <Button
            type="primary"
            label={intl.formatMessage({id: 'general.download'})}
            onClick={() => appendData([], {id: record.id}, record.displayName)}
          />
          : null
      )
    },
  ];

  const { appendData } = useQueryApiClient({
    request: {
      url: `/api/v1/ordered-licences/:id/download`,
      method: 'GET',
      multipart: true,
      disableOnMount: true,
    },
    onSuccess: (response, fileName) => {
      FileDownload(response, fileName);
    },
  });


  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: pages.orderedLicences.title })}
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
                <Select label={intl.formatMessage({ id: 'ordered_licences.licence_status' })} name="confirmedRules">
                  <SelectOption value={1}>{intl.formatMessage({ id: 'general.active' })}</SelectOption>
                  <SelectOption value={0}>{intl.formatMessage({ id: 'general.inactive' })}</SelectOption>
                </Select>
                <InputNumber name="num" label={intl.formatMessage({ id: 'ordered_licences.num' })} />
              </>
            }
            setFilter={setFilter}
          />
          <Table url="/api/v1/ordered-licences" columns={columns} filter={filter} />
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default OrderedLicenceListPage;
