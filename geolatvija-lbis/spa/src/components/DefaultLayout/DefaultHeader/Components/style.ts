import styled from 'styled-components/macro';
import { Layout } from 'antd';
import { VARIABLES } from 'styles/globals';

const { Sider } = Layout;

export const StyledSider = styled(Sider)`
  background-color: ${({ theme }) => theme.gray03};
  max-height: 90vh;
  overflow: auto;

  &.ant-layout-sider-has-trigger {
    padding-bottom: 0;
  }

  .ant-layout-sider-children {
    background-color: ${({ theme }) => theme.gray01};
    overflow-y: auto;
    overflow-x: hidden;
    .ant-menu {
      background-color: ${({ theme }) => theme.gray03};
      border-right: none;
    }

    .ant-menu-inline {
      background-color: ${({ theme }) => theme.gray01};
      border-right: none;
      color: ${({ theme }) => theme.textColor01};
    }

    .ant-menu-item {
      white-space: pre-wrap;
      overflow: visible;
      height: auto;
      font-size: ${({ theme }) => theme.p2Size};
      line-height: ${({ theme }) => theme.lineHeight8};
      padding: 12px;
      padding-left: 24px !important;
      margin: 0;
      width: 100%;
      border-radius: 0;

      a {
        color: ${({ theme }) => theme.textColor01};
        display: flex;
        flex-direction: row;
        align-items: center;
        font-weight: ${({ theme }) => theme.fontWeightBolder};

        &.collapsed {
          justify-content: center;
          .portal-icon {
            margin-right: 0;
          }
        }
      }

      .portal-icon {
        color: ${({ theme }) => theme.iconColor01};
        margin-right: 13px;
      }

      &:active {
        background-color: ${({ theme }) => theme.brand02} !important;
      }
    }
    .ant-menu-submenu {
      .portal-icon {
        color: ${({ theme }) => theme.iconColor01};
        margin-right: 13px;
        &:before {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      &.ant-menu-submenu-open {
        & > .ant-menu-submenu-title {
          color: ${({ theme }) => theme.brand02} !important;
          background: ${({ theme }) => theme.brand02Light2} !important;
        }
        .ant-menu-submenu-arrow {
          color: ${({ theme }) => theme.brand02};
          font-size: ${({ theme }) => theme.p2Size};
        }
      }

      .ant-menu-title-content {
        margin-left: 0;
        color: ${({ theme }) => theme.gray06} !important;
        font-size: ${({ theme }) => theme.p2Size};
      }

      .ant-menu-submenu-title {
        font-weight: ${({ theme }) => theme.fontWeightBolder};
        margin: 0;
        width: 100%;
        border-radius: 0;

        &:hover {
          color: ${({ theme }) => theme.brand02};
          font-weight: ${({ theme }) => theme.fontWeightBolder};
        }
        &:active {
          background-color: ${({ theme }) => theme.button02};
          font-weight: ${({ theme }) => theme.fontWeightBolder};
        }
        &:focus {
          color: ${({ theme }) => theme.textColor03} !important;
          background-color: ${({ theme }) => theme.button02};
          font-weight: ${({ theme }) => theme.fontWeightBolder};
        }
      }

      .ant-menu-submenu-arrow {
        color: ${({ theme }) => theme.textColor01};
        font-size: ${({ theme }) => theme.p2Size};
      }

      .ant-menu-item a {
        font-weight: ${({ theme }) => theme.fontWeightRegular};
      }

      &:hover {
        color: ${({ theme }) => theme.brand02};

        .ant-menu-submenu-arrow::before,
        .ant-menu-submenu-arrow::after {
          background-color: ${({ theme }) => theme.brand02} !important;
        }
      }

      &.second-layer {
        .ant-menu-submenu-title {
          padding: 12px !important;
          padding-left: 24px !important;
        }

        &.ant-menu-submenu-open {
          .ant-menu-submenu-title {
            color: ${({ theme }) => theme.brand02};
            background: ${({ theme }) => theme.brand02Light2};
          }
          .ant-menu-submenu-arrow {
            color: ${({ theme }) => theme.brand02};
          }
        }

        .ant-menu-item {
          padding-left: 48px !important;
        }
      }
    }
    .ant-menu-submenu-selected {
      color: ${({ theme }) => theme.brand02};
    }
    .ant-menu-item-selected {
      background-color: ${({ theme }) => theme.brand02};
      font-weight: ${({ theme }) => theme.fontWeightBolder};

      .portal-icon {
        color: ${({ theme }) => theme.gray01};
      }

      a {
        color: ${({ theme }) => theme.gray01};
        &:hover {
          color: ${({ theme }) => theme.gray01};
        }
      }
    }
  }
  .ant-layout-sider-trigger {
    background-color: ${({ theme }) => theme.gray03};
    border: 1px solid ${({ theme }) => theme.customBorder};

    .anticon {
      color: ${({ theme }) => theme.iconColor01};
    }
  }
`;
