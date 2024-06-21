import styled from 'styled-components/macro';
import { Layout } from 'antd';
import { VARIABLES } from 'styles/globals';

const { Sider } = Layout;

export const StyledSidebarDrawer = styled(Sider)<{ notificationHeight?: number }>`
  background-color: ${({ theme }) => theme.componentsBackground} !important;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.textColor01};
  min-width: 380px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);

  &.ant-layout-sider {
    background-color: ${({ theme }) => theme.componentsBackground} !important;
  }

  height: calc(
    100vh - ${VARIABLES.headerHeight} - ${VARIABLES.footerHeight} - ${(props) => props.notificationHeight}px
  );
  overflow: auto;

  &.ant-layout-sider-collapsed {
    .ant-layout-sider-children {
      display: none;
    }

    .sidebar-title {
      display: none;
    }

    .content {
      display: none;
    }
  }

  &.sidebar-style-1 {
    .ant-layout-sider-children {
      .sidebar-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 26px;
        background-color: ${({ theme }) => theme.portalBackground};

        .close-icon {
          margin-bottom: auto;
        }

        .portal-icon {
          cursor: pointer;
        }
      }
    }

    .content {
      padding: 26px;

      display: flex;
      flex-direction: column;
      gap: 20px;

      height: calc(100% - 76px);

      & > * {
        border-bottom: 1px solid ${({ theme }) => theme.border};
        padding-bottom: 20px;
        color: ${({ theme }) => theme.textColor01};
      }
    }
  }

  &.sidebar-style-2 {
    .ant-layout-sider-children {
      padding: 25px 30px;

      .sidebar-title-wrapper {
        .sidebar-title {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 30px;
          padding-bottom: 20px;
          color: ${({ theme }) => theme.gray07};

          .breadcrumb_and_title {
            width: 90%;
            display: flex;
            flex-direction: column;
            gap: 15px;
            overflow: hidden;
            nav ol li:last-child span{
              white-space: break-spaces;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .close-icon-container {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .close-icon {
              margin-bottom: auto;
              font-size: ${({ theme }) => theme.p2Size};
              line-height: 20px;
            }
            .close-icon-text {
              font-size: ${({ theme }) => theme.p3Size};
              margin-top: 4px;
            }
          }

          .portal-icon {
            cursor: pointer;
          }
        }
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: calc(100% - 76px);
    }
  }

  &.participation-budget,
  &.tapis-documents {
    .content {
      a {
        width: 30px;
        align-self: center;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        i {
          font-size: 16px;
        }
      }
      padding: 26px 10px;

      display: flex;
      flex-direction: column;

      height: calc(100% - 76px);

      & > :last-child {
        border-bottom: unset;
      }
    }
  }
  .breadcrumb_and_title {
    max-width: 100%;
  }
`;
