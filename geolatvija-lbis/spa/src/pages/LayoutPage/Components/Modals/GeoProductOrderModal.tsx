import React, { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react';
import { Modal, Button, Label, Switch, Collapse, Input, Select, SelectOption, Tree, Tooltip, Checkbox } from 'ui';
import { useIntl } from 'react-intl';
import { Collapse as AntdCollapse, Form } from 'antd';
import { useUserState } from '../../../../contexts/UserContext';
import useQueryApiClient from '../../../../utils/useQueryApiClient';
import FileDownload from 'js-file-download';
import dayjs, { Dayjs, ManipulateType } from 'dayjs';
import { TreeProps } from 'antd/es/tree';
import { ClassifierSelect } from '../../../../components/Selects';
import useJwt from '../../../../utils/useJwt';
import { StyledCustomTextPart, StyledFilesListWrapper } from './style';

interface GeoProductOrderModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  onPurchaseSuccessful: Function;
  service: any;
  onClose?: Function;
  orderId?: any;
  setIsDraft: Dispatch<SetStateAction<boolean>>;
}

const GeoProductOrderModal = ({
  showModal,
  setShowModal,
  service,
  onClose,
  onPurchaseSuccessful,
  orderId,
  setIsDraft,
}: GeoProductOrderModalProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const [periodType, setPeriodType] = useState<ManipulateType>();
  const [checkedFiles, setCheckedFiles] = useState<any>([]);
  const [divFileAvailabilityTime, setDivFileAvailabilityTime] = useState<Dayjs>();
  const [fileSearchInput, setFileSearchInput] = useState<string>();
  const [checkedSelectAllFiles, setCheckedSelectAllFiles] = useState(false);

  const intl = useIntl();
  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);

  const { Panel } = AntdCollapse;
  const [form] = Form.useForm();
  const { isTokenActive } = useJwt();

  useEffect(() => {
    form.setFieldValue('email', activeRole?.email);
  }, [activeRole?.email]);

  useEffect(() => {
    if (!showModal) {
      form.resetFields();
    }
  }, [showModal]);

  const { refetch: getOrder } = useQueryApiClient({
    request: {
      url: `api/v1/geoproduct-orders/${orderId}`,
      method: 'GET',
      disableOnMount: true,
    },
    onSuccess: (response) => {
      form.setFieldsValue({ ...response });
      setConfirmed(response?.confirmedRules);
    },
  });

  useEffect(() => {
    if (orderId) getOrder();
  }, [orderId]);

  const { appendData } = useQueryApiClient({
    request: {
      url: 'api/v1/storage/:id',
      method: 'GET',
      multipart: true,
      disableOnMount: true,
    },
    onSuccess: (response) => {
      FileDownload(response, service.displayName || service.institutionDisplayName);
    },
  });

  const { data: options } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/select/KL14`,
    },
  });

  const {} = useQueryApiClient({
    request: {
      url: `api/v1/system-settings/div-file-availability-time`,
      disableOnMount: !service?.attachments,
    },
    onSuccess: (res) => {
      setDivFileAvailabilityTime(dayjs().add(parseInt(res.value), 'seconds'));
    },
  });

  const selectedPeriod = options.find((option: any) => option.code === service.periodCode);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get('orderId')) {
      getStatus([], { id: urlParams.get('orderId') });
    }
  }, []);

  const { appendData: getStatus } = useQueryApiClient({
    request: {
      url: '/api/v1/geoproduct-orders/:id/status',
      method: 'GET',
      disableOnMount: !isTokenActive(),
    },
  });

  const { appendData: orderAppendData } = useQueryApiClient({
    request: {
      url: orderId ? `api/v1/geoproduct-orders/${orderId}` : 'api/v1/geoproduct-orders',
      method: 'POST',
    },
    onSuccess: (response) => {
      if (response.paymentRequestUrl) {
        window.location.href = response.paymentRequestUrl;
      } else {
        form.resetFields();
        setShowModal(false);
        onPurchaseSuccessful();
      }
    },
  });

  useEffect(() => {
    switch (service.periodCode) {
      case 'YEAR':
        setPeriodType('y');
        break;
      case 'MONTH':
        setPeriodType('M');
        break;
      case 'WEEK':
        setPeriodType('w');
        break;
      case 'DAY':
        setPeriodType('d');
        break;
    }
  }, [service]);

  const onLicenceClick = () => {
    if (service.attachmentId) {
      appendData([], { id: service.attachmentId });
    } else if (service.institutionAttachmentId) {
      appendData([], { id: service.institutionAttachmentId });
    } else if (service.site) {
      window.location.assign(service.site);
    }
  };

  const onFinishValidated = useMemo(() => {
    return (
      !(!confirmed || (checkedFiles.length <= 0 && !!service?.attachments)) ||
      (confirmed && service?.paymentType === 'FREE' && !!service?.attachments)
    );
  }, [confirmed, checkedFiles.length, service?.attachments, service?.paymentType]);

  const onFinish = (values: any, ordering = true) => {
    const files =
      service?.paymentType === 'FREE' && !!service?.attachments
        ? service?.attachments.map((at: any) => at.uuid)
        : checkedFiles;

    const parsedValues = {
      ...values,
      checkedFiles: files,
      geoProductServiceId: !service?.attachments ? service.id : null,
      geoProductFileId: !!service?.attachments ? service.id : null,
      responseUrl: window.location.href,
      periodNumberValue: service?.numberValue,
      periodClassifierValueId: selectedPeriod?.id,
      serviceLimitationType: service?.serviceLimitationType,
      ordering: ordering,
    };

    setIsDraft(!ordering);

    orderAppendData(parsedValues);
  };

  const attachments = service?.attachments?.map((e: any) => {
    return {
      key: e.uuid,
      title: e.displayName,
    };
  });

  const filteredAttachments = useMemo(() => {
    if (!fileSearchInput || fileSearchInput === '') return attachments;

    return attachments.filter((attachment: { title: string }) =>
      attachment.title.toLowerCase().includes(fileSearchInput?.toLowerCase())
    );
  }, [attachments, fileSearchInput]);

  const onCheck: TreeProps['onCheck'] = (selectedKeys, nodeData) => {
    const updatedCheckedFiles = nodeData.checked
      ? [...checkedFiles, nodeData.node.key]
      : checkedFiles.filter((key: number) => key !== nodeData.node.key);

    setCheckedFiles(updatedCheckedFiles);
    setCheckedSelectAllFiles(updatedCheckedFiles.length === attachments.length);
  };

  const onCheckAll = (checked: boolean) => {
    setCheckedSelectAllFiles(checked);

    if (checked) {
      setCheckedFiles(attachments.map((at: any) => at.key));
    } else {
      setCheckedFiles([]);
    }
  };

  const onCancel = () => {
    setShowModal(false);
    onClose?.();
  };

  // Event listener for the popstate event, which fires when the user navigates backward or forward in the browser history.
  useEffect(() => {
    const handlePopstate = () => {
      onCancel();
    };

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  return (
    <Modal
      open={showModal}
      onCancel={onCancel}
      footer={
        <>
          <Tooltip hack title={intl.formatMessage({ id: 'order.save_tooltip' })}>
            <Button
              label={intl.formatMessage({ id: 'general.save' })}
              onClick={() => onFinish(form.getFieldsValue(), false)}
            />
          </Tooltip>
          <Button
            type="primary"
            label={intl.formatMessage({ id: 'general.order' })}
            onClick={() => form.submit()}
            disabled={!onFinishValidated}
          />
        </>
      }
      width={700}
      getContainer={document.body}
      title={intl.formatMessage({ id: 'geo_product_order.ordering' })}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Collapse>
          <Panel forceRender key={'orderer'} header={intl.formatMessage({ id: 'geo_product_order.orderer' })}>
            <div className="grid grid-cols-2 gap-30">
              <Input
                label={intl.formatMessage({ id: 'geo_product_order.name_surname' })}
                value={user.name + ' ' + user.surname}
                disabled
              />
              <Input
                label={intl.formatMessage({ id: 'geo_product_order.personal_code' })}
                value={user.personalCode}
                disabled
              />
              {!!activeRole?.regNr && (
                <>
                  <Input
                    label={intl.formatMessage({ id: 'geo_product_order.institution_name' })}
                    value={activeRole.institutionName}
                    disabled
                  />
                  <Input
                    label={intl.formatMessage({ id: 'geo_product_order.reg_nr' })}
                    value={activeRole.regNr}
                    disabled
                  />
                </>
              )}
              {service.usageRequest?.includes('email') && (
                <Input
                  label={intl.formatMessage({ id: 'geo_product_order.email' })}
                  name="email"
                  validations="required"
                />
              )}
              {service.usageRequest?.includes('phone') && (
                <Input
                  label={intl.formatMessage({ id: 'geo_product_order.phone' })}
                  name="phone"
                  validations="required"
                />
              )}
              {service.usageRequest?.includes('description') && (
                <Input
                  label={intl.formatMessage({ id: 'geo_product_order.description' })}
                  name="description"
                  validations="required"
                />
              )}
            </div>
          </Panel>
        </Collapse>

        {service.licenseType !== 'NONE' && (
          <Collapse>
            <Panel
              forceRender
              key={'licence-rules'}
              header={intl.formatMessage({ id: 'geo_product_order.licence_rules' })}
            >
              <Label label={intl.formatMessage({ id: 'geo_product_order.confirm_rules' })} />
              <Label label={intl.formatMessage({ id: 'geo_product_order.confirm_rules_2' })} />
              {service.needTarget && (
                <ClassifierSelect
                  allowClear
                  code="KL27"
                  validations="required"
                  placeholder={intl.formatMessage({ id: 'geo_product_order.usage_target_placeholder' })}
                  label={intl.formatMessage({ id: 'geo_product_order.usage_target' })}
                  name="targetClassifierValueId"
                />
              )}
              <Switch
                className="horizontal"
                name="confirmedRules"
                label={
                  <StyledCustomTextPart>
                    <span>
                      {intl.formatMessage(
                        { id: 'geo_product_order.i_confirm_rules' },
                        { name: user.name + ' ' + user.surname }
                      )}
                    </span>
                    <span className="label" onClick={onLicenceClick}>
                      {' '}
                      {intl.formatMessage({ id: 'geo_product_order.licence_rules_2' })}{' '}
                    </span>
                    <span>{intl.formatMessage({ id: 'geo_product_order.i_confirm_rules_2' })}</span>
                  </StyledCustomTextPart>
                }
                onChange={(v) => setConfirmed(v)}
              />
            </Panel>
          </Collapse>
        )}

        {service.serviceLimitationType && !service.serviceLimitationType.includes('NONE') && (
          <Collapse>
            <Panel
              forceRender
              key={'licence-rules'}
              header={intl.formatMessage({ id: 'geo_product_order.service_limitation' })}
            >
              {service.serviceLimitationType.includes('IP_ADDRESS') && (
                <>
                  <Label label={intl.formatMessage({ id: 'geo_product_order.only_ip_address' })} />
                  <Input
                    label={intl.formatMessage({ id: 'geo_product_order.you_can_ip_address' })}
                    name="ipLimitation"
                    validations="required"
                  />
                </>
              )}
              {service.serviceLimitationType.includes('ONLY_GEOPORTAL') && (
                <Label label={intl.formatMessage({ id: 'geo_product_order.only_geoportal' })} />
              )}

              {!!service.periodCode && (
                <Label
                  label={intl.formatMessage(
                    { id: 'geo_product_order.only_in_period' },
                    { date: dayjs().add(service.numberValue, periodType).format('DD.MM.YYYY') }
                  )}
                />
              )}
            </Panel>
          </Collapse>
        )}

        {service.paymentType !== 'FREE' && (
          <Collapse>
            <Panel
              forceRender
              key={'payment'}
              header={intl.formatMessage({ id: 'geo_product_order.payment' })}
              style={{ maxHeight: '300px', overflow: 'auto' }}
            >
              {service?.attachments ? (
                <>
                  <div className="grid grid-cols-2 gap-30">
                    <div>
                      <Input
                        type="text"
                        placeholder={intl.formatMessage({ id: 'geoproducts.search_file' })}
                        onChange={(event) => {
                          setFileSearchInput(event.target.value);
                        }}
                      />
                      <Checkbox
                        indeterminate={
                          checkedFiles?.length > 0 &&
                          checkedFiles?.length < attachments?.length &&
                          !checkedSelectAllFiles
                        }
                        checked={checkedSelectAllFiles}
                        onChange={(e: any) => onCheckAll(e.target.checked as boolean)}
                      />
                      <Tree treeData={filteredAttachments} checkable checkedKeys={checkedFiles} onCheck={onCheck} />
                    </div>
                    <div>
                      <Input
                        value={
                          (service.priceFor === 'SINGLE' ? checkedFiles.length * service.feeCost : service.feeCost) +
                          ' EUR'
                        }
                        disabled
                      />
                      <Checkbox
                        indeterminate={
                          checkedFiles?.length > 0 &&
                          checkedFiles?.length < attachments?.length &&
                          !checkedSelectAllFiles
                        }
                        checked={checkedSelectAllFiles}
                        onChange={(e: any) => onCheckAll(e.target.checked as boolean)}
                      />
                      <Tree
                        treeData={filteredAttachments.filter((e: any) => checkedFiles.includes(e.key))}
                        checkable
                        checkedKeys={checkedFiles}
                        onCheck={onCheck}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-30">
                    {service.serviceLimitationType?.includes('PERIOD') && (
                      <Select disabled name="periodDuration" initialValue={1}>
                        <SelectOption value={1}>
                          {service?.numberValue} x {selectedPeriod?.translation}
                        </SelectOption>
                      </Select>
                    )}
                    <Input value={service.feeCost + ' EUR'} disabled />
                  </div>
                  {service.serviceLimitationType?.includes('PERIOD') && (
                    <Label
                      label={intl.formatMessage(
                        { id: 'geo_product_order.price_for_period' },
                        {
                          from: dayjs().format('DD.MM.YYYY'),
                          to: dayjs().add(service.numberValue, periodType).format('DD.MM.YYYY'),
                        }
                      )}
                    />
                  )}
                </>
              )}
            </Panel>
          </Collapse>
        )}

        {!!service?.attachments && (
          <Collapse>
            <Panel
              forceRender
              key={'licence-rules'}
              header={intl.formatMessage({ id: 'geo_product_order.information' })}
            >
              <Label
                label={intl.formatMessage(
                  { id: 'geo_product_order.file_availability_info' },
                  {
                    date: divFileAvailabilityTime?.format('DD.MM.YYYY'),
                    time: divFileAvailabilityTime?.format('HH:mm'),
                  }
                )}
              />
              <Label label={intl.formatMessage({ id: 'geo_product_order.file_download_location' })} />
              <Label label={intl.formatMessage({ id: 'geo_product_order.file_download_availability_can_change' })} />
              <br />
              {service.paymentType === 'FREE' && (
                <StyledFilesListWrapper>
                  {service?.attachments?.map((attachment: any) => (
                    <Label bold label={attachment?.displayName} />
                  ))}
                </StyledFilesListWrapper>
              )}
            </Panel>
          </Collapse>
        )}
      </Form>
    </Modal>
  );
};

export default GeoProductOrderModal;
