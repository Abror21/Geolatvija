import React, { useEffect, useState } from 'react';
import { useOpenedTypeDispatch, useOpenedTypeState } from 'contexts/OpenedTypeContext';
import { Button, Label, Modal } from 'ui';
import { SubmitProjectLastStepImage } from 'Assets';
import { useIntl } from 'react-intl';
import { StyledSubmitProjectLastStep } from './style';
import { useNavigate } from 'react-router-dom';
const SubmitProjectLastStep = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { openSubmitProjectLastStep } = useOpenedTypeState();
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const openedTypeDispatch = useOpenedTypeDispatch();

  useEffect(() => {
    if (openSubmitProjectLastStep) {
      setIsVisibleModal(true);
    } else {
      setIsVisibleModal(false);
    }
  }, [openSubmitProjectLastStep]);

  const handleClose = () => {
    setIsVisibleModal(false);
    openedTypeDispatch({ type: 'CLOSE_SUBMIT_PROJECT_LAST_STEP' });
  };

  const handleSubmit = () => {
    navigate('/main?my-participation=open&tab=submitted_projects_tab');
    handleClose();
  };
  return (
    <Modal onCancel={handleClose} disableHeader={true} open={isVisibleModal} width={650}>
      <StyledSubmitProjectLastStep>
        <div className="close_icon" onClick={handleClose}>
          <i className="fa-solid fa-xmark remove_btn"></i>
        </div>
        <img src={SubmitProjectLastStepImage} alt="image" />
        <Label
          title={true}
          bold={true}
          label={intl.formatMessage({ id: 'participation_budget.submit_project_last_step_title' })}
        />
        <Label
          subTitle={true}
          regular={true}
          label={intl.formatMessage({ id: 'participation_budget.submit_project_last_step_desc' })}
        />
        <Button onClick={handleSubmit} label={intl.formatMessage({ id: 'participation_budget.my_submited_project' })} />
      </StyledSubmitProjectLastStep>
    </Modal>
  );
};

export default SubmitProjectLastStep;
