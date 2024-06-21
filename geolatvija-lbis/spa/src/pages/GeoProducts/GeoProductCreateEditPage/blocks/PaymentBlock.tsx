import React, { useEffect, useState } from 'react';
import { RadioGroup, Radio, Collapse, Input, Label, InputNumber } from 'ui';
import { useIntl } from 'react-intl';
import { Col, Collapse as AntdCollapse, Row, Space } from 'antd';
import { EmptyRow } from 'styles/layout/form';
import { RadioChangeEvent } from 'antd/es/radio/interface';
import { PaymentPrePayInputWrapper, PaymentPrePayWrapper } from './styles';

interface PaymentProps {
  dynamicRow: number;
  isPaymentVisible: boolean;
  clearFields: Function;
  showPriceForAll?: boolean;
  isPublic: boolean;
  formPaymentType: string;
}

export enum PaymentTypeEnum {
  Free = 'FREE',
  Fee = 'FEE',
  Prepay = 'PREPAY',
}

const PaymentBlock = ({
  dynamicRow,
  isPaymentVisible,
  clearFields,
  showPriceForAll,
  isPublic,
  formPaymentType,
}: PaymentProps) => {
  const [paymentType, setPaymentType] = useState(formPaymentType ? formPaymentType : 'FREE');
  const intl = useIntl();
  const { Panel } = AntdCollapse;

  const isProd = window.runConfig.nodeEnv === 'production';

  //IF ANY NAMES AR CHANGED THEN NEED TO UPDATE THIS AS WELL
  const blockFields = ['feeCost', 'priceFor', 'serviceStep', 'position'];

  useEffect(() => {
    if (!isPaymentVisible) {
      clearFields(blockFields, dynamicRow);
    }
  }, [isPaymentVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isPaymentVisible) {
    return <></>;
  }

  const onPaymentChange = (value: RadioChangeEvent) => {
    setPaymentType(value.target.value);
    clearFields(blockFields, dynamicRow);
  };

  return (
    <Collapse>
      <Panel key={'payment'} header={intl.formatMessage({ id: 'geoproducts.payment' })} forceRender>
        <Space direction="vertical" size={30} style={{ width: '100%' }}>
          <Row>
            <Col span={12}>
              <RadioGroup
                size="middle"
                name={[dynamicRow, 'paymentType']}
                direction="vertical"
                onChange={onPaymentChange}
                initialValue={PaymentTypeEnum.Free}
                disabled={isPublic}
              >
                <Space direction="vertical" size={30} style={{ width: '100%' }}>
                  <Radio value={PaymentTypeEnum.Free} label={intl.formatMessage({ id: 'geoproducts.free' })} />
                  <Radio value={PaymentTypeEnum.Fee} label={intl.formatMessage({ id: 'geoproducts.fee' })} />
                  <PaymentPrePayWrapper disabled={isProd}>
                    {isProd && (
                      <div className="disabled-label-wrapper">
                        <Label label={intl.formatMessage({ id: 'payment_module_disabled' })} />
                      </div>
                    )}
                    <Radio
                      disabled={isProd}
                      value={PaymentTypeEnum.Prepay}
                      label={intl.formatMessage({ id: 'geoproducts.prepay' })}
                    />
                  </PaymentPrePayWrapper>
                </Space>
              </RadioGroup>
            </Col>
            <Col span={12}>
              <Space direction="vertical" size={1} style={{ width: '100%' }}>
                <EmptyRow />
                <InputNumber
                  name={[dynamicRow, 'feeCost']}
                  label={intl.formatMessage({ id: 'geoproducts.fee_cost' })}
                  disabled={isPublic || paymentType === 'FREE'}
                  precision={2}
                  min={0.01}
                  validations={paymentType === 'FREE' ? undefined : 'required'}
                />
              </Space>
              <Space direction="vertical" size={1} style={{ width: '100%' }}>
                <EmptyRow />
              </Space>
              {showPriceForAll && (
                <Row>
                  <Col span={12}>
                    <Label label={intl.formatMessage({ id: 'geoproducts.cost_for' }) + ':'} />
                  </Col>
                  <Col span={12}>
                    <RadioGroup
                      size="middle"
                      name={[dynamicRow, 'priceFor']}
                      direction="horizontal"
                      disabled={isPublic || paymentType === 'FREE'}
                      initialValue={'SINGLE'}
                    >
                      <Radio value="SINGLE" label={intl.formatMessage({ id: 'geoproducts.for_one' })} />
                      <Radio value="ALL" label={intl.formatMessage({ id: 'geoproducts.for_all' })} />
                    </RadioGroup>
                  </Col>
                </Row>
              )}
              {isProd && (
                <Space direction="vertical" size={1} style={{ width: '100%' }}>
                  <EmptyRow />
                </Space>
              )}
              <Space direction="vertical" size={1} style={{ width: '100%' }}>
                <EmptyRow />
                <PaymentPrePayInputWrapper disabled={isProd}>
                  <Input
                    name={[dynamicRow, 'serviceStep']}
                    label={intl.formatMessage({ id: 'geoproducts.service_step' })}
                    disabled={isPublic || paymentType !== PaymentTypeEnum.Prepay || isProd}
                    validations={paymentType === PaymentTypeEnum.Prepay ? 'required' : undefined}
                  />
                </PaymentPrePayInputWrapper>
              </Space>
              <Space direction="vertical" size={1} style={{ width: '100%' }}>
                <EmptyRow />
                <PaymentPrePayInputWrapper disabled={isProd}>
                  <Input
                    name={[dynamicRow, 'position']}
                    label={intl.formatMessage({ id: 'geoproducts.position' })}
                    disabled={isPublic || paymentType !== PaymentTypeEnum.Prepay || isProd}
                    validations={paymentType === PaymentTypeEnum.Prepay ? 'required' : undefined}
                  />
                </PaymentPrePayInputWrapper>
              </Space>
            </Col>
          </Row>
        </Space>
      </Panel>
    </Collapse>
  );
};

export default PaymentBlock;
