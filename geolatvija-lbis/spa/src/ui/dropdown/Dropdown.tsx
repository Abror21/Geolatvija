import React from 'react';
import styled from 'styled-components/macro';
import { Dropdown as AntdDropdown } from 'antd';
import { ClassName } from 'interfaces/shared';

interface DropdownProps extends ClassName {
  menu?: (originNode: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
  placement?: 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'bottom';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  trigger: ('click' | 'hover' | 'contextMenu')[];
  overlayClassName?: any;
}

const StyledDropdown = styled(AntdDropdown)`
  .ant-dropdown-menu {
    background: ${({ theme }) => theme.gray01};
    padding: 0;
    .ant-btn{
      border-radius: 0;
      box-shadow: unset;
      &:hover{
        color: ${({theme}) => theme.gray01} !important;
        background-color: ${({theme}) => theme.brand02} !important;
        &::after{
          background-color: transparent;
        }
      }
      &::after{
        transition: .3s;
      }
    }
    .ant-dropdown-menu-item {
      color: ${({ theme }) => theme.textColor01};

      &:hover {
        background: ${({ theme }) => theme.brand03};
      }

      a {
        &:hover {
          color: ${({ theme }) => theme.textColor01};
        }
      }
    }
  }

  .w-225 {
    .ant-dropdown-menu {
      width: 240px;
    }
  }
`;

export const Dropdown = ({
  className,
  menu,
  children,
  placement,
  open,
  onOpenChange,
  trigger,
  disabled,
  overlayClassName,
}: DropdownProps) => {
  return (
    <StyledDropdown
      className={className}
      dropdownRender={menu}
      placement={placement}
      open={open}
      onOpenChange={onOpenChange}
      getPopupContainer={(triggerNode: HTMLElement) => triggerNode}
      trigger={trigger}
      disabled={disabled}
      overlayClassName={overlayClassName}
    >
      {children}
    </StyledDropdown>
  );
};
