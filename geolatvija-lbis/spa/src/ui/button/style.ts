import styled from 'styled-components/macro';
import { Button } from 'antd';

export const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.gray01};
  border: 1px solid ${({ theme }) => theme.gray03};
  border-radius: 6px;
  color: ${({ theme }) => theme.textColor01};
  font-size: ${({ theme }) => theme.p2Size};
  font-weight: ${({ theme }) => theme.fontWeightBold};
  line-height: ${({ theme }) => theme.lineHeight6};
  height: auto;
  padding: 8px 14px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
  //font-family: "Ubuntu";

  &.full {
    width: 100%;
  }

  &.ant-btn-link {
    color: ${({ theme }) => theme.brand02} !important;
    background: ${({ theme }) => theme.transparent};
    padding: 0;
    box-shadow: none;
    border: none !important;

    .text {
      text-decoration: underline;
    }
  }

  //&:not(.ant-btn-circle) {
  //  .portal-icon:not(:last-child) {
  //    margin-right: 7px;
  //    text-align: center;
  //  }
  //}

  &:focus {
    background-color: ${({ theme }) => theme.gray01};
  }

  &:disabled {
    color: ${({ theme }) => theme.disabledText};
    border-color: ${({ theme }) => theme.disabledBorder};
    background-color: ${({ theme }) => theme.gray01};

    &:hover {
      color: ${({ theme }) => theme.disabledText};
      border-color: transparent;
      background-color: #fafafa;
    }
  }

  &:empty {
    visibility: visible;
  }

  &.ant-btn-default:hover {
    background-color: ${({ theme }) => theme.brand03} !important;
    border-color: ${({ theme }) => theme.border4} !important;
    color: ${({ theme }) => theme.textColor03} !important;

    .portal-icon {
      color: ${({ theme }) => theme.textColor03} !important;
    }
  }

  &:hover {
    background-color: #eeeeee;
    color: ${({ theme }) => theme.button01};
  }

  &:focus {
    color: ${({ theme }) => theme.button01};
  }

  &.ant-btn {
    border: 1px solid ${({ theme }) => theme.border};
  }

  &.ant-btn-primary {
    background-color: ${({ theme }) => theme.button01};
    background: ${({ theme }) => theme.button01};
    border-color: ${({ theme }) => theme.brand02};
    border-radius: 6px;
    color: ${({ theme }) => theme.textColor03};

    &:hover {
      background-color: ${({ theme }) => theme.brand03} !important;
      border-color: ${({ theme }) => theme.border4} !important;
      color: ${({ theme }) => theme.textColor03} !important;
    }

    .portal-icon {
      color: ${({ theme }) => theme.gray01};
      font-size: ${({ theme }) => theme.p2Size};
    }
  }

  &.ant-btn-dangerous {
    color: ${({ theme }) => theme.alertIcon04};
    border-color: ${({ theme }) => theme.alertIcon04};
  }

  &.ant-btn-circle {
    border-radius: 50%;
  }

  &.ant-btn-text {
    display: inline;
    background: none;
    border: 0;
    padding: 0;
    box-shadow: none;

    &:hover {
      background-color: transparent;
      color: ${({ theme }) => theme.brand02};
    }

    &.primary {
      color: ${({ theme }) => theme.brand02};
      padding: 8px 14px;
    }
  }
  &.selected-project-format{
    color: ${({ theme }) => theme.brand02};
    i{
      color: ${({ theme }) => theme.brand02};
    }
  }
  &.border-none{
    border: none;
    box-shadow: unset;
  }
`;
