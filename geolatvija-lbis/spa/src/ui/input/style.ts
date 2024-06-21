import styled from 'styled-components/macro';
import { Input } from 'antd';

export const StyledInput = styled(Input)`
  &.ant-input {
    font-size: ${({ theme }) => theme.p1Size};
    color: ${({ theme }) => theme.textColor01};
    background-color: ${({ theme }) => theme.gray01};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${({ theme }) => theme.inputBorderRadius};
    box-shadow: ${({ theme }) => theme.formItemsBoxShadowDefault};
    line-height: ${({ theme }) => theme.lineHeight5} !important;

    &::placeholder {
      color: ${({ theme }) => theme.placeholder};
      font-size: ${({ theme }) => theme.p2Size};
    }

    &:hover {
      border-color: ${({ theme }) => theme.brand02};
    }

    &:focus {
      border-color: ${({ theme }) => theme.brand02};
      box-shadow: ${({ theme }) => theme.formItemsBoxShadow} !important;
    }
  }

  &.ant-input-prefix {
    color: ${({ theme }) => theme.textColor01};
  }

  &.ant-input-lg {
    padding: 10px 14px;
    line-height: 22px;
  }

  &.ant-input-affix-wrapper:hover {
    border-color: ${({ theme }) => theme.brand02};
  }

  &.ant-input-disabled {
    background-color: ${({ theme }) => theme.disabledBackground};
    border-color: ${({ theme }) => theme.disabledBorder};
    color: ${({ theme }) => theme.disabledText};
    cursor: not-allowed;

    &:hover {
      border-color: ${({ theme }) => theme.disabledBorder} !important;
    }
  }
`;
