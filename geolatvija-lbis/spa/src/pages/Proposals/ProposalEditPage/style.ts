import styled from 'styled-components/macro';

export const StyledProposalEditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .ant-card {
    display: flex;
    flex-grow: 1;
  }

  .ant-list-item {
    border-block-end: none;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .text-wrapper {
      font-size: 14px;
      font-weight: bold;
      color: ${({ theme }) => theme.textColor01};

      .text {
        white-space: pre-line;
        font-weight: normal;
        color: ${({ theme }) => theme.gray06};
      }
    }
  }
  .text-wrapper{
    font-size: ${({ theme }) => theme.p2Size} !important;
  }
`;
