import React from 'react';
import { Icon } from 'ui/icon';
import { ClassName, Disabled, Name } from 'interfaces/shared';
import { StyledDrawer } from './style';
import { Spinner } from '../spinner';

export interface DrawerProps extends Disabled, ClassName, Name {
  closable?: boolean;
  footer?: React.ReactNode;
  title?: React.ReactNode;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  open: boolean;
  width?: string | number;
  height?: string | number;
  children?: React.ReactNode;
  destroyOnClose?: boolean;
  loading?: boolean;
}

export const Drawer = ({
  className,
  closable,
  footer,
  title,
  onClose,
  open,
  width,
  height,
  children,
  destroyOnClose,
  loading,
}: DrawerProps) => {
  return (
    <StyledDrawer
      className={className}
      closable={closable}
      closeIcon={<Icon icon="times" faBase="far" />}
      footer={footer}
      getContainer={document.body}
      title={title}
      onClose={onClose}
      open={open}
      width={width}
      height={height}
      destroyOnClose={destroyOnClose}
    >
      <Spinner spinning={loading || false}>{children}</Spinner>
    </StyledDrawer>
  );
};
