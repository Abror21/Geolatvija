import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { useIntl } from 'react-intl';
import { ButtonList, ButtonListModal, StyledForm, StyledPage } from 'styles/layout/form';
import { Button, DatePicker, Input, Modal, Switch, Table } from 'ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Form, Row } from 'antd';
import { ClassifierSelect } from 'components/Selects';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import dayjs, { Dayjs } from 'dayjs';
import UserGroupSelect from 'components/Selects/UserGroupSelect';
import UserInstitutionSelect from 'components/Selects/UserInstitutionSelect';
import { useUserState } from '../../../../contexts/UserContext';

interface RolesProps {
  id?: number;
  index: number;
  role: number;
  institution: number;
  isActive?: boolean;
  activeTill: Dayjs;
  email?: string;
}

const UserCreateEditPage = () => {
  const [roles, setRoles] = useState<RolesProps[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedKeysOfRolesTable, setSelectedKeysOfRolesTable] = useState<Array<number>>([]);

  const intl = useIntl();
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);

  //get user
  const {} = useQueryApiClient({
    request: {
      url: `api/v1/users/${id}`,
      disableOnMount: !id,
    },
    onSuccess: (response) => {
      const parsed = {
        ...response,
        activeTill: response.activeTill && dayjs(response.activeTill),
      };

      form.setFieldsValue(parsed);

      const parsedRoles = response.roles.map((role: RolesProps) => {
        role.activeTill = role.activeTill && dayjs(role.activeTill);
        return role;
      });

      setRoles(parsedRoles);
    },
  });

  //save/update user
  const { appendData } = useQueryApiClient({
    request: {
      url: id ? `api/v1/users/${id}` : `api/v1/users/create`,
      method: id ? 'PATCH' : 'POST',
    },
    onSuccess: () => navigate(pages.userManagement.url),
  });

  const { data: institutions } = useQueryApiClient({
    request: {
      url: `api/v1/institution-classifiers/select`,
    },
  });

  const { data: userGroups } = useQueryApiClient({
    request: {
      url: `api/v1/roles/groups-select`,
    },
  });

  const columns = [
    {
      title: intl.formatMessage({ id: 'user_management.role_name' }),
      dataIndex: 'userGroupId',
      render: (value: string) => userGroups.find((e: any) => e.id === value)?.name,
    },
    {
      title: intl.formatMessage({ id: 'user_management.institution_name' }),
      dataIndex: 'institutionClassifierId',
      render: (value: string) => institutions.find((e: any) => e.id === value)?.name,
    },
    {
      title: intl.formatMessage({ id: 'group.email' }),
      dataIndex: 'email',
      render: (value: string, record: any, index: number) => <Input initialValue={value} name={['emails', index]} />,
    },
    {
      title: intl.formatMessage({ id: 'user_management.status' }),
      dataIndex: 'isActive',
      render: (value: boolean, record: RolesProps, index: number) => (
        <Switch defaultChecked={value} onChange={(value) => onSwitchChange(value, record)} disableForm />
      ),
    },
    {
      title: intl.formatMessage({ id: 'user_management.active_till' }),
      dataIndex: 'activeTill',
      render: (value: string) => value && dayjs(value).format('DD.MM.YYYY'),
    },
  ];

  const onEmailChange = (value: string, record: RolesProps) => {
    record.email = value;
  };

  const onSwitchChange = (value: boolean, record: RolesProps) => {
    record.isActive = value;
  };

  const onCancel = () => {
    modalForm.resetFields();
    setShowModal(false);
  };

  const onFinish = (values: any) => {
    const parse = {
      ...values,
      roles: roles,
    };

    appendData(parse);
  };

  const onModalFinish = (values: RolesProps) => {
    values.index = roles.length;

    setRoles((old) => [...old, values]);

    setShowModal(false);
  };

  const onExtend = () => {
    setRoles((old) =>
      old.map((role, index) => {
        if (selectedKeysOfRolesTable.includes(role.index)) {
          role.activeTill = role.activeTill ? role.activeTill.add(1, 'y') : dayjs().add(1, 'y');
        }

        return role;
      })
    );
  };

  const onDelete = () => {
    setRoles((old) => old.filter((role) => !selectedKeysOfRolesTable.includes(role.index)));
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: id ? 'user_management.edit_user' : 'user_management.add_user' })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.administration' }),
              },
              {
                path: pages.userManagement.url,
                name: intl.formatMessage({ id: 'user_management.user_management' }),
              },
            ]}
          />
          <StyledForm>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={20}>
                <Col span={12}>
                  <Input
                    name="name"
                    label={intl.formatMessage({ id: 'user_management.name' })}
                    disabled={!!id}
                    validations="required"
                  />
                </Col>
                <Col span={12}>
                  <Input
                    name="surname"
                    label={intl.formatMessage({ id: 'user_management.surname' })}
                    disabled={!!id}
                    validations="required"
                  />
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={12}>
                  <Input
                    label={intl.formatMessage({ id: 'user_management.personal_code' })}
                    name="personalCode"
                    validations={id ? [] : ['personalCode', 'required']}
                    disabled={!!id}
                  />
                </Col>
                <Col span={12}>
                  <ClassifierSelect
                    allowClear
                    code="KL21"
                    name="statusClassifierValueId"
                    label={intl.formatMessage({ id: 'user_management.user_status' })}
                  />
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={12}>
                  <DatePicker
                    label={intl.formatMessage({ id: 'user_management.active_till' })}
                    name="activeTill"
                    initialValue={dayjs().add(1, 'y')}
                  />
                </Col>
              </Row>
              <ButtonList>
                <Button
                  type="primary"
                  label={intl.formatMessage({ id: 'general.add' })}
                  onClick={() => setShowModal(true)}
                />
                <Button label={intl.formatMessage({ id: 'general.delete' })} onClick={onDelete} />
                <Button label={intl.formatMessage({ id: 'general.extend' })} onClick={onExtend} />
              </ButtonList>
              <Table
                rowKey="index"
                dataSource={roles}
                columns={columns}
                enableSelectedRow
                setSelectedKeys={setSelectedKeysOfRolesTable}
              />

              <ButtonList>
                <Button htmlType="submit" type="primary" label={intl.formatMessage({ id: 'general.save' })} />
                <Button label={intl.formatMessage({ id: 'general.cancel' })} href={pages.userManagement.url} />
              </ButtonList>
            </Form>
          </StyledForm>
        </StyledPage>
        <Modal open={showModal} footer={null} onCancel={onCancel} title={intl.formatMessage({ id: 'general.add' })}>
          <Form form={modalForm} onFinish={onModalFinish} layout="vertical">
            <UserGroupSelect name="userGroupId" validations="required" type="LIMITED" />
            <UserInstitutionSelect
              initialValue={activeRole?.institutionClassifierId}
              name="institutionClassifierId"
              validations="required"
              type="USER_MANAGEMENT"
            />
            <Input label={intl.formatMessage({ id: 'group.email' })} name="email" type="email" />
            <DatePicker label={intl.formatMessage({ id: 'user_management.active_till' })} name="activeTill" />
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
        </Modal>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default UserCreateEditPage;
