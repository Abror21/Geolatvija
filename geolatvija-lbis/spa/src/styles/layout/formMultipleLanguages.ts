import styled from 'styled-components/macro';

export const StyledForm = styled.div`
  padding-top: 24px;

  @media (max-width: 480px) {
    .ant-col {
      left: 0;
      max-width: 100%;
    }
  }
`;

export const StyledPage = styled.div`
  margin-bottom: 16px;
`;

export const RadioContainer = styled.div`
  display: flex;
  flex-direction: row;
  .ant-radio-group {
    display: flex;
    flex-direction: row;
  }
  .title {
    display: flex;
    flex-direction: row;

    label {
      font-weight: ${({ theme }) => theme.fontWeightBolder};
      font-size: ${({ theme }) => theme.h4Size};
      margin-right: 10px;
    }
  }
`;

export const ButtonList = styled.div`
  margin-top: 16px;
  padding-bottom: 32px;

  > * {
    margin-right: 8px;
  }

  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;

    > * {
      margin-right: 0;
      margin-bottom: 8px;
    }
  }
`;
