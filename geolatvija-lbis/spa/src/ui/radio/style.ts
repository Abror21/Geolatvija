import styled from 'styled-components/macro';
import { Radio } from 'antd';

export const StyledRadio = styled(Radio)`
  font-size: ${({ theme }) => theme.p2Size};
  color: ${({ theme }) => theme.textColor01};
  background-color: transparent;

  .ant-radio-inner {
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.border2};
    width: ${({ theme }) => theme.radioGroupInnerSize} !important;
    height: ${({ theme }) => theme.radioGroupInnerSize} !important;
  }

  .ant-radio {
    vertical-align: middle;
  }

  .ant-radio-checked .ant-radio-inner {
    border-color: ${({ theme }) => theme.border4};
    background-color: transparent;
    box-shadow: none;
  }

  .ant-radio-checked:after {
    border: 1px solid ${({ theme }) => theme.border4};
  }

  &.ant-radio-wrapper-disabled .ant-radio-disabled {
    color: ${({ theme }) => theme.textColor01};
    .ant-radio-inner:after {
      background-color: ${({ theme }) => theme.disabledText};
    }
  }

  .ant-radio-disabled + span {
    color: ${({ theme }) => theme.textColor01};
  }

  .ant-radio-disabled .ant-radio-inner {
    border: 1px solid ${({ theme }) => theme.border2} !important;
  }

  .ant-radio-inner::after {
    background-color: ${({ theme }) => theme.button01};
  }

  .ant-radio-wrapper:hover .ant-radio,
  .ant-radio:hover .ant-radio-inner,
  .ant-radio-input:focus + .ant-radio-inner {
    border-color: ${({ theme }) => theme.brand02} !important;
  }

  &:hover {
    .ant-radio {
      .ant-radio-inner {
        border: 1px solid ${({ theme }) => theme.brand02} !important;
      }
    }
  }

  .ant-radio-inner::after:disabled {
    background-color: ${({ theme }) => theme.disabledBackground};
  }
`;
