import React, { useEffect } from 'react';
import { Collapse, CheckboxGroup, Checkbox } from 'ui';
import { useIntl } from 'react-intl';
import { Collapse as AntdCollapse } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

interface PaymentProps {
  dynamicRow: number;
  isVisible: boolean;
  clearFields: Function;
  isPublic: boolean;
  selectedRestrictions?: Array<CheckboxValueType>;
  panelKey: string;
}

const UsageRequestBlock = ({
  dynamicRow,
  isVisible,
  clearFields,
  isPublic,
  selectedRestrictions,
  panelKey,
}: PaymentProps) => {
  const intl = useIntl();
  const { Panel } = AntdCollapse;

  const blockFields = ['usageRequest'];

  useEffect(() => {
    if (!isVisible) {
      clearFields(blockFields, dynamicRow);
    }
  }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isVisible) {
    return <></>;
  }

  return (
    <Collapse>
      <Panel
        key={'usage-request-data'}
        header={intl.formatMessage({ id: 'geoproducts.usage_request_data' })}
        forceRender
      >
        <div className="grid grid-cols-2 align-end gap-20">
          <CheckboxGroup
            key={55}
            name={[dynamicRow, 'usageRequest']}
            direction="vertical"
            initialValue={['name', 'surname', 'personalCode']}
            disabled={isPublic}
          >
            <Checkbox disabled label={intl.formatMessage({ id: 'geoproducts.requester_name' })} value="name" />
            <Checkbox disabled label={intl.formatMessage({ id: 'geoproducts.requester_surname' })} value="surname" />
            <Checkbox disabled label={intl.formatMessage({ id: 'geoproducts.requester_code' })} value="personalCode" />
            <Checkbox label={intl.formatMessage({ id: 'geoproducts.requester_email' })} value="email" />
            <Checkbox label={intl.formatMessage({ id: 'geoproducts.requester_phone' })} value="phone" />
            <Checkbox label={intl.formatMessage({ id: 'geoproducts.description_' })} value="description" />
            <Checkbox
              disabled={!selectedRestrictions?.includes('IP_ADDRESS')}
              label={intl.formatMessage({ id: 'geoproducts.ip_address' })}
              value="ip_address"
            />
          </CheckboxGroup>
        </div>
      </Panel>
    </Collapse>
  );
};

export default UsageRequestBlock;
