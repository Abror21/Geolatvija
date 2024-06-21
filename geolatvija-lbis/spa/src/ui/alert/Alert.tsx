import React from 'react';
import styled from 'styled-components/macro';
import { Alert as AntdAlert } from 'antd';
import { ClassName, Disabled } from 'interfaces/shared';

export interface AlertProps extends Disabled, ClassName {
  closable?: boolean;
  message?: string | React.ReactNode;
  type?: string;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  showIcon?: boolean;
  closeText?: React.ReactNode;
}

export const Alert = styled(AntdAlert).attrs(
  ({ closable, message, type, description, icon, showIcon, closeText }: AlertProps) => ({
    closable,
    message,
    type,
    description,
    icon,
    showIcon,
    closeText,
  })
)`
  font-size: ${({ theme }) => theme.p2Size};

  .ant-alert-message {
    color: ${({ theme }) => theme.textColor01};
  }

  &.ant-alert-success {
    background-color: ${({ theme }) => theme.alert01};
    border-color: ${({ theme }) => theme.alertBorder01};

    .ant-alert-icon {
      color: ${({ theme }) => theme.alertIcon01};
    }
  }

  &.ant-alert-info {
    background-color: ${({ theme }) => theme.portalBackground};
    border-color: ${({ theme }) => theme.portalBackground};

    .ant-alert-icon {
      color: ${({ theme }) => theme.alertIcon02};
    }

    .ant-alert-info-span {
      font-weight: bold;
    }
  }

  &.ant-alert-warning {
    background-color: ${({ theme }) => theme.alert03};
    border-color: ${({ theme }) => theme.alertBorder03};

    .ant-alert-icon {
      color: ${({ theme }) => theme.alertIcon03};
    }
  }

  &.ant-alert-error {
    background-color: ${({ theme }) => theme.alert04};
    border-color: ${({ theme }) => theme.alertBorder04};
    color: ${({ theme }) => theme.errors};

    .ant-alert-icon {
      color: ${({ theme }) => theme.alertIcon04};
      font-size: ${({ theme }) => theme.p1Size};
    }
  }
`;
