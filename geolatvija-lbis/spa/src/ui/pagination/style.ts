import { Pagination } from 'antd';
import styled from 'styled-components';

export const StyledPagination = styled(Pagination)`
  &.default {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid ${({ theme }) => theme.border};
    padding-top: 20px;
    position: relative;

    .ant-pagination-prev,
    .ant-pagination-next {
      position: absolute;
      button {
        color: ${({ theme }) => theme.textColor01};
      }
      @media screen and (max-width: 1200px) {
        position: initial;
      }
    }

    .ant-pagination-prev {
      left: 0;
    }

    .ant-pagination-next {
      right: 0;
    }

    .ant-pagination-item {
      border-radius: 5px;
      a {
        color: ${({ theme }) => theme.brand07};
        font-size: ${({ theme }) => theme.p2Size};
      }
    }
    .ant-pagination-disabled {
      button {
        color: ${({ theme }) => theme.disabledText};
        border-color: ${({ theme }) => theme.disabledBorder};
        background-color: ${({ theme }) => theme.gray01};

        &:hover {
          color: ${({ theme }) => theme.disabledText} !important;
          background-color: ${({ theme }) => theme.disabledBackground} !important;
          cursor: no-drop;
        }
      }
    }
    .ant-pagination-item-active {
      background-color: ${({ theme }) => theme.disabledBackground};
      border-color: ${({ theme }) => theme.darkModeBorder};
      a {
        color: ${({ theme }) => theme.gray07};
      }
    }
  }
`;
