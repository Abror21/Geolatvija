import styled from 'styled-components';

export const StyledSubmitProjectLastStep = styled.div`
  text-align: center;
  position: relative;
  .close_icon {
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
    i {
      font-size: ${({ theme }) => theme.h3Size};
    }
  }
  img {
    width: 200px;
  }
  label {
    justify-content: center;
  }
`;
