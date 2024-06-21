import styled from 'styled-components/macro';
import { InputNumber } from 'antd';

export const StyledInputNumber = styled(InputNumber)`
  background-color: ${({ theme }) => theme.gray01};
  border: 1px solid ${({ theme }) => theme.border};
  line-height: ${({ theme }) => theme.lineHeight5};
  box-shadow: none;
  width: 100%;
  color: ${({ theme }) => theme.textColor01};
  border-radius: ${({ theme }) => theme.inputBorderRadius};

  &:hover {
    border-color: ${({ theme }) => theme.brand02};
  }
  &.ant-input-number-focused {
    border-color: ${({ theme }) => theme.brand02};
    box-shadow: ${({ theme }) => theme.formItemsBoxShadow} !important;
  }

  .ant-input-number-input {
    font-size: ${({ theme }) => theme.p1Size};
    line-height: ${({ theme }) => theme.lineHeight5};
    padding: 10px 14px !important;
    height: initial !important;
    color: ${({ theme }) => theme.textColor01};
    font-family: 'Ubuntu', serif;

    &:disabled {
      color: ${({ theme }) => theme.disabledText};
    }
  }

  .ant-input-prefix {
    color: ${({ theme }) => theme.textColor01};
  }

  &.ant-input-disabled {
    background-color: ${({ theme }) => theme.disabledBackground};
    border-color: ${({ theme }) => theme.disabledBorder};
    color: ${({ theme }) => theme.disabledText};
    cursor: default;

    .ant-input-number-input {
      cursor: default;
    }

    &:hover {
      border-color: ${({ theme }) => theme.disabledBorder} !important;
    }
  }
`;
