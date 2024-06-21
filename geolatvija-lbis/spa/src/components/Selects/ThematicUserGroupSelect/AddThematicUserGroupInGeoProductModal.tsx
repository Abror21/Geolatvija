import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Icon, Input, Modal, Popover, Switch, Table } from 'ui';
import { Col, Form, Row } from 'antd';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonList, ButtonListModal, StyledForm } from 'styles/layout/form';
import { ClassifierSelect } from '../index';
import UserInstitutionSelect from '../UserInstitutionSelect';
import { StyledUserInstitutionSelectWrapper } from './styles';

type AddThematicUserGroupInGeoProductModalProps = {
  isOpen: boolean;
  setIsOpen: Function;
  refetch: Function;
};

const AddThematicUserGroupInGeoProductModal = ({
  isOpen,
  setIsOpen,
  refetch,
}: AddThematicUserGroupInGeoProductModalProps) => {
  const [tableData, setTableData] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUserType, setSelectedUserType] = useState<string>();

  const intl = useIntl();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/thematic-user-groups`,
      method: 'POST',
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
      form.resetFields();
    },
  });

  const { appendData: searchUser } = useQueryApiClient({
    request: {
      url: `api/v1/thematic-user-groups/search-user`,
      disableOnMount: true,
    },
    onSuccess: (response) => {
      setTableData((old: any, index: number) => [...old, { index: index, ...response }]);
      setShowModal(false);
    },
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'thematic_user_group.user_type' }),
      dataIndex: 'personalCode',
      render: (value: string) =>
        value
          ? intl.formatMessage({ id: 'thematic_user_group.physical_person' })
          : intl.formatMessage({ id: 'thematic_user_group.legal_person' }),
    },
    {
      title: intl.formatMessage({ id: 'thematic_user_group.personal_code' }),
      dataIndex: 'personalCode',
      render: (value: string, record: any) => value || record.regNr,
    },
    {
      title: intl.formatMessage({ id: 'thematic_user_group.name_name' }),
      dataIndex: 'name',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'thematic_user_group.surname' }),
      dataIndex: 'surname',
      render: (value: string) => value,
    },
    {
      title: intl.formatMessage({ id: 'thematic_user_group.belonging' }),
      dataIndex: 'users',
      render: (_: string, record: any, index: number) => {
        if (record.regNr) {
          return <></>;
        }

        return (
          <StyledUserInstitutionSelectWrapper>
            <UserInstitutionSelect noStyle label={' '} name={['users', index, 'institutionClassifierId']} allowClear />
          </StyledUserInstitutionSelectWrapper>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'thematic_user_group.active' }),
      dataIndex: 'isActive',
      render: (value: boolean, _: any, index: number) => <Switch name={['users', index, 'isActive']} noStyle />,
    },
    {
      render: (_: any, __: any, index: number) => {
        return (
          <Popover
            content={
              <>
                <div className="popover-item" onClick={() => onRemove(index)}>
                  <FormattedMessage id="general.delete" />
                </div>
              </>
            }
            trigger="click"
            placement="bottom"
          >
            <Icon faBase="fal" icon="ellipsis-v" />
          </Popover>
        );
      },
    },
  ];

  const onRemove = (selectedIndex: number) => {
    setTableData((old: any) => old.filter((_: any, index: number) => index !== selectedIndex));
  };

  const onFinish = (values: any) => {
    const parsed = {
      ...values,
      users: tableData.map((entry: any, index: number) => {
        if (values?.users?.[index]?.['institutionClassifierId']) {
          entry.institutionClassifierId = values?.users?.[index]?.['institutionClassifierId'];
        }

        entry.isActive = values?.users?.[index]?.['isActive'];

        return entry;
      }),
    };

    appendData(parsed);
  };

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        width={1230}
        title={intl.formatMessage({ id: 'general.add_group' })}
      >
        <StyledForm>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Row gutter={30}>
              <Col span={12}>
                <Input
                  label={intl.formatMessage({ id: 'thematic_user_group.name' })}
                  name="name"
                  validations="required"
                />
              </Col>
              <Col span={12} />
            </Row>
            <Table dataSource={tableData} columns={columns} rowKey="id" />
            <Row justify="end">
              <ButtonList>
                <Button
                  label={intl.formatMessage({
                    id: 'general.add',
                  })}
                  onClick={() => setShowModal(true)}
                />
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
        </StyledForm>
      </Modal>
      <Modal
        zIndex={1001}
        open={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
        title={intl.formatMessage({
          id: 'general.search',
        })}
        closable={false}
      >
        <Form form={searchForm} onFinish={searchUser} layout="vertical">
          <ClassifierSelect
            label={intl.formatMessage({ id: 'thematic_user_group.user_type' })}
            allowClear
            code="KL29"
            name="userTypeClassifierValueId"
            validations="required"
            type="code"
            onChange={(v: string) => setSelectedUserType(v)}
          />
          {selectedUserType === 'LEGAL_PERSON' ? (
            <UserInstitutionSelect
              label={intl.formatMessage({ id: 'thematic_user_group.personal_code' })}
              name="number"
              validations="required"
            />
          ) : (
            <Input
              label={intl.formatMessage({ id: 'thematic_user_group.personal_code' })}
              name="number"
              validations="required"
            />
          )}

          <Row justify="end">
            <ButtonListModal>
              <Button
                label={intl.formatMessage({
                  id: 'general.cancel',
                })}
                onClick={() => setShowModal(false)}
              />
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
      </Modal>
    </>
  );
};

export default AddThematicUserGroupInGeoProductModal;
