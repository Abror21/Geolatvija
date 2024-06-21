import styled from 'styled-components/macro';

export const StyledPage = styled.div`

  padding-bottom: 20px;
  .filter-options {
    background: ${({ theme }) => theme.gray01};
    text-align: left;
    padding: 4px 0;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);

    .filter-footer {
      display: flex;
      justify-content: space-around;
      border-top: 1px solid ${({ theme }) => theme.gray03};
      padding: 8px 16px;
      margin-top: 4px;

      .ant-btn-text {
        margin-left: 0;
      }
    }

    .ant-checkbox-wrapper {
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
      margin-left: 0;
      padding: 5px 14px;
      align-items: center;

      &:hover {
        background: ${({ theme }) => theme.brand02Light};
      }
    }

    .ant-checkbox + span {
      padding-right: 0;
    }

    .ant-checkbox-wrapper-checked {
      background: ${({ theme }) => theme.brand02Light};
    }
  }

  .actions-list-table {
    display: flex;
    justify-content: end;
  }
`;

export const ButtonList = styled.div`
  display: flex;
  gap: 10px;
`;
