import styled from 'styled-components/macro';

export const StyledPage = styled.div`
  background-color: ${({ theme }) => theme.gray03};
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.customBorder};
  border-top: none;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 16px;

  &.reverse {
    margin-bottom: 0;
    margin-top: 16px;
  }

  > *:not(:last-child) {
    margin-right: 16px;
  }
`;

export const Container = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border};
  margin-top: 40px;
  padding-top: 16px;

  .add-row {
    display: flex;
    margin-bottom: 24px;

    .title {
      flex-grow: 1;
    }
  }
`;

export const Title = styled.div`
  font-size: ${({ theme }) => theme.h4Size};
  font-weight: ${({ theme }) => theme.fontWeightBold}; ;
`;

export const ButtonList = styled.div`
  margin-top: 32px;
  padding-bottom: 32px;

  > * {
    margin-right: 8px;
  }

  &.small {
    margin-top: 0;
    padding-bottom: 0;
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

export const TableButtonList = styled.div`
  > * {
    margin-right: 8px;
  }
`;

export const StyledForm = styled.div`
  .phone-item {
    display: flex;
    .ant-select {
      max-width: 90px;
      margin-right: 8px;
    }
    .ant-input-number {
      flex-grow: 1;
    }
  }

  .creation-reason {
    margin-top: 16px;
  }
`;

export const StyledDrawers = styled.div`
  .secondary-title {
    font-weight: ${({ theme }) => theme.fontWeightBolder};
    color: ${({ theme }) => theme.textColor01};
    font-size: ${({ theme }) => theme.p1Size};
  }

  .ant-table-row-level-0 {
    vertical-align: bottom;
  }

  .drawer-buttons > * {
    margin-right: 8px;
  }

  .ant-btn-text {
    line-height: 16px;
    padding: 8px 0;
    color: ${({ theme }) => theme.brand02};
    margin: 0 5px;

    span {
      text-decoration: underline;
    }
  }

  .ant-table-wrapper {
    padding-top: ${({ theme }) => theme.p1Size};
  }
`;

export const CustomRightSwitchContainer = styled.div`
  display: flex;

  .user-count-information {
    text-align: end;
    flex-grow: 1;
  }
`;
