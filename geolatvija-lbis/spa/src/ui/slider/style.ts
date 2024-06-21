import { Slider } from 'antd';
import styled from 'styled-components/macro';

export const StyledSlider = styled(Slider)`
  .ant-slider-rail {
    height: 8px;
    background: ${({ theme }) => theme.border3};
  }

  .ant-slider-handle {
    width: 24px;
    height: 24px;

    &.ant-tooltip-open,
    &:not(.ant-tooltip-open) {
      &::after,
      &::before {
        width: 24px;
        height: 24px;
        top: -5px;
      }

      &::after {
        box-shadow: none;
        border: 2px solid ${({ theme }) => theme.brand02};
      }
    }
    &.ant-tooltip-open {
      &::after {
        border: 6px solid ${({ theme }) => theme.brand02};
      }
    }
  }

  &:hover .ant-slider-track {
    background: ${({ theme }) => theme.brand02};
  }

  .ant-slider-track {
    height: 8px;
    background: ${({ theme }) => theme.brand02};

    &:hover {
      background: ${({ theme }) => theme.brand02};
    }
  }

  .ant-slider-handle:not(.ant-tooltip-open)::after {
    background: ${({ theme }) => theme.componentsBackground} !important;
  }

  .ant-slider-handle::after {
    background: ${({ theme }) => theme.componentsBackground} !important;
  }

  .ant-slider-handle.ant-tooltip-open::before {
    background: ${({ theme }) => theme.componentsBackground} !important;
  }
`;
