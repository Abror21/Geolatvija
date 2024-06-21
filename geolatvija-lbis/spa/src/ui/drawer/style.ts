import styled from 'styled-components/macro';
import { Drawer } from 'antd';

export const StyledDrawer = styled(Drawer)`
  background-color: ${({ theme }) => theme.componentsBackground} !important;
  .ant-drawer-content {
    .ant-drawer-header {
      background-color: ${({ theme }) => theme.componentsBackground};
      border-bottom: none;

      .portal-icon {
        color: ${({ theme }) => theme.button03};
      }
      .portal-icon:hover {
        color: ${({ theme }) => theme.button01};
      }

      .ant-drawer-title {
        color: ${({ theme }) => theme.textColor01};
        font-weight: ${({ theme }) => theme.fontWeightBolder};
      }
    }

    .ant-drawer-footer {
      border-top: none;
    }
  }

  .drawer-buttons .ant-btn {
    margin-right: 8px;
  }

  .ant-radio-group,
  .ant-btn-primary {
    margin-bottom: 16px;
  }

  .ant-input-search {
    margin-bottom: 23px;
  }

  .sub-title {
    font-size: ${({ theme }) => theme.h3Size};
    font-weight: ${({ theme }) => theme.fontWeightBold};
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    .ant-drawer-content-wrapper {
      width: 100% !important;
    }
  }
`;
