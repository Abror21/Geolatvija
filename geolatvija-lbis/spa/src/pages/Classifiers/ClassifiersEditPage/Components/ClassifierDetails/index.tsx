import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Input, Switch } from 'ui';
import { Form, Row } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonList } from 'styles/layout/form';
import useQueryApiClient from 'utils/useQueryApiClient';
import { FormInstance } from 'antd/es/form/hooks/useForm';

interface ClassifierDetailProps {
  setDetailsLoading: Dispatch<SetStateAction<boolean>>;
  form: FormInstance;
  refetch: () => void;
  setEnableWeights: Dispatch<SetStateAction<boolean>>;
  setRefresh: Dispatch<SetStateAction<number>>;
}

interface FormProps {
  translation: string;
}

const ClassifierDetails = ({
  setDetailsLoading,
  form,
  refetch,
  setEnableWeights,
  setRefresh,
}: ClassifierDetailProps) => {
  const [readOnly, setReadOnly] = useState(true);
  const navigate = useNavigate();

  const intl = useIntl();
  const { id } = useParams();

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/classifiers/${id}`,
      method: 'PATCH',
    },
    onSuccess: () => {
      refetch();
      setRefresh((prev) => prev + 1);
      setReadOnly(true);
    },
    onFinally: () => setDetailsLoading(false),
  });

  const onSubmit = async (values: FormProps) => {
    appendData(values);
  };

  const renderActionButton = () => {
    if (readOnly) {
      return (
        <>
          <Button
            label={intl.formatMessage({
              id: 'general.back',
            })}
            onClick={() => navigate(-1)}
          />
          <Button
            label={intl.formatMessage({
              id: 'general.edit',
            })}
            type="primary"
            onClick={() => setReadOnly(false)}
          />
        </>
      );
    }

    return (
      <>
        <Button
          label={intl.formatMessage({
            id: 'general.cancel',
          })}
          onClick={() => {
            setReadOnly(true);
            refetch();
          }}
        />
        <Button
          label={intl.formatMessage({
            id: 'general.save',
          })}
          type="primary"
          onClick={() => form.submit()}
        />
      </>
    );
  };

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Switch
        disabled={readOnly}
        name="enableWeights"
        label={intl.formatMessage({ id: 'classifier.enable_weights' })}
        onChange={(checked) => setEnableWeights(checked)}
      />
      <Input
        label={intl.formatMessage({ id: 'classifier.name' })}
        disabled={readOnly}
        name="translation"
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'validation.field_required' }),
          },
        ]}
      />
      <Row justify="end">
        <ButtonList>{renderActionButton()}</ButtonList>
      </Row>
    </Form>
  );
};
export default ClassifierDetails;
