import { Button, Tabs, TabPane, Label, Collapse, Spinner } from 'ui';
import { useIntl } from 'react-intl';
import { StyledPage } from 'styles/layout/table';
import DefaultLayout from '../../../components/DefaultLayout';
import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import useQueryApiClient from '../../../utils/useQueryApiClient';
import { useParams } from 'react-router-dom';
import { Collapse as AntdCollapse } from 'antd';
import { ButtonList } from '../../../styles/layout/tab';
import { extractPVN } from '../../../utils/extractPVN';

const OrderDataHolderEditPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>('orderSummary');
  const intl = useIntl();
  const { id } = useParams();
  const { Panel } = AntdCollapse;

  const initialState: { [key: string]: boolean } = {
    name: false,
    surname: false,
    personalCode: false,
    phone: false,
    email: false,
    ip_address: false,
    description: false,
  };

  const fileUsage = selectedOrder.fileUsage ? JSON.parse(selectedOrder.fileUsage) : null;
  const serviceUsage = selectedOrder.serviceUsage ? JSON.parse(selectedOrder.serviceUsage) : null;

  const isOnHold = selectedOrder.valueCode === 'ONHOLD' || selectedOrder.valueCode === 'DRAFT';

  const { refetch } = useQueryApiClient({
    request: {
      url: `api/v1/orders-data-holder/${id}`,
      data: [],
      method: 'GET',
    },
    onSuccess: (response) => {
      setSelectedOrder(response);
    },
  });

  const onTabChange = (activeKey: string) => {
    setActiveTab(activeKey);
  };

  const distributionDataType = {
    file: selectedOrder.geoProductFileId,
    other: selectedOrder.geoProductOtherId,
    service: selectedOrder.geoProductServiceId,
  };

  const distributionDataTypeLabel =
    distributionDataType.file != null
      ? intl.formatMessage({ id: 'geoproducts.file' })
      : distributionDataType.other != null
      ? intl.formatMessage({ id: 'geoproducts.other' })
      : distributionDataType.service != null
      ? intl.formatMessage({ id: 'order.service' })
      : '';

  const { appendData, isLoading } = useQueryApiClient({
    request: {
      url: `/api/v1/geoproduct-orders/${id}/status-update`,
      method: 'PATCH',
    },
    onSuccess: () => {
      refetch();
    },
  });

  const isTransitionAllowed = (nextStatus: string): boolean => {
    const currentStatus = selectedOrder.valueCode;

    const allowedTransitions: Record<string, string[]> = {
      DRAFT: ['CANCELLED'],
      ACTIVE: ['ONHOLD', 'CANCELLED'],
      ONHOLD: ['ACTIVE'],
    };

    return allowedTransitions[currentStatus] && allowedTransitions[currentStatus].includes(nextStatus);
  };

  const handleSubmit = (nextStatus: string) => {
    if (!isTransitionAllowed(nextStatus)) {
      return;
    }

    const data = {
      status: nextStatus,
    };

    appendData(data);
  };

  if (serviceUsage) {
    for (const key in initialState) {
      if (serviceUsage.includes(key)) {
        initialState[key] = true;
      }
    }
  }

  if (fileUsage) {
    for (const key in initialState) {
      if (fileUsage.includes(key)) {
        initialState[key] = true;
      }
    }
  }

  const pvn = useMemo(() => {
    return extractPVN(selectedOrder.paymentAmount);
  }, [selectedOrder.paymentAmount]);

  const { name, surname, personalCode, phone, email, ip_address, description } = initialState;

  return (
    <>
      <DefaultLayout.PageLayout>
        <DefaultLayout.PageContent>
          <StyledPage>
            <DefaultLayout.PageHeader
              title={intl.formatMessage(
                { id: 'order_data_holder.order_description_id' },
                { id: `#${selectedOrder.id}` }
              )}
              breadcrumb={[
                {
                  path: '/',
                  name: intl.formatMessage({ id: 'navigation.catalog' }),
                },
                {
                  path: '/orders-data-holder',
                  name: intl.formatMessage({ id: 'order_data_holder.orders' }),
                },
              ]}
              rightSideOptions={[
                <ButtonList>
                  <Button
                    type="primary"
                    label={intl.formatMessage({ id: 'general.annul' })}
                    onClick={() => handleSubmit('CANCELLED')}
                    disabled={!isTransitionAllowed('CANCELLED')}
                  />
                  {!isOnHold ? (
                    <Button
                      type="primary"
                      label={intl.formatMessage({ id: 'general.suspended' })}
                      onClick={() => handleSubmit('ONHOLD')}
                      disabled={!isTransitionAllowed('ONHOLD')}
                    />
                  ) : (
                    <Button
                      type="primary"
                      label={intl.formatMessage({ id: 'general.refresh' })}
                      onClick={() => handleSubmit('ACTIVE')}
                      disabled={!isTransitionAllowed('ACTIVE')}
                    />
                  )}
                </ButtonList>,
              ]}
            />

            <Tabs type="card" onChange={onTabChange} activeKey={activeTab}>
              <TabPane
                tab={intl.formatMessage({
                  id: 'order_data_holder.summary',
                })}
                key="orderSummary"
              >
                <Spinner spinning={isLoading}>
                  <div className="grid grid-cols-2 gap-20">
                    <Label label={intl.formatMessage({ id: 'order.date' })} />
                    <Label color="primary" label={dayjs(selectedOrder.createdAt).format('DD.MM.YYYY HH:mm')} />

                    <Label label={intl.formatMessage({ id: 'order.order_number' })} />
                    <Label color="primary" label={selectedOrder.id} />

                    <Label label={intl.formatMessage({ id: 'order.order_status' })} />
                    <Label color="primary" label={selectedOrder.orderStatusClassifier} />

                    <Label label={intl.formatMessage({ id: 'order.data_requester_name' })} />
                    <Label color="primary" label={selectedOrder.fullName} />

                    <Label label={intl.formatMessage({ id: 'order.data_requester_personal_code' })} />
                    <Label color="primary" label={selectedOrder.personalCode} />

                    <Label label={intl.formatMessage({ id: 'order.licence_type' })} />
                    <Label
                      color="primary"
                      label={
                        selectedOrder.licenseType === 'OPEN'
                          ? intl.formatMessage({ id: 'licence_management.OPEN' })
                          : selectedOrder.licenseType === 'PREDEFINED'
                          ? intl.formatMessage({ id: 'licence_management.PREDEFINED' })
                          : selectedOrder.licenseType === 'OTHER'
                          ? intl.formatMessage({ id: 'licence_management.OTHERS' })
                          : ''
                      }
                    />

                    <Label label={intl.formatMessage({ id: 'order.geoproducts' })} />
                    <Label color="primary" label={selectedOrder.geoProductName} />

                    <Label label={intl.formatMessage({ id: 'geoproducts.data_type_of_distribution' })} />
                    <Label color="primary" label={distributionDataTypeLabel} />

                    <Label label={intl.formatMessage({ id: 'order.licence_agreement' })} />
                    <Label
                      color="primary"
                      label={intl.formatMessage({ id: selectedOrder.confirmedRules ? 'order.accept' : 'order.reject' })}
                    />

                    <Label label={intl.formatMessage({ id: 'order_data_holder.price_without_tax' })} />
                    <Label color="primary" label={'€ ' + pvn.withoutPVN} />

                    <Label label={intl.formatMessage({ id: 'order_data_holder.tax' })} />
                    <Label color="primary" label={'€ ' + pvn.pvnAmount} />

                    <Label label={intl.formatMessage({ id: 'order_data_holder.amount_with_pvn' })} />
                    <Label
                      color="primary"
                      label={selectedOrder.paymentAmount === null ? '€ ' + '0' : '€ ' + pvn.withPVN}
                    />
                  </div>
                </Spinner>
              </TabPane>
              <TabPane
                tab={intl.formatMessage({
                  id: 'order_data_holder.request_for_usage',
                })}
                key="orderRequestForUsage"
              >
                <Collapse>
                  <Panel
                    key={1}
                    header={intl.formatMessage({ id: 'order_data_holder.data_holder_information' })}
                    forceRender
                  >
                    <div className="grid grid-cols-2 gap-20">
                      <Label label={intl.formatMessage({ id: 'order_data_holder.data_holder_name' })} />
                      <Label color="primary" label={selectedOrder.name} />

                      <Label label={intl.formatMessage({ id: 'order_data_holder.data_holder_surname' })} />
                      <Label color="primary" label={selectedOrder.surname} />

                      <Label label={intl.formatMessage({ id: 'order_data_holder.data_holder_personal_code' })} />
                      <Label color="primary" label={selectedOrder.personalCode} />

                      {!!selectedOrder.regNr && (
                        <>
                          <Label label={intl.formatMessage({ id: 'order_data_holder.institution_name' })} />
                          <Label color="primary" label={selectedOrder.institutionName} />

                          <Label label={intl.formatMessage({ id: 'order_data_holder.reg_nr' })} />
                          <Label color="primary" label={selectedOrder.regNr} />
                        </>
                      )}

                      {phone && (
                        <>
                          <Label label={intl.formatMessage({ id: 'order_data_holder.data_holder_telephone' })} />
                          <Label color="primary" label={selectedOrder.phone} />
                        </>
                      )}

                      {email && (
                        <>
                          <Label label={intl.formatMessage({ id: 'order_data_holder.data_holder_email' })} />
                          <Label color="primary" label={selectedOrder.email} />
                        </>
                      )}

                      {selectedOrder.ipLimitation && (
                        <>
                          <Label label={intl.formatMessage({ id: 'geoproducts.ip' })} />
                          <Label color="primary" label={selectedOrder.ipLimitation} />
                        </>
                      )}

                      {selectedOrder.description && (
                        <>
                          <Label label={intl.formatMessage({ id: 'order.data_owner_description' })} />
                          <Label color="primary" label={selectedOrder.description} />
                        </>
                      )}

                      {selectedOrder.targetClassifierTranslation && (
                        <>
                          <Label label={intl.formatMessage({ id: 'order_data_holder.data_holder_data_purpose' })} />
                          <Label color="primary" label={selectedOrder.targetClassifierTranslation} />
                        </>
                      )}
                    </div>
                  </Panel>
                </Collapse>
              </TabPane>
            </Tabs>
          </StyledPage>
        </DefaultLayout.PageContent>
      </DefaultLayout.PageLayout>
    </>
  );
};

export default OrderDataHolderEditPage;
