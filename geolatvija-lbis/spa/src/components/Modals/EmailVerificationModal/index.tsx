import React, { useMemo } from 'react';
import { Button, Modal, Spinner } from 'ui';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  EmailVerificationResponseType,
  useUserEmailVerification,
} from '../../../contexts/UserEmailVerificationContext';
import { StyledEmailVerificationModalContainer } from './styles';

const UserEmailVerificationModal = () => {
  const intl = useIntl();

  const { modalOpen, verifiedEmail, clear, isLoading } = useUserEmailVerification();

  const modalContent = useMemo(() => {
    switch (verifiedEmail?.responseType) {
      case EmailVerificationResponseType.SUCCESS:
        return <FormattedMessage id="user_email.verification_modal_success" values={{ email: verifiedEmail?.email }} />;
      case EmailVerificationResponseType.EXPIRED:
        return <FormattedMessage id="user_email.verification_modal_expired" />;
      default:
        return <FormattedMessage id="user_email.verification_modal_error" />;
    }
  }, [verifiedEmail?.responseType, verifiedEmail?.email]);

  return (
    <Modal
      open={modalOpen}
      footer={
        <Button
          type="primary"
          label={intl.formatMessage({
            id: 'general.close',
          })}
          onClick={() => clear()}
        />
      }
      onCancel={() => clear()}
      disableHeader
    >
      <StyledEmailVerificationModalContainer>
        <h3 className="title">
          <FormattedMessage id="user_email.verification_modal_title" />
        </h3>
        <Spinner spinning={isLoading}>{!isLoading && <>{modalContent}</>}</Spinner>
      </StyledEmailVerificationModalContainer>
    </Modal>
  );
};

export default UserEmailVerificationModal;
