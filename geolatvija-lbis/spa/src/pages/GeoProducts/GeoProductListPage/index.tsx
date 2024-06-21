import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { Table, Button, Input, Switch, Popover, Icon, Modal, DatePicker, Select, SelectOption } from 'ui';
import { useIntl, FormattedMessage } from 'react-intl';
import { StyledPage, ButtonList } from 'styles/layout/table';
import { Form, Row } from 'antd';
import Filter from 'components/Filter';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import dayjs, { Dayjs } from 'dayjs';
import DeleteModal from 'components/Modals/DeleteModal';
import UserInstitutionSelect from 'components/Selects/UserInstitutionSelect';
import { ButtonListModal } from 'styles/layout/form';
import { useUserState } from '../../../contexts/UserContext';
import { Ellipsis } from './styles';

interface GeoProductProps {
  id: number;
  publicFrom: string;
  publicTo: string;
  status: 'DRAFT' | 'PLANNED' | 'PUBLIC';
  fileTypes: string;
  geoProductOthersCount: number;
  geoProductNonesCount: number;
  geoProductServicesCount: number;
  geoProductFilesCount: number;
}

interface GeoProductFilterProps {
  name?: string;
  isInspired?: boolean;
  organizationClassifierValueId?: string;
  ownerInstitutionClassifierId?: number[];
}

