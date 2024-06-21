import styled from 'styled-components/macro';
import { VARIABLES } from 'styles/globals/VARIABLES';

export const StyledSearch = styled.div`
  display: flex;
  flex-direction: row;

  font-size: ${({ theme }) => theme.p2Size};
  border-color: ${({ theme }) => theme.border2};
  border-radius: ${VARIABLES.buttonBorderRadius};
  box-shadow: none;

  .input-container {
    flex-grow: 1;
  }

  &:hover {
    .ant-btn {
      border-color: ${({ theme }) => theme.brand02};
    }
    .ant-input-affix-wrapper {
      border-color: ${({ theme }) => theme.brand02};
    }
  }

  &:focus {
    .ant-btn {
      border-color: ${({ theme }) => theme.brand02};
    }
    .ant-input-affix-wrapper {
      border-color: ${({ theme }) => theme.brand02};
    }
  }

  .ant-input-affix-wrapper {
    border-color: ${({ theme }) => theme.border2};
    background-color: ${({ theme }) => theme.gray01};
  }

  .ant-input-affix-wrapper-focused {
    border-color: ${({ theme }) => theme.brand02};
  }

  .ant-input {
    font-size: ${({ theme }) => theme.p2Size} !important;
    background-color: ${({ theme }) => theme.gray01};
    color: ${({ theme }) => theme.textColor01};
    border-color: ${({ theme }) => theme.border2};
    border-radius: ${VARIABLES.buttonBorderRadius};
    line-height: ${({ theme }) => theme.lineHeight5} !important;
    &::placeholder {
      color: ${({ theme }) => theme.disabledText};
      font-size: ${({ theme }) => theme.p2Size};
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
    }
  }
  .anticon-close-circle {
    svg {
      width: ${({ theme }) => theme.p2Size};
      height: ${({ theme }) => theme.p2Size};
    }
  }
  // .ant-input-clear-icon {
  //   color: ${({ theme }) => theme.iconColor04};
  // }

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
