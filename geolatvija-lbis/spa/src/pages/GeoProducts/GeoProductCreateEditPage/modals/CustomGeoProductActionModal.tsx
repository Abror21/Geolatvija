import React, {type Dispatch, type ReactNode, type SetStateAction} from 'react';
import { Button, Icon, Modal } from 'ui';
import { FormattedMessage, useIntl } from 'react-intl';

interface CustomGeoProductActionModal {
  /**
   * Set Modal state
   */
  setShowModal: Dispatch<SetStateAction<boolean>>;

  /**
   * Modal state
   */
  showModal: boolean;

  /**
   * react-intl language id
   */
  confirmTextId?: string;

  /**
   * react-intl language id
   */
  continueButtonTextId?: string;

  /**
   * react-intl language id
   */
  cancelButtonTextId?: string;

  /**
   * Continue button onClick Function
   */
  manualOnModalContinue?: Function;

  /**
   * Cancel button onClick Function
   */
  manualOnModalCancel?: Function;

  /**
   * Custom body
   */
  body?: ReactNode;
}

/**
 * Custom Geo Product Action Modal
 */
const CustomGeoProductActionModal = ({
   body,
   setShowModal,
   showModal,
   continueButtonTextId,
   cancelButtonTextId,
   confirmTextId,
   manualOnModalContinue,
   manualOnModalCancel,
}: CustomGeoProductActionModal) => {
  const intl = useIntl();

  return (
    <>
      <Modal
        onCancel={() => setShowModal(!showModal)}
        open={showModal}
        closable={false}
        disableHeader
        footer={
          <>
            <Button
              label={intl.formatMessage({
                id: !!cancelButtonTextId ? cancelButtonTextId : 'general.cancel',
              })}
              onClick={() => {
                manualOnModalCancel?.();
                setShowModal(false)
              }}
            />
            <Button
              label={intl.formatMessage({
                id: !!continueButtonTextId ? continueButtonTextId : 'general.continue',
              })}
              onClick={manualOnModalContinue}
            />
          </>
        }
      >
        {!!body ? body : (
          <h3 className="confirm-title">
          <Icon faBase="fal" icon="exclamation-circle" />
          {confirmTextId ? <FormattedMessage id={confirmTextId} /> : <FormattedMessage id="general.save.confirm" />}
        </h3>
        )}
      </Modal>
    </>
  );
};

export default CustomGeoProductActionModal;
