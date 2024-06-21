import React, { Dispatch, SetStateAction } from 'react';
import { Button } from 'ui';
import { useIntl } from 'react-intl';
import { StyledFilter } from './styles';
import { Form } from 'antd';
import { FormInstance } from 'antd/es/form/hooks/useForm';

interface FilterProps {
  form: FormInstance;
  primaryLabel?: string;
  filter: React.ReactNode;
  rightSideActions?: React.ReactNode;
  leftSideActions?: React.ReactNode;
  additionalActions?: React.ReactNode;
  hideActions?: boolean;
  setFilter: Dispatch<SetStateAction<object>>;
  onFormTouch?: Function;
  onFinish?: Function;
  disabled?: boolean;
  onDelete?: Function;
}

const Filter = ({
  form,
  filter,
  rightSideActions,
  setFilter,
  onFinish,
  primaryLabel,
  onDelete,
  hideActions,
  additionalActions,
  disabled = false,
  onFormTouch,
  leftSideActions,
}: FilterProps) => {
  const intl = useIntl();

  const onDeleteInner = () => {
    form.resetFields();
    setFilter({});
  };

  const onFinishInner = (values: any) => {
    setFilter(values);
  };

  const defaultActions = (
    <>
      <Button label={intl.formatMessage({ id: 'general.delete_filter' })} onClick={onDelete || onDeleteInner} />
      <Button
        disabled={disabled}
        type="primary"
        label={primaryLabel || intl.formatMessage({ id: 'general.search' })}
        htmlType="submit"
      />
      {additionalActions}
    </>
  );

  return (
    <Form
      form={form}
      onFieldsChange={(e, allFields) => (onFormTouch ? onFormTouch(e, allFields) : null)}
      layout="vertical"
      onFinish={(values) => {
        if (onFinish) {
          onFinish(values);
        } else {
          onFinishInner(values);
        }
      }}
    >
      <StyledFilter>
        <div className="filter-fields">{filter}</div>
        <div className={`actions-list  ${!hideActions ? 'my-9' : 'mb-9'}`}>
          <div className="left-side">{leftSideActions}</div>
          <div className="right-side">{rightSideActions || defaultActions}</div>
        </div>
      </StyledFilter>
    </Form>
  );
};

export default Filter;
