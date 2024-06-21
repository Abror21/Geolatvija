import styled from 'styled-components/macro';
import { DatePicker } from 'antd';

export const StyledDatePicker = styled(DatePicker)`
  font-size: ${({ theme }) => theme.p1Size};
  line-height: ${({ theme }) => theme.lineHeight5};
  background-color: ${({ theme }) => theme.gray01};
  border-color: ${({ theme }) => theme.border};
  display: flex;
  padding: 10px 14px !important;
  box-shadow: ${({ theme }) => theme.formItemsBoxShadowDefault};

  .ant-picker:focus {
    border-color: red !important;
  }

  &.ant-picker-disabled {
    background-color: ${({ theme }) => theme.disabledBackground};
    border-color: ${({ theme }) => theme.disabledBorder};
    color: ${({ theme }) => theme.disabledText};
    cursor: default;

    input[disabled] {
      cursor: default;
    }

    &:hover {
      border-color: ${({ theme }) => theme.disabledBorder} !important;
    }
  }

  .ant-picker-content {
    width: auto !important;
  }

  .ant-picker-date-panel {
    width: auto !important;
  }

  &.ant-picker-disabled .ant-picker-input > input[disabled] {
    color: ${({ theme }) => theme.textColor02};
  }

  &.ant-picker-disabled .ant-picker-suffix {
    color: ${({ theme }) => theme.textColor02} !important;
  }
  &.ant-picker {
    min-height: 44px;
  }
  &.ant-picker:hover {
    border-color: ${({ theme }) => theme.brand02};
  }
  &.ant-picker-focused {
    border-color: ${({ theme }) => theme.brand02};
    box-shadow: ${({ theme }) => theme.formItemsBoxShadow};
  }
  .ant-picker-input {
    input {
      font-size: ${({ theme }) => theme.p1Size};
      color: ${({ theme }) => theme.textColor01};
    }
    .ant-picker-clear {
      background: ${({ theme }) => theme.gray01};
      color: ${({ theme }) => theme.iconColor01};
    }
  }

  .ant-picker-dropdown {
    font-size: ${({ theme }) => theme.p1Size};
    background-color: ${({ theme }) => theme.gray01};

    .ant-picker-panel {
      border: none;

      .ant-picker-header {
        background-color: ${({ theme }) => theme.gray01};
        color: ${({ theme }) => theme.textColor01};
        border-bottom: 1px solid ${({ theme }) => theme.border3};
        button {
          color: ${({ theme }) => theme.textColor01};
          line-height: ${({ theme }) => theme.lineHeight1};
        }
        .ant-picker-header-view {
          .ant-picker-month-btn:hover {
            color: ${({ theme }) => theme.brand02};
          }
          .ant-picker-year-btn:hover {
            color: ${({ theme }) => theme.brand02};
          }
        }
      }

      .ant-picker-body {
        background-color: ${({ theme }) => theme.gray01};
        th {
          color: ${({ theme }) => theme.textColor01};
          line-height: ${({ theme }) => theme.lineHeight3};
        }
        .ant-picker-cell {
          color: ${({ theme }) => theme.textColor01};
          font-size: ${({ theme }) => theme.p1Size};
          height: auto;
          line-height: ${({ theme }) => theme.lineHeight5};
        }
        .ant-picker-cell-today .ant-picker-cell-inner:before {
          border: 1px solid ${({ theme }) => theme.brand02};
        }
        .ant-picker-cell-selected .ant-picker-cell-inner {
          background: ${({ theme }) => theme.brand02};
          color: ${({ theme }) => theme.textColor03};
        }
      }

      .ant-picker-footer {
        background-color: ${({ theme }) => theme.gray01};
        border-top: 1px solid ${({ theme }) => theme.border3};
        .ant-picker-today-btn {
          color: ${({ theme }) => theme.brand02};
        }
      }
      .ant-picker-cell:hover .ant-picker-cell-inner {
        background: ${({ theme }) => theme.brand02} !important;
        color: ${({ theme }) => theme.gray02};
        padding: 4px;
        height: auto !important;
      }

      .ant-picker-cell-inner {
        padding: 4px;
        height: auto !important;
      }

      .ant-picker-cell {
        padding-left: 4px;
        padding-right: 4px;
      }
    }
  }
`;
