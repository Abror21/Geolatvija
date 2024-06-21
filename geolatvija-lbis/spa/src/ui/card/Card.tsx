import { StyledCard } from './style';
import { type ReactNode } from 'react';
import { type CardProps } from 'antd';

interface CustomCardProps extends CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = (props: CustomCardProps) => {
  return <StyledCard {...props}>{props.children}</StyledCard>;
};
