import React, { useEffect, useRef, useState } from 'react';
import { Button, Collapse, Switch, Input, Label, QuillEditor, Icon } from 'ui';
import { Collapse as AntdCollapse, Form, Row } from 'antd';
import { useIntl } from 'react-intl';
import { StyledPanelExtra } from 'ui/collapse/style';
import LicenseBlock from '../blocks/LicenseBlock';
import AvailabilityRestrictionBlock from '../blocks/AvailabilityRestrictionBlock';
import ServiceRestrictionBlock from '../blocks/ServiceRestrictionBlock';
import { ClassifierSelect } from 'components/Selects';
import useQueryApiClient from '../../../../utils/useQueryApiClient';
import DocumentFormItem from '../../../../components/DocumentFormItem';
import { PaymentTypeEnum } from '../blocks/PaymentBlock';
import toastMessage from '../../../../utils/toastMessage';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

interface ServicesPanelProps {
  panelKey: string;
  removePanel: Function;
  dynamicRow: number;
  clearFields: Function;
  id?: string;
}

const ServicesPanel = ({ panelKey, removePanel, dynamicRow, clearFields, id }: ServicesPanelProps) => {
  const form = Form.useFormInstance();

  const [isPublic, setIsPublic] = useState<boolean>(form.getFieldValue([panelKey, dynamicRow, 'isPublic']));
  const [selectedServiceType, setSelectedServiceType] = useState<string>(
    form.getFieldValue([panelKey, dynamicRow, 'serviceTypeClassifier'])
  );
  const [featureDownloadSelected, setFeatureDownloadSelected] = useState<boolean>(false);
  const [initialServiceLinkCheck, setInitialServiceLinkCheck] = useState(true);
  const [serviceLinkCheckSuccessful, setServiceLinkCheckSuccessful] = useState<boolean>(false);
  const [serviceLink, setServiceLink] = useState(form.getFieldValue([panelKey, dynamicRow, 'serviceLink']));
  const [serviceLinkValidated, setServiceLinkValidated] = useState(
    form.getFieldValue([panelKey, dynamicRow, 'serviceLinkValidated'])
  );
  const [selectedRestrictions, setSelectedRestrictions] = useState<Array<CheckboxValueType>>(
    form.getFieldValue([panelKey, dynamicRow, 'serviceLimitationType']) || []
  );

  // Required to trick QuillEditor to set ref when Collapse opens.
  const [_, setCollapseChanged] = useState(false);

  const initialLoad = useRef(true);
  const copiedServiceLink = useRef<string>(form.getFieldValue([panelKey, dynamicRow, 'serviceLink']));

  const intl = useIntl();
  const { Panel } = AntdCollapse;

  useEffect(() => {
    if (initialLoad.current && !!serviceLink) {
      setInitialServiceLinkCheck(true);
      initialLoad.current = false;
    } else {
      setServiceLinkCheckSuccessful(false);
    }
  }, [serviceLink]);

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/geoproducts/check-service-link`,
      method: 'POST',
    },
    onSuccess: () => {
      toastMessage.success(intl.formatMessage({ id: 'message.geoproduct_service_success' }));
      form.setFieldValue([panelKey, dynamicRow, 'serviceLinkValidated'], true);
      setServiceLinkValidated(true);
      setServiceLinkCheckSuccessful(true);
    },
    onError: () => {
      setServiceLinkCheckSuccessful(false);
      setInitialServiceLinkCheck(false);
      setServiceLinkValidated(false);
      form.setFieldValue([panelKey, dynamicRow, 'serviceLinkValidated'], false);
    },
  });

  const onServicesSetPublic = async (v: boolean) => {
    if (!v) return setIsPublic(v);

    const requiredFields = [
      [panelKey, dynamicRow, 'serviceTypeClassifierValueId'],
      [panelKey, dynamicRow, 'serviceLink'],
      [panelKey, dynamicRow, 'serviceLimitationType'],
      [panelKey, dynamicRow, 'description'],
    ];

    const paymentType = form.getFieldValue([panelKey, dynamicRow, 'paymentType']);
    if (paymentType === PaymentTypeEnum.Prepay) {
      requiredFields.push([panelKey, dynamicRow, 'feeCost']);
      requiredFields.push([panelKey, dynamicRow, 'serviceStep']);
      requiredFields.push([panelKey, dynamicRow, 'position']);
    } else if (paymentType === PaymentTypeEnum.Fee) {
      requiredFields.push([panelKey, dynamicRow, 'feeCost']);
    }

    const licenseType = form.getFieldValue([panelKey, dynamicRow, 'licenseType']);
    const requiredField =
      licenseType === 'OPEN'
        ? 'institutionOpenLicenceId'
        : licenseType === 'PREDEFINED'
        ? 'institutionPredefinedLicenceId'
        : 'licence';

    if (!form.getFieldValue([panelKey, dynamicRow, requiredField])) {
      requiredFields.push([panelKey, dynamicRow, requiredField]);
    }

    const availableRestrictionType = form.getFieldValue([panelKey, dynamicRow, 'availableRestrictionType']);
    const requiredFieldB =
      availableRestrictionType === 'BY_BELONGING'
        ? 'institutionTypeClassifierIds'
        : availableRestrictionType === 'BELONG_TO_GROUP'
        ? 'thematicUserGroupId'
        : 'does';

    if (!form.getFieldValue([panelKey, dynamicRow, requiredFieldB])) {
      requiredFields.push([panelKey, dynamicRow, requiredFieldB]);
    }

    await form
      .validateFields(requiredFields)
      .then(() => {
        if (
          (!serviceLinkCheckSuccessful &&
            (copiedServiceLink.current !== serviceLink || featureDownloadSelected || !id)) ||
          !serviceLinkValidated
        ) {
          if (initialServiceLinkCheck) {
            toastMessage.error(intl.formatMessage({ id: 'geoproducts.error.div_publish_initial' }));
          } else {
            toastMessage.error(intl.formatMessage({ id: 'geoproducts.error.div_publish' }));
          }
          form.setFieldValue([panelKey, dynamicRow, 'isPublic'], false);
          form.setFieldValue([panelKey, dynamicRow, 'serviceLinkValidated'], false);
          setServiceLinkValidated(false);
        } else {
          form.setFieldValue([panelKey, dynamicRow, 'serviceLinkValidated'], true);
          setServiceLinkValidated(true);
          setIsPublic(v);
        }
      })
      .catch((e) => {
        form.setFieldValue([panelKey, dynamicRow, 'isPublic'], false);
        form.setFieldValue([panelKey, dynamicRow, 'serviceLinkValidated'], false);
        toastMessage.error(intl.formatMessage({ id: 'message.geoproduct_service_validation_error' }));
        setServiceLinkValidated(false);
      });
  };

  const onFeatureDownloadSelect = (selected: boolean) => {
    setFeatureDownloadSelected(selected);
    setServiceLinkCheckSuccessful(false);
    setServiceLinkValidated(false);
    form.setFieldValue([panelKey, dynamicRow, 'serviceLinkValidated'], false);
    form.setFieldValue([panelKey, dynamicRow, 'serviceLink'], '');
  };

  const extra = (
    <StyledPanelExtra
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Label label={intl.formatMessage({ id: 'general.published' })} />
      <Switch name={[dynamicRow, 'isPublic']} onChange={onServicesSetPublic} />
      <Button label={<Icon icon="trash" />} onClick={() => removePanel()} disabled={isPublic} />
    </StyledPanelExtra>
  );

  const onCheckClick = () => {
    const value = form.getFieldValue([panelKey, dynamicRow, 'serviceLink']);
    const value2 = form.getFieldValue([panelKey, dynamicRow, 'serviceTypeClassifierValueId']);

    if (initialLoad.current) {
      setInitialServiceLinkCheck(false);
    } else initialLoad.current = false;

    appendData({ serviceLink: value, serviceTypeClassifierValueId: value2 });
  };

  const onCollapseChange = () => {
    // onChange required for QuillEditor to set ref when collapse opens.
    // Does not re-render other components in collapse.
    setCollapseChanged((prev) => !prev);
  };

  const onServiceTypeChange = (entry: any) => {
    setSelectedServiceType(entry.code);
    onFeatureDownloadSelect(entry.code === 'FEATURE_DOWNLOAD');

    switch (entry.code) {
      case 'FEATURE_DOWNLOAD':
        form.setFieldValue([panelKey, dynamicRow, 'institutionPredefinedLicenceId'], null);
        form.setFieldValue([panelKey, dynamicRow, 'licence'], null);
        form.setFieldValue([panelKey, dynamicRow, 'institution_licence_id'], null);
        break;
      case 'WFS':
        if (selectedRestrictions.includes('ONLY_GEOPORTAL')) {
          const parsed = selectedRestrictions.splice(selectedRestrictions.indexOf('ONLY_GEOPORTAL'), 1);
          setSelectedRestrictions(parsed);
          form.setFieldValue([panelKey, dynamicRow, 'serviceLimitationType'], null);
        }
        break;
    }
  };

  return (
    <Collapse onChange={onCollapseChange}>
      <Panel
        key={panelKey}
        header={intl.formatMessage({ id: 'geoproducts.service' }) + ` #${dynamicRow + 1}`}
        extra={extra}
        forceRender
      >
        <QuillEditor
          enableLinks
          enableSubscript
          maxLength={600}
          name={[dynamicRow, 'description']}
          label={<label className="fake-required">{intl.formatMessage({ id: 'geoproducts.div_description' })}</label>}
          toolbarKey={panelKey + dynamicRow}
          validations="requiredRichText"
        />
        <ClassifierSelect
          allowClear
          code="KL9"
          name={[dynamicRow, 'serviceTypeClassifierValueId']}
          label={intl.formatMessage({ id: 'geoproducts.choose_service_type' })}
          validations="required"
          disabled={isPublic}
          onChange={onServiceTypeChange}
          onChangeWithRecord
        />
        <Row>
          <Form.Item
            className="form-item-and-button-one-row"
            label={intl.formatMessage({ id: 'geoproducts.service_link' })}
          >
            <Input
              name={[dynamicRow, 'serviceLink']}
              type="url"
              validations={!featureDownloadSelected ? 'required' : 'none'}
              disabled={isPublic}
              onChange={(e) => setServiceLink(e.target.value)}
            />
            <Button
              type="primary"
              label={intl.formatMessage({ id: 'geoproducts.check' })}
              onClick={() => onCheckClick()}
            />
          </Form.Item>
        </Row>
        {selectedServiceType === 'FEATURE_DOWNLOAD' && (
          <DocumentFormItem
            fieldName={[dynamicRow, 'atom']}
            label={intl.formatMessage({ id: 'geoproducts.add_file_feature' })}
            maxCount={1}
            disabled={isPublic}
            fieldList={panelKey}
            accept={'.gml, .zip'}
            onChange={(t) => {
              onFeatureDownloadSelect(!!t.fileList.length);
            }}
          />
        )}
        <AvailabilityRestrictionBlock dynamicRow={dynamicRow} isPublic={isPublic} panelKey={panelKey} />

        {selectedServiceType !== 'FEATURE_DOWNLOAD' && (
          <ServiceRestrictionBlock
            dynamicRow={dynamicRow}
            clearFields={clearFields}
            panelKey={panelKey}
            isPublic={isPublic}
            setSelectedRestrictions={setSelectedRestrictions}
            selectedRestrictions={selectedRestrictions}
            selectedServiceType={selectedServiceType}
          />
        )}
        <LicenseBlock
          dynamicRow={dynamicRow}
          panelKey={panelKey}
          clearFields={clearFields}
          isPublic={isPublic}
          selectedRestrictions={selectedRestrictions}
          selectedServiceType={selectedServiceType}
        />
      </Panel>
    </Collapse>
  );
};
export default ServicesPanel;
