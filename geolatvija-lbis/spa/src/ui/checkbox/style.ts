import styled from 'styled-components/macro';
import { Checkbox } from 'antd';

export const StyledCheckbox = styled(Checkbox)`
  font-size: ${({ theme }) => theme.p2Size};
  color: ${({ theme }) => theme.textColor01};
  display: flex;
  align-items: center;

  .ant-checkbox {
    top: 0;
  }

  .ant-checkbox-inner {
    
    width: ${({ theme }) => theme.checkboxSize};
    height: ${({ theme }) => theme.checkboxSize};

    &:after {
      margin-left: ${({ theme }) => theme.checkmarkMarginLeft} !important;
      width: ${({ theme }) => theme.checkmarkWidth} !important;
      height: ${({ theme }) => theme.checkmarkHeight} !important;
      border-width: 3px !important;
    }
  }

  span {
    font-size: ${({ theme }) => theme.p2Size} !important;
  }

  .ant-radio-inner::after {
    position: absolute;
    top: 50%;
    left: 40%;
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
  }

  .ant-checkbox .ant-checkbox-inner {
    background-color: ${({ theme }) => theme.gray01};
    border-color: ${({ theme }) => theme.border2};
  }

  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: ${({ theme }) => theme.button01};
  }

  .ant-checkbox-checked {
    &::after {
      border: none;
    }
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${({ theme }) => theme.gray01};
    border-color: ${({ theme }) => theme.switchColor01};
    &:after {
      border-color: ${({ theme }) => theme.switchColor01};
      inset-inline-start: 23% !important;
    }
  }

  .ant-checkbox-disabled .ant-checkbox-inner {
    background-color: ${({ theme }) => theme.disabledBackground};
    border-color: ${({ theme }) => theme.disabledBorder} !important;
  }

  .ant-checkbox-disabled + span {
    color: ${({ theme }) => theme.disabledText};
  }

  &.ant-checkbox-wrapper-checked:hover .ant-checkbox-inner {
    background-color: ${({ theme }) => theme.transparent} !important;
    border: 1px solid ${({ theme }) => theme.brand02} !important;
  }

  &.ant-checkbox-wrapper-disabled {
    cursor: default;

    .ant-checkbox-disabled {
      cursor: default;
      .ant-checkbox-input {
        cursor: default;
      }
    }

    .ant-checkbox-disabled + span {
      cursor: default;
    }
  }

  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: ${({ theme }) => theme.button01};
    border-color: ${({ theme }) => theme.button01};

    height: ${({ theme }) => theme.intermediateCheckmarkSize} !important;
    width: ${({ theme }) => theme.intermediateCheckmarkSize} !important;
    margin-left: ${({ theme }) => theme.intermediateCheckmarkMarginLeft} !important;
  }

  .ant-checkbox-disabled .ant-checkbox-inner::after {
    border-color: ${({ theme }) => theme.disabledBorder};
  }

  &:hover {
    .ant-checkbox .ant-checkbox-inner {
      border-color: ${({ theme }) => theme.brand02};
    }
    .ant-checkbox::after {
      color: ${({ theme }) => theme.button01};
      border-color: ${({ theme }) => theme.button01};
    }
  }
`;
