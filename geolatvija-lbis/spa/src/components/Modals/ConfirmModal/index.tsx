import React, { Dispatch, SetStateAction } from 'react';
import { Icon, Modal, Button } from 'ui';
import { FormattedMessage, useIntl } from 'react-intl';

interface ConfirmModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
  onOk: Function;
  confirmText: string;
}

const ConfirmModal = ({ setShowModal, showModal, onOk, confirmText }: ConfirmModalProps) => {
  const intl = useIntl();

  return (
    <Modal
      onCancel={() => setShowModal(false)}
      open={showModal}
      closable={false}
      footer={
        <>
          <Button
            label={intl.formatMessage({
              id: 'general.cancel',
            })}
            onClick={() => setShowModal(false)}
          />
          <Button
            label={intl.formatMessage({
              id: 'general.confirm',
            })}
            onClick={onOk}
          />
        </>
      }
    >
      <h3 className="confirm-title">
        <Icon faBase="fal" icon="exclamation-circle" />
        {confirmText ? <FormattedMessage id={confirmText} /> : <FormattedMessage id="general.confirm_text" />}
      </h3>
    </Modal>
  );
};

export default ConfirmModal;
