import styled from 'styled-components/macro';

export const StyledEmailVerificationModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  width: 100%;

  .title {
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding-bottom: 12px;
    width: 100%;
  }
`;
