import styled from 'styled-components/macro';
import { Tooltip } from 'antd';

export const StyledTooltip = styled(Tooltip)`
  font-size: ${({ theme }) => theme.p2Size};
  color: ${({ theme }) => theme.textColor01};

  &.initial {
    .ant-tooltip {
      max-width: initial;
    }
  }

  &.white {
    .ant-tooltip-arrow {
      &:before {
        background: white !important;
      }
    }

    .ant-popover-content {
      border: 1px solid ${({ theme }) => theme.customBorder};
    }

    .ant-tooltip-inner {
      background-color: ${({ theme }) => theme.gray01};
      color: ${({ theme }) => theme.textColor01};
    }
  }
`;
