import React, { type Dispatch, type SetStateAction } from 'react';
import { Button, Modal } from '../../../ui';
import { FormattedMessage, useIntl } from 'react-intl';

type GeoProductNotAvailableModalProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

export function GeoProductNotAvailableModal({ showModal, setShowModal }: GeoProductNotAvailableModalProps) {
  const intl = useIntl();

  return (
    <Modal
      open={showModal}
      footer={
        <Button
          type="primary"
          label={intl.formatMessage({
            id: 'general.close',
          })}
          onClick={() => setShowModal(false)}
        />
      }
      onCancel={() => setShowModal(false)}
      width={450}
      disableHeader
    >
      <h3>
        <FormattedMessage id="geoproducts.not_available" />
      </h3>
    </Modal>
  );
}
