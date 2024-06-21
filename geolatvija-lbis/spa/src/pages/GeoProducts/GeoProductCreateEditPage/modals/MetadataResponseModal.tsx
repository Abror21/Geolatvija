import React, {type Dispatch, type SetStateAction, useMemo} from 'react';
import { Button, Modal } from 'ui';
import {FormattedMessage, useIntl} from 'react-intl';
import {type MetadataResponse} from "../index";
import {StyledMetadataModalButtonWrapper, StyledMetadataModalContent} from "./style";
import {pages} from "../../../../constants/pages";
import {useNavigate} from "react-router-dom";


export enum MetadataStatus {
  PASSED = 'PASSED',
  PASSED_MANUAL = 'PASSED_MANUAL',
  FAILED = 'FAILED',
}

interface MetadataResponseModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
  metadataResponse?: MetadataResponse;
  creatingNew?: boolean;
  resetInspireLoopCheck: Function;
}

const MetadataResponseModal = ({
   setShowModal,
   showModal,
   metadataResponse,
   creatingNew,
   resetInspireLoopCheck,
}: MetadataResponseModalProps) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const modalMessage = useMemo(() => {
    switch (metadataResponse?.status) {
      case MetadataStatus.FAILED:
        return (
          <div className="failed-wrapper">
            <h3><FormattedMessage id={'geopoducts.metadata.unsuccessfully'} /></h3>
            <div>
              <FormattedMessage id={'geopoducts.metadata.unsuccessfully_description'} values={{url: metadataResponse.report}} />
            </div>
          </div>
        );
      case MetadataStatus.PASSED:
        return (<h3><FormattedMessage id={'geopoducts.metadata.success'} /></h3>);
      case MetadataStatus.PASSED_MANUAL:
        return (<h3><FormattedMessage id={'geopoducts.metadata.success'} /></h3>);
      default:
        return (<h3><FormattedMessage id={'geopoducts.metadata.time_info'} /></h3>)
    }
  }, [metadataResponse?.status, metadataResponse?.report]);

  const copy = async () => {
    resetInspireLoopCheck();
    setShowModal(false);
    if (!!metadataResponse?.report) {
      await navigator.clipboard.writeText(metadataResponse?.report).then(() => {
        !!creatingNew && navigate(pages.geoproduct.url);
      });
    }
  }

  const close = () => {
    if ((metadataResponse?.status === MetadataStatus.PASSED || metadataResponse?.status === MetadataStatus.PASSED_MANUAL) && !!creatingNew) {
      navigate(pages.geoproduct.url)
    }
    resetInspireLoopCheck();
    setShowModal(false);
  }

  return (
    <>
      <Modal
        onCancel={() => setShowModal(!showModal)}
        open={showModal}
        closable={false}
        disableHeader
        footer={
          <StyledMetadataModalButtonWrapper>
            <Button
              type="primary"
              label={intl.formatMessage({
                id: 'general.close',
              })}
              onClick={close}
            />
            {metadataResponse?.status === MetadataStatus.FAILED && (
              <Button
                type="primary"
                label={intl.formatMessage({
                  id: 'general.copy',
                })}
                onClick={copy}
              />
            )}
          </StyledMetadataModalButtonWrapper>
        }
      >
        <StyledMetadataModalContent>
          {modalMessage}
        </StyledMetadataModalContent>
      </Modal>
    </>
  );
};

export default MetadataResponseModal;
