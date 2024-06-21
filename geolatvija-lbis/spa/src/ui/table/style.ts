import styled from 'styled-components/macro';
import { Table } from 'antd';

export const StyledTable = styled(Table)`
  &.half-size {
    .ant-table {
      max-height: 50vh;
    }
  }

  .ant-table {
    overflow: auto;
    border: 1px solid ${({ theme }) => theme.border};
    border-bottom: none;
    border-radius: 6px 6px 0 0;
  }

  .ant-table-tbody > tr.row-red > td {
    color: ${({ theme }) => theme.rowRed};
  }

  .ant-table-tbody > tr.row-green > td {
    color: ${({ theme }) => theme.rowGreen};
  }

  .ant-spin-container {
    display: grid;
  }

  tr.ant-table-placeholder {
    &:hover {
      & > td {
        background-color: ${({ theme }) => theme.brand03};
        color: ${({ theme }) => theme.textColor05} !important;
      }
    }

    .ant-table-cell {
      background-color: ${({ theme }) => theme.componentsBackground};
      border-right: 1px solid ${({ theme }) => theme.customBorder};
      border-left: 1px solid ${({ theme }) => theme.customBorder};
    }

    a {
      justify-content: center;
    }
  }

  .ant-btn-circle:not(:last-child) {
    margin-right: 4px;
  }

  .ant-btn-text {
    color: ${({ theme }) => theme.brand02};

    &:not(:last-child) {
      margin-right: 4px;
    }
  }

  .ant-checkbox-wrapper .ant-checkbox-inner {
    width: ${({ theme }) => theme.h3Size};
    height: ${({ theme }) => theme.h3Size};

    &:after {
      margin-left: ${({ theme }) => theme.checkmarkMarginLeft} !important;
      width: ${({ theme }) => theme.checkmarkWidth} !important;
      height: ${({ theme }) => theme.checkmarkHeight} !important;
    }
  }

  .ant-table-thead .ant-table-cell {
    padding: 12px 16px;
    background-color: ${({ theme }) => theme.componentsBackground};
    line-height: ${({ theme }) => theme.lineHeight8};
    color: ${({ theme }) => theme.textColor02};
    font-weight: ${({ theme }) => theme.fontWeightBold};
    border-bottom: 1px solid ${({ theme }) => theme.customBorder};
    font-size: ${({ theme }) => theme.p1Size};
    line-height: ${({ theme }) => theme.lineHeight6};

    .ant-checkbox .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.gray01};
      border-color: ${({ theme }) => theme.border2};

      &:hover {
        border-color: ${({ theme }) => theme.brand02};
      }
    }

    .ant-checkbox-wrapper .ant-checkbox-indeterminate .ant-checkbox-inner {
      border-color: ${({ theme }) => theme.brand02};

      &:after {
        background-color: ${({ theme }) => theme.brand02};
        height: ${({ theme }) => theme.intermediateCheckmarkSize} !important;
        width: ${({ theme }) => theme.intermediateCheckmarkSize} !important;
        margin-left: ${({ theme }) => theme.intermediateCheckmarkMarginLeft} !important;
      }

      &:hover {
        border-color: ${({ theme }) => theme.brand02};
      }
    }

    .ant-checkbox-wrapper .ant-checkbox-checked .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.brand02};
      border-color: ${({ theme }) => theme.brand02};

      &:hover {
        border-color: ${({ theme }) => theme.brand02};
      }
    }

    &.ant-table-column-has-sorters:hover {
      background: ${({ theme }) => theme.tableHeaderColor};
    }

    &:before {
      display: none;
    }

    .ant-table-column-sorters {
      padding: 0;

      .ant-table-column-sorter {
        color: ${({ theme }) => theme.black};

        .active {
          color: ${({ theme }) => theme.black};
        }
      }
    }
  }

  .ant-table-thead > tr > th {
    color: ${({ theme }) => theme.textColor01};
  }

  tr:nth-child(1n) {
    background: ${({ theme }) => theme.portalBackground} !important;
  }

  tr:nth-child(2n) {
    background-color: ${({ theme }) => theme.gray01} !important;
  }

  .ant-table-tbody > tr:hover {
    //switch
    .ant-switch {
      background: ${({ theme }) => theme.switchColor03};
    }

    .ant-switch-checked {
      background: ${({ theme }) => theme.switchColor02};
    }

    .ant-switch-handle::before {
      background-color: ${({ theme }) => theme.iconColor03};
    }

    .ant-switch-inner {
      i {
        color: ${({ theme }) => theme.iconColor03};
        font-size: 12px;
      }
    }
  }

  .ant-table-tbody > tr.row-error-1 > td {
    background-color: ${({ theme }) => theme.errors}!important;
  }

  .ant-table-tbody > tr.row-error-0 > td {
    background-color: ${({ theme }) => theme.errorsLight}!important;
  }

  .ant-table-tbody > tr.row-warning > td {
    background-color: ${({ theme }) => theme.warning}!important;
  }

  .ant-table-tbody > tr.ant-table-row > td {
    background-color: transparent;
  }

  // TODO add new hover color
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background-color: transparent;
  }

  .ant-table-tbody > tr.clickable-row:hover > td {
    background-color: ${({ theme }) => theme.brand03};
    cursor: pointer;
    color: ${({ theme }) => theme.textColor05} !important;

    a {
      color: ${({ theme }) => theme.textColor05} !important;
    }
  }

  .ant-table-tbody > tr > td {
    border-color: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.textColor01};
  }

  .ant-table-column-sort {
    background: transparent;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${({ theme }) => theme.checkedCheckboxBackground} !important;
  }

  .ant-table-tbody .ant-table-cell {
    padding: 16px 16px;
    font-size: ${({ theme }) => theme.p2Size};
    line-height: ${({ theme }) => theme.lineHeight6};
    color: ${({ theme }) => theme.textColor01};
    font-weight: ${({ theme }) => theme.fontWeightBold};

    &.ellipse {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ant-checkbox .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.gray01};
      border-color: ${({ theme }) => theme.border2};
    }

    .ant-checkbox-wrapper .ant-checkbox-checked .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.brand02};
      border-color: ${({ theme }) => theme.brand02};
    }

    .ant-checkbox-disabled .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.disabledBackground};
      border-color: ${({ theme }) => theme.disabledBorder} !important;
    }

    .ant-checkbox-disabled + span {
      color: ${({ theme }) => theme.disabledText};
    }

    .ant-checkbox-wrapper {
      &:hover {
        .ant-checkbox .ant-checkbox-inner {
          border-color: ${({ theme }) => theme.brand02};
        }
        .ant-checkbox .ant-checkbox-inner::after {
          color: ${({ theme }) => theme.brand02};
          border: 2px solid ${({ theme }) => theme.brand02};
          border-color: ${({ theme }) => theme.brand02};
        }

        .ant-checkbox-checked::after {
          color: ${({ theme }) => theme.brand02};
          border: 2px solid ${({ theme }) => theme.brand02} !important;
          border-color: ${({ theme }) => theme.brand02};
        }
      }
    }
  }

  .history-clickable {
    padding: 0 !important;

    a {
      padding: 18px 16px;
      display: flex;
      flex-grow: 1;
      color: ${({ theme }) => theme.textColor02};
    }
  }

  .notification-title a {
    flex-direction: column;
  }

  .ant-pagination {
    font-size: ${({ theme }) => theme.p2Size};
    background-color: ${({ theme }) => theme.gray01};
    justify-content: initial;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 0 0 6px 6px;
    border-top: none;
    margin: 0 !important;
    padding: 16px 24px;

    &:after {
      display: none;
    }

    .ant-pagination-prev {
      height: auto;
      margin-right: auto;

      .pagination-left-button {
        background-color: ${({ theme }) => theme.gray01};
        color: ${({ theme }) => theme.textColor01};
        border: 1px solid ${({ theme }) => theme.border};
        border-radius: 6px;
        font-size: ${({ theme }) => theme.p2Size};
        line-height: ${({ theme }) => theme.lineHeight6};
        font-weight: ${({ theme }) => theme.fontWeightBold};
        font-family: 'Ubuntu', serif !important;
        padding: 8px 14px;
      }

      .pagination-left-button[disabled] {
        color: ${({ theme }) => theme.disabledText};
      }

      .ant-pagination-item-link {
        background-color: ${({ theme }) => theme.gray01};
        color: ${({ theme }) => theme.textColor01};
        border-color: ${({ theme }) => theme.border2};
        font-size: ${({ theme }) => theme.p2Size};
        line-height: ${({ theme }) => theme.lineHeight3};
      }
    }

    .ant-pagination-item {
      background-color: transparent;
      border-color: transparent;
      color: ${({ theme }) => theme.grayInactive};
      border-radius: 8px;
      height: auto;
      width: 40px;

      display: flex;
      justify-content: center;
      align-items: center;

      a {
        font-size: ${({ theme }) => theme.p2Size};
        color: ${({ theme }) => theme.grayInactive};
        line-height: ${({ theme }) => theme.lineHeight3};
        font-weight: ${({ theme }) => theme.fontWeightBold};
      }
    }

    .ant-pagination-item-active {
      background-color: ${({ theme }) => theme.portalBackground};
      border: 1px solid ${({ theme }) => theme.borderColor};
      color: ${({ theme }) => theme.textColor01};
      a {
        color: ${({ theme }) => theme.tablePaginationActiveColor};
      }
    }

    .ant-pagination-next {
      height: auto;
      margin-left: auto;

      .pagination-right-button {
        background-color: ${({ theme }) => theme.gray01};
        color: ${({ theme }) => theme.textColor01};
        border: 1px solid ${({ theme }) => theme.border};
        border-radius: 6px;
        font-size: ${({ theme }) => theme.p2Size};
        line-height: ${({ theme }) => theme.lineHeight6};
        font-weight: ${({ theme }) => theme.fontWeightBold};
        font-family: 'Ubuntu', serif !important;
        padding: 8px 14px;
      }

      .pagination-right-button[disabled] {
        color: ${({ theme }) => theme.disabledText};
      }

      .ant-pagination-item-link {
        background-color: ${({ theme }) => theme.gray01};
        color: ${({ theme }) => theme.textColor01};
        border-color: ${({ theme }) => theme.border2};
        font-size: ${({ theme }) => theme.p2Size};
        line-height: ${({ theme }) => theme.lineHeight3};
      }
    }

    .ant-pagination-options {
      display: inline-block;

      .ant-select {
        font-size: ${({ theme }) => theme.p2Size};

        .ant-select-arrow {
          color: ${({ theme }) => theme.black};
          display: flex;
          align-items: center;
          justify-content: center;

          span {
            &:before {
              font-size: ${({ theme }) => theme.p1Size};
            }
          }
        }

        .fa-angle-down {
          svg {
            display: none;
          }
        }

        .ant-select-selector {
          border: 1px solid ${({ theme }) => theme.border2};
          background-color: ${({ theme }) => theme.gray01};
          color: ${({ theme }) => theme.textColor01};
          height: auto;
          box-shadow: none !important;

          &:hover {
            border-color: ${({ theme }) => theme.brand02} !important;
          }

          &:focus {
            border-color: ${({ theme }) => theme.brand02} !important;
          }

          &:active {
            border-color: ${({ theme }) => theme.brand02} !important;
          }

          .ant-select-selection-item {
            line-height: ${({ theme }) => theme.lineHeight3};
          }
        }
      }

      .ant-select-open .ant-select-selection-item {
        color: ${({ theme }) => theme.textColor01};
      }
    }

    .ant-pagination-options-quick-jumper {
      color: ${({ theme }) => theme.textColor01};
      height: auto;

      input {
        font-size: ${({ theme }) => theme.p2Size};
        background-color: ${({ theme }) => theme.gray01};
        color: ${({ theme }) => theme.textColor01};
        border: 1px solid ${({ theme }) => theme.border2};
        line-height: ${({ theme }) => theme.lineHeight3};
        padding: 0 11px;
        width: min-content;
        max-width: 60px;
        box-shadow: none !important;

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

    .ant-select-dropdown {
      background-color: ${({ theme }) => theme.gray01};

      .rc-virtual-list-holder {
        .ant-select-item {
          color: ${({ theme }) => theme.textColor01};
          font-size: ${({ theme }) => theme.p2Size};
          line-height: ${({ theme }) => theme.lineHeight6};

          &:hover {
            color: ${({ theme }) => theme.textColor04};
            background-color: ${({ theme }) => theme.brand02Light} !important;
          }
        }

        .ant-select-item-option-selected {
          font-size: ${({ theme }) => theme.p2Size};
          background-color: ${({ theme }) => theme.brand02Light} !important;
          color: ${({ theme }) => theme.textColor04};
        }

        .ant-select-item-option-active {
          background-color: ${({ theme }) => theme.brand02Light} !important;
        }
      }
    }
  }

  .ant-table-row.ant-table-row-selected > .ant-table-cell {
    background-color: ${({ theme }) => theme.rowSelectBackground} !important;
  }

  .ant-spin-dot-item {
    background-color: ${({ theme }) => theme.brand02};
  }
  &.text-ellipse .ant-table .ant-table-tbody td {
    p {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  @media (max-width: 480px) {
    .ant-table-pagination-right {
      justify-content: start;
    }

    .ant-pagination {
      display: flex;

      .ant-pagination-total-text {
        flex: 0 0 100%;
        margin-bottom: 8px;
      }

      .ant-pagination-options {
        margin-top: 16px;
        display: flex;
        margin-left: 0;
        flex-basis: 100%;
      }
    }
  }

  .ant-pagination-item-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    .ant-pagination-item-link-icon {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: ${({ theme }) => theme.brand02} !important;
    }
  }

  .ant-pagination-jump-prev {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .ant-pagination-item-ellipsis {
      width: 100%;
      top: ${({ theme }) => theme.paginationEllipsisPositionTop} !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
    }

    .ant-pagination-item-link {
      width: 40px;
      height: 100%;
    }
  }

  .ant-pagination-jump-next {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .ant-pagination-item-ellipsis {
      width: 100%;
      top: ${({ theme }) => theme.paginationEllipsisPositionTop} !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
    }

    .ant-pagination-item-link {
      width: 40px;
      height: 100%;
    }
  }
`;
