import React from 'react';
import { Modal, Button, Label } from 'ui';
import { useIntl } from 'react-intl';
import { routes } from '../../../../config/config';
import useSessionStorage from '../../../../utils/useSessionStorage';

interface LicenceConfirmationLoginModalProps {
  showModal: boolean;
  setShowModal: Function;
}

const LicenceConfirmationLoginModal = ({ showModal, setShowModal }: LicenceConfirmationLoginModalProps) => {
  const intl = useIntl();
  const { setSessionValue: setOrderConfirmationInSession } = useSessionStorage('ORDER_CONFIRMATION');

  const onConfirm = () => {
    setShowModal(false);
    window.location.replace(routes.api.baseUrl + '/vpm/login');
    setOrderConfirmationInSession(true);
  };

  return (
    <Modal
      open={showModal}
      onCancel={() => setShowModal(false)}
      footer={
        <>
          <Button
            type="default"
            label={intl.formatMessage({ id: 'general.cancel' })}
            onClick={() => setShowModal(false)}
          />
          <Button type="primary" label={intl.formatMessage({ id: 'general.continue' })} onClick={onConfirm} />
        </>
      }
      width={600}
      title={intl.formatMessage({ id: 'geo_product_order.licence_rule_confirmation' })}
    >
      <Label label={intl.formatMessage({ id: 'geo_product_order.login_confirmation_modal' })} />
    </Modal>
  );
};

export default LicenceConfirmationLoginModal;
