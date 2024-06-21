import styled, { css } from 'styled-components/macro';
import { VARIABLES } from 'styles/globals';

export const StyledCheckboxTreeComponent = styled.div`
  .ant-tree-list-holder-inner {
    background-color: ${({ theme }) => theme.portalBackground};
    color: ${({ theme }) => theme.brand02} !important;
    .ant-tree-treenode {
      font-size: ${({ theme }) => theme.p2Size};
      line-height: ${({ theme }) => theme.h2Size};
      font-weight: ${({ theme }) => theme.fontWeightBold};
      &.ant-tree-treenode-checkbox-checked {
        color: ${({ theme }) => theme.brand02} !important;
      }
    }
  }

  .ant-tree-checkbox {
    top: 0;
  }

  .ant-tree-checkbox-inner {
    width: ${({ theme }) => theme.h3Size} !important;
    height: ${({ theme }) => theme.h3Size} !important;

    &:after {
      margin-left: ${({ theme }) => theme.checkmarkMarginLeft} !important;
      width: ${({ theme }) => theme.checkmarkWidth} !important;
      height: ${({ theme }) => theme.checkmarkHeight} !important;
    }
  }

  .ant-tree-radio-inner::after {
    position: absolute;
    top: 50%;
    left: 40%;
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
  }

  .ant-tree-checkbox .ant-tree-checkbox-inner {
    background-color: ${({ theme }) => theme.gray01};
    border-color: ${({ theme }) => theme.border2};
  }

  .ant-tree-checkbox-input:focus + .ant-tree-checkbox-inner {
    border-color: ${({ theme }) => theme.button01};
  }

  .ant-tree-checkbox-checked .ant-tree-checkbox-inner {
    background-color: ${({ theme }) => theme.gray01};
    border-color: ${({ theme }) => theme.switchColor01};
    &:after {
      border-color: ${({ theme }) => theme.switchColor01};
    }
  }

  .ant-tree-checkbox-disabled .ant-tree-checkbox-inner {
    background-color: ${({ theme }) => theme.gray05};
    border-color: ${({ theme }) => theme.disabledBorder} !important;
  }

  .ant-tree-checkbox-disabled + span {
    color: ${({ theme }) => theme.disabledText};
  }

  &.ant-tree-checkbox-wrapper-disabled {
    cursor: default;

    .ant-tree-checkbox-disabled {
      cursor: default;
      .ant-tree-checkbox-input {
        cursor: default;
      }
    }

    .ant-tree-checkbox-disabled + span {
      cursor: default;
    }
  }

  .ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner::after {
    background-color: ${({ theme }) => theme.button01};
    border-color: ${({ theme }) => theme.button01};
  }
  .ant-tree-checkbox-disabled .ant-tree-checkbox-inner::after {
    border-color: ${({ theme }) => theme.gray09};
  }

  &:hover {
    .ant-tree-checkbox .ant-tree-checkbox-inner {
      border-color: ${({ theme }) => theme.button01};
    }
    .ant-tree-checkbox::after {
      color: ${({ theme }) => theme.button01};
      border-color: ${({ theme }) => theme.button01};
    }
  }

  .ant-tree-switcher-icon {
    font-size: ${({ theme }) => theme.p4Size} !important;
    margin-top: ${({ theme }) => theme.chevronIconMarginTop} !important;
  }
`;
