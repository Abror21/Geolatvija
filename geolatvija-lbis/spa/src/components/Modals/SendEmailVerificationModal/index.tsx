import React, { type Dispatch, type SetStateAction } from 'react';
import { Button, Modal, Spinner } from 'ui';
import { FormattedMessage, useIntl } from 'react-intl';
import { StyledSendEmailVerificationModalContainer } from './styles';
import { useUserState } from 'contexts/UserContext';

type SendUserEmailVerificationModalProps = {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  email?: string;
  isLoading: boolean;
  userRefetch?: boolean;
};

const SendUserEmailVerificationModal = ({
  modalOpen,
  setModalOpen,
  email,
  isLoading,
  userRefetch,
}: SendUserEmailVerificationModalProps) => {
  const intl = useIntl();
  const { refetch } = useUserState();

  const handleClick = () => {
    setModalOpen(false);
    if (userRefetch) {
      refetch();
    }
  };

  return (
    <Modal
      open={modalOpen}
      footer={
        <Button
          type="primary"
          label={intl.formatMessage({
            id: 'general.close',
          })}
          onClick={handleClick}
        />
      }
      onCancel={handleClick}
      disableHeader
    >
      <StyledSendEmailVerificationModalContainer>
        <h3 className="title">
          <FormattedMessage id="user_email.verification_modal_title" />
        </h3>
        <Spinner spinning={isLoading}>
          {!isLoading && <FormattedMessage id="user_email.verification_sent" values={{ email }} />}
        </Spinner>
      </StyledSendEmailVerificationModalContainer>
    </Modal>
  );
};

export default SendUserEmailVerificationModal;
