import styled from 'styled-components/macro';
import { Switch } from 'antd';

export const StyledSwitch = styled(Switch)`
  &.ant-switch {
    background: ${({ theme }) => theme.switchColor03};
    box-shadow: none !important;

    & > div:not(.ant-switch-handle) {
      display: none !important;
    }
  }

  &:focus,
  .ant-switch-handle:focus {
    outline: none;
    box-shadow: none !important;
  }

  .ant-switch-inner {
    border: 1px solid ${({ theme }) => theme.customBorder};
  }

  // TODO add hover color if needed
  .ant-switch-inner:hover,
  .ant-switch-handle:hover + .ant-switch-inner,
  button:hover .ant-switch-inner {
    transition: all 0.2s linear;
  }

  &.ant-switch {
    .ant-switch-handle::before {
      background: ${({ theme }) => theme.textColor10};
    }
  }

  &.ant-switch-checked {
    background: ${({ theme }) => theme.brand02} !important;
    box-shadow: none;

    .ant-switch-handle::before {
      background: ${({ theme }) => theme.switchColor03} !important;
    }
  }
`;
