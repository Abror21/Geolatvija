import React, { Dispatch, SetStateAction } from 'react';
import { Button, Input, InputNumber, Modal, Spinner } from 'ui';
import { Form, Row } from 'antd';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonListModal } from '../../../../../styles/layout/form';

interface CreateNewValueProps {
  showModal: boolean;
  selectedId?: number;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setRefresh: Dispatch<SetStateAction<number>>;
  setSelectedId: Dispatch<SetStateAction<number | undefined>>;
  weightsEnabled: boolean;
}

export interface ClassifierValueFormProps {
  translation: string;
  valueCode: string;
}

const ClassifierValueModal = ({
  showModal,
  setShowModal,
  setRefresh,
  selectedId,
  setSelectedId,
  weightsEnabled,
}: CreateNewValueProps) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { id } = useParams();
  const isEdit = !!selectedId;

  const { isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/${id}/values/${selectedId}`,
      data: [],
      method: 'GET',
    },
    onSuccess: (response: ClassifierValueFormProps) => form.setFieldsValue(response),
    enabled: !!selectedId,
  });

  const { appendData } = useQueryApiClient({
    request: {
      url: isEdit ? `api/v1/classifiers/${id}/values/${selectedId}` : `api/v1/classifiers/${id}/values`,
      method: isEdit ? 'PATCH' : 'POST',
    },
    onSuccess: () => {
      setRefresh((oldKey) => oldKey + 1);
      onCancel();
    },
  });

  const onCancel = () => {
    form.resetFields();
    setShowModal(false);
    setSelectedId(undefined);
  };

  return (
    <Modal
      open={showModal}
      footer={null}
      onCancel={onCancel}
      title={intl.formatMessage({
        id: isEdit ? 'classifier.edit' : 'classifier.create_new_value',
      })}
    >
      <Spinner spinning={isLoading}>
        <Form form={form} onFinish={appendData} layout="vertical">
          <Input
            name="valueCode"
            label={intl.formatMessage({
              id: 'classifier.value_code',
            })}
            validations={['required']}
          />
          <Input
            name="translation"
            label={intl.formatMessage({
              id: 'classifier.name',
            })}
            validations={['required']}
          />
          <InputNumber
            disabled={!weightsEnabled}
            name="weight"
            label={intl.formatMessage({
              id: 'classifier.weight',
            })}
          />
          <Row justify="end">
            <ButtonListModal>
              <Button
                type="primary"
                label={intl.formatMessage({
                  id: 'general.save',
                })}
                htmlType="submit"
              />
            </ButtonListModal>
          </Row>
        </Form>
      </Spinner>
    </Modal>
  );
};

export default ClassifierValueModal;
