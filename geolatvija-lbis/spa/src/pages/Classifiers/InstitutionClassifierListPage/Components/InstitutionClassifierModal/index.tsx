import React, { Dispatch, SetStateAction } from 'react';
import { Button, Input, Modal, Spinner, InputNumber } from 'ui';
import { Form, Row } from 'antd';
import { useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonListModal } from 'styles/layout/form';
import { ClassifierSelect } from 'components/Selects';

interface CreateNewValueProps {
  showModal: boolean;
  selectedId?: number;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setRefresh: Dispatch<SetStateAction<number>>;
  setSelectedId: Dispatch<SetStateAction<number | undefined>>;
}

export interface ClassifierValueFormProps {
  translation: string;
  valueCode: string;
}

const InstitutionClassifierModal = ({
  showModal,
  setShowModal,
  setRefresh,
  selectedId,
  setSelectedId,
}: CreateNewValueProps) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const isEdit = !!selectedId;

  const { isLoading } = useQueryApiClient({
    request: {
      url: `api/v1/institution-classifiers/${selectedId}`,
      data: [],
      method: 'GET',
    },
    onSuccess: (response: ClassifierValueFormProps) => form.setFieldsValue(response),
    enabled: !!selectedId,
  });

  const { appendData } = useQueryApiClient({
    request: {
      url: isEdit ? `api/v1/institution-classifiers/${selectedId}` : `api/v1/institution-classifiers`,
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
          <InputNumber
            name="regNr"
            label={intl.formatMessage({
              id: 'classifier.reg_nr',
            })}
            validations={['required', 'regNr']}
          />

          <Input
            name="name"
            label={intl.formatMessage({
              id: 'classifier.name',
            })}
            validations={['required']}
          />

          <ClassifierSelect
            allowClear
            label={intl.formatMessage({
              id: 'classifier.institution_type',
            })}
            code="KL28"
            name="institutionTypeClassifierValueId"
            validations={['required']}
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

export default InstitutionClassifierModal;
