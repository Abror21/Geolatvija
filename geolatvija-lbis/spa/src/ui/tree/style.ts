import styled from 'styled-components/macro';

export const StyledTree = styled.div`
  .ant-tree-list-holder-inner {
    background-color: ${({ theme }) => theme.portalBackground};
    .ant-tree-treenode {
      font-size: ${({ theme }) => theme.p2Size};
      line-height: ${({ theme }) => theme.h2Size};
      font-weight: ${({ theme }) => theme.fontWeightBold};
      align-items: center;
      &.ant-tree-treenode-checkbox-checked {
        color: ${({ theme }) => theme.brand02} !important;
      }
    }
  }

  .ant-tree-checkbox:hover {
    .ant-tree-checkbox-inner {
      border-color: ${({ theme }) => theme.brand02} !important;
      background-color: ${({ theme }) => theme.transparent} !important;
    }
  }

  .ant-tree-title {
    white-space: normal;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    word-break: break-all;
  }

  .ant-tree-switcher-noop {
    width: 0px;
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
`;
