import styled from 'styled-components/macro';
import { Spin } from 'antd';

export const StyledSpinner = styled(Spin)`
  display: flex;
  align-items: center;
  justify-content: center;

  &.fullscreen-spinner {
    background-color: ${({ theme }) => theme.gray01};
    width: 100vw;
    height: 100vh;
  }

  .ant-spin-dot-item {
    background-color: ${({ theme }) => theme.brand02};
  }

  .ant-spin-container {
    &:after {
      background-color: ${({ theme }) => theme.gray01};
    }
  }

  .full {
    height: 100%;
  }
`;
