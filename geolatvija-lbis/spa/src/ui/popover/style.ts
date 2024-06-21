import styled from 'styled-components/macro';
import { Popover } from 'antd';

export const StyledPopover = styled(Popover)`
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  white-space: normal;

  .ant-popover-inner {
    padding: 0;
    background: red;
    p {
      color: ${({ theme }) => theme.textColor09};
    }
  }
`;
