import styled from 'styled-components/macro';

export const StyledInactivityModalButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const StyledInactivityModalContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: 100%;

  .title {
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding-bottom: 12px;
    font-size: ${({ theme }) => theme.p1Size};
  }
  .desc {
    font-size: ${({ theme }) => theme.p2Size};
    color: ${({ theme }) => theme.textColor09};
  }
  h3 {
    font-size: ${({ theme }) => theme.p1Size};
  }

  & > * {
    text-align: center;
  }
`;
