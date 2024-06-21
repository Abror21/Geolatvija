import styled from 'styled-components/macro';
import { Select } from 'antd';

export const StyledSelect = styled(Select)<{ width?: string | null }>`
  min-height: ${({ theme }) => theme.selectHeight} !important;
  .dropdown-button {
    display: flex;
    margin-top: 16px;

    .ant-btn {
      flex-grow: 1;
    }
  }

  .ant-select-selection-placeholder {
    font-size: ${({ theme }) => theme.p1Size} !important;
    font-weight: 350 !important;
    color: ${({ theme }) => theme.placeholder} !important;
    text-overflow: ellipsis;
  }

  &.ant-select-lg {
    line-height: ${({ theme }) => theme.lineHeight5};
    display: flex;
    flex-grow: 1;

    .ant-select-selector {
      display: flex;
      flex-grow: 1;

      background-color: ${({ theme }) => theme.gray01};
      min-height: ${({ theme }) => theme.selectHeight} !important;
      font-size: ${({ theme }) => theme.p1Size};
      border-color: ${({ theme }) => theme.border};
      box-shadow: ${({ theme }) => theme.formItemsBoxShadowDefault};
      .ant-select-selection-item {
        color: ${({ theme }) => theme.textColor02};
        line-height: ${({ theme }) => theme.lineHeight5} !important;
        font-size: ${({ theme }) => theme.p1Size};
        padding: 10px 5px;
      }

      &:hover {
        border-color: ${({ theme }) => theme.border4} !important;
      }
    }
  }
  .ant-select-selection-overflow-item {
    max-width: ${({ width }) => width ?? 'none'} !important;
    .ant-select-selection-item {
      background-color: ${({ theme }) => theme.brand02Light};
      .ant-select-selection-item-content {
        text-overflow: ellipsis;
        overflow: hidden;
        color: ${({ theme }) => theme.textColor04};
        font-size: ${({ theme }) => theme.p1Size};
        line-height: 31px;
      }
    }
  }

  .ant-select-selection-search-input {
    font-size: ${({ theme }) => theme.p1Size} !important;
    color: ${({ theme }) => theme.textColor09} !important;
  }

  &.ant-select-disabled {
    .ant-select-selector {
      background-color: ${({ theme }) => theme.disabledBgForSelect} !important;
      border-color: ${({ theme }) => theme.disabledBorder} !important;
      color: ${({ theme }) => theme.disabledText} !important;
      cursor: default !important;

      .ant-select-selection-search-input {
        cursor: default !important;
      }

      &:hover {
        border-color: ${({ theme }) => theme.disabledBorder} !important;
      }
    }
  }


  .ant-select-selector:has(.ant-select-selection-search-input:focus) {
    border-color: ${({ theme }) => theme.brand02};
    box-shadow: ${({ theme }) => theme.formItemsBoxShadow} !important;
  }

  &.ant-select-multiple .ant-select-selection-item {
    background: ${({ theme }) => theme.brand02Light2} !important;
    color: ${({ theme }) => theme.brand02};
    font-weight: ${({ theme }) => theme.fontWeightBold};
    border-color: ${({ theme }) => theme.border3};
    padding: 0 10px;
    align-items: center;
  }
  &.ant-select-multiple.dimmed .ant-select-selection-item {
    background: ${({ theme }) => theme.gray02} !important;
    .ant-select-selection-item-content {
      color: ${({ theme }) => theme.textColor02} !important;
    }
  }

  .ant-select-selection-item-remove {
    display: flex !important;
    align-items: center;
    color: ${({ theme }) => theme.brand02} !important;
    i {
      color: ${({ theme }) => theme.iconColor02} !important;
    }
  }
  .ant-select-selection-item-remove > * {
    font-size: ${({ theme }) => theme.p1Size};
  }

  .ant-select-item-option-state {
    color: ${({ theme }) => theme.brand02};
    i {
      color: ${({ theme }) => theme.iconColor02} !important;
    }
  }

  font-size: ${({ theme }) => theme.p1Size};
  .ant-select-selector {
    background-color: ${({ theme }) => theme.gray01};
    color: ${({ theme }) => theme.textColor01};
    border-color: ${({ theme }) => theme.border2};
    &:hover {
      background-color: ${({ theme }) => theme.gray01};
      border-color: ${({ theme }) => theme.brand02};
    }
  }

  .ant-select-selector {
    background-color: ${({ theme }) => theme.gray01} !important;
  }

  .ant-select-selection-placeholder {
    color: ${({ theme }) => theme.disabledText};
  }

  &.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    height: auto;
    .ant-select-selection-item {
      line-height: ${({ theme }) => theme.lineHeight3};
    }
  }

  &.ant-select-single.ant-select-open .ant-select-selection-item {
    color: ${({ theme }) => theme.textColor01};
  }

  &.ant-select:not(.ant-select-disabled):hover .ant-select-selector {
    border-color: ${({ theme }) => theme.brand02};
  }

  &.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-color: ${({ theme }) => theme.brand02};
    box-shadow: none;
  }

  & .ant-select-item-option-selected:not(.ant-select-item-option-disabled) .ant-select-item-option-state {
    color: ${({ theme }) => theme.brand02};
  }

  .rc-virtual-list-holder {
    .ant-select-item {
      background-color: ${({ theme }) => theme.portalBackground};

      color: ${({ theme }) => theme.textColor01};
      font-size: ${({ theme }) => theme.p1Size};
      line-height: ${({ theme }) => theme.lineHeight6};
      &:hover {
        color: ${({ theme }) => theme.textColor04};
        background-color: ${({ theme }) => theme.brand02Light} !important;
      }
    }
    .ant-select-item-option-selected {
      font-size: ${({ theme }) => theme.p1Size};
      background-color: ${({ theme }) => theme.brand02Light} !important;
      color: ${({ theme }) => theme.textColor04};
    }
    .ant-select-item-option-active {
      background-color: ${({ theme }) => theme.brand02Light} !important;
      color: ${({ theme }) => theme.textColor04} !important;
    }
  }

  .ant-select-arrow {
    color: ${({ theme }) => theme.iconColor02};
    i {
      font-size: ${({ theme }) => theme.p3Size};
    }
  }
`;
