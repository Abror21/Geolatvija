import styled from 'styled-components/macro';
import { TimePicker } from 'antd';

export const StyledTimePicker = styled(TimePicker)`
  background-color: ${({ theme }) => theme.gray01};
  border-color: ${({ theme }) => theme.border2};
  color: ${({ theme }) => theme.textColor01};

  .ant-picker-input {
    input {
      color: ${({ theme }) => theme.textColor01};
    }

    .ant-picker-clear {
      background: ${({ theme }) => theme.gray01};
      color: ${({ theme }) => theme.iconColor01};
    }
  }

  &.ant-picker:hover,
  &.ant-picker-focused {
    border-color: ${({ theme }) => theme.brand02};
    box-shadow: none;
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

  &.ant-picker-disabled {
    background-color: ${({ theme }) => theme.d};
    color: ${({ theme }) => theme.disabledText};
    border-color: ${({ theme }) => theme.disabledBorder};
  }

  &.ant-picker-disabled .ant-picker-input > input[disabled] {
    color: ${({ theme }) => theme.disabledText};
  }

  &.ant-picker-disabled .ant-picker-suffix {
    color: ${({ theme }) => theme.disabledText};
  }

  .ant-btn-primary {
    background-color: ${({ theme }) => theme.button01};
    background: ${({ theme }) => theme.button01};
    border-color: ${({ theme }) => theme.button01};
    border-radius: 2px;
    color: ${({ theme }) => theme.textColor03};
    &:hover {
      background-color: ${({ theme }) => theme.button01};
      border-color: ${({ theme }) => theme.button01};
      color: ${({ theme }) => theme.textColor03};
    }
  }

  .ant-picker-time-panel-column > li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner {
    background-color: ${({ theme }) => theme.gray01};
    color: ${({ theme }) => theme.textColor01};
  }

  .ant-picker-time-panel-column > li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner:hover {
    background-color: ${({ theme }) => theme.brand02Light};
    color: ${({ theme }) => theme.textColor05};
  }

  .ant-picker-time-panel-column > li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner {
    background-color: ${({ theme }) => theme.brand02};
    color: ${({ theme }) => theme.textColor03};
  }

  .ant-picker-now-btn {
    color:  ${({ theme }) => theme.brand02};
  }

  .ant-picker-dropdown .ant-picker-panel-container {
    background: ${({ theme }) => theme.gray01};
    .ant-picker-panel {
      background-color: ${({ theme }) => theme.gray01};
      border-bottom: none;

      .ant-picker-time-panel {
        background-color: ${({ theme }) => theme.gray01};
        border-color: ${({ theme }) => theme.border2};

        .ant-picker-time-panel-column {
          border-color: ${({ theme }) => theme.border2};
        }
      }
      .ant-picker-footer {
        background-color: ${({ theme }) => theme.gray01};
        border-color: ${({ theme }) => theme.border2};
      }
    }

  }
}
`;
