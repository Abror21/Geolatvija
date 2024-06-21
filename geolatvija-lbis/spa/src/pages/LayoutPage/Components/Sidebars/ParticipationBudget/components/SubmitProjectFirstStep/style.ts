import styled from 'styled-components';
export const StyledSubmitProjectFirstStep = styled.div`
  position: fixed;
  top: 100px;
  left: 120px;
  width: 100%;
  max-width: 500px;
  max-height: 180px;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: 0.2s ease;
  &.open {
    visibility: visible;
    opacity: 1;
  }

  .custom-modal-content {
    background-color: ${({ theme }) => theme.gray01};
    padding: 25px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 1;
  }
  .title {
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding-bottom: 22px;
    color: ${({ theme }) => theme.textColor09};
  }
  p {
    line-height: ${({ theme }) => theme.lineHeight6};
    font-size: ${({ theme }) => theme.p2Size};
    font-weight: ${({ theme }) => theme.fontWeightRegular};
    color: ${({ theme }) => theme.textColor09};
  }

  .custom-modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
`;
