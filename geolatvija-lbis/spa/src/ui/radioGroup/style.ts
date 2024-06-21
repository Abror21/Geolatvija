import styled from 'styled-components/macro';
import { Form, Radio as AntdRadio } from 'antd';

export const StyledRadioGroup = styled(AntdRadio.Group)`
  .ant-radio-wrapper {
    font-size: ${({ theme }) => theme.p2Size};
  }

  &.ant-radio-group-middle .ant-radio-inner {
    width: 1.25rem;
    height: 1.25rem;
  }

  &.ant-radio-group-middle .ant-radio-inner::after {
    transform: scale(0.5);
    margin-block-start: 1px;
    margin-inline-start: 1px;
  }

  .ant-radio-inner {
    width: ${({ theme }) => theme.p1Size};
    height: ${({ theme }) => theme.p1Size};
  }

  .ant-radio-inner::after {
    position: absolute;
    width: ${({ theme }) => theme.p1Size};
    height: ${({ theme }) => theme.p1Size};
    margin-block-start: 1px;
    margin-inline-start: 1px;
    inset-block-start: 0;
    inset-inline-start: 0;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    border-color: ${({ theme }) => theme.border4};
    color: ${({ theme }) => theme.textColor04};
    background-color: ${({ theme }) => theme.button02};
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
    background-color: ${({ theme }) => theme.brand02};
  }
  .ant-radio-button-wrapper-checked:not(
      [class*=' ant-radio-button-wrapper-disabled']
    ).ant-radio-button-wrapper:first-child {
    border-color: ${({ theme }) => theme.border4};
  }
  .ant-radio-button-wrapper {
    background-color: ${({ theme }) => theme.gray01};
    border-color: ${({ theme }) => theme.border2};
    color: ${({ theme }) => theme.textColor01};
  }

  .ant-radio-button-wrapper:hover {
    color: ${({ theme }) => theme.brand02};
  }

  .ant-radio-button-wrapper-checked:hover {
    color: ${({ theme }) => theme.textColor04};
  }
`;
