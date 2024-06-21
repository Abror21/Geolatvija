import styled from 'styled-components/macro';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export const StyledRangePicker = styled(RangePicker)`
  font-size: ${({ theme }) => theme.p1Size};
  line-height: ${({ theme }) => theme.lineHeight5};
  background-color: ${({ theme }) => theme.gray01};
  border-color: ${({ theme }) => theme.border};
  display: flex;
  padding: 10px 14px !important;
  box-shadow: ${({ theme }) => theme.formItemsBoxShadowDefault};

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
      font-size: ${({ theme }) => theme.p2Size};
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
`;
