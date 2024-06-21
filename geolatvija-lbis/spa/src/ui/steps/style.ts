import styled from 'styled-components/macro';
import { Steps } from 'antd';

export const StyledSteps = styled(Steps)`
  .ant-steps-item-tail {
    padding: 4px 16px !important;

    &:after {
      height: 2px;
    }
  }

  .ant-steps-item-container {
    &:hover {
      .ant-steps-item-icon {
        border-color: ${({ theme }) => theme.brand02} !important;

        .ant-steps-icon {
          color: transparent;
        }
      }
    }
  }

  .ant-steps-item-finish {
    .ant-steps-item-tail {
      &:after {
        background-color: ${({ theme }) => theme.brand02} !important;
      }
    }

    &:hover {
      .ant-steps-item-icon {
        .ant-steps-icon {
          color: ${({ theme }) => theme.brand02} !important;
        }
      }
    }

    .ant-steps-item-title {
      color: ${({ theme }) => theme.textColor01} !important;
      font-size: ${({ theme }) => theme.p2Size};
    }

    .ant-steps-item-icon {
      background-color: ${({ theme }) => theme.componentsBackground};

      border: 2px solid ${({ theme }) => theme.brand02};

      .ant-steps-icon {
        color: ${({ theme }) => theme.brand02};
      }
    }
  }

  .ant-steps-item-active {
    .ant-steps-item-tail {
      &:after {
        background-color: ${({ theme }) => theme.border3} !important;
      }
    }

    .ant-steps-item-title {
      color: ${({ theme }) => theme.brand02} !important;
      font-size: ${({ theme }) => theme.p2Size};
      font-weight: ${({ theme }) => theme.fontWeightBold};
    }

    .ant-steps-item-icon {
      background-color: ${({ theme }) => theme.brand02};

      border: 2px solid ${({ theme }) => theme.brand02};
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: transparent;
      }

      .ant-steps-icon {
        background-color: ${({ theme }) => theme.gray01};
        width: 10px;
        height: 10px;

        border-radius: 50%;
        color: ${({ theme }) => theme.gray01};
        overflow: hidden;
      }
    }
  }

  .ant-steps-item-wait {
    .ant-steps-item-tail {
      &:after {
        background-color: ${({ theme }) => theme.border3} !important;
      }
    }

    .ant-steps-item-title {
      color: ${({ theme }) => theme.textColor01} !important;
      font-size: ${({ theme }) => theme.p2Size};
    }

    .ant-steps-item-icon {
      background-color: ${({ theme }) => theme.gray01};

      border: 2px solid ${({ theme }) => theme.border3};
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        border-color: ${({ theme }) => theme.brand02} !important;
      }

      .ant-steps-icon {
        background-color: ${({ theme }) => theme.border3};
        width: 10px;
        height: 10px;

        border-radius: 50%;
        color: ${({ theme }) => theme.border3} !important;
        overflow: hidden;

        &:hover {
          color: transparent !important;
        }
      }
    }
  }
`;
