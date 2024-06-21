import styled from 'styled-components/macro';
import { Form, Space } from 'antd';

export const StyledPage = styled.div`
  margin-bottom: 16px;
`;

export const EmptyRow = styled.div`
  height: 44px;
`;

export const StyledDivider = styled.div`
  margin: 30px 0;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const ButtonListModal = styled.div`
  display: flex;
  margin-top: 20px;
  gap: 10px;

  button {
    margin-inline-start: 0 !important;
  }
`;

export const ButtonList = styled.div`
  margin-top: 32px;
  padding-bottom: 32px;

  display: flex;
  gap: 8px;
  justify-content: end;

  &.small {
    margin-top: 24px;
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

export const ButtonListFull = styled.div`
  display: flex;
  gap: 8px;

  > * {
    flex-grow: 1;
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

export const StyledForm = styled.div`
  .horizontal > div {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(75px, max-content));
    gap: 20px !important;
  }

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

  .special-row {
    .ant-form-item-control-input-content {
      display: flex;
    }

    .define-button {
      display: flex;
      .ant-btn {
        align-self: center;
        margin-left: 8px;
      }
    }

    .add {
      margin-left: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &.without-align {
        display: revert;
      }

      .ant-btn {
        margin-right: 8px;
      }
    }
  }

  .add-more {
    margin-bottom: 32px;
    cursor: pointer;

    .ant-btn {
      margin-right: 8px;
    }
  }

  .service-group-list {
    display: flex;
    flex-direction: column;
  }

  .break {
    height: 58px;
  }

  .ant-drawer-content {
    .ant-radio-group {
      margin: 16px 0;
    }

    .ant-input-search {
      margin-bottom: 16px;
    }
  }

  .ant-form-item-control-input {
    min-height: initial;
  }

  @media (max-width: 480px) {
    .special-row {
      .ant-form-item-control-input-content {
        display: revert;
      }

      .add {
        display: revert;
        margin-left: 0;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 16px;

    .ant-col {
      left: 0;
      max-width: 100%;
    }
  }
`;

export const StyledDrawerForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DrawerButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StyledSpace = styled(Space)`
  width: 100%;
  & > * {
    width: 100% !important;
  }
`;

export const StyledSummaryField = styled.div`
  display: flex;
  gap: 10px;

  .label {
    font-size: ${({ theme }) => theme.p2Size} !important;
    word-break: unset;
    white-space: nowrap;
    &::after {
      content: ':';
    }
  }

  .value {
    font-size: ${({ theme }) => theme.p2Size} !important;
    & > * {
      margin: 0;
    }
  }

  .link {
    word-break: break-all;
  }
`;
