import styled from 'styled-components/macro';
import { Tree } from 'antd';

const { DirectoryTree } = Tree;

export const StyledDirectoryTree = styled(DirectoryTree)`
  &.ant-tree-directory .ant-tree-treenode .ant-tree-node-content-wrapper {
    user-select: initial; !important;
  }

  .ant-tree-list {
    background-color: ${({ theme }) => theme.componentsBackground};
  }

  .ant-tree-node-content-wrapper {
    font-weight: ${({ theme }) => theme.fontWeightBold} !important;
    font-size: ${({ theme }) => theme.p3Size} !important;
  }

  .ant-tree-list-holder {
    background-color: ${({ theme }) => theme.componentsBackground};
  }

  .ant-tree-node {
    background-color: ${({ theme }) => theme.componentsBackground};
    color: ${({ theme }) => theme.textColor01} !important;
  }

  .ant-tree {
    color: ${({ theme }) => theme.textColor01} !important;
  }

  .ant-tree-list-holder-inner {
    color: ${({ theme }) => theme.textColor01} !important;
    .ant-tree-treenode {
      font-size: ${({ theme }) => theme.p2Size};
      line-height: ${({ theme }) => theme.h2Size};
      font-weight: ${({ theme }) => theme.fontWeightRegular};
      &.ant-tree-treenode-checkbox-checked {
        color: ${({ theme }) => theme.textColor01} !important;
      }
    }

    .ant-tree-treenode:hover:before {
      background-color: transparent !important;
    }
  }

  .ant-tree-checkbox {
    top: 0;
  }

  .ant-tree-checkbox-inner {
    width: ${({ theme }) => theme.h3Size} !important;
    height: ${({ theme }) => theme.h3Size} !important;
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

  .ant-tree-treenode-selected::before {
    background: ${({ theme }) => theme.componentsBackground} !important;
  }

  .ant-tree-node-selected {
    color: ${({ theme }) => theme.textColor01} !important;
  }

  .ant-tree-content-wrapper {
    color: ${({ theme }) => theme.textColor01} !important;
  }

  .ant-tree-switcher {
    color: ${({ theme }) => theme.textColor01} !important;
  }

  .ant-tree-switcher-icon {
    font-size: ${({ theme }) => theme.p3Size} !important;
  }
`;
