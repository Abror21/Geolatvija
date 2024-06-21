import React, { Dispatch, SetStateAction, useState } from 'react';
import { Collapse, RadioGroup, Radio } from 'ui';
import { useIntl } from 'react-intl';
import { Col, Collapse as AntdCollapse, Form, Row, Space } from 'antd';
import { EmptyRow } from 'styles/layout/form';
import { RadioChangeEvent } from 'antd/es/radio/interface';
import ThematicUserGroupSelect from 'components/Selects/ThematicUserGroupSelect';
import { ClassifierSelect } from '../../../../components/Selects';

interface AvailabilityRestrictionProps {
  dynamicRow: number;
  setIsLicenseVisible?: Dispatch<SetStateAction<boolean>>;
  isPublic: boolean;
  panelKey: string;
}

const AvailabilityRestrictionBlock = ({
  dynamicRow,
  setIsLicenseVisible,
  isPublic,
  panelKey,
}: AvailabilityRestrictionProps) => {
  const form = Form.useFormInstance();
  const avaiableRestrictionType = form.getFieldValue([panelKey, dynamicRow, 'availableRestrictionType']);

  const [selectedAvailability, setSelectedAvailability] = useState<string>(avaiableRestrictionType || 'NO_RESTRICTION');
  const intl = useIntl();
  const { Panel } = AntdCollapse;

  const onAvailabilityChange = (value: RadioChangeEvent) => {
    setSelectedAvailability(value.target.value);

    switch (value.target.value) {
      case 'NO_RESTRICTION':
        form.setFieldValue([panelKey, dynamicRow, 'institutionTypeClassifierIds'], null);
        form.setFieldValue([panelKey, dynamicRow, 'thematicUserGroupId'], null);
        break;
      case 'BY_BELONGING':
        form.setFieldValue([panelKey, dynamicRow, 'thematicUserGroupId'], null);
        break;
      case 'BELONG_TO_GROUP':
        form.setFieldValue([panelKey, dynamicRow, 'institutionTypeClassifierIds'], null);
        break;
    }
  };

  console.log(form.getFieldValue([panelKey, dynamicRow, 'institutionTypeClassifierIds']));

  return (
    <Collapse>
      <Panel
        key={'availability-restrictions'}
        header={intl.formatMessage({ id: 'geoproducts.availability_restrictions' })}
        forceRender
      >
        <Row gutter={20}>
          <Col span={12}>
            <RadioGroup
              size="middle"
              name={[dynamicRow, 'availableRestrictionType']}
              direction="vertical"
              initialValue="NO_RESTRICTION"
              onChange={onAvailabilityChange}
              disabled={isPublic}
            >
              <Space direction="vertical" size={44}>
                <Radio value="NO_RESTRICTION" label={intl.formatMessage({ id: 'geoproducts.no_restrictions' })} />
                <Radio value="BY_BELONGING" label={intl.formatMessage({ id: 'geoproducts.by_belonging' })} />
                <Radio value="BELONG_TO_GROUP" label={intl.formatMessage({ id: 'geoproducts.belong_to_group' })} />
              </Space>
            </RadioGroup>
          </Col>
          <Col span={12}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <EmptyRow />
              <ClassifierSelect
                allowClear
                code="KL28"
                name={[dynamicRow, 'institutionTypeClassifierIds']}
                initialValue={[]}
                disabled={isPublic || selectedAvailability !== 'BY_BELONGING'}
                validations={selectedAvailability !== 'BY_BELONGING' ? undefined : 'required'}
                mode="multiple"
              />
              <ThematicUserGroupSelect
                name={[dynamicRow, 'thematicUserGroupId']}
                disabled={isPublic || selectedAvailability !== 'BELONG_TO_GROUP'}
                validations={selectedAvailability !== 'BELONG_TO_GROUP' ? undefined : 'required'}
              />
            </Space>
          </Col>
        </Row>
      </Panel>
    </Collapse>
  );
};

export default AvailabilityRestrictionBlock;
