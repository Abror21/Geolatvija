import React, { CSSProperties, MouseEventHandler } from 'react';
import { ClassName } from 'interfaces/shared';
import { StyledLabel } from './style';

export interface LabelProps extends ClassName {
  className?: string;
  label: string | React.ReactNode;

  heading?: boolean;
  title?: boolean;
  subTitle?: boolean;
  extraBold?: boolean;
  regular?: boolean;
  marginClassName?: string;
  center?: boolean;
  end?: boolean;
  onClick?: MouseEventHandler;
  italic?: boolean;
  styles?: CSSProperties;
  color?: string;
  bold?: boolean;
  themeColor?: boolean;
  clickable?: boolean;
}

export const Label = ({
  className,
  label,
  heading,
  title,
  subTitle,
  extraBold,
  regular,
  marginClassName,
  center,
  end,
  onClick,
  italic,
  styles,
  color,
  bold,
  themeColor,
  clickable,
}: LabelProps) => {
  let completeClassName = '';

  if (className) {
    completeClassName += className;
  }

  if (heading) {
    completeClassName += ' heading';
  }

  if (title) {
    completeClassName += ' title';
  }

  if (subTitle) {
    completeClassName += ' sub-title';
  }

  if (regular) {
    completeClassName += ' regular';
  }

  if (bold) {
    completeClassName += ' regular-bold';
  }

  if (extraBold) {
    completeClassName += ' extra-bold';
  }

  if (themeColor) {
    completeClassName += ' theme-color';
  }

  if (marginClassName) {
    completeClassName += ' ' + marginClassName;
  }

  if (!marginClassName) {
    if (title) {
      completeClassName += ' mb-2.5';
    }

    if (subTitle && extraBold) {
      completeClassName += ' mb-6';
    }

    if (subTitle && !extraBold) {
      completeClassName += ' mb-3';
    }
  }

  if (center) {
    completeClassName += ' center';
  }

  if (end) {
    completeClassName += ' end';
  }

  if (italic) {
    completeClassName += ' italic';
  }

  if (color) {
    completeClassName += ' ' + color;
  }

  if (clickable) {
    completeClassName += ' clickable';
  }

  return (
    <StyledLabel className={completeClassName} onClick={onClick} style={styles}>
      {label}
    </StyledLabel>
  );
};
