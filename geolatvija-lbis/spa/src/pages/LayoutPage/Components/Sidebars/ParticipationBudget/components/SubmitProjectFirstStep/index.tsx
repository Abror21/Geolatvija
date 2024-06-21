import { useOpenedTypeState } from 'contexts/OpenedTypeContext';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { StyledSubmitProjectFirstStep } from './style';
import { Label } from 'ui';

const SubmitProjectFirstStep = () => {
  const { openSubmitProject } = useOpenedTypeState();
  let [searchParams] = useSearchParams();

  return (
    <StyledSubmitProjectFirstStep className={`custom-modal ${openSubmitProject ? 'open' : ''}`}>
      <div className="custom-modal-content">
        <Label className="title" bold={true} heading={true} label="Atzīmē kartē projekta atrašanās vietu"></Label>
        <p>
          Ja projekts atradīsies ārpus pašvaldības piederošās zemes, būs nepieciešams pievienot zemes īpašnieka
          apliecinājumu, ka atļaus realizēt projektu uz viņa zemes.
        </p>
      </div>
    </StyledSubmitProjectFirstStep>
  );
};

export default SubmitProjectFirstStep;
