import styled from 'styled-components/macro';
import { Collapse } from 'antd';

export const StyledPanelExtra = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  .disable-icon {
    cursor: not-allowed;
  }
`;

export const StyledPanelNone = styled.div`
  display: flex;
  justify-content: end;
`;

export const StyledCollapse = styled(Collapse)`
  border: 0;
  background: none;

  &.ant-collapse-ghost {
    background-color: transparent;

    .ant-collapse-item {
      background-color: transparent;
      border: transparent !important;

      .ant-collapse-content {
        background-color: transparent;
      }

      .ant-collapse-header {
        padding: 9px 0;
      }
    }
  }

  &.ant-collapse-icon-position-end {
    .ant-collapse-expand-icon i.ant-collapse-arrow {
      color: ${({ theme }) => theme.gray06};
      font-size: ${({ theme }) => theme.p2Size};
    }
    .ant-collapse-header span.ant-collapse-header-text {
      color: ${({ theme }) => theme.brand02};
      font-size: ${({ theme }) => theme.p2Size};
      line-height: ${({ theme }) => theme.lineHeight5};
      text-decoration: underline;
    }
    .ant-collapse-content .ant-collapse-content-box {
      padding: 0;
    }
  }

  .ant-collapse-item {
    background-color: ${({ theme }) => theme.portalBackground};
    border: 1px solid ${({ theme }) => theme.border} !important;
    border-radius: 6px;
    margin: 16px 0;

    .ant-collapse-content {
      background-color: ${({ theme }) => theme.gray01};
      border-color: ${({ theme }) => theme.border};
      border-radius: 0 0 6px 6px;
    }

    .ant-collapse-header {
      display: flex;
      align-items: center;
      padding: 9px 20px;
      color: ${({ theme }) => theme.textColor01};

      .portal-icon {
        font-size: ${({ theme }) => theme.p1Size};
        width: 16px;
      }

      .ant-collapse-header-text {
        flex: auto !important;
        font-size: ${({ theme }) => theme.p2Size};
        line-height: ${({ theme }) => theme.h3Size};
        color: ${({ theme }) => theme.textColor02};
        font-weight: ${({ theme }) => theme.fontWeightBold};
        margin-right: 4px;
      }

      .ant-collapse-arrow {
        line-height: normal !important;
        color: ${({ theme }) => theme.brand02};

        &:before {
          display: inherit !important;
        }
      }
    }
  }
`;

export const StyledErrorCollapse = styled(Collapse)`
  margin-bottom: 16px;
  border: 0;
  background: none;

  .ant-collapse-item {
    background-color: ${({ theme }) => theme.errors};
    border: 1px solid ${({ theme }) => theme.border} !important;

    .ant-collapse-content {
      background-color: ${({ theme }) => theme.errors};
      border-color: ${({ theme }) => theme.border};
      max-height: 300px;
      overflow: auto;

      .ant-collapse-content-box {
        padding: 0;

        .panel-container-0 {
          padding: 24px 8px;
          background-color: ${({ theme }) => theme.errors};
        }

        .panel-container-1 {
          padding: 24px 8px;
          background-color: ${({ theme }) => theme.errorsLight};
        }
      }
    }

    .ant-collapse-header {
      color: ${({ theme }) => theme.textColor01};

      .portal-icon {
        font-size: ${({ theme }) => theme.p1Size};
      }

      .ant-collapse-arrow {
        line-height: normal !important;
        color: ${({ theme }) => theme.brand02};

        &:before {
          display: inherit !important;
        }
      }
    }
  }
`;

export const StyledWarningCollapse = styled(Collapse)`
  margin-bottom: 16px;
  border: 0;
  background: none;

  .ant-collapse-item {
    background-color: ${({ theme }) => theme.warning};
    border: 1px solid ${({ theme }) => theme.border} !important;

    .ant-collapse-content {
      background-color: ${({ theme }) => theme.warning};
      border-color: ${({ theme }) => theme.border};
      max-height: 300px;
      overflow: auto;

      .ant-collapse-content-box {
        padding: 0;

        .panel-container-0 {
          padding: 24px 8px;
          background-color: ${({ theme }) => theme.warning};
        }

        .panel-container-1 {
          padding: 24px 8px;
          background-color: ${({ theme }) => theme.warning};
        }
      }
    }

    .ant-collapse-header {
      color: ${({ theme }) => theme.textColor01};

      .portal-icon {
        font-size: ${({ theme }) => theme.p1Size};
      }

      .ant-collapse-arrow {
        line-height: normal !important;
        color: ${({ theme }) => theme.brand02};

        &:before {
          display: inherit !important;
        }
      }
    }
  }
`;
