import React from 'react';
import { StyledSidebarDrawer } from './style';
import { Icon, Label } from 'ui';
import { useNotificationHeader } from '../../contexts/NotificationHeaderContext';
import { useIntl } from 'react-intl';
import { Breadcrumb } from '../breadcrumb';
import { Divider } from '../divider';

export interface SidebarDrawerProps {
  children?: React.ReactNode;
  title: string;
  subtitle?: string | React.ReactNode;
  breadcrumb?: BreadcrumbObject[];
  trunc?: number;
  onClose?: () => void | Function;
  isOpen?: boolean;
  width?: string;
  className?: 'sidebar-style-1' | 'sidebar-style-2' | string;
  hideLabel?: boolean;
  showBreadcrumb?: boolean;
  backIcon?: string;
  dividerVisible?: boolean;
  backText?: string;
  showTitleInBreadcrump?: boolean;
}
interface BreadcrumbObject {
  path?: string;
  name: string;
  goBack?: boolean;
  withState?: boolean;
}

export const SidebarDrawer = ({
  children,
  title,
  subtitle,
  breadcrumb = [],
  trunc = 0,
  onClose,
  isOpen,
  width = '380',
  className = 'sidebar-style-1',
  hideLabel = false,
  showBreadcrumb = true,
  backIcon = 'right',
  dividerVisible = true,
  backText = 'hide',
  showTitleInBreadcrump = true,
}: SidebarDrawerProps) => {
  const { height } = useNotificationHeader();
  const intl = useIntl();
  return (
    <StyledSidebarDrawer
      notificationHeight={height}
      trigger={null}
      collapsible
      collapsed={!isOpen}
      collapsedWidth={0}
      width={width}
      className={className}
    >
      {!hideLabel &&
        (className == 'sidebar-style-2' ? (
          <div className="sidebar-title-wrapper">
            <div className="sidebar-title">
              <div className="breadcrumb_and_title">
                {showBreadcrumb && (
                  <Breadcrumb
                    title={showTitleInBreadcrump ? title : undefined}
                    breadcrumb={breadcrumb}
                    trunc={trunc}
                  ></Breadcrumb>
                )}
                <Label className='sidebar-title-text' title label={title} bold />
                {subtitle && <Label className="mt-3" label={subtitle} />}
              </div>
              <div className="close-icon-container" onClick={onClose}>
                <Icon className="close-icon" icon={`long-arrow-${backIcon}`} faBase="fa-regular" />
                <div className="close-icon-text">{intl.formatMessage({ id: backText })}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="sidebar-title">
            <div className='breadcrumb_and_title'>
              <Label className='sidebar-title-text' title label={title} bold />
              {subtitle && (typeof subtitle !== 'string' ? subtitle : <Label className="mt-3" label={subtitle} />)}
            </div>
            <Icon className="close-icon" icon="circle-xmark" faBase="fa-regular" onClick={onClose} />
          </div>
        ))}
      {className == 'sidebar-style-2' && dividerVisible && <Divider />}
      <div className="content">{children}</div>
    </StyledSidebarDrawer>
  );
};
