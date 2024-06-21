import React, { TouchEventHandler } from 'react';
import { Icon } from 'ui';
import { ClassName, Disabled } from 'interfaces/shared';
import { StyledButton } from './style';
import { Link } from 'react-router-dom';

export interface ButtonProps extends Disabled, ClassName {
  icon?: string;
  href?: string;
  shape?: 'circle' | 'round';
  type?: 'primary' | 'link' | 'text' | 'default' | 'dashed';
  htmlType?: 'button' | 'reset' | 'submit';
  block?: boolean;
  onClick?: any; //weird class in antd
  size?: 'large' | 'middle' | 'small';
  faBase?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLSpanElement>;
  onTouchStart?: TouchEventHandler;
  onTouchEnd?: TouchEventHandler;
  label?: React.ReactNode | string;
  danger?: boolean;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  title?: string;
  border?: boolean;
}

export const Button = ({
  disabled,
  label,
  className,
  icon,
  type,
  shape,
  htmlType,
  onClick,
  block,
  href,
  size,
  faBase,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onTouchStart,
  onTouchEnd,
  danger,
  loading,
  title,
  border=true
}: ButtonProps) => {
  const actualButton = (
    <StyledButton
      disabled={disabled}
      className={`${className} ${!border && 'border-none'}`}
      type={type}
      htmlType={htmlType}
      onClick={onClick}
      block={block}
      size={size}
      shape={shape}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      danger={danger}
      loading={loading}
      title={title}
    >
      {!!icon && <Icon icon={icon} faBase={faBase} />}
      {!!label && <span className="text">{label}</span>}
    </StyledButton>
  );

  return href ? <Link to={href}>{actualButton}</Link> : actualButton;
};
