import React, { useState } from 'react';
import { Modal, Button, Input, Radio, RadioGroup, TextArea, InputNumber } from 'ui';
import { useIntl } from 'react-intl';
import { Col, Form, Row, Space } from 'antd';
import { ButtonList } from '../../../../styles/layout/form';
import { RadioChangeEvent } from 'antd/es/radio/interface';
import useQueryApiClient from '../../../../utils/useQueryApiClient';

interface AddProcessingTypeModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  refetch: Function;
}

const AddProcessingTypeModal = ({ isOpen, setIsOpen, refetch }: AddProcessingTypeModalProps) => {
  const [unificationType, setUnificationType] = useState<string>('NONE');

  const intl = useIntl();
  const [form] = Form.useForm();

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/processing-types`,
      method: 'POST',
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
      form.resetFields();
    },
  });

  const onUnificationChange = (value: RadioChangeEvent) => {
    setUnificationType(value.target.value);
    form.setFieldsValue({
      symbolAmount: null,
      directoryName: null,
    });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      modalType={2}
      getContainer={document.body}
      width={830}
      title={intl.formatMessage({ id: 'geoproducts.add_processing_type' })}
      zIndex={1051}
    >
      <Form form={form} onFinish={appendData} layout="vertical">
        <Input label={intl.formatMessage({ id: 'processing_type.name' })} name="name" validations="required" />
        <Space size={23} direction="vertical" style={{ width: '100%' }}>
          <RadioGroup
            size="middle"
            name="unificationType"
            direction="vertical"
            label={intl.formatMessage({ id: 'processing_type.file_add_type' })}
            initialValue="NONE"
            onChange={onUnificationChange}
          >
            <Radio value="NONE" label={intl.formatMessage({ id: 'processing_type.not' })} />
            <Radio value="UNIFY" label={intl.formatMessage({ id: 'processing_type.combine' })} />
          </RadioGroup>
        </Space>
        <Row gutter={30}>
          <Col span={12}>
            <InputNumber
              label={intl.formatMessage({ id: 'processing_type.first_symbols' })}
              name="symbolAmount"
              disabled={unificationType !== 'UNIFY'}
              validations={unificationType === 'UNIFY' ? ['required'] : []}
              min={1}
              max={255}
              precision={0}
            />
          </Col>
          <Col span={12}>
            <Input
              label={intl.formatMessage({ id: 'processing_type.directory_names' })}
              name="directoryName"
              validations={['required']}
            />
          </Col>
        </Row>

        <TextArea label={intl.formatMessage({ id: 'processing_type.description' })} name="description" />
        <Row justify="end">
          <ButtonList>
            <Button
              label={intl.formatMessage({
                id: 'general.cancel',
              })}
              onClick={() => setIsOpen(false)}
            />
            <Button
              type="primary"
              label={intl.formatMessage({
                id: 'general.save',
              })}
              htmlType="submit"
            />
          </ButtonList>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddProcessingTypeModal;
