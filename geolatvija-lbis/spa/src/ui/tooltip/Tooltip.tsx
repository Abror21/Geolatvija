import React from 'react';
import { ClassName, Disabled } from 'interfaces/shared';
import { StyledTooltip } from './style';
import { TooltipPlacement } from 'antd/es/tooltip';

type ActionType = 'hover' | 'focus' | 'click' | 'contextMenu';

export interface TooltipProps extends Disabled, ClassName {
  color?: string;
  title: string | React.ReactNode;
  children: React.ReactNode;
  overlay?: React.ReactElement | (() => React.ReactElement);
  hack?: boolean;
  style?: any;
  overlayClassName?: string;
  placement?: TooltipPlacement;
  trigger?: ActionType | ActionType[];
  open?: boolean | undefined;
  onOpenChange?: (open: boolean) => void;
}

export const Tooltip = ({
  color,
  title,
  children,
  overlay,
  hack,
  className,
  style,
  overlayClassName,
  placement,
  trigger,
  open,
  onOpenChange,
}: TooltipProps) => {
  const mainApp: any = document.getElementsByClassName('App')[0];

  return (
    <StyledTooltip
      color={color}
      title={title}
      overlay={overlay}
      getPopupContainer={() => mainApp}
      className={className}
      style={style}
      overlayClassName={overlayClassName}
      placement={placement}
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
    >
      {hack ? <div>{children}</div> : children}
    </StyledTooltip>
  );
};
