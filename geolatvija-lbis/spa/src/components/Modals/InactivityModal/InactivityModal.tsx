import React from 'react';
import { Button, Modal, Spinner } from '../../../ui';
import { FormattedMessage, useIntl } from 'react-intl';
import { StyledInactivityModalButtonWrapper, StyledInactivityModalContentContainer } from './style';
import sessionControlBroadcastChannel from '../../../utils/sessionControlBroadcastChannel';
import { SessionControlBroadcastType } from '../../../contexts/SessionControlContext';

type InactivityModalProps = {
  showModal: boolean;
  loading: boolean;
  countdown: number;
  resetModal: Function;
  setNewTokens: Function;
  logout: Function;
};

export const InactivityModal = ({
  resetModal,
  showModal,
  countdown,
  setNewTokens,
  loading,
  logout,
}: InactivityModalProps) => {
  const intl = useIntl();

  const endSession = () => {
    resetModal();
    logout();
  };

  const extendSession = () => {
    resetModal();
    setNewTokens();
    sessionControlBroadcastChannel.postMessage({ type: SessionControlBroadcastType.CLOSE_MODAL });
  };

  const formatCountdown = (remainingTime: number) => {
    const seconds = Math.floor((remainingTime / 1000) % 60);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));

    if (remainingTime <= 0) {
      return intl.formatMessage({ id: 'inactivity_countdown_message_session_ended' });
    } else if (hours > 0 && minutes > 1) {
      return intl.formatMessage({ id: 'inactivity_countdown_message_hours_and_minutes' }, { hours, minutes });
    } else if (hours > 0 && minutes === 1) {
      return intl.formatMessage({ id: 'inactivity_countdown_message_hours_and_minute' }, { hours, minutes });
    } else if (hours === 1) {
      return intl.formatMessage({ id: 'inactivity_countdown_message_hour' }, { hours });
    } else if (minutes > 1 || (minutes === 1 && seconds > 0)) {
      return intl.formatMessage(
        { id: `inactivity_countdown_message_minutes` },
        { count: minutes + (seconds > 0 ? 1 : 0) }
      );
    } else if (minutes === 1) {
      return intl.formatMessage({ id: `inactivity_countdown_message_minute` }, { count: minutes });
    } else if (seconds > 1) {
      return intl.formatMessage({ id: `inactivity_countdown_message_seconds` }, { count: seconds });
    } else {
      return intl.formatMessage({ id: `inactivity_countdown_message_second` }, { count: seconds });
    }
  };

  return (
    <Modal
      zIndex={9999}
      onCancel={extendSession}
      open={showModal}
      closable={false}
      disableHeader
      footer={
        <StyledInactivityModalButtonWrapper>
          <Button
            type="default"
            label={intl.formatMessage({
              id: 'inactivity_session.button.end_session',
            })}
            onClick={endSession}
          />
          <Button
            type="primary"
            label={intl.formatMessage({
              id: 'inactivity_session.button.extend_session',
            })}
            onClick={extendSession}
          />
        </StyledInactivityModalButtonWrapper>
      }
    >
      <StyledInactivityModalContentContainer>
        <h3 className="title">
          <FormattedMessage id="inactivity_session.title" />
        </h3>
        <Spinner spinning={loading}>
          <div className='desc'>
            <FormattedMessage id="inactivity_session.description" />
          </div>
          <h3>{formatCountdown(countdown)}</h3>
        </Spinner>
      </StyledInactivityModalContentContainer>
    </Modal>
  );
};
