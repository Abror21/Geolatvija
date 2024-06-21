import React, { useState } from 'react';
import DefaultLayout from 'components/DefaultLayout';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Icon, Input, Modal, Popover, Switch, Table, Tooltip } from 'ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Form, Row } from 'antd';
import { pages } from 'constants/pages';
import useQueryApiClient from 'utils/useQueryApiClient';
import { ButtonList, ButtonListModal, StyledForm, StyledPage } from 'styles/layout/form';
import { ClassifierSelect } from '../../../components/Selects';
import UserInstitutionSelect from '../../../components/Selects/UserInstitutionSelect';
import toastMessage from '../../../utils/toastMessage';
import { StyledUserInstitutionSelectWrapper } from './styles';

const ThematicUserGroupCreateEditPage = () => {
  const [tableData, setTableData] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUserType, setSelectedUserType] = useState<string>();

  const intl = useIntl();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const {} = useQueryApiClient({
    request: {
      url: `api/v1/thematic-user-groups/${id}`,
      disableOnMount: !id,
    },
    onSuccess: (response) => {
      form.setFieldsValue(response);
      setTableData(response['users']);
    },
  });

  const validateUniqueness = (response: { regNr?: string; personalCode?: string }) => {
    const isUnique = (key: keyof typeof response) => {
      return !tableData.some((data: any) => data[key] === response[key]);
    };

    return !((response.regNr && !isUnique('regNr')) || (response.personalCode && !isUnique('personalCode')));
  };

  const { appendData } = useQueryApiClient({
    request: {
      url: id ? `api/v1/thematic-user-groups/${id}` : `api/v1/thematic-user-groups`,
      method: id ? 'PATCH' : 'POST',
    },
    onSuccess: () => navigate(pages.thematicUserGroups.url),
  });

  const { appendData: searchUser } = useQueryApiClient({
    request: {
      url: `api/v1/thematic-user-groups/search-user`,
      disableOnMount: true,
    },
    onSuccess: (response) => {
      const validated = validateUniqueness(response);

      if (!validated) {
        toastMessage.error(intl.formatMessage({ id: 'thematic_user_group.person_already_exists' }));
        return;
      }

      setTableData((old: any, index: number) => [...old, { index: index, ...response }]);
    },
    onFinally: () => {
      searchForm.resetFields();
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
            <UserInstitutionSelect noStyle allowClear label={' '} name={['users', index, 'institutionClassifierId']} />
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
        if (!id) {
          return;
        }

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
        entry.institutionClassifierId = values?.users?.[index]?.['institutionClassifierId'];
        entry.isActive = values?.users?.[index]?.['isActive'];

        return entry;
      }),
    };

    appendData(parsed);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({
              id: id ? pages.thematicUserGroups.edit.title : pages.thematicUserGroups.create.title,
            })}
            breadcrumb={[
              {
                path: pages.thematicUserGroups.url,
                name: intl.formatMessage({ id: pages.thematicUserGroups.title }),
              },
            ]}
          />
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
              <Table dataSource={tableData} columns={columns} rowKey="index" />
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
                    onClick={() => navigate(pages.thematicUserGroups.url)}
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
        </StyledPage>
        <Modal
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
              onChange={(v: string) => {
                setSelectedUserType(v);
                searchForm.setFieldValue('number', null);
              }}
            />
            {selectedUserType === 'LEGAL_PERSON' ? (
              <UserInstitutionSelect
                label={intl.formatMessage({ id: 'thematic_user_group.personal_code' })}
                name="number"
                validations="required"
              />
            ) : (
              <Tooltip hack title={intl.formatMessage({ id: 'thematic_user_group.personal_code_tooltip' })}>
                <Input
                  label={intl.formatMessage({ id: 'thematic_user_group.personal_code' })}
                  name="number"
                  validations="personalCode"
                />
              </Tooltip>
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
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default ThematicUserGroupCreateEditPage;
