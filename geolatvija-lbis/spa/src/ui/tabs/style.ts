import styled from 'styled-components/macro';
import { Tabs } from 'antd';

export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    padding-bottom: 30px !important;
    margin-bottom: 30px;

    &:before {
      color: ${({ theme }) => theme.border};
      border-color: ${({ theme }) => theme.border};
    }
  }
  &.my-participation-tabs .ant-tabs-nav {
    padding-top: 20px !important;
    padding-bottom: 20px !important;
    margin-bottom: 14px;
  }

  .ant-tabs-ink-bar {
    display: none !important;
  }

  .ant-tabs-nav-list {
    display: flex;
    gap: 8px;

    .ant-tabs-tab {
      border: 1px solid ${({ theme }) => theme.border} !important;
      font-size: ${({ theme }) => theme.p2Size};
      border-radius: 6px !important;
      padding: 10px 14px;
      margin: 0 !important;
      font-size: ${({ theme }) => theme.p2Size};
      line-height: ${({ theme }) => theme.lineHeight6};
      font-weight: ${({ theme }) => theme.fontWeightBold};
      background: ${({ theme }) => theme.transparent} !important;

      .ant-tabs-tab-btn {
        color: ${({ theme }) => theme.textColor02};
        span {
          color: ${({ theme }) => theme.textColor02};
        }
      }

      &:hover .ant-tabs-tab-btn {
        color: ${({ theme }) => theme.brand02} !important;
      }

      &.ant-tabs-tab-active {
        background: ${({ theme }) => theme.tagBackground05} !important;
        .ant-tabs-tab-btn {
          color: ${({ theme }) => theme.textColor12} !important;
          span {
            color: ${({ theme }) => theme.textColor12} !important;
          }
        }
      }
    }
  }

  .ant-tabs-content-holder {
    border-top: none;
  }
  &.my-participation-tabs.no-border {
    .ant-tabs-nav-list {
      .ant-tabs-tab {
        border: none !important;
      }
    }
  }
`;
