import styled from 'styled-components/macro';
import { Input } from 'antd';
import { VARIABLES } from 'styles/globals/VARIABLES';

const { Search } = Input;

export const StyledSearch = styled(Search)`
  font-size: ${({ theme }) => theme.p2Size};
  border-color: ${({ theme }) => theme.border2};
  border-radius: ${VARIABLES.buttonBorderRadius};
  box-shadow: none;

  .ant-input-affix-wrapper {
    border-color: ${({ theme }) => theme.border2};
    background-color: ${({ theme }) => theme.gray01};
    &:hover {
      border-color: ${({ theme }) => theme.brand02};
    }
    &:focus {
      border-color: ${({ theme }) => theme.brand02};
    }
  }

  .ant-input-affix-wrapper-focused {
    border-color: ${({ theme }) => theme.brand02};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.boxShadow} !important;
  }

  .ant-input {
    font-size: ${({ theme }) => theme.p2Size};
    background-color: ${({ theme }) => theme.gray01};
    color: ${({ theme }) => theme.textColor01};
    border-color: ${({ theme }) => theme.border2};
    border-radius: ${VARIABLES.buttonBorderRadius};
    &::placeholder {
      color: ${({ theme }) => theme.textColor03};
    }
  }

  .ant-input-prefix {
    color: ${({ theme }) => theme.textColor01};
  }

  .ant-input-group-addon {
    background-color: transparent;

    .ant-btn {
      border: 1px solid ${({ theme }) => theme.border2};
      border-radius: ${VARIABLES.buttonBorderRadius};
      background-color: ${({ theme }) => theme.gray01};

      .anticon {
        color: ${({ theme }) => theme.iconColor01};
      }

      &:hover {
        border-color: ${({ theme }) => theme.brand02} !important;
      }
      &:focus {
        border-color: ${({ theme }) => theme.brand02} !important;
      }
      &:active {
        border-color: ${({ theme }) => theme.brand02} !important;
      }
    }
  }

  .ant-input-clear-icon {
    color: ${({ theme }) => theme.iconColor04};
  }

  .ant-input-affix-wrapper-disabled {
    background-color: ${({ theme }) => theme.disabledBackground};
    border-color: ${({ theme }) => theme.disabledBorder};
    color: ${({ theme }) => theme.disabledText};
    &:hover {
      border-color: ${({ theme }) => theme.disabledBorder} !important;
    }
  }
  .ant-input-affix-wrapper-disabled + .ant-input-group-addon {
    .ant-btn {
      background-color: ${({ theme }) => theme.disabledBackground};
      border-color: ${({ theme }) => theme.disabledBorder};
      color: ${({ theme }) => theme.disabledText};
      &:hover {
        border-color: ${({ theme }) => theme.disabledBorder} !important;
      }
    }
  }
`;