const GeoProductListPage = () => {
  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const owner =
    activeRole?.code !== 'admin' && activeRole?.institutionClassifierId ? [activeRole?.institutionClassifierId] : [];

  const [filter, setFilter] = useState<GeoProductFilterProps>({ ownerInstitutionClassifierId: owner });
  const [reload, setReload] = useState<number>(0);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPublicModal, setShowPublishModal] = useState<boolean>(false);

  const { appendData: appendDataPublish } = useQueryApiClient({
    request: {
      url: `api/v1/geoproducts/:id/publish`,
      method: 'POST',
    },
    onSuccess: () => setReload((old) => old + 1),
  });

  const { appendData: appendDataUnpublish } = useQueryApiClient({
    request: {
      url: `api/v1/geoproducts/:id/unpublish`,
      method: 'POST',
    },
    onSuccess: () => setReload((old) => old + 1),
  });

  const { appendData: appendDataCopy } = useQueryApiClient({
    request: {
      url: `api/v1/geoproducts/:id/copy`,
      method: 'POST',
    },
    onSuccess: () => setReload((old) => old + 1),
  });

  const intl = useIntl();
  const [form] = Form.useForm();
  const [publishForm] = Form.useForm();

  const columns = [
    {
      title: intl.formatMessage({ id: 'geoproducts.name' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'geoproducts.geoproduct_type' }),
      dataIndex: 'serviceTypes',
      render: (_: string, record: GeoProductProps) =>
        removeDuplicates([
          record.geoProductServicesCount ? intl.formatMessage({ id: 'geoproducts.service' }) : '',
          record.geoProductFilesCount ? intl.formatMessage({ id: 'geoproducts.file' }) : '',
          record.geoProductOthersCount ? intl.formatMessage({ id: 'geoproducts.other' }) : '',
          record.geoProductNonesCount ? intl.formatMessage({ id: 'geoproducts.none' }) : '',
        ])
          .filter((e) => !!e)
          .join(', '),
    },
    {
      title: intl.formatMessage({ id: 'geoproducts.status' }),
      dataIndex: 'status',
      sorter: true,
      render: (value: string) => intl.formatMessage({ id: 'geoproducts.' + value }),
    },
    {
      title: intl.formatMessage({ id: 'geoproducts.public_period' }),
      render: (record: GeoProductProps) => {
        let result = record.publicFrom && dayjs(record.publicFrom).format('DD.MM.YYYY');

        if (record.publicFrom && record.publicTo) {
          result = result + ' - ' + dayjs(record.publicTo).format('DD.MM.YYYY');
        } else if (result) {
          result = result + ' - ...';
        }

        return result;
      },
    },
    {
      render: (text: string, record: GeoProductProps) => (
        <Popover
          content={
            <>
              {record.status === 'DRAFT' && (
                <div className="popover-item" onClick={() => onPublishOpen(record.id)}>
                  <FormattedMessage id="geoproducts.publish" />
                </div>
              )}
              {record.status !== 'DRAFT' && (
                <div className="popover-item" onClick={() => appendDataUnpublish([], { id: record.id })}>
                  <FormattedMessage id="geoproducts.republish" />
                </div>
              )}
              <div className="popover-item" onClick={() => appendDataCopy([], { id: record.id })}>
                <FormattedMessage id="general.copy" />
              </div>
            </>
          }
          trigger="click"
          placement="bottom"
        >
          <Ellipsis>
            <Icon faBase="fal" icon="ellipsis-v" />
          </Ellipsis>
        </Popover>
      ),
    },
  ];

  function removeDuplicates(arr: string[]) {
    let unique: string[] = [];

    arr.forEach((element) => {
      if (!unique.includes(element)) {
        unique.push(element);
      }
    });

    return unique;
  }

  const rowSelection = {
    getCheckboxProps: (record: GeoProductProps) => ({
      // Disable selection for rows with specific conditions
      disabled: record.status != 'DRAFT',
    }),
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedKeys && setSelectedKeys(selectedRowKeys);
    },
  };

  const onPublishOpen = (id: number) => {
    setShowPublishModal(true);

    publishForm.setFieldValue('id', id);
  };

  const onPublishFinish = () => {
    const values = publishForm.getFieldsValue(true);

    appendDataPublish(values, { id: values.id });
    setShowPublishModal(false);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: 'navigation.geoproducts' })}
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
                <Input name="name" label={intl.formatMessage({ id: 'geoproducts.name' })} />
                <UserInstitutionSelect
                  name="ownerInstitutionClassifierId"
                  label={intl.formatMessage({ id: 'geoproducts.data_holder' })}
                  type="LIMITED"
                  mode="multiple"
                  initialValue={
                    activeRole?.code !== 'admin' && activeRole?.institutionClassifierId
                      ? [activeRole?.institutionClassifierId]
                      : []
                  }
                  disabled={activeRole?.code !== 'admin'}
                />
                <Switch name="isInspired" label={intl.formatMessage({ id: 'geoproducts.inspire_data' })} />
                <Select
                  label={intl.formatMessage({ id: 'geoproducts.data_type_of_distribution' })}
                  name="div"
                  mode="multiple"
                >
                  <SelectOption value={'service'}>{intl.formatMessage({ id: 'geoproducts.service' })}</SelectOption>
                  <SelectOption value={'file'}>{intl.formatMessage({ id: 'geoproducts.file' })}</SelectOption>
                  <SelectOption value={'other'}>{intl.formatMessage({ id: 'geoproducts.other' })}</SelectOption>
                  <SelectOption value={'none'}>{intl.formatMessage({ id: 'geoproducts.none' })}</SelectOption>
                </Select>
              </>
            }
            setFilter={setFilter}
          />

          <div className="theme-container">
            <Table
              url="/api/v1/geoproducts"
              columns={columns}
              filter={filter}
              enableSelectedRow
              linkProps={{ url: pages.geoproduct.edit.url }}
              reload={reload}
              setSelectedKeys={setSelectedKeys}
              rowSelectionFunction={rowSelection}
              tableActions={
                <ButtonList>
                  <Button
                    label={intl.formatMessage({ id: 'general.delete_chosen' })}
                    onClick={() => setShowDeleteModal(true)}
                    disabled={!selectedKeys.length}
                  />
                  <Button
                    type="primary"
                    label={intl.formatMessage({ id: 'general.add_new' })}
                    href={pages.geoproduct.create.url}
                  />
                </ButtonList>
              }
            />
          </div>
        </StyledPage>

        <DeleteModal
          setRefresh={setReload}
          url="api/v1/geoproducts"
          params={{ ids: selectedKeys }}
          setShowModal={setShowDeleteModal}
          showModal={showDeleteModal}
        />

        <Modal
          open={showPublicModal}
          footer={null}
          onCancel={() => setShowPublishModal(true)}
          title={intl.formatMessage({ id: 'geoproducts.publish_geoproduct' })}
        >
          <Form form={publishForm} onFinish={onPublishFinish} layout="vertical">
            <DatePicker
              label={intl.formatMessage({ id: 'geoproducts.date_from' })}
              name="publicFrom"
              disabledDate={(date: Dayjs) => date < dayjs().subtract(1, 'day')}
            />
            <DatePicker label={intl.formatMessage({ id: 'geoproducts.date_to' })} name="publicTo" />

            <Row justify="end">
              <ButtonListModal>
                <Button
                  label={intl.formatMessage({
                    id: 'general.cancel',
                  })}
                  onClick={() => setShowPublishModal(false)}
                />
                <Button
                  type="primary"
                  label={intl.formatMessage({
                    id: 'general.publish',
                  })}
                  htmlType="submit"
                />
              </ButtonListModal>
            </Row>
          </Form>
        </Modal>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default GeoProductListPage;
