import React from 'react';
import { StyledPopover } from './style';

type ActionType = 'hover' | 'focus' | 'click' | 'contextMenu';

export interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  trigger: ActionType | ActionType[];
  title?: string;
  className?: string;
  open?: boolean;
  overlayInnerStyle?: any;
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
}

export const Popover = ({
  children,
  content,
  trigger,
  title,
  className,
  open,
  placement,
  overlayInnerStyle,
}: PopoverProps) => {
  const mainApp: any = document.getElementsByClassName('App')[0];

  return (
    <StyledPopover
      content={content}
      trigger={trigger}
      title={title}
      getPopupContainer={() => mainApp}
      className={className}
      open={open}
      placement={placement}
      overlayInnerStyle={overlayInnerStyle}
    >
      {children}
    </StyledPopover>
  );
};
