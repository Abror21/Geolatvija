import React from 'react';
import { ClassName, Disabled } from 'interfaces/shared';
import { StyledCollapse, StyledErrorCollapse, StyledWarningCollapse } from './style';
import { Icon } from '../icon';

export interface CollapseProps extends Disabled, ClassName {
  accordion?: boolean;
  children?: React.ReactNode;
  ghost?: boolean;
  defaultActiveKey?: string[] | string | number[] | number;
  onChange?: (key: string | string[]) => void;
  error?: boolean;
  warning?: boolean;
  expandIcon?: React.ReactNode;
  collapsible?: 'header' | 'icon' | 'disabled';
  expandIconPosition?: 'start' | 'end';
}

export const Collapse = ({
  accordion,
  children,
  ghost,
  error,
  warning,
  defaultActiveKey,
  onChange,
  expandIcon,
  collapsible,
  expandIconPosition = 'start',
  className,
}: CollapseProps) => {
  if (error) {
    return (
      <StyledErrorCollapse
        accordion={accordion}
        expandIconPosition={expandIconPosition}
        expandIcon={({ isActive }) => {
          if (expandIcon) {
            return expandIcon;
          } else {
            if (isActive) {
              return expandIconPosition === 'end' ? (
                <Icon icon="angle-up" faBase="far" />
              ) : (
                <Icon icon="angle-down" faBase="far" />
              );
            }
            return expandIconPosition === 'end' ? (
              <Icon icon="angle-down" faBase="far" />
            ) : (
              <Icon icon="angle-right" faBase="far" />
            );
          }
        }}
        ghost={ghost}
        collapsible={collapsible}
        className={className}
      >
        {children}
      </StyledErrorCollapse>
    );
  }

  if (warning) {
    return (
      <StyledWarningCollapse
        accordion={accordion}
        expandIconPosition={expandIconPosition}
        expandIcon={({ isActive }) => {
          if (expandIcon) {
            return expandIcon;
          } else {
            if (isActive) {
              return expandIconPosition === 'end' ? (
                <Icon icon="angle-up" faBase="far" />
              ) : (
                <Icon icon="angle-down" faBase="far" />
              );
            }
            return expandIconPosition === 'end' ? (
              <Icon icon="angle-down" faBase="far" />
            ) : (
              <Icon icon="angle-right" faBase="far" />
            );
          }
        }}
        ghost={ghost}
      >
        {children}
      </StyledWarningCollapse>
    );
  }

  return (
    <StyledCollapse
      accordion={accordion}
      defaultActiveKey={defaultActiveKey}
      onChange={onChange}
      expandIconPosition={expandIconPosition}
      expandIcon={({ isActive }) => {
        if (expandIcon) {
          return expandIcon;
        } else {
          if (isActive) {
            return expandIconPosition === 'end' ? (
              <Icon icon="angle-up" faBase="far" />
            ) : (
              <Icon icon="angle-down" faBase="far" />
            );
          }
          return expandIconPosition === 'end' ? (
            <Icon icon="angle-down" faBase="far" />
          ) : (
            <Icon icon="angle-right" faBase="far" />
          );
        }
      }}
      ghost={ghost}
    >
      {children}
    </StyledCollapse>
  );
};
