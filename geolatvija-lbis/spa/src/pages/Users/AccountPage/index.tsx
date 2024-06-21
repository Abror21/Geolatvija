import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Space } from 'antd';
import DefaultLayout from 'components/DefaultLayout';
import { StyledPage, ButtonList } from 'styles/layout/table';
import { useIntl } from 'react-intl';
import { Button, Icon, Input, Label, Switch, Tooltip } from 'ui';
import { type UserRole, useUserDispatch, useUserState } from 'contexts/UserContext';
import useQueryApiClient from 'utils/useQueryApiClient';
import UserRoleSelect from 'components/Selects/UserRoleSelect';
import { StyledEmailInput, StyledLabelWrapper, StyledVerifyButtonWrapper } from './styles';
import SendUserEmailVerificationModal from '../../../components/Modals/SendEmailVerificationModal';
import useJwt from '../../../utils/useJwt';
import useLocalStorage from '../../../utils/useLocalStorage';
import sessionControlBroadcastChannel from '../../../utils/sessionControlBroadcastChannel';
import { AuthWebStorageEnums, SessionControlBroadcastType } from '../../../contexts/SessionControlContext';

const AccountPage = () => {
  const [showSendEmails, setShowSendEmails] = useState<boolean>(false);
  const [selectedRoleInSelect, setSelectedRoleInSelect] = useState<UserRole>();
  const [showSendEmailVerificationModal, setShowSendEmailVerificationModal] = useState(false);
  const [isDisabledEmailInput, setIsDisabledEmailInput] = useState<boolean>(true);

  const { setInitialCookies, remove } = useJwt();
  const { value: _, setLocalStorageValue: setRefreshTokenLife } = useLocalStorage<{
    start: string;
    end: string;
  }>(AuthWebStorageEnums.REFRESH_TOKEN_LIFE);

  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const dispatch = useUserDispatch();

  const intl = useIntl();
  const [form] = Form.useForm();

  useEffect(() => {
    setSelectedRoleInSelect(activeRole);
  }, [activeRole]);

  const { appendData: changeRole } = useQueryApiClient({
    request: {
      url: `api/v1/token/:id`,
      method: 'GET',
      disableOnMount: true,
    },
    onSuccess: (res) => {
      sessionControlBroadcastChannel.postMessage({ type: SessionControlBroadcastType.RELOAD_PAGE });
      remove();
      setInitialCookies(
        res?.access_token?.token,
        res?.access_token?.expires_at,
        res?.refresh_token?.token,
        res?.refresh_token?.expires_at
      );
      setRefreshTokenLife({
        start: res?.refresh_token?.expire_set_at,
        end: res?.refresh_token?.expires_at,
      });
      dispatch({
        type: 'SELECT_ROLE',
        payload: { selectedRole: form.getFieldValue('selectedRole'), loggingOut: false },
      });
      window.location.reload();
    },
  });

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/users`,
      method: 'PATCH',
    },
    onSuccess: () => {
      changeRole({}, { id: selectedRoleInSelect?.id });
    },
  });

  const { appendData: generateEmail, isLoading: isSendingEmail } = useQueryApiClient({
    request: {
      url: `api/v1/user-email/generate`,
      method: 'POST',
      disableOnMount: true,
    },
  });

  useEffect(() => {
    form.setFieldsValue({
      name: user.name,
      surname: user.surname,
      email: activeRole?.email,
      selectedRole: user.selectedRole,
      sendEmail: user.sendEmail,
    });

    const hasEmailRole = user.roles.find((e) => ['admin', 'data_owner'].includes(e.code));

    setShowSendEmails(!!hasEmailRole);
  }, [user, form]);

  const cancelHandler = () => {
    form.setFieldValue('email', '');
  };

  const onUserRoleSelectChange = (selectedRoleId: number) => {
    const role = user.roles.find((e) => e.id === selectedRoleId);
    setSelectedRoleInSelect(role);
    form.setFieldsValue({
      email: role?.email,
    });
  };

  const onGenerateVerificationEmail = () => {
    setShowSendEmailVerificationModal(true);
    generateEmail({
      email: form.getFieldValue('email'),
      roleId: selectedRoleInSelect?.id,
    });
  };

  const handleCancelEmailEdit = () => {
    setIsDisabledEmailInput(true);
    form.setFieldValue('email', selectedRoleInSelect?.email);
  };

  return (
    <DefaultLayout.PageLayout>
      <DefaultLayout.PageContent>
        <StyledPage>
          <DefaultLayout.PageHeader
            title={intl.formatMessage({ id: 'profile.my_invoice' })}
            breadcrumb={[
              {
                path: '/',
                name: intl.formatMessage({ id: 'general.start' }),
              },
            ]}
          />
          <Form form={form} layout="vertical" onFinish={() => appendData(form.getFieldsValue(true))}>
            <Space size={22} direction="vertical" style={{ width: '100%' }}>
              <Row gutter={[30, 7]}>
                <Col span={24} md={12}>
                  <Input name="name" label={intl.formatMessage({ id: 'group.name_1' })} disabled />
                </Col>
                <Col span={24} md={12}>
                  <Input name="surname" label={intl.formatMessage({ id: 'group.surname' })} disabled />
                </Col>
                <Col span={24}>
                  <StyledLabelWrapper>
                    <Label label={intl.formatMessage({ id: 'group.email' })} />
                    {!selectedRoleInSelect?.emailVerified && !!selectedRoleInSelect?.email && (
                      <Label className="not-verified" label={intl.formatMessage({ id: 'group.email_not_verified' })} />
                    )}
                  </StyledLabelWrapper>
                  <StyledEmailInput>
                    <Input
                      disabled={isDisabledEmailInput}
                      name="email"
                      suffix={
                        isDisabledEmailInput && (
                          <>
                            {(!selectedRoleInSelect?.email || !selectedRoleInSelect?.emailVerified) && (
                              <Tooltip
                                title={intl.formatMessage({
                                  id: !selectedRoleInSelect?.email
                                    ? 'my_participation.my_profile.empty_email_tooltip_text'
                                    : 'my_participation.my_profile.not_verified_email_text',
                                })}
                                overlayClassName={'tooltip-white'}
                                placement={'topRight'}
                              >
                                <div className="icon-warning">
                                  <Icon
                                    faBase="far"
                                    icon="exclamation-triangle"
                                    className="field-email-icon-exclamation-triangle"
                                  />
                                </div>
                              </Tooltip>
                            )}

                            <Icon
                              faBase="far"
                              icon="edit"
                              className="field-email-icon-edit"
                              onClick={() => setIsDisabledEmailInput(false)}
                            />
                          </>
                        )
                      }
                    />

                    {!isDisabledEmailInput && (
                      <StyledVerifyButtonWrapper>
                        <Button
                          onClick={handleCancelEmailEdit}
                          type="default"
                          label={intl.formatMessage({ id: 'general.cancel_changes' })}
                        />
                        <Button
                          onClick={onGenerateVerificationEmail}
                          type="primary"
                          label={intl.formatMessage({ id: 'group.verify' })}
                        />
                      </StyledVerifyButtonWrapper>
                    )}
                  </StyledEmailInput>
                </Col>
                <Col span={24}>
                  <UserRoleSelect name="selectedRole" onChange={onUserRoleSelectChange} />
                </Col>

                <Col span={24}>
                  {showSendEmails && <Switch label={intl.formatMessage({ id: 'group.use_emails' })} name="sendEmail" />}
                </Col>
              </Row>
              <Row justify="end">
                <ButtonList>
                  <Button label={intl.formatMessage({ id: 'general.cancel' })} onClick={cancelHandler} />
                  <Button htmlType="submit" type="primary" label={intl.formatMessage({ id: 'general.submit' })} />
                </ButtonList>
              </Row>
            </Space>
          </Form>
          <SendUserEmailVerificationModal
            isLoading={isSendingEmail}
            email={selectedRoleInSelect?.email ? selectedRoleInSelect?.email : form.getFieldValue('email')}
            setModalOpen={setShowSendEmailVerificationModal}
            modalOpen={showSendEmailVerificationModal}
            userRefetch={true}
          />
        </StyledPage>
      </DefaultLayout.PageContent>
    </DefaultLayout.PageLayout>
  );
};

export default AccountPage;
