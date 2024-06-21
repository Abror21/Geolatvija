import React, { Dispatch, SetStateAction } from 'react';
import { Button, Icon, Modal } from 'ui';
import { FormattedMessage, useIntl } from 'react-intl';
import useQueryApiClient from 'utils/useQueryApiClient';
import {useUserState} from "../../../contexts/UserContext";

interface DeleteModalProps {
  setRefresh?: Dispatch<SetStateAction<number>>;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
  url?: string;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
  deleteId?: number;
  confirmText?: string;
  manualOnModalOk?: Function;
  params?: ParamProps;
}

interface ParamProps {
  [key: string]: string[] | string | number[] | number | boolean[] | boolean | React.Key[];
}

const DeleteModal = ({
  setRefresh,
  setIsLoading,
  url,
  setShowModal,
  showModal,
  deleteId,
  confirmText,
  manualOnModalOk,
  params,
}: DeleteModalProps) => {
  const intl = useIntl();
  const user = useUserState();

  const { appendData } = useQueryApiClient({
    request: {
      url: url?.replace('{id}', deleteId?.toString() || '') || '',
      method: 'DELETE',
    },
    onSuccess: () => {
      setRefresh && setRefresh((old: number) => old + 1);
      setIsLoading && setIsLoading(false);
      {user.refetch()}
    },
  });

  const onModalOk = () => {
    appendData(params || []);
    setShowModal(false);
  };

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
                id: 'general.cancel',
              })}
              onClick={() => setShowModal(false)}
            />
            <Button
              label={intl.formatMessage({
                id: 'general.delete',
              })}
              onClick={manualOnModalOk || onModalOk}
            />
          </>
        }
      >
        <h3 className="confirm-title">
          <Icon faBase="fal" icon="exclamation-circle" />
          {confirmText ? <FormattedMessage id={confirmText} /> : <FormattedMessage id="general.delete.confirm" />}
        </h3>
      </Modal>
    </>
  );
};

export default DeleteModal;
