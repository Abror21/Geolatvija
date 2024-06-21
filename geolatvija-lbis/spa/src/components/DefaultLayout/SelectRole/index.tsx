import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'ui';
import { Form, Row } from 'antd';
import { useIntl } from 'react-intl';
import { useUserDispatch, useUserState } from 'contexts/UserContext';
import { ButtonListModal } from 'styles/layout/form';
import UserRoleSelect from '../../Selects/UserRoleSelect';
import useJwt from '../../../utils/useJwt';
import useLocalStorage from '../../../utils/useLocalStorage';
import useQueryApiClient from '../../../utils/useQueryApiClient';
import sessionControlBroadcastChannel from '../../../utils/sessionControlBroadcastChannel';
import { AuthWebStorageEnums, SessionControlBroadcastType } from '../../../contexts/SessionControlContext';

const SelectRole = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const intl = useIntl();
  const [form] = Form.useForm();

  const user = useUserState();
  const dispatch = useUserDispatch();

  const { setInitialCookies, remove } = useJwt();
  const { value: _, setLocalStorageValue: setRefreshTokenLife } = useLocalStorage<{
    start: string;
    end: string;
  }>(AuthWebStorageEnums.REFRESH_TOKEN_LIFE);

  const { value: initialRoleIsSet, setLocalStorageValue: setInitialRoleIsSet } = useLocalStorage<boolean>(
    AuthWebStorageEnums.INITIAL_ROLE_IS_SET
  );

  useEffect(() => {
    if (user.id && !initialRoleIsSet && !user.loggingOut && user.roles.length > 1) {
      setShowModal(true);
    }
  }, [user, initialRoleIsSet]);

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
      localStorage.setItem(AuthWebStorageEnums.TOKEN_EXPIRE_AT, res?.access_token?.expires_at);
      setRefreshTokenLife({
        start: res?.refresh_token?.expire_set_at,
        end: res?.refresh_token?.expires_at,
      });
      dispatch({
        type: 'SELECT_ROLE',
        payload: { selectedRole: form.getFieldValue('selectedRole'), loggingOut: false },
      });
      setInitialRoleIsSet(true);
      setShowModal(false);
      window.location.reload();
    },
  });

  const onCancel = () => {
    setInitialRoleIsSet(true);
    form.resetFields();
    setShowModal(false);
    window.location.reload();
  };

  return (
    <Modal
      open={showModal}
      footer={null}
      onCancel={onCancel}
      title={intl.formatMessage({
        id: 'general.choose_user_role',
      })}
      closable={false}
    >
      <Form form={form} onFinish={(values) => changeRole({}, { id: values?.selectedRole })} layout="vertical">
        <UserRoleSelect name="selectedRole" />
        <Row justify="end">
          <ButtonListModal>
            <Button
              label={intl.formatMessage({
                id: 'general.cancel',
              })}
              onClick={onCancel}
            />
            <Button
              type="primary"
              label={intl.formatMessage({
                id: 'general.continue',
              })}
              htmlType="submit"
            />
          </ButtonListModal>
        </Row>
      </Form>
    </Modal>
  );
};

export default SelectRole;
