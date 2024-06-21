import React, { Dispatch, SetStateAction } from 'react';
import { Modal, Button, Label } from 'ui';
import { useIntl } from 'react-intl';
import { StyledGeoProductOrderConfirmationModalContent } from './style';

interface GeoProductOrderConfirmationModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  isDraft: boolean;
}

const GeoProductOrderConfirmationModal = ({
  showModal,
  setShowModal,
  isDraft,
}: GeoProductOrderConfirmationModalProps) => {
  const intl = useIntl();

  return (
    <Modal
      open={showModal}
      onCancel={() => setShowModal(false)}
      footer={
        <>
          <Button
            type="primary"
            label={intl.formatMessage({ id: 'general.close' })}
            onClick={() => setShowModal(false)}
          />
        </>
      }
      width={600}
      title={intl.formatMessage({
        id: isDraft ? 'geo_product_order.draft_confirmation_title' : 'geo_product_order.confirmation_title',
      })}
    >
      <StyledGeoProductOrderConfirmationModalContent>
        <Label
          label={intl.formatMessage({
            id: isDraft
              ? 'geo_product_order.draft_confirmation_description'
              : 'geo_product_order.confirmation_description',
          })}
        />
      </StyledGeoProductOrderConfirmationModalContent>
    </Modal>
  );
};

export default GeoProductOrderConfirmationModal;
