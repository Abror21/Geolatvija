import React, { useEffect, useState } from 'react';
import { Col, Collapse as AntdCollapse, Form, Row, Space, message } from 'antd';
import { ButtonList } from 'styles/layout/table';
import { useIntl } from 'react-intl';
import {
  Button,
  Icon,
  Input,
  Label,
  Switch,
  Tooltip,
  Divider,
  CheckboxGroup,
  Checkbox,
  Collapse,
  Select,
  SelectOption,
} from 'ui';

import { type UserRole, useUserDispatch, useUserState } from 'contexts/UserContext';
import useQueryApiClient from 'utils/useQueryApiClient';
import { StyledLabelWrapper, StyledVerifyButtonWrapper, StyledTabNotifications, StyledMessageWrapper } from './styles';
import useJwt from '../../../../../../../utils/useJwt';
import useLocalStorage from '../../../../../../../utils/useLocalStorage';
import sessionControlBroadcastChannel from '../../../../../../../utils/sessionControlBroadcastChannel';
import { AuthWebStorageEnums, SessionControlBroadcastType } from '../../../../../../../contexts/SessionControlContext';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import SendUserEmailVerificationModal from 'components/Modals/SendEmailVerificationModal';

const TabNotifications = () => {
  const navigate = useNavigate();
  const [showSendEmails, setShowSendEmails] = useState<boolean>(false);
  const [isDisabledEmailInput, setIsDisabledEmailInput] = useState<boolean>(true);
  const [selectedRoleInSelect, setSelectedRoleInSelect] = useState<UserRole>();
  const [showSendEmailVerificationModal, setShowSendEmailVerificationModal] = useState(false);
  const [notificationCheckBox, setNotificationCheckBox] = useState<CheckboxValueType[]>([]);

  const { setInitialCookies, remove } = useJwt();
  const { value: _, setLocalStorageValue: setRefreshTokenLife } = useLocalStorage<{
    start: string;
    end: string;
  }>(AuthWebStorageEnums.REFRESH_TOKEN_LIFE);

  const user = useUserState();
  const activeRole = user.roles.find((e) => e.id === user.selectedRole);
  const isPhysical = activeRole?.code === 'authenticated';

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

  const { appendData: generateEmail, isLoading: isSendingEmail } = useQueryApiClient({
    request: {
      url: `api/v1/user-email/generate`,
      method: 'POST',
      disableOnMount: true,
    },
    onSuccess() {
      setIsDisabledEmailInput(true);
    },
  });

  const { data: organisationsData, isLoading: isOrganisationsLoading } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/organisations/`,
      method: 'GET',
    },
  });

  useQueryApiClient({
    request: {
      url: `api/v1/tapis/notification_configurations/`,
      method: 'GET',
    },
    onSuccess(res) {
      if (res && res.length > 0) {
        const voteStart = res[0].vote_start ? 'vote_start' : undefined;
        const submitStart = res[0].submit_start ? 'submit_start' : undefined;
        const atvk_ids = res.map((item: any) => item.atvk_id);
        form.setFieldsValue({ notice_checkbox: [submitStart, voteStart], atvk_id: atvk_ids });
      }
    },
  });

  const { appendData: postNotificationConfig, isLoading: isPostNotificationLoading } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/notification_configurations`,
      method: 'POST',
    },
    onSuccess() {
      message.success(intl.formatMessage({ id: 'my_participation.notification_restored_successfully' }));
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

  const { Panel } = AntdCollapse;

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

  const handleOnFinish = (values: any) => {
    const booleanData = {
      vote_start: notificationCheckBox?.includes('vote_start') ? true : false,
      submit_start: notificationCheckBox?.includes('submit_start') ? true : false,
    };
    const organisationsData = values?.atvk_id.map((el: any) => {
      return { atvk_id: el, ...booleanData };
    });

    const data = {
      notification_configuration: { configurations: organisationsData.length ? organisationsData : [booleanData] },
    };
    postNotificationConfig(data);
  };

  return (
    <StyledTabNotifications>
      <Label subTitle label={intl.formatMessage({ id: 'my_participation.my_profile.my_profile' })} bold className="" />

      <Form form={form} layout="vertical" onFinish={handleOnFinish}>
        <Space size={22} direction="vertical" style={{ width: '100%' }}>
          <Row gutter={[30, 7]}>
            <Col span={24} md={12}>
              <Input name="name" label={intl.formatMessage({ id: 'group.name_1' })} disabled />
            </Col>
            <Col span={24} md={12}>
              <Input name="surname" label={intl.formatMessage({ id: 'group.surname' })} disabled />
            </Col>
            <Col span={24} md={12}>
              <StyledLabelWrapper>
                <Tooltip
                  title={intl.formatMessage({
                    id: 'my_participation.my_profile.not_verified_email_text',
                  })}
                  overlayClassName={'tooltip-white'}
                  placement={'topLeft'}
                >
                  <Label label={intl.formatMessage({ id: 'group.email' })} />
                </Tooltip>
              </StyledLabelWrapper>

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
            </Col>
            <Col span={24} md={12}>
              <Input
                disabled
                name="address"
                placeholder={'Zeltiņu iela 50, Mārupe'}
                label={intl.formatMessage({ id: 'my_participation.my_profile.declared_address' })}
                suffix={<Icon faBase="far" icon="info-circle" className="field-email-icon-edit" />}
              />
            </Col>

            <Divider />

            <Col span={24}>
              <Label
                subTitle
                label={intl.formatMessage({
                  id: 'my_participation.my_budget.announcements_about_the_participation_budget',
                })}
                bold
                className=""
              />
            </Col>

            <Col span={24}>
              <StyledMessageWrapper>
                {intl.formatMessage({
                  id: 'my_participation.my_budget.the_first_notifications_will_be_sent_out_in_2025',
                })}
              </StyledMessageWrapper>
            </Col>

            <Col span={24}>
              <CheckboxGroup
                direction="vertical"
                name="notice_checkbox"
                onChange={(checkedValue: CheckboxValueType[]) => setNotificationCheckBox(checkedValue)}
              >
                <Checkbox
                  label={intl.formatMessage({
                    id: 'my_participation.my_budget.i_would_like_to_receive_a_notification_about_the_possibility_to_vote_on_projects_in_my_municipality',
                  })}
                  value="vote_start"
                  name="vote_start"
                  defaultChecked={false}
                />

                <Checkbox
                  label={intl.formatMessage({
                    id: 'my_participation.my_budget.i_would_like_to_receive_a_notification_about_the_possibility_of_submitting_the_project_to_my_municipality',
                  })}
                  value="submit_start"
                  name="submit_start"
                  defaultChecked={false}
                />
              </CheckboxGroup>
            </Col>

            <Divider />

            <Col span={24}>
              <Collapse ghost expandIconPosition={'end'}>
                <Panel
                  forceRender
                  key={'key1'}
                  header={intl.formatMessage({
                    id: 'my_participation.my_budget.i_want_to_submit_projects_in_the_municipality_where_i_am_not_registered',
                  })}
                >
                  <Select
                    mode={'multiple'}
                    label={intl.formatMessage({ id: 'my_participation.my_budget.add_another_municipality' })}
                    name={'atvk_id'}
                    placeholder={intl.formatMessage({ id: 'my_participation.my_budget.choose_a_municipality' })}
                    loading={isOrganisationsLoading}
                  >
                    {(organisationsData && Array.isArray(organisationsData)) && organisationsData.map((item: any) => (
                      <SelectOption key={item.id} value={item.atvk_id}>
                        {item.name}
                      </SelectOption>
                    ))}
                  </Select>
                </Panel>
              </Collapse>
            </Col>

            <Divider />

            <Col span={24}>
              <Collapse ghost expandIconPosition={'end'}>
                <Panel
                  forceRender
                  key={'key1'}
                  header={intl.formatMessage({
                    id: 'my_participation.my_budget.i_am_an_employee_of_vpckac_and_have_the_opportunity_to_help_non_digital_customers_vote',
                  })}
                >
                  <Label
                    label={intl.formatMessage({ id: 'my_participation.my_budget.functionality_will_add_over_time' })}
                  />
                </Panel>
              </Collapse>
            </Col>

            <Divider />

            <Col span={24}>
              {showSendEmails && <Switch label={intl.formatMessage({ id: 'group.use_emails' })} name="sendEmail" />}
            </Col>
          </Row>
          <Row justify="end">
            <ButtonList>
              <Button
                label={intl.formatMessage({ id: 'general.cancel' })}
                onClick={() => navigate('/main?my-participation=false')}
              />
              <Button
                loading={isPostNotificationLoading}
                htmlType="submit"
                type="primary"
                label={intl.formatMessage({ id: 'general.submit' })}
              />
            </ButtonList>
          </Row>
        </Space>
      </Form>
      {isPhysical && <Notifications />}
      <SendUserEmailVerificationModal
        isLoading={isSendingEmail}
        email={selectedRoleInSelect?.email ? selectedRoleInSelect?.email : form.getFieldValue('email')}
        setModalOpen={setShowSendEmailVerificationModal}
        modalOpen={showSendEmailVerificationModal}
        userRefetch={true}
      />
    </StyledTabNotifications>
  );
};

export default TabNotifications;
