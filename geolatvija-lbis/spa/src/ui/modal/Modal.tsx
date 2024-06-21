import * as React from 'react';
import { ClassName } from 'interfaces/shared';
import { StyledModal } from './style';
import { Icon } from '../icon';

export interface ModalProps extends ClassName {
  open: boolean;
  zIndex?: number;
  title?: string | React.ReactNode;
  onOk?: (e: React.MouseEvent<HTMLElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
  closable?: boolean;
  confirmLoading?: boolean;
  width?: number;
  closeIcon?: React.ReactNode;
  wrapClassName?: string;
  actions?: React.ReactNode;
  modalType?: number;
  getContainer?: string | HTMLElement | (() => HTMLElement) | false;
  disableHeader?: boolean;
  destroyOnClose?: boolean;
  centered?: boolean;
  style?: React.CSSProperties | undefined;
  mask?: boolean;
}

export const Modal = ({
  open,
  zIndex,
  title,
  onOk,
  onCancel,
  footer,
  children,
  closable,
  confirmLoading,
  width,
  closeIcon,
  wrapClassName,
  actions,
  modalType = 1,
  getContainer = false,
  disableHeader,
  destroyOnClose,
  centered,
  style,
  mask,
  className,
}: ModalProps) => {
  return (
    <StyledModal
      zIndex={zIndex}
      destroyOnClose={destroyOnClose}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={footer || <></>}
      closable={closable}
      confirmLoading={confirmLoading}
      width={width}
      wrapClassName={wrapClassName}
      closeIcon={<></>}
      getContainer={getContainer}
      className={`${className} ${modalType === 2 ? 'modal-secondary' : ''} ${!title && 'without-title'}`}
      centered={centered}
      style={style}
      mask={mask}
    >
      {!disableHeader && (
        <div className={`modal-header`}>
          <div className="title">{title}</div>
          <div className="actions">
            {actions}
            {closable === true ? <Icon faBase="fal" icon="circle-xmark" onClick={onCancel} /> : null}
          </div>
        </div>
      )}

      <div className="actual-content">{children}</div>
    </StyledModal>
  );
};
