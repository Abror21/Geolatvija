import React from 'react';
import styled from 'styled-components/macro';
import { ClassName, Label } from 'interfaces/shared';
import { ClassNameUtil } from 'utils/className';

export interface IconProps extends ClassName, Label {
  color?: string;
  size?: string;
  roundBorder?: boolean;
  icon: string;
  iconLeft?: boolean;
  iconClassName?: string;
  faBase?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  baseClass?: string;
}

const StyledIcon = styled.i`
  font-size: ${({ theme }) => theme.iconSize2};
  color: ${({ theme }) => theme.iconColor01};
  width: auto !important;

  &.fa-envelope {
    color: ${({ theme }) => theme.iconColor02};
  }

  &.rotate {
    animation: rotation 2s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }

  &.large:before {
    font-size: 40px;
  }

  &.green {
    color: forestgreen;
  }

  &.red {
    color: ${({ theme }) => theme.tag02};
  }

  &.clickable {
    cursor: pointer;
  }
`;

export const Icon = ({
  className = '',
  icon = '',
  faBase = 'fas',
  color = '',
  size = '',
  roundBorder = false,
  baseClass = 'portal-icon',
  onClick,
}: IconProps) => {
  const iconClassName = new ClassNameUtil();
  iconClassName.add(baseClass);
  iconClassName.add(className);
  iconClassName.add(`${faBase} fa-${icon} `, !!icon);
  iconClassName.add(color);
  iconClassName.add(size);
  iconClassName.add(`${baseClass}__round-border`, roundBorder);

  return <StyledIcon className={iconClassName.getClassName()} onClick={onClick} />;
};
