import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { Collapse, CheckboxGroup, Checkbox, InputNumber } from 'ui';
import { useIntl } from 'react-intl';
import { Col, Collapse as AntdCollapse, Row, Space } from 'antd';
import { EmptyRow } from 'styles/layout/form';
import { ClassifierSelect } from 'components/Selects';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { ServiceRestrictionClassifierSelectWrapper } from './styles';

interface ServiceRestrictionProps {
  dynamicRow: number;
  clearFields: Function;
  panelKey: string;
  isPublic: boolean;
  selectedRestrictions: Array<CheckboxValueType>;
  setSelectedRestrictions: Dispatch<SetStateAction<Array<CheckboxValueType>>>;
  selectedServiceType?: string;
}

enum SelectedRestriction {
  NONE = 'NONE',
  ONLY_GEOPORTAL = 'ONLY_GEOPORTAL',
  IP_ADDRESS = 'IP_ADDRESS',
  PERIOD = 'PERIOD',
}

const ServiceRestrictionBlock = ({
  dynamicRow,
  clearFields,
  panelKey,
  isPublic,
  selectedRestrictions,
  setSelectedRestrictions,
  selectedServiceType,
}: ServiceRestrictionProps) => {
  const intl = useIntl();
  const { Panel } = AntdCollapse;

  const onAvailabilityChange = (value: Array<CheckboxValueType>) => {
    setSelectedRestrictions(value);

    //if period selected dont clear values
    if (value.includes(SelectedRestriction.PERIOD)) {
      return;
    }

    clearFields(['periodClassifierValueId', 'numberClassifierValueId'], dynamicRow);
  };

  const disableNoneRestrictions = useMemo(() => {
    return (
      selectedRestrictions.includes(SelectedRestriction.ONLY_GEOPORTAL) ||
      selectedRestrictions.includes(SelectedRestriction.IP_ADDRESS) ||
      selectedRestrictions.includes(SelectedRestriction.PERIOD)
    );
  }, [selectedRestrictions]);

  const disableOnlyGeoPortal = useMemo(() => {
    if (selectedRestrictions.includes(SelectedRestriction.IP_ADDRESS)) return true;
    if (selectedRestrictions.includes(SelectedRestriction.PERIOD)) return false;

    return (
      selectedRestrictions.includes(SelectedRestriction.NONE) ||
      selectedRestrictions.includes(SelectedRestriction.IP_ADDRESS)
    );
  }, [selectedRestrictions]);

  const disableIpAddress = useMemo(() => {
    if (selectedRestrictions.includes(SelectedRestriction.ONLY_GEOPORTAL)) return true;
    if (selectedRestrictions.includes(SelectedRestriction.PERIOD)) return false;

    return (
      selectedRestrictions.includes(SelectedRestriction.ONLY_GEOPORTAL) ||
      selectedRestrictions.includes(SelectedRestriction.NONE)
    );
  }, [selectedRestrictions]);

  const disablePeriod = useMemo(() => {
    return selectedRestrictions.includes(SelectedRestriction.NONE);
  }, [selectedRestrictions]);

  return (
    <Collapse>
      <Panel
        key={'services-restrictions'}
        header={
          <label className="fake-required">{intl.formatMessage({ id: 'geoproducts.services_restrictions' })}</label>
        }
        forceRender
      >
        <Row>
          <Col span={12}>
            <CheckboxGroup
              name={[dynamicRow, 'serviceLimitationType']}
              direction="vertical"
              onChange={onAvailabilityChange}
              disabled={isPublic}
              validations="required"
            >
              <Space direction="vertical" size={44}>
                <Checkbox
                  disabled={disableNoneRestrictions}
                  value={SelectedRestriction.NONE}
                  label={intl.formatMessage({ id: 'geoproducts.no_restrictions' })}
                />
                <Checkbox
                  disabled={disableOnlyGeoPortal || selectedServiceType === 'WFS'}
                  value={SelectedRestriction.ONLY_GEOPORTAL}
                  label={intl.formatMessage({ id: 'geoproducts.use_in_geoportal' })}
                />
                <Checkbox
                  disabled={disableIpAddress}
                  value={SelectedRestriction.IP_ADDRESS}
                  label={intl.formatMessage({ id: 'geoproducts.by_ip' })}
                />
                <Checkbox
                  disabled={disablePeriod}
                  value={SelectedRestriction.PERIOD}
                  label={intl.formatMessage({ id: 'geoproducts.by_period' })}
                />
              </Space>
            </CheckboxGroup>
          </Col>
          <Col span={12}>
            <ServiceRestrictionClassifierSelectWrapper direction="vertical" size={20}>
              <EmptyRow />
              <EmptyRow />
              <EmptyRow />
              <Row gutter={10}>
                <Col span={12}>
                  <ClassifierSelect
                    disabled={
                      isPublic || selectedRestrictions.length
                        ? !selectedRestrictions.includes(SelectedRestriction.PERIOD)
                        : true
                    }
                    allowClear
                    code="KL14"
                    name={[dynamicRow, 'periodClassifierValueId']}
                    validations={selectedRestrictions.includes(SelectedRestriction.PERIOD) ? 'required' : undefined}
                  />
                </Col>
                <Col span={12}>
                  <InputNumber
                    disabled={
                      isPublic || selectedRestrictions.length
                        ? !selectedRestrictions.includes(SelectedRestriction.PERIOD)
                        : true
                    }
                    name={[dynamicRow, 'numberValue']}
                    min={1}
                    initialValue={1}
                    validations={selectedRestrictions.includes(SelectedRestriction.PERIOD) ? 'required' : undefined}
                  />
                </Col>
              </Row>
            </ServiceRestrictionClassifierSelectWrapper>
          </Col>
        </Row>
      </Panel>
    </Collapse>
  );
};

export default ServiceRestrictionBlock;
