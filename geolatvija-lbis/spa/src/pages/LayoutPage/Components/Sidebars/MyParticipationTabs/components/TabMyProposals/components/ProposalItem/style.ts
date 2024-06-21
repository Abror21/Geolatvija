import styled from 'styled-components/macro';

export const StyledProposalItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  .ant-card .ant-card-body {
    display: flex;
    flex-direction: column;
  }
  .proposal-items-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .ant-card .ant-card-body > *:not(:last-child) {
    margin-bottom: 10px;
  }
  .proposal-item__header {
    display: flex;
    align-items: center;
    gap: 30px;
    label {
      margin-bottom: 0 ;
    }
    .back-button {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .without-hovering:hover {
      background-color: unset !important;
    }
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .text-wrapper{
    font-size: ${({ theme }) => theme.p2Size} !important;
    span{
      font-size: ${({ theme }) => theme.p2Size};
    }
  }
`;
