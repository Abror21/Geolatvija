import React, { Dispatch, SetStateAction } from 'react';
import { Icon, Modal, Button } from 'ui';
import { FormattedMessage, useIntl } from 'react-intl';
import { routes } from '../../../config/config';
import { ButtonListModal } from '../../../styles/layout/form';
import useSessionStorage from 'utils/useSessionStorage';
import { useLocation } from 'react-router-dom';

interface UnauthenticatedModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
  confirmText?: string;
  additionalOnOkExecution?: Function;
  additionalParam?: { name: string; value: string };
}

const UnauthenticatedModal = ({
  setShowModal,
  showModal,
  additionalOnOkExecution,
  additionalParam,
}: UnauthenticatedModalProps) => {
  const intl = useIntl();
  const location = useLocation();

  const disableAuthentication = window?.runConfig?.disableAuthentication;
  const { setSessionValue } = useSessionStorage<string | null | undefined>('SAVE_LOCATION');

  const onOk = () => {
    const params = new URLSearchParams(window.location.search);
    if (additionalParam) {
      params.append(additionalParam.name, additionalParam.value);
    }
    setSessionValue(location.pathname + (params ? '?' + params.toString() : null));
    window.location.replace(routes.api.baseUrl + '/vpm/login');
    additionalOnOkExecution?.();
  };

  return (
    <Modal
      onCancel={() => setShowModal(false)}
      open={showModal}
      closable={false}
      disableHeader
      centered
      footer={
        <ButtonListModal>
          <Button
            label={intl.formatMessage({
              id: 'general.cancel',
            })}
            onClick={() => setShowModal(false)}
          />
          {!disableAuthentication && (
            <Button
              label={intl.formatMessage({
                id: 'general.authenticate',
              })}
              type="primary"
              onClick={onOk}
            />
          )}
        </ButtonListModal>
      }
    >
      <h3 className="confirm-title">
        <Icon faBase="fal" icon="exclamation-circle" />
        {disableAuthentication ? (
          <FormattedMessage id="general.login_disabled" />
        ) : (
          <FormattedMessage id="general.need_to_login" />
        )}
      </h3>
    </Modal>
  );
};

export default UnauthenticatedModal;
