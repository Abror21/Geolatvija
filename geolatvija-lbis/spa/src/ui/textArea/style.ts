import styled from 'styled-components/macro';
import { Input } from 'antd';

const { TextArea } = Input;

export const StyledTextArea = styled(TextArea)`
  color: ${({ theme }) => theme.textColor01};
  font-size: ${({ theme }) => theme.p2Size};
  background-color: ${({ theme }) => theme.gray01};
  border-color: ${({ theme }) => theme.border2};
  box-shadow: none !important;
  padding: 12px 14px;
  resize: vertical !important;

  &:hover {
    border-color: ${({ theme }) => theme.brand02};
  }

  &:focus {
    border-color: ${({ theme }) => theme.brand02};
    box-shadow: ${({ theme }) => theme.formItemsBoxShadow} !important;
  }

  .ant-input {
    font-size: ${({ theme }) => theme.p2Size};
    background-color: ${({ theme }) => theme.gray01};
    color: ${({ theme }) => theme.textColor01};
  }

  .ant-input-prefix {
    color: ${({ theme }) => theme.textColor01};
  }

  &.ant-input-disabled,
  &.ant-input[disabled] {
    background-color: ${({ theme }) => theme.disabledBackground};
    border-color: ${({ theme }) => theme.disabledBorder};
    color: ${({ theme }) => theme.disabledText};
    cursor: default;
    &:hover {
      border-color: ${({ theme }) => theme.disabledBorder} !important;
    }
  }
`;
