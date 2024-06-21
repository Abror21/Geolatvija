import React, { useState } from 'react';
import { RadioGroup, Radio, Collapse, Switch } from 'ui';
import { useIntl } from 'react-intl';
import { Col, Collapse as AntdCollapse, Form, Row, Space } from 'antd';
import { EmptyRow } from 'styles/layout/form';
import PaymentBlock from './PaymentBlock';
import DocumentFormItem from 'components/DocumentFormItem';
import { RadioChangeEvent } from 'antd/es/radio/interface';
import UsageRequestBlock from './UsageRequestBlock';
import LicenceSelect from '../../../../components/Selects/LicenceSelect';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

interface LicenseProps {
  dynamicRow: number;
  clearFields: Function;
  showPriceForAll?: boolean;
  panelKey: string;
  isPublic: boolean;
  selectedByIpAddress?: boolean;
  selectedRestrictions?: Array<CheckboxValueType>;
  selectedServiceType?: string;
}

const LicenseBlock = ({
  dynamicRow,
  clearFields,
  showPriceForAll,
  panelKey,
  isPublic,
  selectedRestrictions,
  selectedServiceType,
}: LicenseProps) => {
  const form = Form.useFormInstance();
  const licenceType = form.getFieldValue([panelKey, dynamicRow, 'licenseType']);
  const paymentType = form.getFieldValue([panelKey, dynamicRow, 'paymentType']);

  const [isPaymentVisible, setIsPaymentVisible] = useState<boolean>(licenceType ? licenceType !== 'OPEN' : false);
  const [license, setLicense] = useState<string>(licenceType ? licenceType : 'OPEN');

  const [removeAllAttachments, setRemoveAllAttachments] = useState(false);

  const intl = useIntl();
  const { Panel } = AntdCollapse;

  //IF ANY NAMES AR CHANGED THEN NEED TO UPDATE THIS AS WELL
  // const blockFields = ['licenseRadio', 'openData', 'predefinedLicense'];

  const onLicenseChange = (value: RadioChangeEvent) => {
    setLicense(value.target.value);

    switch (value.target.value) {
      case 'OPEN':
        form.setFieldValue([panelKey, dynamicRow, 'institutionPredefinedLicenceId'], null);
        form.setFieldValue([panelKey, dynamicRow, 'licence'], null);
        form.setFieldValue([panelKey, dynamicRow, 'institution_licence_id'], null);
        setRemoveAllAttachments(true);
        break;
      case 'PREDEFINED':
        form.setFieldValue([panelKey, dynamicRow, 'institutionOpenLicenceId'], null);
        form.setFieldValue([panelKey, dynamicRow, 'institution_licence_id'], null);
        setRemoveAllAttachments(true);
        break;
      case 'OTHER':
        form.setFieldValue([panelKey, dynamicRow, 'institutionOpenLicenceId'], null);
        form.setFieldValue([panelKey, dynamicRow, 'institutionPredefinedLicenceId'], null);
        form.setFieldValue([panelKey, dynamicRow, 'institution_licence_id'], null);
        setRemoveAllAttachments(false);
        break;
    }

    if (value.target.value === 'NONE' || value.target.value === 'OPEN') {
      setIsPaymentVisible(false);
      return;
    }

    setIsPaymentVisible(true);
  };

  return (
    <>
      <Collapse>
        <Panel
          key={'license'}
          header={<label className="fake-required">{intl.formatMessage({ id: 'geoproducts.license' })}</label>}
          forceRender
        >
          <Row>
            <Col span={12}>
              <RadioGroup
                size="middle"
                name={[dynamicRow, 'licenseType']}
                direction="vertical"
                onChange={onLicenseChange}
                initialValue="OPEN"
                disabled={isPublic}
              >
                <Space direction="vertical" size={44}>
                  <Radio
                    value="OPEN"
                    label={intl.formatMessage({ id: 'geoproducts.open_data' })}
                    disabled={selectedRestrictions?.includes('IP_ADDRESS') || selectedRestrictions?.includes('PERIOD')}
                  />
                  <Radio
                    value="PREDEFINED"
                    label={intl.formatMessage({ id: 'geoproducts.predefined_license' })}
                    disabled={selectedServiceType === 'FEATURE_DOWNLOAD'}
                  />
                  <Radio
                    value="OTHER"
                    label={intl.formatMessage({ id: 'geoproducts.other_license' })}
                    disabled={selectedServiceType === 'FEATURE_DOWNLOAD'}
                  />
                </Space>
              </RadioGroup>
              <Switch
                className="horizontal mt-4"
                name={[dynamicRow, 'needTarget']}
                label={intl.formatMessage({ id: 'geoproducts.needs_target' })}
                disabled={isPublic}
              />
            </Col>
            <Col span={12}>
              <Space direction="vertical" size={20} style={{ width: '100%' }}>
                <LicenceSelect
                  disabled={isPublic || license !== 'OPEN'}
                  name={[dynamicRow, 'institutionOpenLicenceId']}
                  type="OPEN"
                  validations={license !== 'OPEN' ? undefined : 'required'}
                />
                <LicenceSelect
                  disabled={isPublic || license !== 'PREDEFINED'}
                  name={[dynamicRow, 'institutionPredefinedLicenceId']}
                  type="PREDEFINED"
                  validations={license !== 'PREDEFINED' ? undefined : 'required'}
                />
                <DocumentFormItem
                  fieldName={[dynamicRow, 'licence']}
                  maxCount={1}
                  disabled={isPublic || license !== 'OTHER'}
                  fieldList={panelKey}
                  removeAllAttachments={removeAllAttachments}
                  mandatory={license !== 'OTHER' ? undefined : true}
                />
                <EmptyRow />
              </Space>
            </Col>
          </Row>
        </Panel>
      </Collapse>
      <PaymentBlock
        formPaymentType={paymentType}
        dynamicRow={dynamicRow}
        isPaymentVisible={isPaymentVisible}
        clearFields={clearFields}
        showPriceForAll={showPriceForAll}
        isPublic={isPublic}
      />
      <UsageRequestBlock
        selectedRestrictions={selectedRestrictions}
        dynamicRow={dynamicRow}
        isVisible={isPaymentVisible}
        clearFields={clearFields}
        isPublic={isPublic}
        panelKey={panelKey}
      />
    </>
  );
};

export default LicenseBlock;
