import React, { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Input, Label, Modal, Tooltip } from '../../../ui';
import BorderBottom from '../../BorderBottom';
import { useUserState } from '../../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Form } from 'antd';
import useJwt from '../../../utils/useJwt';
import useQueryApiClient from '../../../utils/useQueryApiClient';

interface SubscribeModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
  showUnauthenticated: boolean;
  setShowUnauthenticated: Dispatch<SetStateAction<boolean>>;
  removeSessionValue: Function;
  kadastrs?: number;
}

interface FormData {
  email: string;
}

const SubscribeModal = ({
  setShowModal,
  showModal,
  showUnauthenticated,
  setShowUnauthenticated,
  removeSessionValue,
  kadastrs,
}: SubscribeModalProps) => {
  const [emailState, setEmailState] = useState({
    emailMatch: false,
    emailDoNotMatch: false,
  });
  const { emailMatch, emailDoNotMatch } = emailState;
  const intl = useIntl();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const marginBottomStyles = { marginBottom: '16px' };
  const authUser = useUserState();
  const activeRole = authUser.roles.find((e) => e.id === authUser.selectedRole);
  const { isTokenActive } = useJwt();

  const { appendData } = useQueryApiClient({
    request: {
      url: `api/v1/tapis/parcel-data-email`,
      method: 'POST',
    },
    onSuccess: () => setShowModal(false),
  });

  useEffect(() => {
    if (showModal) {
      form.setFieldValue('email', activeRole?.email);
    }
  }, [activeRole?.email, form, showModal]);

  const checkIfEmailInputMatchProfileEmail = (values: FormData) => {
    if (activeRole?.email === values.email) {
      setEmailState((prevState) => ({
        ...prevState,
        emailMatch: true,
      }));
    } else if (activeRole?.email !== values.email) {
      setEmailState((prevState) => ({
        ...prevState,
        emailDoNotMatch: true,
      }));
    }
  };

  const onFinish = (values: FormData) => {
    if (!activeRole?.emailVerified) return;

    checkIfEmailInputMatchProfileEmail(values);
    removeSessionValue();

    appendData({ cadastreNumber: kadastrs });
  };

  const closeModal = () => {
    removeSessionValue();
    setShowModal(false);
    form.resetFields();
    setEmailState((prevState) => ({
      ...prevState,
      emailMatch: false,
      emailDoNotMatch: false,
    }));
  };

  const navigateToUserProfile = () => {
    navigate('/account');
    removeSessionValue();
    setShowModal(false);
  };

  const closeButton = (
    <Button
      label={intl.formatMessage({
        id: 'general.close',
      })}
      onClick={closeModal}
      type="primary"
    />
  );

  const loginButton = (
    <Button
      label={intl.formatMessage({
        id: 'map.informative_statement_login',
      })}
      onClick={() => {
        if (!isTokenActive()) setShowUnauthenticated(true);
      }}
    />
  );

  const profileButton = (
    <Button
      label={intl.formatMessage({
        id: 'map.informative_statement_authenticated_my_profile',
      })}
      onClick={navigateToUserProfile}
    />
  );

  const applyButton = !activeRole?.emailVerified ? (
    <Tooltip hack className="tooltip-inner-div" title={intl.formatMessage({ id: 'user_email.not_verified' })}>
      <Button
        label={intl.formatMessage({
          id: 'general.receive',
        })}
        disabled={!activeRole?.emailVerified}
        type="primary"
        onClick={() => {
          form.submit();
        }}
      />
    </Tooltip>
  ) : (
    <Button
      label={intl.formatMessage({
        id: 'general.receive',
      })}
      type="primary"
      onClick={() => {
        form.submit();
      }}
    />
  );

  return (
    <Modal
      onCancel={closeModal}
      open={showModal}
      closable={true}
      destroyOnClose
      getContainer={document.body}
      title={intl.formatMessage({ id: 'map.informative_statement_receive' })}
      footer={
        <>
          {(emailMatch || emailDoNotMatch) && closeButton}
          {!emailMatch && !emailDoNotMatch && (showUnauthenticated ? loginButton : profileButton)}
          {!emailMatch && !emailDoNotMatch && applyButton}
        </>
      }
    >
      <div style={marginBottomStyles}>
        {emailMatch && (
          <Label bold color="primary" label={intl.formatMessage({ id: 'map.informative_statement_email_match' })} />
        )}

        {!emailMatch &&
          !emailDoNotMatch &&
          (showUnauthenticated ? (
            <Label
              bold
              color="primary"
              label={intl.formatMessage({ id: 'map.informative_statement_unauthenticated_sub_header' })}
            />
          ) : (
            <Label
              bold
              color="primary"
              label={intl.formatMessage({ id: 'map.informative_statement_authenticated_sub_header' })}
            />
          ))}

        {emailDoNotMatch && (
          <Label
            bold
            color="primary"
            label={intl.formatMessage(
              { id: 'map.informative_statement_email_do_not_match' },
              { email: form.getFieldValue('email') }
            )}
          />
        )}
      </div>
      {!emailMatch && !emailDoNotMatch ? (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Input name="email" type="email" validations={['required', 'email']} disabled />
        </Form>
      ) : null}
      <BorderBottom modal />

      <div style={marginBottomStyles}>
        {!emailMatch &&
          !emailDoNotMatch &&
          (showUnauthenticated ? (
            <Label
              bold
              color="primary"
              label={intl.formatMessage({ id: 'map.informative_statement_unauthenticated_confirm_text' })}
            />
          ) : (
            <Label
              bold
              color="primary"
              label={intl.formatMessage({ id: 'map.informative_statement_authenticated_confirm_text' })}
            />
          ))}
      </div>
    </Modal>
  );
};

export default SubscribeModal;
