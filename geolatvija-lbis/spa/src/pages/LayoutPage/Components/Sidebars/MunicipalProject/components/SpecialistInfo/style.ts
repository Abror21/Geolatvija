import styled from 'styled-components';

export const StyledSpecialistInfo = styled.div`
  .title {
    color: ${({ theme }) => theme.textColor09};
    font-weight: 400;
    font-size: ${({ theme }) => theme.p1Size};
  }
  .name {
    color: ${({ theme }) => theme.textColor09};
    font-weight: 500;
  }
  a {
    color: ${({ theme }) => theme.brand02};
    text-decoration: underline;
    font-size: ${({ theme }) => theme.p1Size};
  }
  p {
    font-weight: 400;
    font-size: ${({ theme }) => theme.p1Size};
    margin-top: 3px;
    color: ${({ theme }) => theme.textColor09};
  }
  .disabled-button {
    cursor: not-allowed;
  }
`;
